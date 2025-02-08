// package com.example.Pet.Controller;
// import com.example.Pet.Modal.Serviceforpet;
// import com.example.Pet.Modal.ServicePrice;
// import com.example.Pet.Service.ServiceforpetService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.math.BigDecimal;
// import java.util.List;
// @RestController
// @RequestMapping("/services")
// public class ServiceforpetController {
//     private final ServiceforpetService serviceforpetService;
//     public ServiceforpetController(ServiceforpetService serviceforpetService) {
//         this.serviceforpetService = serviceforpetService;
//     }
//     //  Thêm dịch vụ mới (Kèm giá theo PetSize)
//     @PostMapping("/add")
//     public ResponseEntity<Serviceforpet> addServiceWithPrices(
//             @RequestParam String name,
//             @RequestParam(required = false) String description,
//             @RequestParam Integer duration,
//             @RequestParam BigDecimal defaultPrice) {
//         return ResponseEntity.ok(serviceforpetService.addServiceWithPrices(name, description, duration, defaultPrice));
//     }
//     // Cập nhật giá dịch vụ theo PetSize
//     @PutMapping("/update-price/{serviceId}/{petSizeId}")
//     public ResponseEntity<ServicePrice> updateServicePrice(
//             @PathVariable Integer serviceId,
//             @PathVariable Integer petSizeId,
//             @RequestParam BigDecimal newPrice) {
//         return ResponseEntity.ok(serviceforpetService.updateServicePrice(serviceId, petSizeId, newPrice));
//     }
//     //  Lấy tất cả giá của một dịch vụ theo PetSize
//     @GetMapping("/prices/{serviceId}")
//     public ResponseEntity<List<ServicePrice>> getServicePricesByService(@PathVariable Integer serviceId) {
//         return ResponseEntity.ok(serviceforpetService.getServicePricesByService(serviceId));
//     }
// }
package com.example.Pet.Controller;

import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Service.ServiceforpetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceforpetController {

    private final ServiceforpetService serviceforpetService;

    public ServiceforpetController(ServiceforpetService serviceforpetService) {
        this.serviceforpetService = serviceforpetService;
    }

    //  Thêm dịch vụ mới
    @PostMapping("/add")
    public ResponseEntity<Serviceforpet> addService(@RequestParam String name,
            @RequestParam String description,
            @RequestParam Integer duration) {
        return ResponseEntity.ok(serviceforpetService.addService(name, description, duration));
    }

    // Cập nhật thông tin dịch vụ
    @PutMapping("/update/{id}")
    public ResponseEntity<Serviceforpet> updateService(@PathVariable Integer id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer duration) {
        return ResponseEntity.ok(serviceforpetService.updateService(id, name, description, duration));
    }

    // Xóa dịch vụ theo ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Integer id) {
        serviceforpetService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully!");
    }

    // Lấy danh sách tất cả dịch vụ
    @GetMapping("/all")
    public ResponseEntity<List<Serviceforpet>> getAllServices() {
        return ResponseEntity.ok(serviceforpetService.getAllServices());
    }
}
