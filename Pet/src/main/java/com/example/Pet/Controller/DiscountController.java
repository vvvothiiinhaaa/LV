package com.example.Pet.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Discount;
import com.example.Pet.Service.DiscountService;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    // Thêm mã giảm giá
    @PostMapping
    public ResponseEntity<Discount> addDiscount(@RequestBody Discount discount) {
        Discount createdDiscount = discountService.addDiscount(discount);
        return ResponseEntity.ok(createdDiscount);
    }

    // // Cập nhật mã giảm giá
    // @PutMapping("/{id}")
    // public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody Discount discountDetails) {
    //     Discount updatedDiscount = discountService.updateDiscount(id, discountDetails);
    //     if (updatedDiscount != null) {
    //         return ResponseEntity.ok(updatedDiscount);
    //     }
    //     return ResponseEntity.notFound().build(); // Nếu không tìm thấy
    // }
    // Cập nhật mã giảm giá theo mã (code)
    @PutMapping("/update/{code}")
    public ResponseEntity<Discount> updateDiscountByCode(
            @PathVariable("code") String code, // Lấy code từ URL
            @RequestBody Discount discountDetails) { // Lấy thông tin cập nhật từ body
        Discount updatedDiscount = discountService.updateDiscountByCode(code, discountDetails);

        if (updatedDiscount != null) {
            return ResponseEntity.ok(updatedDiscount); // Trả về mã giảm giá đã cập nhật
        }
        return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy mã giảm giá
    }

    @PutMapping("/update-UsageLimit/{code}")
    public ResponseEntity<Discount> updateDiscountByCode(@PathVariable("code") String code) {
        Discount updatedDiscount = discountService.updateUsageLimitDiscountByCode(code);

        if (updatedDiscount != null) {
            return ResponseEntity.ok(updatedDiscount); // Trả về mã giảm giá đã cập nhật
        }
        return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy mã giảm giá hoặc usageLimit đã hết
    }

    // Xóa mã giảm giá
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        if (discountService.deleteDiscount(id)) {
            return ResponseEntity.noContent().build(); // Thành công
        }
        return ResponseEntity.notFound().build(); // Nếu không tìm thấy
    }

    // Lấy tất cả mã giảm giá
    @GetMapping
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        List<Discount> discounts = discountService.getAllDiscounts();
        return ResponseEntity.ok(discounts);
    }

    // Lấy mã giảm giá theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Discount> getDiscountById(@PathVariable Long id) {
        Optional<Discount> discount = discountService.getDiscountById(id);
        return discount.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API lấy tất cả mã giảm giá còn hiệu lực
    @GetMapping("/all")
    public ResponseEntity<List<Discount>> getAllActiveDiscounts() {
        List<Discount> discounts = discountService.getAllActiveDiscounts();
        return ResponseEntity.ok(discounts);
    }

    // API kiểm tra mã giảm giá
    @GetMapping("/validate/{code}")
    public ResponseEntity<Discount> validateDiscount(@PathVariable String code) {
        Discount discount = discountService.getDiscountByCode(code);
        if (discount != null) {
            return ResponseEntity.ok(discount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
