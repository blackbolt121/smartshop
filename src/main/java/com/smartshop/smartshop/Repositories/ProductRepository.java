package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Producto, String> {
    // Consulta personalizada para obtener 5 productos aleatorios
    @Query(value = "SELECT * FROM producto ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Producto> findRandomProducts();
}
