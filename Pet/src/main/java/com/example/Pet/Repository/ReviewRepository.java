package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.review;

@Repository
public interface ReviewRepository extends JpaRepository<review, Long> {

    // List<review> findByProductId(Long productId);
    // Lấy tất cả đánh giá của một sản phẩm trong một đơn hàng cụ thể
    List<review> findByOrderItemId(Integer orderItemId);

    // Lấy tất cả đánh giá của một sản phẩm từ tất cả đơn hàng
    List<review> findByOrderItem_ProductId(Long productId);

    // Tính trung bình rating của một sản phẩm từ tất cả các đánh giá
    @Query("SELECT AVG(r.rating) FROM review r JOIN r.orderItem oi WHERE oi.productId = :productId")
    Optional<Double> findAverageRatingByProductId(Long productId);

}
