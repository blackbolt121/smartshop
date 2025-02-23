package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {
}
