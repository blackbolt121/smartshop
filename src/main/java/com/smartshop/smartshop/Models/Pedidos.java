package com.smartshop.smartshop.Models;

import com.smartshop.smartshop.Enumeration.PedidoStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@ToString(exclude = {"usuario", "pedidoDetails"}) // Excluir AMBAS relaciones
@EqualsAndHashCode(exclude = {"usuario", "pedidoDetails"}) // Excluye la colección para evitar bucles infinitos
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String guia;
    private PedidoStatus pedidoStatus;

    @OneToMany(
            mappedBy = "pedidos",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<PedidoDetail> pedidoDetails = new HashSet<>();

    private double total;

    // --- Métodos de Ayuda ---

    public void addDetail(PedidoDetail detail) {
        this.pedidoDetails.add(detail);
        detail.setPedidos(this); // Sincroniza la relación en ambos sentidos
        System.out.println("--- ASOCIACIÓN COMPLETA. El campo 'pedidos' en el detalle es null? " + (detail.getPedidos() == null));
    }

    public void calcularTotal() {
        this.total = this.pedidoDetails.stream()
                .mapToDouble(detail -> detail.getStatic_price() * detail.getQuantity())
                .sum();
    }
}