package com.example.Pet.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.imgProduct;
import com.example.Pet.Repository.imgProductRepository;

@Service
public class imgProductService {

    @Autowired
    private imgProductRepository imgproductRepository;

    public imgProduct getImagesByProductId(Long productId) {
        return imgproductRepository.findByProductId(productId).orElse(null);
    }

    public imgProduct imgByProduct(Long productId) {
        return imgproductRepository.findByProductId(productId).orElse(null);
    }

}
