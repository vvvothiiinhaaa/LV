package com.example.Pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.Pet.Modal.Admin;
import com.example.Pet.Repository.AdminRepository;
import com.example.Pet.Service.AdminService;

@Component
public class AdminDataLoader implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminService adminService;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra nếu số lượng tài khoản admin đã đủ 2, nếu chưa đủ thì tạo 2 tài khoản mặc định
        if (adminRepository.count() < 2) {
            // Tạo tài khoản admin1 mặc định
            Admin admin1 = new Admin();
            admin1.setUsername("admin1");
            admin1.setPassword("admin123");  // Mật khẩu thô, không mã hóa
            admin1.setRole("ADMIN");
            admin1.setStatus(true);
            adminRepository.save(admin1);

            // Tạo tài khoản admin2 mặc định
            Admin admin2 = new Admin();
            admin2.setUsername("admin2");
            admin2.setPassword("admin234");  // Mật khẩu thô, không mã hóa
            admin2.setRole("ADMIN");
            admin1.setStatus(true);
            adminRepository.save(admin2);
        }
    }
}
