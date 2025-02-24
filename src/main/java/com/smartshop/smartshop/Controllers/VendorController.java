package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api/1/vendor")
public class VendorController {
    @Autowired
    private final VendorRepository vendorRepository;
    @GetMapping
    public ResponseEntity<String> getVendor(@PathVariable String vendorId) {
        Optional<Vendor> vendor = vendorRepository.findById(vendorId);
        return vendor.map(value -> ResponseEntity.ok(value.toString())).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<String> createVendor(@RequestBody Vendor vendor) {
        vendorRepository.save(vendor);
        return ResponseEntity.ok(vendor.toString());
    }
}
