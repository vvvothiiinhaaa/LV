package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Cart;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.CartRepository;
import com.example.Pet.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;  // Thêm CartRepository

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

}
