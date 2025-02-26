package com.example.Pet.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderAddress;
import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Modal.Product;
import com.example.Pet.Repository.OrderAddressRepository;
import com.example.Pet.Repository.OrderItemRepository;
import com.example.Pet.Repository.OrderRepository;
import com.example.Pet.Repository.ProductRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderAddressRepository orderAddressRepository;

    @Autowired
    private ProductRepository productRepository;

    // @Transactional
    // public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod,
    //         List<OrderItem> orderItems, Integer addressId) {
    //     // Khởi tạo và lưu thông tin đơn hàng
    //     Order order = new Order();
    //     order.setUserId(userId);
    //     order.setOrderDate(new Date());
    //     order.setDiscount(discount);
    //     order.setOrderStatus("Chờ Xác Nhận"); // Trạng thái mặc định là PENDING
    //     order.setTotalPayment(totalPayment);
    //     order.setPaymentMethod(paymentMethod);
    //     // Thiết lập quan hệ giữa Order và OrderItem
    //     for (OrderItem item : orderItems) {
    //         item.setOrder(order); // Gắn đơn hàng cho từng OrderItem
    //     }
    //     order.setOrderItems(orderItems);
    //     // Lưu Order trước khi lưu OrderItem (Cascade.ALL sẽ tự động lưu OrderItem)
    //     Order savedOrder = orderRepository.save(order);
    //     // Lưu thông tin địa chỉ liên kết với đơn hàng
    //     OrderAddress orderAddress = new OrderAddress();
    //     orderAddress.setUserId(userId);
    //     orderAddress.setOrderId(savedOrder.getId());
    //     orderAddress.setAddressId(addressId);
    //     orderAddressRepository.save(orderAddress);
    //     // Trả về thông tin đơn hàng đã được lưu
    //     return savedOrder;
    // }
    @Transactional
    public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod,
            List<OrderItem> orderItems, Integer addressId) {
        // Khởi tạo và lưu thông tin đơn hàng
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(new Date());
        order.setDiscount(discount);
        order.setOrderStatus("Chờ Xác Nhận"); // Trạng thái mặc định là PENDING
        order.setTotalPayment(totalPayment);
        order.setPaymentMethod(paymentMethod);

        // Thiết lập quan hệ giữa Order và OrderItem
        for (OrderItem item : orderItems) {
            item.setOrder(order); // Gắn đơn hàng cho từng OrderItem

            // Tìm sản phẩm trong database
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + item.getProductId()));

            // Kiểm tra tồn kho
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Số lượng tồn kho không đủ cho sản phẩm: " + product.getName());
            }

            // Cập nhật số lượng đã bán và tồn kho
            product.setSold(product.getSold() + item.getQuantity());
            product.setQuantity(product.getQuantity() - item.getQuantity());

            // Lưu lại thay đổi của sản phẩm
            productRepository.save(product);
        }
        order.setOrderItems(orderItems);

        // Lưu Order trước khi lưu OrderItem (Cascade.ALL sẽ tự động lưu OrderItem)
        Order savedOrder = orderRepository.save(order);

        // Lưu thông tin địa chỉ liên kết với đơn hàng
        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setUserId(userId);
        orderAddress.setOrderId(savedOrder.getId());
        orderAddress.setAddressId(addressId);
        orderAddressRepository.save(orderAddress);

        // Trả về thông tin đơn hàng đã được lưu
        return savedOrder;
    }

    ///////////////// lấy chi tiết đơn hàng
     public Map<String, Object> getOrderDetails(Integer orderId) {
        // Tìm thông tin đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Tìm danh sách OrderItem liên quan
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        // Lấy thông tin chi tiết sản phẩm cho từng OrderItem
        List<Map<String, Object>> itemDetails = orderItems.stream().map(orderItem -> {
            Product product = productRepository.findById(orderItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItem.getProductId()));

            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("id", orderItem.getId());
            itemMap.put("productName", product.getName());
            itemMap.put("quantity", orderItem.getQuantity());
            itemMap.put("url", product.getUrl());
            itemMap.put("total", orderItem.getTotal());
            return itemMap;
        }).collect(Collectors.toList());

        // Tìm địa chỉ liên quan đến đơn hàng
        OrderAddress orderAddress = orderAddressRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order address not found for Order ID: " + orderId));

        // Tạo map chứa thông tin địa chỉ
        Map<String, Object> addressMap = new HashMap<>();
        addressMap.put("userId", orderAddress.getUserId());
        addressMap.put("addressId", orderAddress.getAddressId());

        // Tạo map trả về
        Map<String, Object> orderDetails = new HashMap<>();
        orderDetails.put("orderId", order.getId());
        orderDetails.put("userId", order.getUserId());
        orderDetails.put("orderDate", order.getOrderDate());
        orderDetails.put("totalPayment", order.getTotalPayment());
        orderDetails.put("paymentMethod", order.getPaymentMethod());
        orderDetails.put("orderStatus", order.getOrderStatus());
        orderDetails.put("address", addressMap);
        orderDetails.put("items", itemDetails);

        return orderDetails;
    }

    /// lấy đơn hàng theo trạng thái 
    public List<Order> getOrdersByUserAndStatus(Integer userId, String status) {
        return orderRepository.findByUserIdAndOrderStatus(userId, status);
    }

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        // Giả sử Order có thuộc tính 'orderStatus' là trạng thái của đơn hàng
        return orderRepository.findByOrderStatus(status);
    }

    /// lấy tất cả đơn hàng
    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    ////////////////////////////////// hủy đơn hàng
    // public void cancelOrder(int orderId) {
    //     Optional<Order> orderOptional = orderRepository.findById(orderId);
    //     if (orderOptional.isPresent()) {
    //         Order order = orderOptional.get();
    //         order.setOrderStatus("Đã Hủy");
    //         orderRepository.save(order);
    //     } else {
    //         throw new RuntimeException("Order not found");
    //     }
    // }
    public void cancelOrder(int orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            if ("Chờ Xác Nhận".equals(order.getOrderStatus())) {
                order.setOrderStatus("Đã Hủy");
                // Khôi phục số lượng sản phẩm đã bán và tồn kho
                // Kiểm tra danh sách sản phẩm trong đơn hàng
                if (order.getOrderItems().isEmpty()) {
                    System.out.println("Không có sản phẩm nào trong đơn hàng!");
                    throw new RuntimeException("Không có sản phẩm nào trong đơn hàng để cập nhật số lượng.");
                }

                // Cập nhật số lượng sản phẩm đã bán và tồn kho
                for (OrderItem item : order.getOrderItems()) {
                    System.out.println("Cập nhật sản phẩm: " + item.getProductId() + " - Số lượng: " + item.getQuantity());
                    productRepository.restoreProductStock(item.getProductId(), item.getQuantity());
                }
                orderRepository.save(order);
            } else {
                throw new RuntimeException("Hủy đơn hàng được thực hiện khi ở trạng thái chờ xác nhận!");
            }
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    ////////////////////////////////////// cập nhật trạng thái đơn hàng
    public void updateOrderStatus(int orderId, String newStatus) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setOrderStatus(newStatus);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    ////////////////////////////////////////////////////////////
    /// 
    /// 
  public List<Order> getOrdersByDate(LocalDate orderDate) {
        return orderRepository.findOrdersByOrderDate(orderDate); // Truy vấn từ repository
    }

    // Phương thức lấy đơn hàng theo trạng thái và ngày (hoặc thiếu một trong hai)
    public List<Order> getOrders(String status, String orderDate) {
        return orderRepository.findOrdersByStatusAndDate(status, orderDate);
    }

}
