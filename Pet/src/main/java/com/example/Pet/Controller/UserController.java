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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.DTO.UserWarningDTO;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.OrderRepository;
import com.example.Pet.Repository.UserRepository;
import com.example.Pet.Service.AppointmentService;
import com.example.Pet.Service.CartService;
import com.example.Pet.Service.FileStorageService;
import com.example.Pet.Service.OrderService;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // @GetMapping("/list")
    // public ResponseEntity<List<User>> getUsersWithRisk() {
    //     List<User> users = userRepository.findAll();  // Lấy danh sách tất cả người dùng
    //     for (User user : users) {
    //         long userId = (long) user.getId();
    //         long cancelledOrders = orderRepository.countByUserIdAndOrderStatus(userId, "Đã Hủy");
    //         // Kiểm tra số lần hủy và gán trạng thái nguy cơ cho người dùng
    //         if (cancelledOrders > 3) {
    //             user.setriskStatus("Nguy cơ vô hiệu hóa");
    //         } else {
    //             user.setriskStatus("An toàn");
    //         }
    //     }
    //     return ResponseEntity.ok(users);
    // }
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
            String username = loginRequest.get("username");
            String passwords = loginRequest.get("passwords");

            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên người dùng không được để trống");
            }
            if (passwords == null || passwords.isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            User user = userService.loginUser(username, passwords);

            if (user != null) {
                // Kiểm tra trạng thái ngay sau khi login
                if (!user.getStatus()) {
                    session.invalidate(); // Hủy session nếu có
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản đã bị vô hiệu hóa.");
                }

                // Cảnh báo nếu hủy nhiều
                long orderCancels = orderRepository.countByUserIdAndOrderStatus(user.getId().intValue(), "Đã Hủy");
                long appointmentCancels = appointmentRepository.countByUserIdAndStatus(user.getId(), "Đã hủy lịch");

                boolean isWarning = (orderCancels >= 2 || appointmentCancels >= 2);
                String warningMessage = null;
                if (isWarning) {
                    warningMessage = "Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều đơn hàng hoặc lịch hẹn!";
                }

                //  Đặt session sau khi đã qua kiểm tra khóa
                session.setAttribute("user", user);

                // Trả về thông tin user
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("cartId", cartService.findCartByUserId(user.getId()) != null
                        ? cartService.findCartByUserId(user.getId()).getId() : null);
                if (warningMessage != null) {
                    response.put("warning", warningMessage);
                }

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

    // @GetMapping("/info/{userId}")
    // public ResponseEntity<User> getUserInfoById(@PathVariable Long userId) {
    //     // Lấy thông tin người dùng từ userService theo userId
    //     User user = userService.getUserById(userId);  // Giả sử bạn có phương thức getUserById trong userService
    //     if (user != null) {
    //         return new ResponseEntity<>(user, HttpStatus.OK);  // Trả về thông tin người dùng nếu tìm thấy
    //     } else {
    //         return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Nếu không tìm thấy người dùng
    //     }
    // }
    @GetMapping("/info/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }

        return ResponseEntity.ok(user); //  Luôn trả về user, dù bị khóa
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

    ///// vô hiệu hóa tài khoản

     // Endpoint 1: Hủy đơn hàng và kiểm tra trạng thái tài khoản
     @PostMapping("/cancel-order/{orderId}")
    public ResponseEntity<String> cancelOrderAndCheckUser(@PathVariable Integer orderId) {
        try {
            orderService.cancelUserAccount(orderId);
            return ResponseEntity.ok("Order cancelled and user status checked.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Endpoint 2: Kiểm tra tất cả người dùng đã hủy lịch hẹn quá 3 lần
    @PostMapping("/check-appointment-cancellations")
    public ResponseEntity<String> disableUsersFromAppointments() {
        appointmentService.disableUsersWithTooManyCancellations();
        return ResponseEntity.ok("Checked all users and disabled those with too many cancellations.");
    }

    // @GetMapping
    // public List<User> getAllUsers2() {
    //     return userService.getAllUsersOnlyRiskStatus();
    // }
    @GetMapping
    public ResponseEntity<List<UserWarningDTO>> getAllUsersOnlyRiskStatus() {
        try {
            // Gọi service để lấy danh sách người dùng có cảnh báo hoặc nguy cơ cao
            List<UserWarningDTO> warningUsers = userService.getAllUsersOnlyRiskStatus();

            // Trả về danh sách người dùng với trạng thái nguy cơ
            return ResponseEntity.ok(warningUsers);
        } catch (Exception ex) {
            // Ghi log lỗi chi tiết
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/warnings")
    public ResponseEntity<List<UserWarningDTO>> getUsersWithWarningsOnly() {
        List<UserWarningDTO> warnedUsers = userService.getAllUsersWithWarningOnly();
        return ResponseEntity.ok(warnedUsers);
    }

    @PatchMapping("/unlock/{userId}")
    public ResponseEntity<String> unlockUser(@PathVariable Long userId) {
        try {
            userService.unlockUserAccount(userId); // Gọi service mở khóa tài khoản
            return ResponseEntity.ok("Tài khoản đã được mở khóa.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
