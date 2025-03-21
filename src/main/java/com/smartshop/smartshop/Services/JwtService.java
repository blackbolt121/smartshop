package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    public String secretKey = "adsfalk11984akla719qaklada81932asjklnbjcjh2i1";
    public long expiration = 86400000;
    public long refresh = 604800000;
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public boolean isTokenValid(String token, Usuario user) {
        final String username = extractUsername(token);
        return (username.equals(user.getEmail())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }
    public String generateToken(final Usuario usuario){
        return buildToken(usuario, expiration);
    }

    public String refreshToken(final Usuario usuario){
        return buildToken(usuario, refresh);
    }

    public String generateRefreshToken(final Usuario user) {
        return buildToken(user, expiration);
    }

    private String buildToken(final Usuario usuario, final long expiration){
        return Jwts.builder().id(usuario.getId())
                .claims(Map.of("name", usuario.getName()))
                .subject(usuario.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
