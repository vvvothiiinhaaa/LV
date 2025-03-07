package com.example.Pet.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Admin;
import com.example.Pet.Repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Đăng ký tài khoản admin
    public boolean registerAdmin(Admin admin) {
        // Kiểm tra số lượng tài khoản admin
        if (adminRepository.count() >= 3) {
            return false;  // Giới hạn số lượng tài khoản admin là 3
        }

        // Kiểm tra nếu tên người dùng đã tồn tại
        if (adminRepository.findByUsername(admin.getUsername()) != null) {
            return false;  // Tên người dùng đã tồn tại
        }

        admin.setRole("ADMIN");  // Gán role là ADMIN
        admin.setStatus(true);  // Trạng thái là ACTIVE khi đăng ký
        adminRepository.save(admin);
        return true;
    }

    // Đăng nhập admin
    public Admin loginAdmin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin;  // Đăng nhập thành công
        }
        return null;  // Đăng nhập thất bại
    }
}
