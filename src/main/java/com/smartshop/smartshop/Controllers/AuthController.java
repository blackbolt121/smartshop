package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.AuthService;
import com.smartshop.smartshop.Services.JwtService;
import com.smartshop.smartshop.Services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService service;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthService authService;
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest request) {

        if(userRepository.findByEmail(request.email()).isPresent()){
            return ResponseEntity.badRequest().build();
        }
        final TokenResponse response = service.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticate(@RequestBody AuthRequest request) {
        Logger.getGlobal().info(request.email());
        Logger.getGlobal().info(request.password());
        final TokenResponse response = service.authenticate(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public TokenResponse refreshToken(
            @RequestHeader(HttpHeaders.AUTHORIZATION) final String authentication
    ) {
        return service.refreshToken(authentication);
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authentication) {
        log.info("Auth token: " + authentication);
        if (authentication == null || authentication.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        log.info(authentication);
        if(!authentication.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        final String token = authentication.split(" ")[1];
        log.info(token);
        Boolean validation = authService.validateToken(token);
        log.info(validation.toString());
        return (validation)? ResponseEntity.ok(token) : ResponseEntity.badRequest().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authentication) {
        log.info("Auth token: " + authentication);
        if (authentication == null || authentication.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        log.info(authentication);
        if(!authentication.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        final String token = authentication.split(" ")[1];
        log.info(token);
        String username = jwtService.extractUsername(token);
        Usuario user = userService.getUsuario(username).orElseThrow();
        jwtService.revokeToken(token, user);
        return ResponseEntity.ok("");
    }




}