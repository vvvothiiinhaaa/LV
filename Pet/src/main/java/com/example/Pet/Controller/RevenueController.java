package com.example.Pet.Controller;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Service.AppointmentService;
import com.example.Pet.Service.OrderService;
import com.example.Pet.Service.RevenueService;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/byGenre")
    public BigDecimal getRevenueByGenre(@RequestParam String genre,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return orderService.getRevenueByGenreAndTime(genre, startDate, endDate);
    }

    // Phương thức lấy doanh thu của tất cả danh mục trong thời gian
    @GetMapping("/allGenres")
    public Map<String, BigDecimal> getRevenueByAllGenres(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return orderService.getRevenueByAllGenres(startDate, endDate);
    }

    @GetMapping("/total")
    public ResponseEntity<?> getTotalRevenue() {
        BigDecimal total = revenueService.getTotalRevenue();
        return ResponseEntity.ok(Map.of("totalRevenue", total));
    }

    // Endpoint tính doanh thu theo ngày
    @GetMapping("/byGenres/daily")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getRevenueByGenresDaily(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            // Gọi phương thức từ service để lấy doanh thu theo ngày
            Map<String, Map<String, BigDecimal>> revenue = orderService.getRevenueByGenresDaily(startDate, endDate);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            // Nếu có lỗi, trả về lỗi 500 với thông báo lỗi
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint tính doanh thu theo tháng (sử dụng định dạng MM-yyyy)
    @GetMapping("/byGenres/monthly")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getRevenueByGenresMonthly(
            @RequestParam("startMonth") @DateTimeFormat(pattern = "MM-yyyy") String startMonth,
            @RequestParam("endMonth") @DateTimeFormat(pattern = "MM-yyyy") String endMonth) {
        try {
            Date startDate = parseMonthToDate(startMonth, true); // Lấy ngày đầu tháng
            Date endDate = parseMonthToDate(endMonth, false);   // Lấy ngày cuối tháng
            Map<String, Map<String, BigDecimal>> revenue = orderService.getRevenueByGenresMonthly(startDate, endDate);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Hàm chuyển đổi MM-yyyy thành Date (ngày đầu hoặc ngày cuối của tháng)
    private Date parseMonthToDate(String monthYear, boolean isStartOfMonth) {
        try {
            DateFormat formatter = new SimpleDateFormat("MM-yyyy");
            Date date = formatter.parse(monthYear);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            if (isStartOfMonth) {
                calendar.set(Calendar.DAY_OF_MONTH, 1); // Lấy ngày đầu tháng
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.set(Calendar.MILLISECOND, 0);
            } else {
                calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH)); // Lấy ngày cuối tháng
                calendar.set(Calendar.HOUR_OF_DAY, 23);
                calendar.set(Calendar.MINUTE, 59);
                calendar.set(Calendar.SECOND, 59);
                calendar.set(Calendar.MILLISECOND, 999);
            }
            return calendar.getTime();
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid month-year format: " + monthYear);
        }
    }

    //////////////////////////////////////// ngày 12
    /// 
     // Endpoint để lấy tổng doanh thu theo ngày
     @GetMapping("/total/daily")
    public Map<String, BigDecimal> getRevenueByDay(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {

        // Chuyển đổi từ String sang LocalDate
        LocalDate start = LocalDate.parse(startDate);  // Chuyển đổi từ chuỗi sang LocalDate
        LocalDate end = LocalDate.parse(endDate);      // Chuyển đổi từ chuỗi sang LocalDate

        // Gọi phương thức trong service để lấy doanh thu tổng hợp
        return revenueService.getTotalRevenueByDay(start, end);
    }

    // Endpoint để lấy tổng doanh thu theo tháng
    @GetMapping("/total/monthly")
    public Map<String, BigDecimal> getTotalRevenueByMonth(
            @RequestParam("startMonth") String startMonth,
            @RequestParam("endMonth") String endMonth) {

        // Chuyển đổi từ String sang LocalDate (startMonth và endMonth phải theo định dạng MM-yyyy)
        return revenueService.getTotalRevenueByMonth(startMonth, endMonth);
    }

    /// đếm số sản phẩm đã bán ra
    @GetMapping("/total-products-sold")
    public ResponseEntity<?> getTotalSoldProducts() {
        int total = revenueService.getTotalSoldProducts();
        return ResponseEntity.ok(Map.of("totalProducts", total));
    }

}
