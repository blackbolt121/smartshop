package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.DTO.CartItemDto;
import com.smartshop.smartshop.DTO.CartResponseDto;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.CartItemRepository;
import com.smartshop.smartshop.Repositories.CartRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productoRepository;


    public Cart createCart(CartItemRequest[] cartItemRequest, Usuario usuario) {
        Cart cart = new Cart();
        cart.setUsuario(usuario);
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

        cartRepository.save(cart);


        return cart;
    }

    public Cart getCartById(String id) {
        return cartRepository.findById(id).get();
    }

    public CartResponseDto toDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(item -> new CartItemDto(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity()
                ))
                .toList();

        return new CartResponseDto(cart.getId(), itemDtos);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll().stream().filter(cart -> cart.getOrdenPago() != null).toList();
    }

    public void save(Cart cart) {
        cartRepository.save(cart);
    }
}
