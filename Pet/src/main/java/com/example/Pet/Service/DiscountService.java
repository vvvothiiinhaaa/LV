package com.example.Pet.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Discount;
import com.example.Pet.Repository.DiscountRepository;

@Service
public class DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    // Thêm mã giảm giá mới
    // public Discount addDiscount(Discount discount) {
    //     return discountRepository.save(discount);
    // }
    public Discount addDiscount(Discount discount) {
        // Kiểm tra nếu mã giảm giá đã tồn tại
        if (discountRepository.existsByCode(discount.getCode())) {
            throw new RuntimeException("Mã giảm giá đã tồn tại!");
        }
        return discountRepository.save(discount);
    }

    // // Cập nhật mã giảm giá
    // public Discount updateDiscount(Long id, Discount discountDetails) {
    //     Optional<Discount> discount = discountRepository.findById(id);
    //     if (discount.isPresent()) {
    //         Discount existingDiscount = discount.get();
    //         existingDiscount.setStartDate(discountDetails.getStartDate());
    //         existingDiscount.setEndDate(discountDetails.getEndDate());
    //         existingDiscount.setUsageLimit(discountDetails.getUsageLimit());
    //         existingDiscount.setDiscountPercentage(discountDetails.getDiscountPercentage());
    //         existingDiscount.setMinOrderAmount(discountDetails.getMinOrderAmount());
    //         existingDiscount.setCode(discountDetails.getCode());
    //         return discountRepository.save(existingDiscount);
    //     }
    //     return null; // Nếu không tìm thấy mã giảm giá
    // }
    // Cập nhật mã giảm giá theo mã (code)
    public Discount updateDiscountByCode(String code, Discount discountDetails) {
        Discount existingDiscount = discountRepository.findByCode(code); // Tìm mã giảm giá theo code

        if (existingDiscount != null) {
            // Cập nhật các trường thông tin của mã giảm giá
            existingDiscount.setStartDate(discountDetails.getStartDate());
            existingDiscount.setEndDate(discountDetails.getEndDate());
            existingDiscount.setUsageLimit(discountDetails.getUsageLimit());
            existingDiscount.setDiscountPercentage(discountDetails.getDiscountPercentage());
            existingDiscount.setMinOrderAmount(discountDetails.getMinOrderAmount());
            existingDiscount.setCode(discountDetails.getCode()); // Cập nhật code nếu cần thiết

            // Lưu lại vào database
            return discountRepository.save(existingDiscount);
        }
        return null; // Nếu không tìm thấy mã giảm giá
    }

    public Discount updateUsageLimitDiscountByCode(String code) {
        Discount existingDiscount = discountRepository.findByCode(code); // Tìm mã giảm giá theo code

        if (existingDiscount != null) {
            // Nếu usageLimit là null hoặc bằng 0, không cho phép sử dụng mã giảm giá
            if (existingDiscount.getUsageLimit() <= 0) {
                return null; // Không thể sử dụng mã giảm giá
            }

            // Giảm usageLimit đi 1
            existingDiscount.setUsageLimit(existingDiscount.getUsageLimit() - 1);

            // Lưu lại vào database
            return discountRepository.save(existingDiscount);
        }
        return null; // Nếu không tìm thấy mã giảm giá
    }

    // Xóa mã giảm giá
    public boolean deleteDiscount(Long id) {
        if (discountRepository.existsById(id)) {
            discountRepository.deleteById(id);
            return true;
        }
        return false; // Nếu không tìm thấy mã giảm giá
    }

    // Lấy tất cả mã giảm giá
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    // Lấy mã giảm giá theo ID
    public Optional<Discount> getDiscountById(Long id) {
        return discountRepository.findById(id);
    }

    // Lấy tất cả các mã giảm giá còn hiệu lực
    public List<Discount> getAllActiveDiscounts() {
        Date currentDate = new Date();  // Lấy thời gian hiện tại
        return discountRepository.findAllByStartDateBeforeAndEndDateAfter(currentDate, currentDate);
    }

    // Kiểm tra mã giảm giá theo mã
    public Discount getDiscountByCode(String code) {
        return discountRepository.findByCode(code);
    }

    public List<Discount> getUpcomingDiscounts() {
        return discountRepository.findUpcomingDiscounts();
    }

    public List<Discount> getExpiredDiscounts() {
        return discountRepository.findExpiredDiscounts();
    }

}
