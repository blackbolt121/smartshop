package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smartshop.smartshop.Models.Cart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.smartshop.smartshop.RequestModels.CartItemRequest;


@RestController
@RequestMapping("/rest/api/1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/order")
    public ResponseEntity<Cart> addItem(
            @RequestBody CartItemRequest[] itemRequest,
            @AuthenticationPrincipal Usuario usuario
            ) {
        Cart updatedCart = cartService.createCart(itemRequest, usuario);
        return ResponseEntity.ok(updatedCart);
    }

}