package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.ProductPrice;

@Repository
public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {

    @Query(value = "SELECT TOP 1 * FROM product_price WHERE product_id = :productId ORDER BY effective_date DESC", nativeQuery = true)
    ProductPrice findLatestPriceByProductId(Long productId);

}
