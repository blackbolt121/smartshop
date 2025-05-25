package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Cart;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import org.springframework.stereotype.Service;
import com.smartshop.smartshop.Models.CartItem;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    private final Map<String, Cart> temporaryCarts = new HashMap<>();

    private final ProductRepository productoRepository;

    public CartService(ProductRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public Cart addToCart(String userId, CartItemRequest itemRequest) {
        Cart cart = temporaryCarts.getOrDefault(userId, new Cart());
        Producto producto = productoRepository.findById(itemRequest.productId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(ci -> ci.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setCantidad(existingItem.get().getCantidad() + itemRequest.quantity());
        } else {
            CartItem item = new CartItem();
            item.setProducto(producto);
            item.setCantidad(itemRequest.quantity());
            item.setCart(cart);
            cart.getCartItems().add(item);
        }

        cart.setUsuarioId(userId); // útil para luego guardar si paga
        temporaryCarts.put(userId, cart);
        return cart;
    }

    public Cart getCart(String userId) {
        return temporaryCarts.getOrDefault(userId, new Cart());
    }
}
