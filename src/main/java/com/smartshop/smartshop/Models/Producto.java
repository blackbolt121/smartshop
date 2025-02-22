package com.smartshop.smartshop.Models;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;



@Data
@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @Column(nullable = false)
    private String name;
    private String description;
    private double price;
}
