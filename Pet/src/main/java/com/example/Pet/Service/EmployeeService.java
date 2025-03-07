package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Employee;
import com.example.Pet.Repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee createEmployee(String fullname, String username, String password) {
        Employee employee = new Employee();
        employee.setFullname(fullname);
        employee.setUsername(username);
        employee.setPassword(password);  // In a real-world app, you should hash the password before storing it
        employee.setRole("STAFF");  // Default role
        employee.setStatus(true);  // Active status

        return employeeRepository.save(employee);
    }

    // Phương thức để lấy tất cả nhân viên
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Phương thức đăng nhập
    public Employee loginEmployee(String username, String password) {
        // Kiểm tra tài khoản trong cơ sở dữ liệu
        Employee employee = employeeRepository.findByUsername(username);
        if (employee != null && employee.getPassword().equals(password)) {
            return employee;  // Trả về đối tượng employee nếu đăng nhập thành công
        }

        return null;  // Nếu không tìm thấy nhân viên hoặc mật khẩu sai
    }

}
