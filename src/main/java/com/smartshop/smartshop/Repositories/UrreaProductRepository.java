package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.UrreaProduct;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrreaProductRepository extends JpaRepository<UrreaProduct, String> {
    @NonNull Page<UrreaProduct> findAll(@NonNull Pageable pageable);

    @Query("SELECT p FROM UrreaProduct AS p WHERE p.estatusInventario != 'No disponible' AND LENGTH(p.nombreLargo) > 0")
    List<UrreaProduct> findByProductosDisponible();

    @Query("SELECT DISTINCT u.marca FROM UrreaProduct u")
    List<String> getMarcas();
}

