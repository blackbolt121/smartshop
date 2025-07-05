package com.smartshop.smartshop.Enumeration;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PedidoStatus {

    ENTREGADO("Entregado", 1),
    EN_PROCESO("En processo", 2),
    CANCELADO("Cancelado", 3);

    private final String status;
    private final int id;
}
