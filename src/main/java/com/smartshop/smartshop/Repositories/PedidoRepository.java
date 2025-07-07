package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.Usuario;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PedidoRepository extends JpaRepository<Pedidos, Long> {

    @NonNull
    Page<Pedidos> findAllByUsuario(@NonNull Usuario usuario,@NonNull Pageable pageable);


}
