package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.CartResponseDto;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.CartService;
import com.smartshop.smartshop.Services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import com.smartshop.smartshop.Models.Cart;
import com.smartshop.smartshop.RequestModels.CartItemRequest;

import java.util.Map;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/rest/api/1/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final UserService userService;


    @PostMapping("/order")
    public ResponseEntity<CartResponseDto> addItem(
            @RequestBody CartItemRequest[] itemRequest
            ) {

        Usuario usuario = userService.getUserByContext();
        Cart updatedCart = cartService.createCart(itemRequest, usuario);
        return ResponseEntity.ok().body(cartService.toDto(updatedCart));
    }

    @PostMapping("/order/{id}")
    public ResponseEntity<String> addPayment(@PathVariable String id, @RequestBody Map<String, Object> body){


        String transactionId = (String) body.get("transactionId");

        Cart cart = cartService.getCartById(id);

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        if (!cart.getUsuario().getId().equals(userService.getUserByContext().getId())) {
            return ResponseEntity.status(403).build();
        }

        cart.setOrdenPago(transactionId);

        cartService.save(cart);

        return ResponseEntity.ok().body("");
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<CartResponseDto> getCart(@PathVariable String id) {

        Cart cart = cartService.getCartById(id);

        log.info("getCart: {}", cart);

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(cartService.toDto(cart));
    }

    @PutMapping("/order/{id}")
    public ResponseEntity<CartResponseDto> setCart(@PathVariable String id, @RequestBody CartItemRequest[] itemRequest) {

        Cart cart = cartService.getCartById(id);

        log.info("setCart: {}", cart.getItems());

        Usuario usuario = userService.getUserByContext();

        if(!usuario.getId().equals(cart.getUsuario().getId())){
            return ResponseEntity.status(404).build();
        }

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        cartService.updateCart(itemRequest, cart);

        return ResponseEntity.ok().body(cartService.toDto(cart));
    }

}