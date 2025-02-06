package com.example.Pet.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Repository.CartItemRepository;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public void updateSelected(Long userId, Long productId) {
        cartItemRepository.updateSelectedByUserIdAndProductId(userId, productId);
    }

    public List<Long> getSelectedProductIds(Long userId) {
        return cartItemRepository.findSelectedProductIdsByUserId(userId);
    }

    public void resetSelectedProducts(Long userId) {
        cartItemRepository.resetSelectedProductsByUserId(userId);
    }

    public List<Map<String, Object>> getSelectedProductsWithQuantity(Long userId) {
        List<Object[]> results = cartItemRepository.findSelectedProductsWithQuantityByUserId(userId);
        List<Map<String, Object>> selectedProducts = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("productId", row[0]);
            productData.put("quantity", row[1]);
            selectedProducts.add(productData);
        }

        return selectedProducts;
    }
}
