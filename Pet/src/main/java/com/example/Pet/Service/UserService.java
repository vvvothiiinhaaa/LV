package com.example.Pet.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.DTO.UserWarningDTO;
import com.example.Pet.Modal.Appointment;
import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.CartRepository;
import com.example.Pet.Repository.EmployeeRepository;
import com.example.Pet.Repository.OrderRepository;
import com.example.Pet.Repository.UserRepository;
import com.example.Pet.Repository.UserWarningLogRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CartRepository cartRepository;  // Thêm CartRepository

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserWarningLogRepository userWarningLogRepository;

    public User registerUser(String username, String password) {
        // Kiểm tra nếu người dùng đã tồn tại
        if (userRepository.findByUsername(username) != null) {
            throw new RuntimeException("Username already exists");
        }
        if (employeeRepository.findByUsername(username) != null) {
            throw new RuntimeException("Username đã được sử dụng bởi một nhân viên!");
        }

        // Tạo và lưu người dùng mới với mật khẩu chưa mã hóa
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPasswords(password); // Mật khẩu chưa mã hóa
        newUser.setRole("user");
        newUser.setIsUnlocked(false);
        newUser.setStatus(true);

        // Lưu người dùng vào cơ sở dữ liệu
        User savedUser = userRepository.save(newUser);

        // Tạo giỏ hàng mới cho người dùng
        Cart cart = new Cart();
        cart.setUser(savedUser);  // Gán người dùng cho giỏ hàng
        cartRepository.save(cart); // Lưu giỏ hàng vào cơ sở dữ liệu

        return savedUser; // Trả về người dùng đã lưu
    }

    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Username not found");
        }

        if (!user.getPasswords().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        // In giá trị role để kiểm tra xem nó có được trả về đúng không
        if (user.getRole() == null) {
            throw new RuntimeException("Role is null for user: " + username);
        }
        System.out.println("User role: " + user.getRole());  // Kiểm tra giá trị của role

        return user;
    }

    // lấy toàn bộ User
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);  // Tìm người dùng theo ID, trả về null nếu không tìm thấy
    }

    // Cập nhật thông tin người dùng (không cập nhật mật khẩu)
    // @Transactional
    // public User updateUser(Long userId, User userDetails) {
    //     // Tìm người dùng trong cơ sở dữ liệu
    //     User existingUser = userRepository.findById(userId).orElse(null);
    //     if (existingUser == null) {
    //         return null; // Người dùng không tồn tại
    //     }
    //     // Cập nhật các thông tin của người dùng ngoại trừ mật khẩu
    //     if (userDetails.getUsername() != null) {
    //         existingUser.setUsername(userDetails.getUsername());
    //     }
    //     if (userDetails.getEmail() != null) {
    //         existingUser.setEmail(userDetails.getEmail());
    //     }
    //     if (userDetails.getBirthday() != null) {
    //         existingUser.setBirthday(userDetails.getBirthday());
    //     }
    //     if (userDetails.getUrl() != null) {
    //         existingUser.setUrl(userDetails.getUrl());
    //     }
    //     if (userDetails.getPhonenumber() != null) {
    //         existingUser.setPhonenumber(userDetails.getPhonenumber());
    //     }
    //     if (userDetails.getName() != null) {
    //         existingUser.setName(userDetails.getName());
    //     }
    //     if (userDetails.getStatus() != null) {
    //         existingUser.setStatus(userDetails.getStatus());
    //     }
    //     if (userDetails.getRole() != null) {
    //         existingUser.setRole(userDetails.getRole());
    //     }
    //     if (userDetails.getGender() != null) {
    //         existingUser.setGender(userDetails.getGender());
    //     }
    //     // Lưu người dùng đã cập nhật vào cơ sở dữ liệu
    //     return userRepository.save(existingUser);
    // }
    @Transactional
    public User updateUser(Long userId, User userDetails, MultipartFile file) {
        // Tìm người dùng trong cơ sở dữ liệu
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser == null) {
            return null; // Người dùng không tồn tại
        }

        // Cập nhật các thông tin của người dùng ngoại trừ mật khẩu
        if (userDetails.getUsername() != null) {
            existingUser.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null) {
            existingUser.setEmail(userDetails.getEmail());
        }
        if (userDetails.getBirthday() != null) {
            existingUser.setBirthday(userDetails.getBirthday());
        }
        if (userDetails.getPhonenumber() != null) {
            existingUser.setPhonenumber(userDetails.getPhonenumber());
        }

        if (userDetails.getStatus() != null) {
            existingUser.setStatus(userDetails.getStatus());
        }
        if (userDetails.getRole() != null) {
            existingUser.setRole(userDetails.getRole());
        }
        if (userDetails.getGender() != null) {
            existingUser.setGender(userDetails.getGender());
        }

        // Nếu có file (ảnh), lưu lại URL của ảnh
        if (file != null && !file.isEmpty()) {
            // Lưu file và lấy URL
            String imageUrl = fileStorageService.saveFile(file); // Giả sử bạn có class `FileStorageService`
            existingUser.setUrl(imageUrl); // Lưu URL của ảnh vào cơ sở dữ liệu
        }

        // Lưu người dùng đã cập nhật vào cơ sở dữ liệu
        return userRepository.save(existingUser);
    }

    // Lấy URL ảnh của người dùng
    public String getUserImageUrl(Long userId) {
        User user = getUserById(userId);
        return (user != null) ? user.getUrl() : null; // Trả về URL ảnh của người dùng nếu tồn tại
    }

    // public List<User> getAllUsersOnlyRiskStatus() {
    //     List<User> users = userRepository.findAll();
    //     List<Appointment> allAppointments = appointmentRepository.findAll();
    //     List<Order> allOrders = orderRepository.findAll();
    //     Map<Long, Long> cancelledOrdersMap = allOrders.stream()
    //             .filter(o -> "Đã Hủy".equalsIgnoreCase(o.getOrderStatus()))
    //             .collect(Collectors.groupingBy(o -> o.getUserId().longValue(), Collectors.counting()));
    //     Map<Long, Long> cancelledAppointmentsMap = allAppointments.stream()
    //             .filter(a -> "Đã hủy lịch".equalsIgnoreCase(a.getStatus()))
    //             .collect(Collectors.groupingBy(Appointment::getUserId, Collectors.counting()));
    //     return users.stream().map(user -> {
    //         long orderCancels = cancelledOrdersMap.getOrDefault(user.getId(), 0L);
    //         long appointmentCancels = cancelledAppointmentsMap.getOrDefault(user.getId(), 0L);
    //         boolean isRiskHigh = (orderCancels >= 5 || appointmentCancels >= 5);
    //         boolean isWarning = (orderCancels >= 1 || appointmentCancels >= 1);
    //         // Gán trạng thái nguy cơ 3 mức
    //         if (isRiskHigh) {
    //             user.setriskStatus("Cao");
    //         } else if (isWarning) {
    //             user.setriskStatus("Cảnh báo");
    //         } else {
    //             user.setriskStatus("Bình Thường");
    //         }
    //         // Gán thông báo cảnh báo nếu cần
    //         if (isWarning && !isRiskHigh) {
    //             user.setWarningMessage("Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều!");
    //         }
    //         // Ghi log nếu chưa từng log với lý do này
    //         String reason = "Hủy ≥ 3 đơn hàng hoặc lịch hẹn";
    //         if (!userWarningLogRepository.existsByUserIdAndReason(user.getId(), reason)) {
    //             userWarningLogRepository.save(new UserWarningLog(user.getId(), reason));
    //         }
    //         // Nếu nguy cơ cao thì vô hiệu hóa tài khoản (nếu chưa bị khóa)
    //         if (isRiskHigh && Boolean.TRUE.equals(user.getStatus())) {
    //             user.setStatus(false);
    //             userRepository.save(user); // cập nhật DB
    //         }
    //         return user;
    //     }).collect(Collectors.toList());
    // }
    //////////////////////////////////////////////////////////////////////////
//     public List<User> getAllUsersOnlyRiskStatus() {
//         List<User> users = userRepository.findAll();
//         List<Appointment> allAppointments = appointmentRepository.findAll();
//         List<Order> allOrders = orderRepository.findAll();

//         Map<Long, Long> cancelledOrdersMap = allOrders.stream()
//                 .filter(o -> "Đã Hủy".equalsIgnoreCase(o.getOrderStatus()))
//                 .collect(Collectors.groupingBy(o -> o.getUserId().longValue(), Collectors.counting()));

//         Map<Long, Long> cancelledAppointmentsMap = allAppointments.stream()
//                 .filter(a -> "Đã hủy lịch".equalsIgnoreCase(a.getStatus()))
//                 .collect(Collectors.groupingBy(Appointment::getUserId, Collectors.counting()));

//         return users.stream().map(user -> {
//             long orderCancels = cancelledOrdersMap.getOrDefault(user.getId(), 0L);
//             long appointmentCancels = cancelledAppointmentsMap.getOrDefault(user.getId(), 0L);

//             boolean isRiskHigh = (orderCancels >= 5 || appointmentCancels >= 5);
//             boolean isWarning = (orderCancels >= 1 || appointmentCancels >= 1);

//             // Ghi log cảnh báo nếu cần
//             String warningReason = "Hủy ≥ 3 đơn hàng hoặc lịch hẹn";
//             if (isWarning && !userWarningLogRepository.existsByUserIdAndReason(user.getId(), warningReason)) {
//                 userWarningLogRepository.save(new UserWarningLog(user.getId(), warningReason));
//             }

//             // Gán cảnh báo người dùng
//             if (isWarning && !isRiskHigh) {
//                 user.setWarningMessage("Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều!");
//             } else {
//                 user.setWarningMessage(null);
//             }

//             // Đánh giá nguy cơ & trạng thái
//             if (isRiskHigh) {
//                 user.setriskStatus("Cao");
//                 if (Boolean.TRUE.equals(user.getStatus()) && !Boolean.TRUE.equals(user.isManuallyUnlocked())) {
//                     user.setStatus(false); // Khóa tự động
//                     userWarningLogRepository.save(new UserWarningLog(user.getId(), "Khóa tự động do nguy cơ cao"));
//                 }
//             } else if (!isRiskHigh && Boolean.FALSE.equals(user.getStatus())) {
//                 user.setStatus(true); // Mở tự động
//                 user.setManuallyUnlocked(false); // Reset cờ mở thủ công
//                 userWarningLogRepository.save(new UserWarningLog(user.getId(), "Mở khóa tự động do nguy cơ giảm"));
//             }

//             // Gán trạng thái nguy cơ 3 mức
//             if (isRiskHigh) {
//                 user.setriskStatus("Cao");
//             } else if (isWarning) {
//                 user.setriskStatus("Cảnh báo");
//             } else {
//                 user.setriskStatus("Bình Thường");
//             }

//             return userRepository.save(user);
//         }).collect(Collectors.toList());
//     }

//     //// lọc các tài khoản bị cảnh cáo
//   public List<UserWarningDTO> getAllUsersWithWarningOnly() {
//         List<User> users = userRepository.findAll();
//         List<Appointment> allAppointments = appointmentRepository.findAll();
//         List<Order> allOrders = orderRepository.findAll();

//         Map<Long, Long> cancelledOrdersMap = allOrders.stream()
//                 .filter(o -> "Đã Hủy".equalsIgnoreCase(o.getOrderStatus()))
//                 .collect(Collectors.groupingBy(o -> o.getUserId().longValue(), Collectors.counting()));

//         Map<Long, Long> cancelledAppointmentsMap = allAppointments.stream()
//                 .filter(a -> "Đã hủy lịch".equalsIgnoreCase(a.getStatus()))
//                 .collect(Collectors.groupingBy(Appointment::getUserId, Collectors.counting()));

//         return users.stream()
//                 .map(user -> {
//                     long orderCancels = cancelledOrdersMap.getOrDefault(user.getId(), 0L);
//                     long appointmentCancels = cancelledAppointmentsMap.getOrDefault(user.getId(), 0L);

//                     boolean isRiskHigh = (orderCancels >= 5 || appointmentCancels >= 5);
//                     boolean isWarning = (orderCancels >= 1 || appointmentCancels >= 1);

//                     if (isWarning && !isRiskHigh) {
//                         return new UserWarningDTO(
//                                 user.getId(),
//                                 user.getUsername(),
//                                 user.getPasswords(), //  Bạn nên ẩn trường này nếu không cần thiết
//                                 user.getEmail(),
//                                 user.getBirthday(),
//                                 user.getPhonenumber(),
//                                 user.getGender(),
//                                 orderCancels,
//                                 appointmentCancels,
//                                 "Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều!"
//                         );
//                     } else {
//                         return null;
//                     }
//                 })
//                 .filter(Objects::nonNull)
//                 .collect(Collectors.toList());
//     }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
public List<UserWarningDTO> getAllUsersOnlyRiskStatus() {
        // Lấy tất cả người dùng, cuộc hẹn và đơn hàng
        List<User> users = userRepository.findAll();
        List<Appointment> allAppointments = appointmentRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();

        // Kiểm tra dữ liệu có hợp lệ không
        if (users == null || allAppointments == null || allOrders == null) {
            throw new RuntimeException("Dữ liệu người dùng, cuộc hẹn hoặc đơn hàng không hợp lệ.");
        }

        // Đếm số đơn hàng đã hủy của từng người dùng
        Map<Long, Long> cancelledOrdersMap = allOrders.stream()
                .filter(o -> "Đã Hủy".equalsIgnoreCase(o.getOrderStatus()))
                .collect(Collectors.groupingBy(o -> o.getUserId().longValue(), Collectors.counting()));

        // Đếm số cuộc hẹn đã hủy của từng người dùng
        Map<Long, Long> cancelledAppointmentsMap = allAppointments.stream()
                .filter(a -> "Đã hủy lịch".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.groupingBy(Appointment::getUserId, Collectors.counting()));

        // Lọc và xử lý danh sách người dùng
        return users.stream()
                .map(user -> {
                    if (user == null) {
                        return null; // Bỏ qua các người dùng null
                    }

                    // Lấy số lần hủy đơn hàng và cuộc hẹn của người dùng
                    long orderCancels = cancelledOrdersMap.getOrDefault(user.getId(), 0L);
                    long appointmentCancels = cancelledAppointmentsMap.getOrDefault(user.getId(), 0L);

                    // Kiểm tra trạng thái tài khoản (đã mở khóa hoặc chưa)
                    boolean isUnlocked = user.isIsUnlocked() != null && user.isIsUnlocked();  // Trạng thái tài khoản đã mở khóa (cải thiện kiểm tra null)
                    boolean isRiskHigh = false;
                    boolean isWarning = false;

                    // Kiểm tra điều kiện cảnh báo và nguy cơ cao
                    if (orderCancels >= 1 || appointmentCancels >= 1) {
                        isWarning = true;
                    }
                    if (orderCancels >= 5 || appointmentCancels >= 5) {
                        isRiskHigh = true;
                    }

                    // Gán trạng thái nguy cơ cho người dùng
                    String riskStatus = "Bình Thường";
                    if (isRiskHigh) {
                        riskStatus = "Cao";
                    } else if (isWarning) {
                        riskStatus = "Cảnh báo";
                    }

                    // Nếu tài khoản đã mở khóa và đã hủy >= 5 lần, không cần thay đổi số hủy
                    // chỉ cần gán trạng thái nguy cơ theo logic bên trên
                    if (isWarning && !isRiskHigh && !user.isManuallyUnlocked()) {
                        return new UserWarningDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getPasswords(), // Ẩn trường này nếu không cần thiết
                                user.getEmail(),
                                user.getBirthday(),
                                user.getPhonenumber(),
                                user.getGender(),
                                orderCancels,
                                appointmentCancels,
                                "Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều!",
                                riskStatus
                        );
                    }

                    // Trả về người dùng nếu không có cảnh báo nhưng vẫn có trạng thái "Bình Thường" hoặc "Cao"
                    return new UserWarningDTO(
                            user.getId(),
                            user.getUsername(),
                            user.getPasswords(),
                            user.getEmail(),
                            user.getBirthday(),
                            user.getPhonenumber(),
                            user.getGender(),
                            orderCancels,
                            appointmentCancels,
                            "Tài khoản của bạn đang hoạt động bình thường.",
                            riskStatus
                    );
                })
                .filter(Objects::nonNull) // Loại bỏ các kết quả null
                .collect(Collectors.toList());  // Trả về danh sách kết quả
    }

    public List<UserWarningDTO> getAllUsersWithWarningOnly() {
        List<User> users = userRepository.findAll();
        List<Appointment> allAppointments = appointmentRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();

        Map<Long, Long> cancelledOrdersMap = allOrders.stream()
                .filter(o -> "Đã Hủy".equalsIgnoreCase(o.getOrderStatus()))
                .collect(Collectors.groupingBy(o -> o.getUserId().longValue(), Collectors.counting()));

        Map<Long, Long> cancelledAppointmentsMap = allAppointments.stream()
                .filter(a -> "Đã hủy lịch".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.groupingBy(Appointment::getUserId, Collectors.counting()));

        return users.stream()
                .map(user -> {
                    long orderCancels = cancelledOrdersMap.getOrDefault(user.getId(), 0L);
                    long appointmentCancels = cancelledAppointmentsMap.getOrDefault(user.getId(), 0L);

                    boolean isRiskHigh = (orderCancels >= 5 || appointmentCancels >= 5);
                    boolean isWarning = (orderCancels >= 1 || appointmentCancels >= 1);

                    // Tính giá trị riskStatus dựa vào cảnh báo và nguy cơ cao
                    String riskStatus = "Bình Thường"; // Mặc định là bình thường
                    if (isRiskHigh) {
                        riskStatus = "Cao";
                    } else if (isWarning) {
                        riskStatus = "Cảnh báo";
                    }

                    // Nếu người dùng có cảnh báo và không phải là tài khoản thủ công đã mở khóa
                    if (isWarning && !isRiskHigh && !user.isManuallyUnlocked()) {
                        return new UserWarningDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getPasswords(), // Ẩn trường này nếu không cần thiết
                                user.getEmail(),
                                user.getBirthday(),
                                user.getPhonenumber(),
                                user.getGender(),
                                orderCancels,
                                appointmentCancels,
                                "Tài khoản của bạn có nguy cơ bị khóa do hủy quá nhiều!",
                                riskStatus // Truyền giá trị riskStatus vào UserWarningDTO
                        );
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // Phương thức mở khóa tài khoản
    public void unlockUserAccount(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Kiểm tra xem tài khoản có bị khóa không
            if (user.getStatus() != null && !user.getStatus()) {
                user.setStatus(true); // Đổi trạng thái tài khoản thành "Đang hoạt động"
                user.setriskStatus("Bình Thường");
                user.setIsUnlocked(true); // Đánh dấu tài khoản đã được mở khóa

                userRepository.save(user); // Lưu thay đổi
            } else {
                throw new RuntimeException("Tài khoản này không bị khóa.");
            }
        } else {
            throw new RuntimeException("Người dùng không tồn tại.");
        }
    }

}
