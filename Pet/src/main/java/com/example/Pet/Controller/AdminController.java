package com.example.Pet.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.Pet.Modal.Admin;
import com.example.Pet.Modal.Employee;
import com.example.Pet.Service.AdminService;
import com.example.Pet.Service.EmployeeService;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private EmployeeService employeeService;

    // API đăng ký admin
    @PostMapping("/admin/register")
    public String registerAdmin(@RequestParam String username, @RequestParam String password) {
        Admin newAdmin = new Admin();
        newAdmin.setUsername(username);
        newAdmin.setPassword(password);  // Mật khẩu thô, không mã hóa

        boolean success = adminService.registerAdmin(newAdmin);
        if (!success) {
            return "";  // Nếu đăng ký thất bại (do vượt quá giới hạn tài khoản)
        }
        return "redirect:/fontend/dashboard-admin.html";  // Nếu đăng ký thành công
    }

    // API đăng nhập admin
    // API đăng nhập admin
    // @PostMapping("/admin/login")
    // @ResponseBody
    // public String loginAdmin(@RequestParam String username, @RequestParam String password, HttpSession session) {
    //     // Xử lý đăng nhập
    //     Admin admin = adminService.loginAdmin(username, password);
    //     if (admin == null) {
    //         return "Đăng nhập thất bại!";  // Trả về thông báo đăng nhập thất bại
    //     }
    //     // Lưu thông tin người dùng vào session khi đăng nhập thành công
    //     session.setAttribute("admin", admin);
    //     // Nếu đăng nhập thành công
    //     return "Đăng nhập thành công!";  // Trả về thông báo đăng nhập thành công
    // }
    // 
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        try {
            // Lấy thông tin đăng nhập
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Kiểm tra nếu các trường không rỗng
            if (username == null || username.isEmpty()) {
                return ResponseEntity.badRequest().body("Tên người dùng không được để trống");
            }
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            // Đăng nhập và lấy đối tượng admin
            Admin admin = adminService.loginAdmin(username, password);

            // Kiểm tra nếu admin đăng nhập thành công
            if (admin != null) {
                if (!admin.getStatus()) { // Kiểm tra trạng thái của admin
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản chưa được kích hoạt");
                }

                // Lưu thông tin admin vào session
                session.setAttribute("admin", admin);

                // Trả về thông tin admin  
                Map<String, Object> response = new HashMap<>();
                response.put("username", admin.getUsername());
                response.put("adminId", admin.getId());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sai tên người dùng hoặc mật khẩu");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API đăng xuất admin
    @PostMapping("/admin/logout")
    @ResponseBody
    public String logout(HttpSession session) {
        session.invalidate();  // Xóa session khi đăng xuất
        return "Đăng xuất thành công";  // Trả về thông báo đăng xuất thành công
    }

    @GetMapping("/admin/check-login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkLoginStatus(HttpSession session) {
        // Retrieve the admin object from the session
        Admin admin = (Admin) session.getAttribute("admin");

        // Create a response map to hold the status and user data
        Map<String, Object> response = new HashMap<>();

        // If admin is logged in, add details to the response
        if (admin != null) {
            response.put("isLoggedIn", true);
            response.put("userId", admin.getId()); // Return userId
            response.put("username", admin.getUsername()); // Return username
        } else {
            response.put("isLoggedIn", false); // If not logged in, return false
        }

        // Return the response as JSON
        return ResponseEntity.ok(response);
    }

    //////////////////////////////////// đăng kí cho nhân viên
    // @PostMapping("/admin/create-employee")
    // public ResponseEntity<String> createEmployee(@RequestBody Employee employee) {
    //     // Make sure Employee class is correctly mapped
    //     Employee newEmployee = employeeService.createEmployee(employee.getFullname(),
    //             employee.getUsername(),
    //             employee.getPassword());
    //     return new ResponseEntity<>("Employee account created successfully with ID: " + newEmployee.getId(), HttpStatus.CREATED);
    // }
    @PostMapping("/admin/create-employee")
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        try {
            // Xử lý tạo mới nhân viên
            Employee newEmployee = employeeService.createEmployee(employee.getFullname(),
                    employee.getUsername(),
                    employee.getPassword());
            // Trả về phản hồi thành công dưới dạng JSON
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    "{\"message\": \"Employee account created successfully with ID: " + newEmployee.getId() + "\" }"
            );
        } catch (Exception e) {
            // Xử lý lỗi và trả về thông điệp lỗi dưới dạng JSON
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    "{\"error\": \"There was an error creating the employee: " + e.getMessage() + "\" }"
            );
        }
    }

    // API để lấy tất cả danh sách nhân viên
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);  // Trả về danh sách nhân viên dưới dạng JSON
    }

}
