// package com.example.Pet.Service;
// import java.time.LocalDate;
// import java.util.List;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import com.example.Pet.DTO.reviewDTO;
// import com.example.Pet.Modal.review;
// import com.example.Pet.Repository.OrderRepository;
// import com.example.Pet.Repository.ProductRepository;
// import com.example.Pet.Repository.ReviewRepository;
// import com.example.Pet.Repository.UserRepository;
// @Service
// public class ReviewService {
//     @Autowired
//     private ReviewRepository reviewRepository;
//     @Autowired
//     private OrderRepository orderRepository;
//     @Autowired
//     private UserRepository userRepository;
//     @Autowired
//     private ProductRepository productRepository;
//     public ReviewService(ReviewRepository reviewRepository, OrderRepository orderRepository,
//             UserRepository userRepository, ProductRepository productRepository) {
//         this.reviewRepository = reviewRepository;
//         this.orderRepository = orderRepository;
//         this.userRepository = userRepository;
//         this.productRepository = productRepository;
//     }
//     public review addReview(reviewDTO reviewwwDTO) {
//         review revieww = new review();
//         revieww.setOrder(orderRepository.findById(reviewwwDTO.getOrderId())
//                 .orElseThrow(() -> new RuntimeException("Order not found")));
//         revieww.setUser(userRepository.findById(reviewwwDTO.getUserId())
//                 .orElseThrow(() -> new RuntimeException("User not found")));
//         revieww.setProduct(productRepository.findById(reviewwwDTO.getProductId())
//                 .orElseThrow(() -> new RuntimeException("Product not found")));
//         revieww.setContent(reviewwwDTO.getContent());
//         revieww.setRating(reviewwwDTO.getRating());
//         revieww.setReviewDate(LocalDate.now());
//         return reviewRepository.save(revieww);
//     }
//     public List<review> getReviewsByProduct(Long productId) {
//         return reviewRepository.findByProductId(productId);
//     }
//     // Lấy tất cả đánh giá của một sản phẩm nhất định
//     public List<review> getAllReviewsByProductId(Long productId) {
//         return reviewRepository.findByProductId(productId);
//     }
// }
package com.example.Pet.Service;

import com.example.Pet.DTO.reviewDTO;

import com.example.Pet.Repository.OrderItemRepository;
import com.example.Pet.Repository.ReviewRepository;
import com.example.Pet.Repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Modal.User;
import com.example.Pet.Modal.review;
import com.example.Pet.Repository.OrderRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository, OrderItemRepository orderItemRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // Thêm đánh giá cho sản phẩm trong đơn hàng
    public review addReview(reviewDTO reviewDTO) {
        OrderItem orderItem = orderItemRepository.findById(reviewDTO.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderItem.getOrder().getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        review revieww = new review();
        revieww.setOrderItem(orderItem);
        revieww.setOrder(order);
        revieww.setUser(user);
        revieww.setContent(reviewDTO.getContent());
        revieww.setRating(reviewDTO.getRating());

        // Nếu `reviewDate` không được gửi từ DTO, mặc định là ngày hiện tại
        if (reviewDTO.getReviewDate() == null) {
            revieww.setReviewDate(LocalDate.now());
        } else {
            revieww.setReviewDate(reviewDTO.getReviewDate());
        }

        return reviewRepository.save(revieww);
    }

    // Lấy tất cả đánh giá của một sản phẩm trong đơn hàng
    public List<review> getReviewsByOrderItem(Integer orderItemId) {
        return reviewRepository.findByOrderItemId(orderItemId);
    }
    // Lấy tất cả đánh giá của một sản phẩm từ tất cả các đơn hàng

    public List<review> getReviewsByProduct(Long productId) {
        return reviewRepository.findByOrderItem_ProductId(productId);
    }

    // Lấy tất cả đánh giá từ tất cả các đơn hàng (Admin hoặc User muốn xem toàn bộ đánh giá)
    public List<review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Lấy đánh giá trung bình của một sản phẩm
    public double getAverageRatingByProduct(Long productId) {
        Optional<Double> averageRating = reviewRepository.findAverageRatingByProductId(productId);
        return averageRating.orElse(0.0); // Nếu không có đánh giá, trả về 0.0
    }
}
