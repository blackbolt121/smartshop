package com.smartshop.smartshop.Services;


import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Repositories.ProductDetailRepository;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class PedidosService {

    private final PedidoRepository pedidoRepository;
    private final CartService cartService;
    private final UrreaProductRepository urreaProductRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductoService productoService;


    @Transactional
    public Pedidos generatePedido(Cart cart) {
        // 1. Crea el objeto Pedido principal. Aún no lo guardes.
        Pedidos nuevoPedido = new Pedidos();
        nuevoPedido.setUsuario(cart.getUsuario());
        nuevoPedido.setPedidoStatus(PedidoStatus.EN_PROCESO);
        nuevoPedido.setGuia("");

        // 2. Agrupa los productos del carrito para obtener sus cantidades.
        Map<UUID, Integer> productQuantityMap = new HashMap<>();
        for (CartItem item : cart.getItems()) {
            productQuantityMap.merge(item.getProduct().getId(), item.getQuantity(), Integer::sum);
        }

        // 3. Itera sobre los productos para crear y asociar los detalles.
        for (Map.Entry<UUID, Integer> entry : productQuantityMap.entrySet()) {
            UUID productoId = entry.getKey();
            int cantidad = entry.getValue();

            Producto producto = productoService.getProduct(productoId.toString())
                    .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con ID: " + productoId));

            PedidoDetail detalle = new PedidoDetail();
            detalle.setQuantity(cantidad);
            detalle.setStatic_price(producto.getPrice()); // Guarda el precio del producto en ese momento

            // Asocia el producto al detalle.
            detalle.setProducto(producto);

            // ¡CLAVE! Usa tu método de ayuda para asociar el detalle al pedido.
            // Esto establece la relación en ambos lados y previene el error.
            nuevoPedido.addDetail(detalle);

        }

        // 4. Una vez que el pedido está completo, calcula el total.
        nuevoPedido.calcularTotal();



        // 5. Guarda el objeto Pedido UNA SOLA VEZ.
        // CascadeType.ALL se encargará de guardar todos los PedidoDetail asociados.
        return pedidoRepository.save(nuevoPedido);
    }

}
