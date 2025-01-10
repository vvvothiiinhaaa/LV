package com.example.Pet.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.User;
import com.example.Pet.Service.CartService;
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

    // @PostMapping("/login")
    // public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
    //     try {
    //         // Lấy thông tin từ yêu cầu đăng nhập
    //         String username = loginRequest.get("username");
    //         String passwords = loginRequest.get("passwords");
    //         // Kiểm tra yêu cầu đăng nhập hợp lệ
    //         if (username == null || username.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Tên người dùng không được để trống");
    //         }
    //         if (passwords == null || passwords.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
    //         }
    //         // Đăng nhập người dùng và lấy đối tượng User
    //         User user = userService.loginUser(username, passwords);
    //         // Kiểm tra nếu người dùng đăng nhập thành công
    //         if (user != null) {
    //             // Nếu đăng nhập thành công, trả về thông báo thành công
    //             return ResponseEntity.ok().body("Đăng nhập thành công");
    //         } else {
    //             // Nếu không tìm thấy người dùng, trả về lỗi
    //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên người dùng hoặc mật khẩu");
    //         }
    //     } catch (RuntimeException e) {
    //         // Nếu có lỗi trong quá trình đăng nhập, trả về lỗi 400
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
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

            // Kiểm tra nếu người dùng đăng nhập thành công
            if (user != null) {
                // Lưu thông tin người dùng vào session
                session.setAttribute("user", user); // Lưu đối tượng user vào session

                // Trả về thông tin người dùng
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("cartId", cartService.findCartByUserId(user.getId()) != null ? cartService.findCartByUserId(user.getId()).getId() : null);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên người dùng hoặc mật khẩu");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // @CrossOrigin(origins = "http://localhost:8080")
    // @PostMapping("/login")
    // public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
    //     try {
    //         // Lấy thông tin từ yêu cầu đăng nhập
    //         String username = loginRequest.get("username");
    //         String passwords = loginRequest.get("passwords");
    //         // Kiểm tra yêu cầu đăng nhập hợp lệ
    //         if (username == null || username.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Tên người dùng không được để trống");
    //         }
    //         if (passwords == null || passwords.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
    //         }
    //         // Đăng nhập người dùng và lấy đối tượng User
    //         User user = userService.loginUser(username, passwords);
    //         // Log giá trị của role để kiểm tra
    //         System.out.println("User role in Controller: " + user.getRole());
    //         if (user.getRole() != null && user.getRole().trim().equals("user")) {
    //             // Nếu vai trò là user, trả về thông báo thành công và chuyển hướng đến trang chủ
    //             return ResponseEntity.status(HttpStatus.FOUND) // 302 Found
    //                     .location(URI.create("http://localhost:8080/fontend/trangchu.html")) // Đảm bảo đường dẫn đúng
    //                     .build();
    //         } else {
    //             return ResponseEntity.status(HttpStatus.FORBIDDEN)
    //                     .body("Vai trò không hợp lệ");
    //         }
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    // @PostMapping("/register")
    // public ResponseEntity<?> registerUser(@RequestBody User registrationRequest) {
    //     System.out.println("Dữ liệu nhận được từ frontend: " + registrationRequest);
    //     // Tiến hành xử lý đăng ký người dùng
    //     // Đảm bảo rằng bạn có các getter/setter cho các trường trong User
    //     return ResponseEntity.ok("Đăng ký thành công");
    // }
    // @PostMapping("/register")
    // public ResponseEntity<User> registerUser(@RequestBody User registrationRequest) {
    //     try {
    //         // Gọi service để đăng ký người dùng
    //         User registeredUser = userService.registerUser(registrationRequest.getUsername(), registrationRequest.getPasswords());
    //         // Trả về HTTP status 201 (Created) cùng với thông tin người dùng
    //         return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    //     } catch (RuntimeException e) {
    //         // Trả về lỗi nếu username đã tồn tại
    //         return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    //     }
    // }
    // @GetMapping("/is-logged-in")
    // public ResponseEntity<Boolean> isLoggedIn(HttpSession session) {
    //     // Lấy userId từ session
    //     Object userIdObj = session.getAttribute("userId");
    //     // Kiểm tra xem userId có tồn tại và không phải là null
    //     boolean isLoggedIn = userIdObj != null;
    //     // In ra trạng thái đăng nhập và Session ID
    //     System.out.println("User logged-in status: " + isLoggedIn);
    //     System.out.println("Session ID: " + session.getId());
    //     // Trả về ResponseEntity với trạng thái của người dùng
    //     return ResponseEntity.ok(isLoggedIn);
    // }
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
}
