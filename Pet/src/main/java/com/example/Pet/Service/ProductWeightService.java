package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.ProductWeight;
import com.example.Pet.Repository.ProductWeightRepository;

@Service
public class ProductWeightService {

    @Autowired
    private ProductWeightRepository repository;

    public List<ProductWeight> getWeightsByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    public Double getPriceByProductIdAndWeight(Long productId, Integer weight) {
        return repository.findByProductId(productId).stream()
                .filter(p -> p.getWeight().equals(weight))
                .findFirst()
                .map(ProductWeight::getPrice)
                .orElse(null);
    }
}
