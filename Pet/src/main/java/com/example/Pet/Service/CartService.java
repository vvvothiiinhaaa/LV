package com.example.Pet.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.Cartitem;
import com.example.Pet.Modal.Product;
import com.example.Pet.Repository.CartItemRepository;
import com.example.Pet.Repository.CartRepository;
import com.example.Pet.Repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // Tìm ID giỏ hàng theo userId
    public Long findCartIdByUserId(Long userId) {
        // Giả sử mỗi người dùng chỉ có một giỏ hàng, và Cart có liên kết với User
        return cartRepository.findCartIdByUserId(userId);  // Truy vấn ID giỏ hàng từ repository
    }
    // Tìm giỏ hàng theo userId

    public Cart findCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // Thêm sản phẩm vào giỏ hàng
    public String addProductToCart(Long userId, Long productId, int quantity) {
        // Kiểm tra nếu giỏ hàng đã tồn tại
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);

        // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra số lượng sản phẩm có trong kho
        int availableQuantity = product.getQuantity(); // Lấy số lượng có sẵn trong kho của sản phẩm

        if (quantity > availableQuantity) {
            return "Số lượng sản phẩm vượt quá số lượng có trong kho. Số lượng còn lại: " + availableQuantity;
        }

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng, nếu có thì cập nhật số lượng, nếu không thì thêm mới sản phẩm vào giỏ hàng
        Cartitem cartItem = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);

        if (cartItem == null) {
            // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới CartItem
            cartItem = new Cartitem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setSelected(false);
        } else {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            int newQuantity = cartItem.getQuantity() + quantity;
            if (newQuantity > availableQuantity) {
                return "Số lượng sản phẩm trong giỏ hàng cộng với số lượng muốn thêm vượt quá số lượng có trong kho. Số lượng còn lại: " + availableQuantity;
            }
            cartItem.setQuantity(newQuantity);
        }

        // Lưu hoặc cập nhật CartItem
        cartItemRepository.save(cartItem);

        return "Thêm sản phẩm vào giỏ hàng thành công";
    }

// Xem giỏ hàng của người dùng
    public List<Cartitem> viewCart(Long userId) {
        // Kiểm tra nếu giỏ hàng của người dùng tồn tại
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);

        if (cart == null) {
            throw new RuntimeException("Cart not found for user");
        }

        // Trả về danh sách sản phẩm trong giỏ hàng
        return cartItemRepository.findByCart(cart);
    }
// Cập nhật giỏ hàng

    // public String updateCart(Long userId, Long productId, int quantity) {
    //     // Kiểm tra nếu giỏ hàng của người dùng tồn tại
    //     Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
    //     if (cart == null) {
    //         return "Cart not found for user";  // Giỏ hàng không tồn tại
    //     }
    //     // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu
    //     Product product = productRepository.findById(productId).orElse(null);
    //     if (product == null) {
    //         return "Product not found";  // Sản phẩm không tồn tại
    //     }
    //     // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    //     Cartitem cartItem = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);
    //     if (cartItem == null) {
    //         return "Product not found in cart";  // Sản phẩm không có trong giỏ hàng
    //     }
    //     // Kiểm tra số lượng hợp lệ
    //     if (quantity <= 0) {
    //         return "Quantity must be greater than 0";  // Kiểm tra số lượng
    //     }
    //     // Cập nhật số lượng sản phẩm trong giỏ hàng
    //     cartItem.setQuantity(quantity);
    //     // Lưu lại CartItem đã được cập nhật
    //     cartItemRepository.save(cartItem);
    //     return "cập nhật số lượng thành công";
    // }
    public String updateCart(Long userId, Long productId, int quantity) {
        // Kiểm tra nếu giỏ hàng của người dùng tồn tại
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
        if (cart == null) {
            return "Cart not found for user";  // Giỏ hàng không tồn tại
        }
        // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Product not found";  // Sản phẩm không tồn tại
        }
        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        Cartitem cartItem = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);
        if (cartItem == null) {
            return "Product not found in cart";  // Sản phẩm không có trong giỏ hàng
        }
        // Kiểm tra số lượng hợp lệ
        if (quantity <= 0) {
            return "Quantity must be greater than 0";  // Kiểm tra số lượng
        }

        // Lấy số lượng có sẵn trong kho của sản phẩm
        int availableQuantity = product.getQuantity();
        if (quantity > availableQuantity) {
            // Nếu số lượng yêu cầu vượt quá số lượng có sẵn, thông báo và không cập nhật
            return "Cannot update quantity to " + quantity + " as it exceeds available stock. Available quantity: " + availableQuantity;
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng nếu không vượt quá
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return "Quantity updated successfully";
    }

    // Phương thức để xóa sản phẩm khỏi giỏ hàng
    public String deleteProductFromCart(Long userId, Long productId) {
        // Kiểm tra nếu giỏ hàng của người dùng tồn tại
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
        if (cart == null) {
            return "Cart not found for user";  // Giỏ hàng không tồn tại
        }

        // Kiểm tra sản phẩm có tồn tại trong giỏ hàng không
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Product not found";  // Sản phẩm không tồn tại
        }

        // Tìm CartItem tương ứng trong giỏ hàng
        Cartitem cartItem = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);
        if (cartItem == null) {
            return "Product not found in cart";  // Sản phẩm không có trong giỏ hàng
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cartItemRepository.delete(cartItem);
        return "sản phẩm đã được xóa khỏi giỏ hàng";
    }

    @Transactional
    public String deleteAllProductsFromCart(Long userId) {
        // Kiểm tra nếu giỏ hàng của người dùng tồn tại
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
        if (cart == null) {
            return "Cart not found for user";  // Giỏ hàng không tồn tại
        }

        // Xóa tất cả các sản phẩm trong giỏ hàng
        try {
            cartItemRepository.deleteByCart(cart);  // Xóa tất cả sản phẩm trong giỏ hàng
            return "All products removed from cart";
        } catch (Exception e) {
            // Ghi log lỗi chi tiết nếu có
            e.printStackTrace();
            return "Error occurred while deleting products from cart: " + e.getMessage();
        }
    }

    public int getCartProductCount(Long userId) {
        // Lấy giỏ hàng của người dùng
        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for user");
        }

        // Tính tổng số sản phẩm duy nhất trong giỏ hàng
        List<Cartitem> cartItems = cartItemRepository.findByCart(cart);
        Set<Long> uniqueProductIds = new HashSet<>(); // Set dùng để đếm mỗi sản phẩm một lần

        // Duyệt qua các sản phẩm trong giỏ hàng và thêm vào Set
        for (Cartitem item : cartItems) {
            uniqueProductIds.add(item.getProduct().getId()); // Thêm ID sản phẩm vào Set
        }

        // Trả về số lượng sản phẩm duy nhất
        return uniqueProductIds.size(); // Số lượng sản phẩm duy nhất trong giỏ hàng
    }

}
