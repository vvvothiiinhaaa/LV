package com.example.Pet.Controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Appointment;
import com.example.Pet.Repository.AppointmentPriceRepository;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.ServicePriceRepository;
import com.example.Pet.Service.AppointmentService;
import com.example.Pet.Service.RevenueService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ServicePriceRepository servicePriceRepository;

    @Autowired
    private AppointmentPriceRepository appointmentPriceRepository;

    @Autowired
    private RevenueService revenueService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // API lấy tất cả lịch hẹn
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // API ĐẶT LỊCH HẸN
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Map<String, Object> request) {
        Long userId = ((Number) request.get("userId")).longValue();
        Set<Integer> petIds = ((List<Number>) request.get("petIds")).stream().map(Number::intValue).collect(Collectors.toSet());
        Set<Integer> serviceIds = ((List<Number>) request.get("serviceIds")).stream().map(Number::intValue).collect(Collectors.toSet());
        String slot = (String) request.get("slot");
        LocalDate appDate = LocalDate.parse((String) request.get("appDate"));

        return ResponseEntity.ok(appointmentService.createAppointment(userId, petIds, serviceIds, slot, appDate));
    }

    // API HỦY LỊCH HẸN
    @DeleteMapping("/cancel/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
        String message = appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.ok(message);
    }

    // API LẤY DANH SÁCH LỊCH HẸN CỦA NGƯỜI DÙNG
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    // API LẤY DANH SÁCH LỊCH HẸN THEO KHUNG GIỜ
    @GetMapping("/time-slot")
    public ResponseEntity<List<Appointment>> getAppointmentsByTimeSlot(
            @RequestParam(required = false) String slot,
            @RequestParam(required = false) String date) {

        LocalDate appDate = (date != null && !date.isEmpty()) ? LocalDate.parse(date) : null;
        List<Appointment> appointments = appointmentService.getAppointmentsByTimeSlot(slot, appDate);

        return ResponseEntity.ok(appointments);
    }

    // API lọc lịch hẹn theo trạng thái
    @GetMapping("/filter")
    public ResponseEntity<?> getAppointmentsByStatus(@RequestParam(required = false) String status) {
        try {
            List<Appointment> appointments;

            if (status == null || status.isEmpty()) {
                appointments = appointmentService.getAllAppointments(); // Trả về tất cả lịch hẹn nếu không có status
            } else {
                appointments = appointmentService.getAppointmentsByStatus(status);
            }

            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi lọc lịch hẹn: " + e.getMessage());
        }
    }

    // @PutMapping("/update-status")
    // public ResponseEntity<?> updateAppointmentStatus(@RequestBody Map<String, Object> request) {
    //     try {
    //         List<Integer> ids = (List<Integer>) request.get("ids");
    //         String status = (String) request.get("status");
    //         for (Integer id : ids) {
    //             Appointment appointment = appointmentRepository.findById(Long.valueOf(id)).orElse(null);
    //             if (appointment != null) {
    //                 appointment.setStatus(status);
    //                 appointmentRepository.save(appointment);
    //             }
    //         }
    //         return ResponseEntity.ok("Cập nhật trạng thái thành công.");
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật: " + e.getMessage());
    //     }
    // }
    /////////// lấy chi tiết lịch hẹn
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentDetails(@PathVariable Integer id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointment);
    }

    ///////////////////
    @GetMapping("/filter-status")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status) {

        List<Appointment> appointments = appointmentService.getAppointmentsByStatus(userId, status);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/filter-time-slot")
    public ResponseEntity<List<Appointment>> getAppointmentsByTimeSlot(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String slot,
            @RequestParam(required = false) String date) {

        LocalDate appDate = (date != null && !date.isEmpty()) ? LocalDate.parse(date) : null;
        List<Appointment> appointments = appointmentService.getAppointmentsByTimeSlot(userId, slot, appDate);

        return ResponseEntity.ok(appointments);
    }

    /////////////// lấy chi tiết 
    @GetMapping("/pet/{petId}")
    public List<Appointment> getAppointmentsByPetId(@PathVariable Integer petId) {
        return appointmentService.getAppointmentsByPetId(petId);
    }

    // API kiểm tra khung giờ trống của một ngày cụ thể
    @GetMapping("/available-slots")
    public ResponseEntity<?> getAvailableSlots(@RequestParam String date) {
        try {
            LocalDate appointmentDate = LocalDate.parse(date); // Chuyển đổi ngày từ String sang LocalDate
            List<String> availableSlots = appointmentService.getAvailableTimeSlots(appointmentDate);
            return ResponseEntity.ok(availableSlots);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Ngày không hợp lệ! Định dạng phải là YYYY-MM-DD");
        }
    }

    ///////////////////////// ngày 19 tháng 3

    @PutMapping("/update-status")
    public ResponseEntity<?> updateAppointmentStatus(@RequestBody Map<String, Object> request) {
        try {
            // Lấy thông tin các lịch hẹn và trạng thái mới từ yêu cầu
            List<Integer> ids = (List<Integer>) request.get("ids");  // Kiểu Integer
            String status = (String) request.get("status");

            // Kiểm tra nếu danh sách ids rỗng
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Danh sách lịch hẹn không được để trống.");
            }

            // Lặp qua tất cả các lịch hẹn đã chọn và cập nhật trạng thái
            for (Integer id : ids) {  // id là Integer
                Long appointmentId = Long.valueOf(id);

                Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);  // FindById sử dụng Long
                if (appointment != null) {
                    // Cập nhật trạng thái
                    appointment.setStatus(status);
                    appointmentRepository.save(appointment);

                    // Nếu trạng thái là "Hoàn Thành", tính toán và lưu giá dịch vụ
                    if ("Hoàn Thành".equals(status)) {
                        appointmentService.calculateAndSavePrice(appointmentId);  // Gọi service với Long
                    }
                }
            }

            return ResponseEntity.ok("Cập nhật trạng thái và tính giá dịch vụ thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // Lấy doanh thu cho dịch vụ cụ thể trong một khoảng thời gian
    @GetMapping("/revenueByService")
    public BigDecimal getRevenueByService(@RequestParam Integer serviceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return appointmentService.getRevenueByServiceForPeriod(serviceId, startDate, endDate);
    }

    // Lấy doanh thu cho tất cả dịch vụ trong một khoảng thời gian
    @GetMapping("/revenueByAllServices")
    public Map<String, BigDecimal> getRevenueByAllServices(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return appointmentService.getRevenueByAllServices(startDate, endDate);
    }

    // Endpoint tính doanh thu dịch vụ theo ngày
    @GetMapping("/services/day")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getRevenueForServicesByDay(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        Map<String, Map<String, BigDecimal>> revenue = revenueService.getRevenueForServicesByDay(startDate, endDate);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/services/month")
    public ResponseEntity<Map<String, Map<String, BigDecimal>>> getRevenueForServicesByMonth(
            @RequestParam("startMonth") String startMonth,
            @RequestParam("endMonth") String endMonth) {

        // Call service to get revenue for services by month
        Map<String, Map<String, BigDecimal>> revenue = revenueService.getRevenueForServicesByMonth(startMonth, endMonth);

        // Return the response
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/today")
    public List<Appointment> getAppointmentsToday() {
        return appointmentService.getAppointmentsToday();
    }

    // API lấy lịch hẹn hôm nay theo trạng thái (optional)
    @GetMapping("/today/status")
    public List<Appointment> getAppointmentsTodayByStatus(@RequestParam String status) {
        return appointmentService.getTodayAppointmentsByStatus(status);
    }

    @GetMapping("/today/count")
    public long getAppointmentsTodayCount() {
        return appointmentService.countAppointmentsToday();
    }

    //// ngày 25
    @PostMapping("/check-cancelled-users")
    public String disableUsersWithTooManyCancellations() {
        appointmentService.disableUsersWithTooManyCancellations();
        return "Checked and updated user statuses successfully!";
    }

    //// ngày 31
    @GetMapping("/total")
    public Map<String, Long> getTotalAppointments() {
        long total = appointmentService.countAppointments();
        return Map.of("totalAppointments", total);
    }

}
