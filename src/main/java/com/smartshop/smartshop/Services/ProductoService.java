package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    ProductRepository productRepository;
    public List<Producto> getAllProducts(){
        return productRepository.findAll();
    }
    public Optional<Producto> getProduct(Long id){
        return productRepository.findById(id);
    }
    public Producto saveProduct(Producto producto){
        productRepository.save(producto);
        return producto;
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }
}
