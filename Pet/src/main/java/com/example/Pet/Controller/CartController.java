package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Cartitem;  // Đảm bảo CartItem có chữ cái đầu tiên viết hoa
import com.example.Pet.Service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy giỏ hàng theo userId
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartIdByUserId(@PathVariable Long userId) {
        Long cartId = cartService.findCartIdByUserId(userId);  // Lấy ID giỏ hàng từ userId

        if (cartId != null) {
            return ResponseEntity.ok(cartId);  // Trả về ID giỏ hàng
        } else {
            return ResponseEntity.status(404).body("Cart not found for this user");  // Không tìm thấy giỏ hàng
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(@RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        String response = cartService.addProductToCart(userId, productId, quantity);
        return ResponseEntity.ok(response);  // Trả về kết quả thành công
    }

    // Xem giỏ hàng của người dùng
    @GetMapping("/view")
    public ResponseEntity<List<Cartitem>> viewCart(@RequestParam Long userId) {
        List<Cartitem> cartItems = cartService.viewCart(userId);
        return ResponseEntity.ok(cartItems);  // Trả về danh sách sản phẩm trong giỏ hàng
    }

    @PutMapping("/update")
    public String updateCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        // Gọi phương thức trong service để cập nhật giỏ hàng
        String response = cartService.updateCart(userId, productId, quantity);
        return response;
    }

    // API để xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/delete")
    public String deleteProductFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        // Gọi phương thức trong service để xóa sản phẩm khỏi giỏ hàng
        String response = cartService.deleteProductFromCart(userId, productId);
        return response;  // Trả về phản hồi từ service
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllProductsFromCart(@RequestParam Long userId) {
        // Gọi phương thức xóa tất cả sản phẩm trong giỏ hàng từ service
        String response = cartService.deleteAllProductsFromCart(userId);
        if (response.equals("All products removed from cart")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Integer> getCartProductCount(@PathVariable Long userId) {
        try {
            int productCount = cartService.getCartProductCount(userId);
            return ResponseEntity.ok(productCount);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }

}
