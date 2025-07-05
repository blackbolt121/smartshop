package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString(exclude = {"pedidos", "producto"}) // Excluye las referencias a los padres
@EqualsAndHashCode(exclude = {"pedidos", "producto"}) // Excluye las referencias a los padres
public class PedidoDetail {

    @Id
    private ProductDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("pedidoId") // Mapea al campo 'pedidoId' de ProductDetailId
    @JoinColumn(name = "pedidoId")
    private Pedidos pedidos;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId") // Mapea al campo 'productId' de ProductDetailId
    @JoinColumn(name = "productoId")
    private Producto producto;

    @Column(nullable = false)
    private double static_price;

    @Column(nullable = false)
    private double quantity;
}