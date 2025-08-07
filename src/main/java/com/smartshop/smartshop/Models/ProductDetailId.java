package com.smartshop.smartshop.Models;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode // Correcto aquí porque se basa en los valores de la clave
public class ProductDetailId implements Serializable {

    // Debe coincidir con el tipo del ID de Pedidos
    private Long pedidoId;
    // Debe coincidir con el tipo del ID de Producto
    private UUID productId;



}