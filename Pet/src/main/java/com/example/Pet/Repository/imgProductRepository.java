package com.example.Pet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.imgProduct;

@Repository
public interface imgProductRepository extends JpaRepository<imgProduct, Long> {

    Optional<imgProduct> findByProductId(Long productId);
}
