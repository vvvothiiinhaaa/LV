package com.example.Pet.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrderId(Integer orderId);

    Optional<OrderItem> findById(Long id);

    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByOrder(Order order);

    // @Query("SELECT oi FROM OrderItem oi WHERE oi.order.orderDate BETWEEN :startDate AND :endDate AND oi.order.orderStatus = :status")
    // List<OrderItem> findOrderItemsByProductIdAndDateRangeAndStatus(
    //         @Param("startDate") LocalDate startDate,
    //         @Param("endDate") LocalDate endDate,
    //         @Param("status") String status);
    @Query("SELECT oi FROM OrderItem oi WHERE oi.productId = :productId AND oi.order.orderDate BETWEEN :startDate AND :endDate AND oi.order.orderStatus = :status")
    List<OrderItem> findOrderItemsByProductIdAndDateRangeAndStatus(Long productId, LocalDate startDate, LocalDate endDate, String status);

}
