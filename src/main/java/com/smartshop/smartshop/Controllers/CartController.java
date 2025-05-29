package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.CartResponseDto;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.CartService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smartshop.smartshop.Models.Cart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.smartshop.smartshop.RequestModels.CartItemRequest;

import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/rest/api/1/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;


    @PostMapping("/order")
    public ResponseEntity<CartResponseDto> addItem(
            @RequestBody CartItemRequest[] itemRequest
            ) {

        SecurityContext context = SecurityContextHolder.getContext();
        User user = (User) context.getAuthentication().getPrincipal();
        Optional<Usuario> opt_usuario = userRepository.findByEmail(user.getUsername());
        if(opt_usuario.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        Usuario usuario = opt_usuario.get();
        Cart updatedCart = cartService.createCart(itemRequest, usuario);
        return ResponseEntity.ok().body(cartService.toDto(updatedCart));
    }

}