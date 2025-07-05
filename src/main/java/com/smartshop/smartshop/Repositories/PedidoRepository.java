package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Pedidos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedidos, Long> {
}
