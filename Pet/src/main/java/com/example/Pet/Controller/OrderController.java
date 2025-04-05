package com.example.Pet.Controller;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestParam Integer userId,
            @RequestParam BigDecimal discount,
            @RequestParam BigDecimal totalPayment,
            @RequestParam String paymentMethod,
            @RequestParam String note,
            @RequestParam Integer addressId,
            @RequestBody List<OrderItem> orderItems) {
        try {
            //  Kiểm tra danh sách sản phẩm
            if (orderItems == null || orderItems.isEmpty()) {
                return ResponseEntity.badRequest().body(" Danh sách sản phẩm (orderItems) không được để trống.");
            }

            //  Kiểm tra phương thức thanh toán
            System.out.println(" Phương thức thanh toán nhận được: " + paymentMethod);

            //  Gọi service để tạo đơn hàng
            Order savedOrder = orderService.createOrder(userId, discount, totalPayment, paymentMethod, note, orderItems, addressId);

            //  Trả về phản hồi với ID đơn hàng
            return ResponseEntity.ok(Map.of(
                    "message", " Đơn hàng đã được tạo thành công!",
                    "orderId", savedOrder.getId(),
                    "orderStatus", savedOrder.getOrderStatus()
            ));

        } catch (Exception e) {
            System.err.println(" Lỗi khi tạo đơn hàng: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    ////////////////////////api lấy chi tiết đơn hàng
    //   @GetMapping("/{orderId}")
    // public ResponseEntity<Map<String, Object>> getOrderDetails(@PathVariable Integer orderId) {
    //     Map<String, Object> orderDetails = orderService.getOrderDetails(orderId);
    //     return ResponseEntity.ok(orderDetails);
    // }
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderId) {
        try {
            //  Gọi service để lấy chi tiết đơn hàng
            Map<String, Object> orderDetails = orderService.getOrderDetails(orderId);

            //  Kiểm tra nếu đơn hàng không tồn tại
            if (orderDetails == null || orderDetails.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy đơn hàng với ID: " + orderId));
            }

            //  Trả về dữ liệu đơn hàng
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            //  Ghi log lỗi để dễ debug
            System.err.println(" Lỗi khi lấy chi tiết đơn hàng: " + e.getMessage());

            //  Trả về lỗi 500 nếu có lỗi xảy ra
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau!"));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
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

    // Lấy tất cả đơn hàng cho admin
    @GetMapping("/employee")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
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

    ////////////////// cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId, @RequestParam String newStatus) {
        try {
            orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok("Cập nhật trạng thái thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Order not found");
        }
    }

    @GetMapping("/date")
    public List<Order> getOrdersByDate(
            @RequestParam("orderDate")
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate orderDate) {
        return orderService.getOrdersByDate(orderDate);
    }

    @GetMapping("/filter")
    public List<Order> getOrdersByStatusAndDate(
            @RequestParam(value = "orderStatus", required = false) String status,
            @RequestParam(value = "orderDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") Date orderDate) {
        // Convert date to string in the format yyyy-MM-dd if orderDate is provided
        String orderDateString = null;
        if (orderDate != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            orderDateString = sdf.format(orderDate);
        }
        return orderService.getOrders(status, orderDateString); // Gọi service để lấy đơn hàng
    }

    @GetMapping("/count/pending")
    public long getPendingOrderCount() {
        return orderService.countPendingOrders();
    }

    /// đếm số sp đã bán
    @GetMapping("/total-sold-products")
    public Map<String, Integer> getTotalSoldProducts() {
        int total = orderService.countSoldProducts();
        return Map.of("totalProducts", total);
    }
}

//////////////////////////////////////////////////
// package com.example.Pet.Controller;

// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.Pet.Modal.Order;
// import com.example.Pet.Modal.OrderItem;
// import com.example.Pet.Service.OrderService;

// @RestController
// @RequestMapping("/api/orders")
// public class OrderController {

//     @Autowired
//     private OrderService orderService;

//     //  API tạo đơn hàng (orderDate tự động lấy `LocalDateTime.now()`)
//     @PostMapping("/create")
//     public ResponseEntity<String> createOrder(
//             @RequestParam Integer userId,
//             @RequestParam BigDecimal discount,
//             @RequestParam BigDecimal totalPayment,
//             @RequestParam String paymentMethod,
//             @RequestParam Integer addressId,
//             @RequestBody List<OrderItem> orderItems) {

//         try {
//             if (orderItems == null || orderItems.isEmpty()) {
//                 return ResponseEntity.badRequest().body("Danh sách sản phẩm không được để trống.");
//             }

//             Order savedOrder = orderService.createOrder(userId, discount, totalPayment, paymentMethod, orderItems, addressId);
//             return ResponseEntity.ok("Đơn hàng đã tạo thành công với ID: " + savedOrder.getId());
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng: " + e.getMessage());
//         }
//     }

//     // ✅ API lấy chi tiết đơn hàng
//     @GetMapping("/{orderId}")
//     public ResponseEntity<Map<String, Object>> getOrderDetails(@PathVariable Integer orderId) {
//         Map<String, Object> orderDetails = orderService.getOrderDetails(orderId);
//         return ResponseEntity.ok(orderDetails);
//     }

//     // ✅ API lấy đơn hàng theo trạng thái
//     @GetMapping("/status/{status}")
//     public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
//         List<Order> orders = orderService.getOrdersByStatus(status);
//         return ResponseEntity.ok(orders);
//     }

//     //  API lấy đơn hàng theo userId & trạng thái
//     @GetMapping("/user/{userId}/status/{status}")
//     public ResponseEntity<List<Order>> getOrdersByUserAndStatus(
//             @PathVariable Integer userId,
//             @PathVariable String status) {
//         List<Order> orders = orderService.getOrdersByUserAndStatus(userId, status);
//         return ResponseEntity.ok(orders);
//     }

//     //  API lấy tất cả đơn hàng theo userId
//     @GetMapping("/user/{userId}")
//     public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Integer userId) {
//         List<Order> orders = orderService.getOrdersByUserId(userId);
//         return ResponseEntity.ok(orders);
//     }

//     //  API lấy tất cả đơn hàng cho nhân viên/admin
//     @GetMapping("/employee")
//     public List<Order> getAllOrders() {
//         return orderService.getAllOrders();
//     }

//     //  API hủy đơn hàng
//     @PutMpping("/{orderId}/cancel")
//     public ResponseEntity<String> cancelOrder(@PathVariable int orderId) {
//         try {
//             orderService.cancelOrder(orderId);
//             return ResponseEntity.ok("Đơn hàng đã được hủy thành công.");
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//         }
//     }

//     //  API cập nhật trạng thái đơn hàng
//     @PutMapping("/{orderId}/status")
//     public ResponseEntity<String> updateOrderStatus(@PathVariable int orderId, @RequestParam String newStatus) {
//         try {
//             orderService.updateOrderStatus(orderId, newStatus);
//             return ResponseEntity.ok("Cập nhật trạng thái thành công.");
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng.");
//         }
//     }

//     //  API lấy đơn hàng theo ngày (bỏ giờ phút giây)
//     @GetMapping("/date")
//     public List<Order> getOrdersByDate(
//             @RequestParam("orderDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate orderDate) {
//         return orderService.getOrdersByDate(orderDate);
//     }

//     //  API lọc đơn hàng theo trạng thái và ngày (bỏ giờ phút giây)
//     @GetMapping("/filter")
//     public ResponseEntity<List<Order>> getOrdersByStatusAndDate(
//             @RequestParam(value = "orderStatus", required = false) String status,
//             @RequestParam(value = "orderDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate orderDate) {

//         // Gọi service để lấy danh sách đơn hàng
//         List<Order> orders = orderService.getOrders(status, orderDate);

//         // Kiểm tra nếu danh sách rỗng
//         if (orders.isEmpty()) {
//             return ResponseEntity.status(HttpStatus.NO_CONTENT).body(orders);
//         }

//         return ResponseEntity.ok(orders);
//     }

// }
