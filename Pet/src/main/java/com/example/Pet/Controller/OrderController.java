package com.example.Pet.Controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // @PostMapping("/create")
    // public ResponseEntity<String> createOrder(
    //         @RequestParam Integer userId,
    //         @RequestParam BigDecimal discount,
    //         @RequestParam BigDecimal totalPayment,
    //         @RequestParam String paymentMethod,
    //         @RequestParam Integer addressId,
    //         @RequestBody List<OrderItem> orderItems) {
    //     try {
    //         // Kiểm tra danh sách sản phẩm
    //         if (orderItems == null || orderItems.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Danh sách sản phẩm (orderItems) không được để trống.");
    //         }
    //         // Gọi service để tạo đơn hàng
    //         Order savedOrder = orderService.createOrder(userId, discount, totalPayment, paymentMethod, orderItems, addressId);
    //         return ResponseEntity.ok("Đơn hàng đã được tạo thành công với ID: " + savedOrder.getId());
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng: " + e.getMessage());
    //     }
    // }
    @PostMapping("/create")
    public ResponseEntity<String> createOrder(
            @RequestParam Integer userId,
            @RequestParam BigDecimal discount,
            @RequestParam BigDecimal totalPayment,
            @RequestParam String paymentMethod,
            @RequestParam Integer addressId,
            @RequestBody List<OrderItem> orderItems) {

        try {
            // Kiểm tra danh sách sản phẩm
            if (orderItems == null || orderItems.isEmpty()) {
                return ResponseEntity.badRequest().body("Danh sách sản phẩm (orderItems) không được để trống.");
            }

            // Gọi service để tạo đơn hàng
            Order savedOrder = orderService.createOrder(userId, discount, totalPayment, paymentMethod, orderItems, addressId);

            return ResponseEntity.ok("Đơn hàng đã được tạo thành công với ID: " + savedOrder.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    ////////////////////////api lấy chi tiết đơn hàng
      @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderDetails(@PathVariable Integer orderId) {
        Map<String, Object> orderDetails = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    ////// api lấy đơn hàng theo trạng thái
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByUserAndStatus(
            @PathVariable Integer userId,
            @PathVariable String status) {
        List<Order> orders = orderService.getOrdersByUserAndStatus(userId, status);
        return ResponseEntity.ok(orders);
    }

    ////////////// api lấy tất cả đơn hàng  @GetMapping("/user/{userId}")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    /////////////////////////////////////// hủy đơn hàng 
      @PutMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable int orderId) {
        try {
            orderService.cancelOrder(orderId);
            return ResponseEntity.ok("Order has been cancelled successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
