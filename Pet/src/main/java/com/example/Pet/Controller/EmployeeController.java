package com.example.Pet.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Employee;
import com.example.Pet.Service.EmployeeService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService; // Dịch vụ xử lý đăng nhập

    // API Đăng Nhập
    // @PostMapping("/login")
    // public ResponseEntity<?> loginEmployee(@RequestBody Map<String, String> loginRequest, HttpSession session) {
    //     try {
    //         String username = loginRequest.get("username");
    //         String password = loginRequest.get("password");
    //         // Kiểm tra thông tin đăng nhập không được rỗng
    //         if (username == null || username.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Tên đăng nhập không được để trống");
    //         }
    //         if (password == null || password.isEmpty()) {
    //             return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
    //         }
    //         // Xác thực tài khoản nhân viên
    //         Employee employee = employeeService.loginEmployee(username, password);
    //         if (employee != null) {
    //             // Lưu thông tin nhân viên vào session
    //             session.setAttribute("employee", employee); // Lưu thông tin vào session
    //             // Trả về thông tin nhân viên
    //             return ResponseEntity.ok().body(employee);
    //         } else {
    //             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên đăng nhập hoặc mật khẩu");
    //         }
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
    @PostMapping("/login")
    public ResponseEntity<?> loginEmployee(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Kiểm tra thông tin đăng nhập không được rỗng
            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên đăng nhập không được để trống");
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            // Xác thực tài khoản nhân viên
            Employee employee = employeeService.loginEmployee(username, password);

            if (employee != null) {
                // Kiểm tra trạng thái tài khoản
                if (!employee.isStatus()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản đã bị vô hiệu hóa");
                }

                // Lưu thông tin nhân viên vào session
                session.setAttribute("employee", employee);

                // Trả về thông tin nhân viên
                return ResponseEntity.ok().body(employee);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API Kiểm Tra Đăng Nhập
    @GetMapping("/check-login")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        Employee employee = (Employee) session.getAttribute("employee");
        if (employee != null) {
            // Trả về thông tin nhân viên nếu đã đăng nhập
            return ResponseEntity.ok().body(employee);
        } else {
            // Trả về thông báo chưa đăng nhập
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }
    }

    // API Đăng Xuất
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // Hủy session khi người dùng đăng xuất
        return ResponseEntity.ok().body("Đăng xuất thành công");
    }

    // API cập nhật thông tin nhân viên
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestParam String fullname,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String birthdate,
            @RequestParam String phonenumber,
            @RequestParam String password,
            @RequestParam String role,
            @RequestParam boolean status,
            @RequestParam(required = false) MultipartFile file) {

        // Tạo đối tượng employeeDetails từ dữ liệu nhận được
        Employee employeeDetails = new Employee();
        employeeDetails.setFullname(fullname);
        employeeDetails.setUsername(username);
        employeeDetails.setEmail(email);
        employeeDetails.setBirthdate(birthdate);
        employeeDetails.setPhonenumber(phonenumber);
        employeeDetails.setPassword(password);
        employeeDetails.setRole(role);
        employeeDetails.setStatus(status);

        // Gọi service để cập nhật thông tin nhân viên
        Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails, file);

        if (updatedEmployee != null) {
            return ResponseEntity.ok(updatedEmployee);  // Trả về nhân viên đã cập nhật
        } else {
            return ResponseEntity.notFound().build();  // Trả về lỗi 404 nếu không tìm thấy nhân viên
        }
    }

    // API xóa tài khoản nhân viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        boolean isDeleted = employeeService.deleteEmployee(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();  // Thành công
        }

        return ResponseEntity.notFound().build();  // Nếu không tìm thấy nhân viên
    }

    // API cập nhật trạng thái nhân viên
    @PutMapping("/{id}/status")
    public ResponseEntity<Employee> updateEmployeeStatus(@PathVariable Long id, @RequestParam boolean status) {
        Employee updatedEmployee = employeeService.updateEmployeeStatus(id, status);

        if (updatedEmployee != null) {
            return ResponseEntity.ok(updatedEmployee);
        }

        return ResponseEntity.notFound().build();  // Nếu không tìm thấy nhân viên
    }

    @GetMapping("/{id}/detailt")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);

        if (employee != null) {
            return ResponseEntity.ok(employee); // Trả về thông tin nhân viên
        } else {
            return ResponseEntity.notFound().build(); // Nếu không tìm thấy nhân viên, trả về 404
        }
    }
}
