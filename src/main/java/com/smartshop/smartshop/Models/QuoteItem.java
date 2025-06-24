package com.smartshop.smartshop.Models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Producto product;

    @ManyToOne(optional = false)
    private Cotizacion cotizacion;

    @Column(nullable = false)
    private Integer quantity;
}
