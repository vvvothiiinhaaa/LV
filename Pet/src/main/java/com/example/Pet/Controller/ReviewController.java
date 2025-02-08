// package com.example.Pet.Controller;
// import java.util.List;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.example.Pet.DTO.reviewDTO;
// import com.example.Pet.Modal.review;
// import com.example.Pet.Service.ReviewService;
// @RestController
// @RequestMapping("/reviews")
// public class ReviewController {
//     private final ReviewService reviewService;
//     public ReviewController(ReviewService reviewService) {
//         this.reviewService = reviewService;
//     }
//     // API thêm đánh giá sản phẩm
//     @PostMapping("/add")
//     public ResponseEntity<review> addReview(@RequestBody reviewDTO reviewwDTO) {
//         review createdReview = reviewService.addReview(reviewwDTO);
//         return ResponseEntity.ok(createdReview);
//     }
//     // API lấy danh sách đánh giá theo sản phẩm
//     @GetMapping("/product/{productId}")
//     public ResponseEntity<List<review>> getReviewsByProduct(@PathVariable Long productId) {
//         List<review> reviews = reviewService.getReviewsByProduct(productId);
//         return ResponseEntity.ok(reviews);
//     }
//     // API lấy tất cả đánh giá của một sản phẩm
//     @GetMapping("/product/{productId}/all")
//     public ResponseEntity<List<review>> getAllReviewsByProductId(@PathVariable Long productId) {
//         List<review> reviews = reviewService.getAllReviewsByProductId(productId);
//         return ResponseEntity.ok(reviews);
//     }
// }
package com.example.Pet.Controller;

import com.example.Pet.DTO.reviewDTO;
import com.example.Pet.Modal.review;
import com.example.Pet.Service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // API thêm đánh giá cho từng sản phẩm trong đơn hàng
    @PostMapping("/add")
    public ResponseEntity<review> addReview(@RequestBody reviewDTO reviewDTO) {
        return ResponseEntity.ok(reviewService.addReview(reviewDTO));
    }

    // API lấy tất cả đánh giá của một sản phẩm trong đơn hàng
    @GetMapping("/order-item/{orderItemId}")
    public ResponseEntity<List<review>> getReviewsByOrderItem(@PathVariable Integer orderItemId) {
        return ResponseEntity.ok(reviewService.getReviewsByOrderItem(orderItemId));
    }

    // API lấy tất cả đánh giá của một sản phẩm cụ thể từ tất cả các đơn hàng
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    // API lấy tất cả đánh giá từ tất cả các đơn hàng (Admin hoặc User muốn xem tất cả đánh giá)
    @GetMapping("/all")
    public ResponseEntity<List<review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // API lấy đánh giá trung bình của một sản phẩm
    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRatingByProduct(productId));
    }
}
