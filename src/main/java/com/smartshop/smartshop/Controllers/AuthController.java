package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.AuthService;
import com.smartshop.smartshop.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService service;
    @Autowired
    private final UserRepository userRepository;
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




}