package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.ProductWeight;
import com.example.Pet.Service.ProductWeightService;

@RestController
@RequestMapping("/api/productweights")
public class ProductWeightController {

    @Autowired
    private ProductWeightService service;

    // API lấy danh sách trọng lượng và giá của 1 sản phẩm
    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductWeight>> getWeightsByProductId(@PathVariable Long productId) {
        List<ProductWeight> weights = service.getWeightsByProductId(productId);
        return ResponseEntity.ok(weights);
    }

    // API lấy giá theo productId và weight
    @GetMapping("/{productId}/price")
    public ResponseEntity<Double> getPriceByProductIdAndWeight(
            @PathVariable Long productId,
            @RequestParam Integer weight) {

        Double price = service.getPriceByProductIdAndWeight(productId, weight);
        if (price != null) {
            return ResponseEntity.ok(price);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
