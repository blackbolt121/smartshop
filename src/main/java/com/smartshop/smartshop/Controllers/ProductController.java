package com.smartshop.smartshop.Controllers;


import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Services.ProductoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;


@CrossOrigin(origins = "*")
@RequestMapping(path = "/rest/api/1/producto")
@RestController
public class ProductController {

    @Autowired
    private ProductoService service;
    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> createProduct(@RequestBody Producto producto){

        try{
            Producto p = service.saveProduct(producto);
            HashMap<String, String> response = new HashMap<String, String>(){
                {
                    put("status", String.valueOf(p).toString());
                }
            };
            return ResponseEntity.ok().body(response);
        }catch(Exception exception){


            HashMap<String, String> response = new HashMap<String, String>(){
                {
                    put("message", "Product couldn't be created");
                }
            };
            return ResponseEntity.badRequest().body(response);
        }

    }

    @GetMapping(path = "all")
    public ResponseEntity<List<Producto>> getAllProducts(){

        try{
            return ResponseEntity.ok().body(service.getAllProducts());
        }catch(Exception exception){

            return ResponseEntity.badRequest().build();
        }

    }
    @GetMapping(path = "top")
    public ResponseEntity<List<Producto>> getTopProducts(){
        return ResponseEntity.ok(productRepository.findRandomProducts());
    }
    @GetMapping(path = "{producto}")
    public ResponseEntity<Producto> getProduct(@PathVariable String producto){
        Producto product = service.getProduct(producto).orElse(null);
        if(product != null){
            return ResponseEntity.ok().body(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping(path = "{producto}")
    public ResponseEntity<String> updateProduct(@PathVariable String producto, @RequestBody Producto updatedProduct){


        Producto search = service.getProduct(producto).orElse(null);

        if(search == null){
            return ResponseEntity.notFound().build();
        }

        if(!updatedProduct.getId().equals(search.getId())){
            return ResponseEntity.badRequest().build();
        }

        service.saveProduct(updatedProduct);

        return ResponseEntity.status(204).build();
    }


}
