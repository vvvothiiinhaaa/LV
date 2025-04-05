package com.example.Pet.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.DTO.ServiceDTO;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Service.ServiceforpetService;

@RestController
@RequestMapping("/services")
public class ServiceforpetController {

    private final ServiceforpetService serviceforpetService;

    public ServiceforpetController(ServiceforpetService serviceforpetService) {
        this.serviceforpetService = serviceforpetService;
    }

    // Thêm dịch vụ mới
    // @PostMapping("/add")
    // public ResponseEntity<Serviceforpet> addService(
    //         @RequestParam String name,
    //         @RequestParam String description,
    //         @RequestParam Integer duration,
    //         @RequestParam MultipartFile file) {
    //     return ResponseEntity.ok(serviceforpetService.addService(name, description, duration, file));
    // }
    // Cập nhật thông tin dịch vụ
    // @PutMapping("/update/{id}")
    // public ResponseEntity<Serviceforpet> updateService(
    //         @PathVariable Integer id,
    //         @RequestParam(required = false) String name,
    //         @RequestParam(required = false) String description,
    //         @RequestParam(required = false) Integer duration,
    //         @RequestParam(required = false) MultipartFile file) {
    //     return ResponseEntity.ok(serviceforpetService.updateService(id, name, description, duration, file));
    // }
    // Xóa dịch vụ theo ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Integer id) {
        serviceforpetService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully!");
    }

    // Lấy danh sách tất cả dịch vụ
    // @GetMapping("/all")
    // public ResponseEntity<List<Serviceforpet>> getAllServices() {
    //     return ResponseEntity.ok(serviceforpetService.getAllServices());
    // }
    /// lấy chi tiết dịch vụ
     @GetMapping("/{id}")
    public Serviceforpet getServiceById(@PathVariable Integer id) {
        return serviceforpetService.getServiceById(id);
    }

    /////////////////////////////////////////////////////  thêm ngày 10 tháng 3
    @PostMapping("/add")
    public ResponseEntity<?> addService(@ModelAttribute ServiceDTO serviceDTO) {
        Serviceforpet newService = serviceforpetService.addService(serviceDTO);
        return ResponseEntity.ok(newService);
    }

    // Lấy danh sách tất cả dịch vụ kèm bước & giá
    @GetMapping("/all")
    public ResponseEntity<List<Serviceforpet>> getAllServices() {
        return ResponseEntity.ok(serviceforpetService.getAllServices());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateService(@PathVariable Integer id, @ModelAttribute ServiceDTO serviceDTO) {
        Serviceforpet updatedService = serviceforpetService.updateService(id, serviceDTO);
        return ResponseEntity.ok(updatedService);
    }

    @GetMapping("/count")
    public long getServiceCount() {
        return serviceforpetService.countAllServices();
    }

}
