package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Tìm kiếm nhân viên theo tên đăng nhập
    Employee findByUsername(String username);
}
