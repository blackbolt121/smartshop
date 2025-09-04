// src/main/java/com/smartshop/smartshop/services/ForgotPasswordService.java
package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.ForgotPasswordToken;
import com.smartshop.smartshop.Repositories.ForgotPasswordTokenRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.MailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository usuarioRepository;
    private final ForgotPasswordTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private static final SecureRandom RNG = new SecureRandom();
    private static final Base64.Encoder B64URL = Base64.getUrlEncoder().withoutPadding();

    @Value("${app.publicBaseUrl}")
    private String publicBaseUrl;

    // ===== API =====

    /**
     * Inicia el flujo: genera token y envía email si el usuario existe.
     * Responde siempre mensaje neutro para no revelar existencia de cuentas.
     */
    @Transactional
    public String requestReset(String email, String requestIp, String userAgent) {
        var genericMsg = "Si la cuenta existe, te enviaremos instrucciones para restablecer tu contraseña.";
        var userOpt = usuarioRepository.findByEmail(email);
        if (userOpt.isEmpty()) return genericMsg;

        var user = userOpt.get();

        // Rate limit simple: máx 3 solicitudes en 1 hora
        var lastHour = LocalDateTime.now().minusHours(1);
        if (tokenRepository.countRecentByUser(user.getId(), lastHour) >= 3) {
            return genericMsg;
        }

        var tokenPlain = generateToken();
        var tokenHash  = hashToken(tokenPlain);
        var expiresAt  = LocalDateTime.now().plus(Duration.ofMinutes(20));

        var entity = ForgotPasswordToken.builder()
                .usuario(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .requestedIp(requestIp != null ? truncate(requestIp, 45) : null)
                .userAgent(userAgent != null ? truncate(userAgent, 500) : null)
                .build();

        tokenRepository.save(entity);

        var link = publicBaseUrl + "/reset-password?token=" +
                URLEncoder.encode(tokenPlain, StandardCharsets.UTF_8);

        var html = """
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente enlace antes de 20 minutos:</p>
            <p><a href="%s">%s</a></p>
            <p>Si no fuiste tú, puedes ignorar este correo.</p>
            """.formatted(link, link);

        mailService.sendEmail(user, "Restablece tu contraseña", html);
        return genericMsg;
    }

    /**
     * Completa el flujo: valida token y cambia la contraseña.
     * Marca token como usado e invalida JWTs existentes vía passwordChangedAt.
     */
    @Transactional
    public void resetPassword(String tokenPlain, String newPassword) {
        if (newPassword == null || newPassword.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es demasiado corta.");
        }

        var tokenHash = hashToken(tokenPlain);
        var token = tokenRepository.findByTokenHashAndUsedAtIsNullAndExpiresAtAfter(
                tokenHash, LocalDateTime.now()
        ).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido o expirado")
        );

        var user = token.getUsuario();
        user.setPassword(passwordEncoder.encode(newPassword));

        // Opcional pero recomendado: marca cuándo cambió la password
        // Agrega este campo a tu entidad Usuario: LocalDateTime passwordChangedAt;
        try {
            var field = user.getClass().getDeclaredField("passwordChangedAt");
            field.setAccessible(true);
            field.set(user, LocalDateTime.now());
        } catch (NoSuchFieldException ignored) {
            // Si no tienes el campo, no pasa nada; solo no podrás invalidar JWT por iat.
        } catch (IllegalAccessException e) {
            throw new IllegalStateException("No fue posible actualizar passwordChangedAt", e);
        }

        usuarioRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        tokenRepository.save(token);
    }

    // ===== Utilidades =====

    private static String generateToken() {
        byte[] bytes = new byte[32]; // 256 bits
        RNG.nextBytes(bytes);
        return B64URL.encodeToString(bytes);
    }

    private static String hashToken(String tokenPlain) {
        try {
            var md = MessageDigest.getInstance("SHA-256");
            var digest = md.digest(tokenPlain.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo calcular hash del token", e);
        }
    }

    private static String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max);
    }
}
