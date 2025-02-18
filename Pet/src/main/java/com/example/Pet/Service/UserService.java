package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.CartRepository;
import com.example.Pet.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;  // Thêm CartRepository

    @Autowired
    private FileStorageService fileStorageService;

    public User registerUser(String username, String password) {
        // Kiểm tra nếu người dùng đã tồn tại
        if (userRepository.findByUsername(username) != null) {
            throw new RuntimeException("Username already exists");
        }

        // Tạo và lưu người dùng mới với mật khẩu chưa mã hóa
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPasswords(password); // Mật khẩu chưa mã hóa
        newUser.setRole("user");
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
}
