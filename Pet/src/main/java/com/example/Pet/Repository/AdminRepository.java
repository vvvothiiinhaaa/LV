package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByUsername(String username);

    long count();  // Đếm số lượng tài khoản admin trong cơ sở dữ liệu
}
