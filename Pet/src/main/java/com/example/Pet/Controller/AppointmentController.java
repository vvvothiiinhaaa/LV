// package com.example.Pet.Controller;

// import com.example.Pet.Modal.Appointment;
// import com.example.Pet.Service.AppointmentService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/appointments")
// public class AppointmentController {

//     private final AppointmentService appointmentService;

//     public AppointmentController(AppointmentService appointmentService) {
//         this.appointmentService = appointmentService;
//     }

//     // API ĐẶT LỊCH HẸN
//     @PostMapping("/book")
//     public ResponseEntity<Appointment> bookAppointment(
//             @RequestParam Long userId,
//             @RequestParam Integer petId,
//             @RequestParam Integer serviceId,
//             @RequestParam String slot) {

//         Appointment appointment = appointmentService.createAppointment(userId, petId, serviceId, slot);
//         return ResponseEntity.ok(appointment);
//     }

//     // API HỦY LỊCH HẸN
//     @DeleteMapping("/cancel/{appointmentId}")
//     public ResponseEntity<String> cancelAppointment(@PathVariable Integer appointmentId) {
//         String message = appointmentService.cancelAppointment(appointmentId);
//         return ResponseEntity.ok(message);
//     }

//     //  API LẤY DANH SÁCH LỊCH HẸN CỦA NGƯỜI DÙNG
//     @GetMapping("/user/{userId}")
//     public ResponseEntity<List<Appointment>> getAppointmentsByUser(@PathVariable Long userId) {
//         List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
//         return ResponseEntity.ok(appointments);
//     }

//     // API LẤY DANH SÁCH LỊCH HẸN THEO KHUNG GIỜ
//     @GetMapping("/time-slot")
//     public ResponseEntity<List<Appointment>> getAppointmentsByTimeSlot(@RequestParam String slot) {
//         List<Appointment> appointments = appointmentService.getAppointmentsByTimeSlot(slot);
//         return ResponseEntity.ok(appointments);
//     }
// }
