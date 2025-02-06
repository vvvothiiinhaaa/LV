package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.Cartitem;
import com.example.Pet.Modal.Product;

import jakarta.transaction.Transactional;

@Repository
public interface CartItemRepository extends JpaRepository<Cartitem, Long> {

    Optional<Cartitem> findByCartAndProduct(Cart cart, Product product);

    List<Cartitem> findByCart(Cart cart);  // Trả về danh sách CartItem theo giỏ hàng
    // xóa tất cả

    void deleteByCart(Cart cart);

    //////////// cập nhật select
     @Modifying
    @Transactional
    @Query("UPDATE Cartitem c SET c.selected = true WHERE c.cart.user.id = :userId AND c.product.id = :productId")
    void updateSelectedByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    /// lấy select
    @Query("SELECT c.product.id FROM Cartitem c WHERE c.selected = true AND c.cart.user.id = :userId")
    List<Long> findSelectedProductIdsByUserId(@Param("userId") Long userId);

    // reset selectselect
    @Modifying
    @Transactional
    @Query("UPDATE Cartitem c SET c.selected = false WHERE c.cart.user.id = :userId")
    void resetSelectedProductsByUserId(@Param("userId") Long userId);

    @Query("SELECT c.product.id, c.quantity FROM Cartitem c WHERE c.selected = true AND c.cart.user.id = :userId")
    List<Object[]> findSelectedProductsWithQuantityByUserId(@Param("userId") Long userId);

}
