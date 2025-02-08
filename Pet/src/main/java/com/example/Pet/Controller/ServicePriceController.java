package com.example.Pet.Controller;

import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Service.ServicePriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/serviceprice")
public class ServicePriceController {

    private final ServicePriceService servicePriceService;

    public ServicePriceController(ServicePriceService servicePriceService) {
        this.servicePriceService = servicePriceService;
    }

    //  Thêm giá dịch vụ theo kích thước thú cưng
    @PostMapping("/add")
    public ResponseEntity<List<ServicePrice>> addMultipleServicePrices(@RequestBody List<ServicePrice> servicePrices) {
        List<ServicePrice> savedPrices = servicePrices.stream()
                .map(sp -> servicePriceService.addServicePrice(sp.getServiceforpet().getId(), sp.getPetSize().getId(), sp.getPrice()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(savedPrices);
    }

    //  Lấy danh sách giá của một dịch vụ
    @GetMapping("/{serviceId}")
    public ResponseEntity<List<ServicePrice>> getServicePricesByService(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(servicePriceService.getServicePricesByService(serviceId));
    }

    //  Cập nhật giá của một dịch vụ theo kích thước thú cưng
    @PutMapping("/update/{id}")
    public ResponseEntity<ServicePrice> updateServicePrice(@PathVariable Integer id,
            @RequestParam BigDecimal price) {
        return ResponseEntity.ok(servicePriceService.updateServicePrice(id, price));
    }

    //  Xóa giá dịch vụ
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteServicePrice(@PathVariable Integer id) {
        servicePriceService.deleteServicePrice(id);
        return ResponseEntity.ok("Service price deleted successfully!");
    }
}
