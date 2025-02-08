// package com.example.Pet.Service;

// import com.example.Pet.Modal.Appointment;
// import com.example.Pet.Modal.Pet;
// import com.example.Pet.Modal.Serviceforpet;
// import com.example.Pet.Repository.AppointmentRepository;
// import com.example.Pet.Repository.PetRepository;
// import com.example.Pet.Repository.ServiceRepository;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.stream.Collectors;

// @org.springframework.stereotype.Service
// public class AppointmentService {

//     private final AppointmentRepository appointmentRepository;
//     private final PetRepository petRepository;
//     private final ServiceRepository serviceRepository;

//     // Danh sách khung giờ hợp lệ
//     private static final List<String> ALLOWED_SLOTS = List.of(
//             "09:00-10:30", "11:00-12:00", "12:30-14:00",
//             "14:00-15:30", "16:00-17:30", "18:00-19:30", "20:00-21:20"
//     );

//     public AppointmentService(AppointmentRepository appointmentRepository,
//             PetRepository petRepository,
//             ServiceRepository serviceRepository) {
//         this.appointmentRepository = appointmentRepository;
//         this.petRepository = petRepository;
//         this.serviceRepository = serviceRepository;
//     }

//     //  ĐẶT LỊCH HẸN
//     public Appointment createAppointment(Long userId, Integer petId, Integer serviceId, String slot) {

//         // Kiểm tra Pet
//         Pet pet = petRepository.findById(petId)
//                 .orElseThrow(() -> new RuntimeException("Pet not found"));

//         // Kiểm tra Service
//         Serviceforpet service = serviceRepository.findById(serviceId)
//                 .orElseThrow(() -> new RuntimeException("Service not found"));

//         // Kiểm tra khung giờ hợp lệ
//         if (!ALLOWED_SLOTS.contains(slot)) {
//             throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
//         }

//         // Chuyển đổi chuỗi slot thành thời gian LocalDateTime
//         String[] times = slot.split("-");
//         LocalDateTime startTime = LocalDateTime.now().withHour(Integer.parseInt(times[0].split(":")[0]))
//                 .withMinute(Integer.parseInt(times[0].split(":")[1])).withSecond(0);
//         LocalDateTime endTime = LocalDateTime.now().withHour(Integer.parseInt(times[1].split(":")[0]))
//                 .withMinute(Integer.parseInt(times[1].split(":")[1])).withSecond(0);

//         // Kiểm tra số lượng lịch hẹn trong khung giờ
//         long appointmentCount = appointmentRepository.countByStartTimeAndEndTime(startTime, endTime);
//         if (appointmentCount >= 20) {
//             throw new RuntimeException("This time slot is fully booked! Choose another slot.");
//         }

//         // Tạo lịch hẹn
//         Appointment appointment = new Appointment(userId, pet, service, startTime, endTime, "Scheduled");
//         return appointmentRepository.save(appointment);
//     }

//     //  HỦY LỊCH HẸN
//     public String cancelAppointment(Integer appointmentId) {
//         Appointment appointment = appointmentRepository.findById(appointmentId)
//                 .orElseThrow(() -> new RuntimeException("Appointment not found"));

//         // Kiểm tra nếu lịch hẹn đã bắt đầu
//         if (appointment.getStartTime().isBefore(LocalDateTime.now())) {
//             throw new RuntimeException("Cannot cancel an appointment that has already started or ended.");
//         }

//         // Cập nhật trạng thái thành "Canceled"
//         appointment.setStatus("Canceled");
//         appointmentRepository.save(appointment);

//         return "Appointment has been canceled successfully. The time slot is now available for booking.";
//     }

//     //  LẤY DANH SÁCH LỊCH HẸN CỦA NGƯỜI DÙNG
//     public List<Appointment> getAppointmentsByUserId(Long userId) {
//         return appointmentRepository.findAll().stream()
//                 .filter(a -> a.getUserId().equals(userId))
//                 .collect(Collectors.toList());
//     }

//     //  LẤY DANH SÁCH LỊCH HẸN THEO KHUNG GIỜ
//     public List<Appointment> getAppointmentsByTimeSlot(String slot) {
//         if (!ALLOWED_SLOTS.contains(slot)) {
//             throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
//         }

//         String[] times = slot.split("-");
//         LocalDateTime startTime = LocalDateTime.now().withHour(Integer.parseInt(times[0].split(":")[0]))
//                 .withMinute(Integer.parseInt(times[0].split(":")[1])).withSecond(0);
//         LocalDateTime endTime = LocalDateTime.now().withHour(Integer.parseInt(times[1].split(":")[0]))
//                 .withMinute(Integer.parseInt(times[1].split(":")[1])).withSecond(0);

//         return appointmentRepository.findAll().stream()
//                 .filter(a -> a.getStartTime().equals(startTime) && a.getEndTime().equals(endTime))
//                 .collect(Collectors.toList());
//     }
// }
