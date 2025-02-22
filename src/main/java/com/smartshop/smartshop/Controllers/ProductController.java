package com.smartshop.smartshop.Controllers;


import com.smartshop.smartshop.Models.Producto;
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

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProducts(){

        try{
            return ResponseEntity.ok().body(service.getAllProducts());
        }catch(Exception exception){

            return ResponseEntity.badRequest().build();
        }

    }


}
