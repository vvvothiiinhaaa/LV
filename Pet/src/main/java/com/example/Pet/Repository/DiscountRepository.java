package com.example.Pet.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Pet.Modal.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    // Các phương thức truy vấn tùy chỉnh có thể thêm ở đây (nếu cần)

    // Lấy tất cả các mã giảm giá còn hiệu lực (hiển thị các mã giảm giá có ngày bắt đầu trong quá khứ và ngày kết thúc trong tương lai)
    List<Discount> findAllByStartDateBeforeAndEndDateAfter(LocalDateTime startDate, LocalDateTime endDate);

    // Lấy mã giảm giá theo mã (code)
    Discount findByCode(String code);

    // Optional<Discount> findByCode(String code);
    // Lấy các mã giảm giá chưa đến ngày bắt đầu
    @Query("SELECT d FROM Discount d WHERE d.startDate > CURRENT_DATE")
    List<Discount> findUpcomingDiscounts();

    // Lấy các mã giảm giá đã hết hạn
    @Query("SELECT d FROM Discount d WHERE d.endDate < CURRENT_DATE")
    List<Discount> findExpiredDiscounts();

    //  kiểm tra mã giảm giá đã có chưa
    boolean existsByCode(String code);
}
