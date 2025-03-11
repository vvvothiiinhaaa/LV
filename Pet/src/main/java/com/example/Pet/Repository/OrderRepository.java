package com.example.Pet.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserIdAndOrderStatus(Integer userId, String orderStatus);

    List<Order> findByUserId(Integer userId);

    Optional<Order> findById(Long id);

    // Truy vấn các đơn hàng theo trạng thái
    List<Order> findByOrderStatus(String orderStatus);

    // @Query("SELECT o FROM Order o WHERE o.orderDate = :orderDate")
    // List<Order> findOrdersByOrderDate(Date orderDate);
    List<Order> findByOrderDate(Date orderDate);

    @Query(value = "SELECT * FROM orders o WHERE CONVERT(VARCHAR, o.order_date, 23) = :orderDate", nativeQuery = true)
    List<Order> findOrdersByOrderDate(LocalDate orderDate);

    // Tìm đơn hàng theo trạng thái và ngày (hoặc thiếu một trong hai)
    // Native query sử dụng CONVERT để lấy phần ngày
    @Query(value = "SELECT * FROM orders o WHERE "
            + "(?1 IS NULL OR o.order_status = ?1) AND "
            + "(?2 IS NULL OR CONVERT(VARCHAR, o.order_date, 23) = ?2)",
            nativeQuery = true)
    List<Order> findOrdersByStatusAndDate(String status, String orderDate);
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;

// import com.example.Pet.Modal.Order;

// @Repository
// public interface OrderRepository extends JpaRepository<Order, Integer> {

//     List<Order> findByUserIdAndOrderStatus(Integer userId, String orderStatus);

//     List<Order> findByUserId(Integer userId);

//     Optional<Order> findById(Integer id);

//     List<Order> findByOrderStatus(String orderStatus);

//     // ✅ Sửa lại kiểu dữ liệu cho orderDate
//     List<Order> findByOrderDate(LocalDateTime orderDate);

//     // ✅ Truy vấn theo ngày (chỉ lấy phần ngày, bỏ giờ phút giây)
//     @Query("SELECT o FROM Order o WHERE DATE(o.orderDate) = :orderDate")
//     List<Order> findOrdersByOrderDate(LocalDate orderDate);

//     // // ✅ Truy vấn theo trạng thái và ngày (nếu có)
//     // @Query("SELECT o FROM Order o WHERE "
//     //         + "(:status IS NULL OR o.orderStatus = :status) AND "
//     //         + "(:orderDate IS NULL OR DATE(o.orderDate) = :orderDate)")
//     // List<Order> findOrdersByStatusAndDate(String status, LocalDate orderDate);
//     @Query(value = "SELECT * FROM orders o WHERE "
//             + "(?1 IS NULL OR o.order_status = ?1) AND "
//             + "(?2 IS NULL OR CONVERT(VARCHAR, o.order_date, 23) = ?2)",
//             nativeQuery = true)
//     List<Order> findOrdersByStatusAndDate(String status, LocalDate orderDate);
// }
