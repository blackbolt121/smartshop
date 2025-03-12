package com.smartshop.smartshop.Config;

import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.TokenRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ConversionService conversionService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);  // Skip processing for OPTIONS
            return;
        }

        if (request.getServletPath().contains("/auth/")) {
            logger.info("JWT Authentication Filter for authentication");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.info("Invalid JWT token");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.split(" ")[1];
        final String userEmail = jwtService.extractUsername(jwt);
        logger.info("JWT token: " + jwt);
        logger.info("User: " + userEmail);
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (userEmail == null || authentication != null) {
            filterChain.doFilter(request, response);
            return;
        }

        final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        final boolean isTokenExpiredOrRevoked = tokenRepository.findByToken(jwt)
                .map(token -> !token.isExpired() && !token.isRevoked())
                .orElse(false);

        logger.info("isTokenExpiredOrRevoked: " + isTokenExpiredOrRevoked);

        if (isTokenExpiredOrRevoked) {
            final Optional<Usuario> user = userRepository.findByEmail(userEmail);
            logger.info("User: " + user.get().getId());
            final boolean isTokenValid = jwtService.isTokenValid(jwt, user.get());
            logger.info("isTokenValid: " + isTokenValid);
            if (isTokenValid) {
                logger.info("Passed authentication");
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}