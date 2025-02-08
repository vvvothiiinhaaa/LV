package com.example.Pet.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Appointment;
import com.example.Pet.Service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
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

    // // API HỦY LỊCH HẸN
    // @DeleteMapping("/cancel/{appointmentId}")
    // public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
    //     String message = appointmentService.cancelAppointment(appointmentId);
    //     return ResponseEntity.ok(message);
    // }
    // // API LẤY DANH SÁCH LỊCH HẸN CỦA NGƯỜI DÙNG
    // @GetMapping("/user/{userId}")
    // public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long userId) {
    //     List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
    //     return ResponseEntity.ok(appointments);
    // }
    // // API LẤY DANH SÁCH LỊCH HẸN THEO KHUNG GIỜ
    // @GetMapping("/time-slot")
    // public ResponseEntity<List<Appointment>> getAppointmentsByTimeSlot(@RequestParam String slot, @RequestParam String date) {
    //     LocalDate appDate = LocalDate.parse(date);
    //     List<Appointment> appointments = appointmentService.getAppointmentsByTimeSlot(slot, appDate);
    //     return ResponseEntity.ok(appointments);
    // }
}
