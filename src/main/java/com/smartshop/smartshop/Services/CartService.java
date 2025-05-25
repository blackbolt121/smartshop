package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.CartItemRepository;
import com.smartshop.smartshop.Repositories.CartRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productoRepository;


    public Cart createCart(CartItemRequest[] cartItemRequest, Usuario usuario) {
        Cart cart = new Cart();
        cartRepository.save(cart);
        Set<CartItem> cartItems = new HashSet<>();

        for(CartItemRequest cartItemRequest1 : cartItemRequest) {
            try{
                CartItemId cartItemId = new CartItemId();
                cartItemId.setCartId(cart.getId());
                cartItemId.setProductId(cartItemRequest1.productId());
                Producto product = productoRepository.findById(cartItemRequest1.productId()).orElse(null);
                Integer quantity = cartItemRequest1.quantity();
                CartItem cartItem = new CartItem(cartItemId, cart, product, quantity);
                cartItemRepository.save(cartItem);
                cartItems.add(cartItem);
            }catch (Exception ignored){

            }
        }
        cartItemRepository.saveAll(cartItems);
        cart.setItems(cartItems);
        cart.setUsuario(usuario);
        cartRepository.save(cart);


        return cart;
    }
}
