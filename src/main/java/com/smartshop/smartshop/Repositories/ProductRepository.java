package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.UrreaProduct;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Producto, String> {
    @NonNull
    Page<Producto> findAll(@NonNull Pageable pageable);
    // Consulta personalizada para obtener 5 productos aleatorios
    @Query(value = "SELECT * FROM producto ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Producto> findRandomProducts();

    @Query(value = """
        SELECT * FROM producto as p
        WHERE MATCH(p.name, p.description, p.category)
        AGAINST(:query IN NATURAL LANGUAGE MODE)
        """, nativeQuery = true)
    Page<Producto> buscarFullText(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Producto p WHERE (:name IS NULL OR p.name LIKE %:name%)" +
            " AND (:categories IS NULL OR p.category IN :categories)" +
            " AND (:minPrice IS NULL OR p.price >= :minPrice)" +
            " AND (:maxPrice IS NULL OR p.price <= :maxPrice)" +
            " AND (:brand IS NULL OR p.vendor.vendorId = :brand)")
    Page<Producto> findByFilters(@Param("name") String name,
                                 @Param("categories") List<String> categories,
                                 @Param("minPrice") Double minPrice,
                                 @Param("maxPrice") Double maxPrice,
                                 @Param("brand") String brand,
                                 Pageable pageable);
    @Query("SELECT DISTINCT p.category FROM Producto p")
    List<String> findDistinctCategories();
}
