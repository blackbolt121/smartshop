package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.Id;
import com.smartshop.smartshop.Models.Vendor;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Producto {
    @Id
    private String Id;
    @Column(nullable = false)
    private String name;
    @Column( columnDefinition = "TEXT")
    private String description;
    private double price;
    @Column(name = "image_url", length = 1024) // opcional: nombre de columna en la base de datos
    private String imageUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;
    @PrePersist
    public void prePersist() {
        if (this.Id == null) {
            this.Id = UUID.randomUUID().toString();
        }
    }
    @Column
    private String category;
}
