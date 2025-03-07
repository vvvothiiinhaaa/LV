package com.example.Pet.Controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
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
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.User;
import com.example.Pet.Service.CartService;
import com.example.Pet.Service.FileStorageService;
import com.example.Pet.Service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private CartService cartService;
    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User registrationRequest) {
        try {
            // Kiểm tra mật khẩu và xác nhận mật khẩu
            if (registrationRequest.getPasswords() == null || registrationRequest.getPasswords().isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }
            if (registrationRequest.getConfirmPassword() == null || registrationRequest.getConfirmPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Xác nhận mật khẩu không được để trống");
            }
            // Đăng ký người dùng và tạo giỏ hàng cho người dùng đó
            User newUser = userService.registerUser(
                    registrationRequest.getUsername(),
                    registrationRequest.getPasswords()
            );
            // userRepository.save(newUser);
            return ResponseEntity.ok().body("Đăng ký thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        try {
            // Lấy thông tin đăng nhập
            String username = loginRequest.get("username");
            String passwords = loginRequest.get("passwords");

            // Kiểm tra nếu các trường không rỗng
            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên người dùng không được để trống");
            }
            if (passwords == null || passwords.isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            // Đăng nhập và lấy đối tượng người dùng
            User user = userService.loginUser(username, passwords);

            // Kiểm tra nếu người dùng tồn tại
            if (user != null) {
                // Kiểm tra trạng thái của tài khoản
                if (!user.getStatus()) {  // Giả sử `getStatus()` trả về `true` nếu tài khoản đang hoạt động
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản của bạn đã bị vô hiệu hóa");
                }

                // Lưu thông tin người dùng vào session
                session.setAttribute("user", user); // Lưu đối tượng user vào session

                // Trả về thông tin người dùng
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("cartId", cartService.findCartByUserId(user.getId()) != null
                        ? cartService.findCartByUserId(user.getId()).getId() : null);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên người dùng hoặc mật khẩu");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/info")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<User> getUserInfoById(@PathVariable Long userId) {
        // Lấy thông tin người dùng từ userService theo userId
        User user = userService.getUserById(userId);  // Giả sử bạn có phương thức getUserById trong userService

        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);  // Trả về thông tin người dùng nếu tìm thấy
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Nếu không tìm thấy người dùng
        }
    }

    @PostMapping("/logout")
    public void logout(HttpSession session, HttpServletResponse response) throws IOException {
        session.invalidate();  // Xóa session khi đăng xuất
        response.sendRedirect("/fontend/trangchu.html");  // Chuyển hướng về trang chủ
    }

    @GetMapping("/check-login")
    public ResponseEntity<Map<String, Object>> checkLoginStatus(HttpSession session) {
        User user = (User) session.getAttribute("user");
        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("isLoggedIn", true);
            response.put("userId", user.getId()); // Trả về userId
            response.put("username", user.getUsername()); // Trả về username (có thể gửi trực tiếp nếu cần)
            return ResponseEntity.ok(response);
        } else {
            response.put("isLoggedIn", false);
            return ResponseEntity.ok(response);
        }
    }

    // Cập nhật thông tin người dùng (không cập nhật mật khẩu)
    // @PutMapping("/{id}")
    // public ResponseEntity<User> updateUser(@PathVariable("id") Long userId, @RequestBody User userDetails) {
    //     // Cập nhật người dùng qua service
    //     User updatedUser = userService.updateUser(userId, userDetails);
    //     if (updatedUser != null) {
    //         return ResponseEntity.ok(updatedUser); // Trả về người dùng đã được cập nhật
    //     } else {
    //         return ResponseEntity.notFound().build(); // Trả về lỗi 404 nếu không tìm thấy người dùng
    //     }
    // }
    // API cập nhật thông tin người dùng (kể cả ảnh)
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestParam(value = "file", required = false) MultipartFile file, // Đón nhận file ảnh (không bắt buộc)
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phonenumber", required = false) String phoneNumber,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "birthday", required = false) LocalDate birthday,
            @RequestParam(value = "status", required = false) Boolean status,
            @RequestParam(value = "role", required = false) String role
    ) {
        try {
            // Gọi service để cập nhật thông tin người dùng
            User userDetails = new User();
            userDetails.setEmail(email);
            userDetails.setPhonenumber(phoneNumber);
            userDetails.setGender(gender);
            userDetails.setBirthday(birthday);
            userDetails.setStatus(status);
            userDetails.setRole(role);

            // Cập nhật thông tin người dùng và lưu URL ảnh (nếu có)
            User updatedUser = userService.updateUser(userId, userDetails, file);

            // Trả về kết quả
            return ResponseEntity.ok(updatedUser); // Trả về người dùng đã cập nhật

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // API để lấy URL ảnh của người dùng
    @GetMapping("/{userId}/image")
    public ResponseEntity<String> getUserImageUrl(@PathVariable Long userId) {
        String imageUrl = userService.getUserImageUrl(userId);

        if (imageUrl == null) {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy ảnh
        }

        return ResponseEntity.ok(imageUrl); // Trả về URL ảnh nếu tìm thấy
    }

}
