package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.ProductWeight;

public interface ProductWeightRepository extends JpaRepository<ProductWeight, Long> {

    List<ProductWeight> findByProductId(Long productId);
}
