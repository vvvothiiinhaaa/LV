package com.example.Pet.Repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    // Các phương thức truy vấn tùy chỉnh có thể thêm ở đây (nếu cần)

    // Lấy tất cả các mã giảm giá còn hiệu lực (hiển thị các mã giảm giá có ngày bắt đầu trong quá khứ và ngày kết thúc trong tương lai)
    List<Discount> findAllByStartDateBeforeAndEndDateAfter(Date startDate, Date endDate);

    // Lấy mã giảm giá theo mã (code)
    Discount findByCode(String code);

    // Optional<Discount> findByCode(String code);
}
