package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.Cartitem;
import com.example.Pet.Modal.Product;

@Repository
public interface CartItemRepository extends JpaRepository<Cartitem, Long> {

    Optional<Cartitem> findByCartAndProduct(Cart cart, Product product);

    List<Cartitem> findByCart(Cart cart);  // Trả về danh sách CartItem theo giỏ hàng
    // xóa tất cả

    void deleteByCart(Cart cart);

}
