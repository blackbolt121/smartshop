package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api/1/vendor")
@Slf4j
public class VendorController {
    @Autowired
    private final VendorRepository vendorRepository;

    @GetMapping
    public ResponseEntity<String> getVendor(@PathVariable String vendorId) {
        Optional<Vendor> vendor = vendorRepository.findById(vendorId);
        return vendor.map(value -> ResponseEntity.ok(value.toString())).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/all")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        log.info("Get all vendors");
        List<Vendor> vendors = vendorRepository.findAll();
        return ResponseEntity.ok(vendors); // Devuelve un único array JSON

    }

    @PutMapping(path = "{vendorId}")
    public ResponseEntity<String> updateVendor(@PathVariable String vendorId, @RequestBody Vendor updatedVendor) {


        try {

            log.info("Updating vendor: " + updatedVendor);

            vendorRepository.save(updatedVendor);

            return ResponseEntity.status(200).build();
        }catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteVendor(@PathVariable String vendorId) {
        Optional<Vendor> vendor = vendorRepository.findById(vendorId);
        vendor.ifPresent(vendorRepository::delete);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<String> createVendor(@RequestBody Vendor vendor) {
        vendorRepository.save(vendor);
        String id = vendor.getVendorId();

        return ResponseEntity.status(201).body(String.format("{\"id\": \"%s\"}", id));
    }
}
