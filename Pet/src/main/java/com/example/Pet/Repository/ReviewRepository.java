package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Modal.User;
import com.example.Pet.Modal.review;

@Repository
public interface ReviewRepository extends JpaRepository<review, Long> {

    // List<review> findByProductId(Long productId);
    // Lấy tất cả đánh giá của một sản phẩm trong một đơr hàng cụ thể
    List<review> findByOrderItemId(Integer orderItemId);

    // Lấy tất cả đánh giá của một sản phẩm từ tất cả đơn hàng
    List<review> findByOrderItem_ProductId(Long productId);

    // @Query("SELECT r FROM Review r "
    //         + "JOIN FETCH r.user u "
    //         + "JOIN r.orderItem oi "
    //         + "JOIN oi.product p "
    //         + // Thêm JOIN với Product
    //         "WHERE p.id = :productId")
    // List<review> findReviewsByProductId(@Param("productId") Long productId);
    // Tính trung bình rating của một sản phẩm từ tất cả các đánh giá
    @Query("SELECT AVG(r.rating) FROM review r JOIN r.orderItem oi WHERE oi.productId = :productId")
    Optional<Double> findAverageRatingByProductId(Long productId);

    boolean existsByOrderItemAndUser(OrderItem orderItem, User user);

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong cùng một đơn hàng hay chưa
    boolean existsByOrderItem_ProductIdAndUser_Id(Long productId, Long userId);

    //////////////////////////////////////
    @Query("SELECT r, u FROM review r JOIN r.user u WHERE r.orderItem.productId = :productId")
    List<Object[]> findReviewsWithUserByProductId(@Param("productId") Long productId);

}
