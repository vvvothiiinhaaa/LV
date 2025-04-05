package com.example.Pet.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Employee;
import com.example.Pet.Repository.EmployeeRepository;
import com.example.Pet.Repository.UserRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Employee createEmployee(String fullname, String username, String email, String birthdate, String phonenumber, String password, MultipartFile file) {
        if (userRepository.findByUsername(username) != null) {
            throw new RuntimeException("vui lòng chọn username khác!");
        }

        //  Kiểm tra username có bị trùng trong bảng Employee không (cho chắc chắn)
        if (employeeRepository.findByUsername(username) != null) {
            throw new RuntimeException("vui lòng chọn username khác!");
        }

        Employee employee = new Employee();
        employee.setFullname(fullname);
        employee.setUsername(username);
        employee.setEmail(email);
        employee.setBirthdate(birthdate);
        employee.setPhonenumber(phonenumber);
        employee.setPassword(password);  // Trong thực tế, nên mã hóa mật khẩu trước khi lưu
        employee.setRole("STAFF");  // Mặc định là STAFF
        employee.setStatus(true);  // Mặc định là Active

        // Xử lý ảnh và lưu đường dẫn vào database
        String imageUrl = fileStorageService.saveFile(file);
        if (imageUrl != null) {
            employee.setUrl(imageUrl); // Lưu đường dẫn ảnh vào cột url trong database
        } else {
            employee.setUrl("img/default-avata.png"); // Nếu không có ảnh, sử dụng ảnh mặc định
        }

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

    //// cập nhậtnhật

    public Employee updateEmployee(Long id, Employee employeeDetails, MultipartFile file) {
        // Tìm kiếm nhân viên bằng ID
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();

            // Cập nhật các thông tin cơ bản
            employee.setFullname(employeeDetails.getFullname());
            employee.setUsername(employeeDetails.getUsername());
            employee.setEmail(employeeDetails.getEmail());
            employee.setBirthdate(employeeDetails.getBirthdate());
            employee.setPhonenumber(employeeDetails.getPhonenumber());
            employee.setPassword(employeeDetails.getPassword());
            employee.setRole(employeeDetails.getRole());
            employee.setStatus(employeeDetails.isStatus());

            // Cập nhật ảnh nếu có
            if (file != null) {
                String imageUrl = fileStorageService.saveFile(file);
                if (imageUrl != null) {
                    employee.setUrl(imageUrl); // Cập nhật đường dẫn ảnh
                }
            }

            // Lưu và trả về nhân viên đã được cập nhật
            return employeeRepository.save(employee);
        }

        return null;  // Trả về null nếu không tìm thấy nhân viên
    }

    // Xóa tài khoản nhân viên
    public boolean deleteEmployee(Long id) {
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

        if (existingEmployee.isPresent()) {
            employeeRepository.deleteById(id);
            return true;
        }

        return false;  // Trả về false nếu không tìm thấy nhân viên
    }

    // Phương thức cập nhật trạng thái của nhân viên
    public Employee updateEmployeeStatus(Long id, boolean status) {
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setStatus(status);  // Cập nhật trạng thái
            return employeeRepository.save(employee);
        }

        return null;  // Trả về null nếu không tìm thấy nhân viên
    }

    public Employee getEmployeeById(Long id) {
        // Tìm nhân viên trong cơ sở dữ liệu bằng ID
        Optional<Employee> employee = employeeRepository.findById(id);

        // Nếu có nhân viên, trả về thông tin chi tiết, ngược lại trả về null
        return employee.orElse(null);
    }

}
