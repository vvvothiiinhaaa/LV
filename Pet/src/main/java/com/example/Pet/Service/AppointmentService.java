// package com.example.Pet.Service;
// // import java.time.LocalDate;
// // import java.time.LocalTime;
// // import java.util.List;
// // import java.util.Set;
// // import java.util.stream.Collectors;
// // import org.springframework.stereotype.Service;
// // import com.example.Pet.Modal.Appointment;
// // import com.example.Pet.Modal.Pet;
// // import com.example.Pet.Modal.Serviceforpet;
// // import com.example.Pet.Repository.AppointmentRepository;
// // import com.example.Pet.Repository.PetRepository;
// // import com.example.Pet.Repository.ServiceforpetRepository;
// // import jakarta.transaction.Transactional;
// // @Service
// // public class AppointmentService {
// //     private final AppointmentRepository appointmentRepository;
// //     private final PetRepository petRepository;
// //     private final ServiceforpetRepository serviceRepository;
// //     // Danh sách khung giờ hợp lệ
// //     private static final List<String> ALLOWED_SLOTS = List.of(
// //             "09:00-10:30", "11:00-12:00", "12:30-14:00",
// //             "14:00-15:30", "16:00-17:30", "18:00-19:30", "20:00-21:20"
// //     );
// //     public AppointmentService(AppointmentRepository appointmentRepository,
// //             PetRepository petRepository,
// //             ServiceforpetRepository serviceRepository) {
// //         this.appointmentRepository = appointmentRepository;
// //         this.petRepository = petRepository;
// //         this.serviceRepository = serviceRepository;
// //     }
// //     //  ĐẶT LỊCH HẸN
// //     // public Appointment createAppointment(Long userId, Integer petId, Integer serviceId, String slot) {
// //     //     // Kiểm tra Pet
// //     //     Pet pet = petRepository.findById(petId)
// //     //             .orElseThrow(() -> new RuntimeException("Pet not found"));
// //     //     // Kiểm tra Service
// //     //     Serviceforpet service = serviceRepository.findById(serviceId)
// //     //             .orElseThrow(() -> new RuntimeException("Service not found"));
// //     //     // Kiểm tra khung giờ hợp lệ
// //     //     if (!ALLOWED_SLOTS.contains(slot)) {
// //     //         throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
// //     //     }
// //     //     // Chuyển đổi chuỗi slot thành thời gian LocalDateTime
// //     //     String[] times = slot.split("-");
// //     //     LocalDateTime startTime = LocalDateTime.now().withHour(Integer.parseInt(times[0].split(":")[0]))
// //     //             .withMinute(Integer.parseInt(times[0].split(":")[1])).withSecond(0);
// //     //     LocalDateTime endTime = LocalDateTime.now().withHour(Integer.parseInt(times[1].split(":")[0]))
// //     //             .withMinute(Integer.parseInt(times[1].split(":")[1])).withSecond(0);
// //     //     // Kiểm tra số lượng lịch hẹn trong khung giờ
// //     //     long appointmentCount = appointmentRepository.countByStartTimeAndEndTime(startTime, endTime);
// //     //     if (appointmentCount >= 4) {
// //     //         throw new RuntimeException("This time slot is fully booked! Choose another slot.");
// //     //     }
// //     //     // Tạo lịch hẹn
// //     //     Appointment appointment = new Appointment(userId, pet, service, startTime, endTime,"Scheduled");
// //     //     return appointmentRepository.save(appointment);
// //     // }
// //     //////////////////////////////////////////////
// //     @Transactional
// //     public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
// //         // Kiểm tra danh sách thú cưng
// //         Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
// //         if (pets.isEmpty() || pets.size() != petIds.size()) {
// //             throw new RuntimeException("Some pets not found");
// //         }
// //         // Kiểm tra danh sách dịch vụ
// //         Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
// //         if (services.isEmpty() || services.size() != serviceIds.size()) {
// //             throw new RuntimeException("Some services not found");
// //         }
// //         // Chuyển đổi thời gian từ `timeSlot`
// //         String[] times = timeSlot.split("-");
// //         LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
// //         LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));
// //         // Kiểm tra số lượng lịch hẹn đã tồn tại trong khung giờ/ngày
// //         Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
// //         if (appointmentCount >= 4) {
// //             throw new RuntimeException("This time slot is fully booked! Choose another slot.");
// //         }
// //         // Tạo lịch hẹn chính
// //         Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");
// //         appointment = appointmentRepository.save(appointment); // Lưu vào DB để có ID
// //         // Thêm dữ liệu vào bảng trung gian `appointment_pets`
// //         for (Pet pet : pets) {
// //             appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
// //         }
// //         // Thêm dữ liệu vào bảng trung gian `appointment_services`
// //         for (Serviceforpet service : services) {
// //             appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
// //         }
// //         return appointment;
// //     }
// //     //////////////////////////////////////////////////////////////
// //     //  HỦY LỊCH HẸN
// //     public String cancelAppointment(Integer appointmentId) {
// //         Appointment appointment = appointmentRepository.findById(appointmentId)
// //                 .orElseThrow(() -> new RuntimeException("Appointment not found"));
// //         // Kiểm tra nếu lịch hẹn đã bắt đầu
// //         if (appointment.getStartTime().isBefore(LocalTime.now())) {
// //             throw new RuntimeException("Cannot cancel an appointment that has already started or ended.");
// //         }
// //         // Cập nhật trạng thái thành "Canceled"
// //         appointment.setStatus("Canceled");
// //         appointmentRepository.save(appointment);
// //         return "Appointment has been canceled successfully. The time slot is now available for booking.";
// //     }
// //     //  LẤY DANH SÁCH LỊCH HẸN CỦA NGƯỜI DÙNG
// //     public List<Appointment> getAppointmentsByUserId(Long userId) {
// //         return appointmentRepository.findAll().stream()
// //                 .filter(a -> a.getUserId().equals(userId))
// //                 .collect(Collectors.toList());
// //     }
// //     //  LẤY DANH SÁCH LỊCH HẸN THEO KHUNG GIỜ
// //     public List<Appointment> getAppointmentsByTimeSlot(String slot, LocalDate appDate) {
// //         if (!ALLOWED_SLOTS.contains(slot)) {
// //             throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
// //         }
// //         String[] times = slot.split("-");
// //         LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
// //         LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));
// //         return appointmentRepository.findAll().stream()
// //                 .filter(a -> a.getStartTime().equals(startTime) && a.getEndTime().equals(endTime) && a.getAppDate().equals(appDate))
// //                 .collect(Collectors.toList());
// //     }
// // }
// import java.time.LocalDate;
// import java.time.LocalTime;
// import java.util.List;
// import java.util.Set;
// import java.util.stream.Collectors;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import com.example.Pet.Modal.Appointment;
// import com.example.Pet.Modal.Pet;
// import com.example.Pet.Modal.Serviceforpet;
// import com.example.Pet.Repository.AppointmentRepository;
// import com.example.Pet.Repository.PetRepository;
// import com.example.Pet.Repository.ServiceforpetRepository;
// @Service
// public class AppointmentService {
//     private final AppointmentRepository appointmentRepository;
//     private final PetRepository petRepository;
//     private final ServiceforpetRepository serviceRepository;
//     private static final List<String> ALLOWED_SLOTS = List.of(
//             "09:00-10:30", "11:00-12:00", "12:30-14:00",
//             "14:00-15:30", "16:00-17:30", "18:00-19:30", "20:00-21:20"
//     );
//     public AppointmentService(AppointmentRepository appointmentRepository,
//             PetRepository petRepository,
//             ServiceforpetRepository serviceRepository) {
//         this.appointmentRepository = appointmentRepository;
//         this.petRepository = petRepository;
//         this.serviceRepository = serviceRepository;
//     }
//     @Transactional
//     public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
//         // Xử lý trường hợp nếu chỉ có 1 pet hoặc 1 service
//         Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
//         if (pets.isEmpty() || pets.size() != petIds.size()) {
//             throw new RuntimeException("Some pets not found");
//         }
//         Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
//         if (services.isEmpty() || services.size() != serviceIds.size()) {
//             throw new RuntimeException("Some services not found");
//         }
//         // Chuyển đổi chuỗi slot thành thời gian
//         String[] times = timeSlot.split("-");
//         LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
//         LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));
//         // Kiểm tra số lượng lịch hẹn trong khung giờ đó
//         Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
//         if (appointmentCount >= 4) {
//             throw new RuntimeException("This time slot is fully booked! Choose another slot.");
//         }
//         // Tạo lịch hẹn chính
//         Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");
//         appointment = appointmentRepository.save(appointment);
//         // **Thêm dữ liệu vào bảng trung gian**
//         for (Pet pet : pets) {
//             if (!appointmentRepository.existsPetInAppointment(appointment.getId(), pet.getId())) {
//                 appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
//             }
//         }
//         for (Serviceforpet service : services) {
//             if (!appointmentRepository.existsServiceInAppointment(appointment.getId(), service.getId())) {
//                 appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
//             }
//         }
//         return appointment;
//     }
// }
package com.example.Pet.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Pet.Modal.Appointment;
import com.example.Pet.Modal.Pet;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.PetRepository;
import com.example.Pet.Repository.ServiceforpetRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;
    private final ServiceforpetRepository serviceRepository;

    private static final List<String> ALLOWED_SLOTS = List.of(
            "09:00-10:30", "11:00-12:00", "12:30-14:00",
            "14:00-15:30", "16:00-17:30", "18:00-19:30", "20:00-21:20"
    );

    public AppointmentService(AppointmentRepository appointmentRepository,
            PetRepository petRepository,
            ServiceforpetRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.petRepository = petRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
        // Kiểm tra xem danh sách thú cưng có hợp lệ không
        Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
        if (pets.isEmpty() || pets.size() != petIds.size()) {
            throw new RuntimeException("Some pets not found");
        }

        // Kiểm tra xem danh sách dịch vụ có hợp lệ không
        Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
        if (services.isEmpty() || services.size() != serviceIds.size()) {
            throw new RuntimeException("Some services not found");
        }

        // Chuyển đổi chuỗi slot thành thời gian
        String[] times = timeSlot.split("-");
        LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
        LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));

        // Kiểm tra số lượng lịch hẹn trong khung giờ đó
        Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
        if (appointmentCount >= 4) {
            throw new RuntimeException("This time slot is fully booked! Choose another slot.");
        }

        // Tạo lịch hẹn chính
        Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");
        appointment = appointmentRepository.save(appointment);

        // **Thêm dữ liệu vào bảng trung gian**
        for (Pet pet : pets) {
            if (appointmentRepository.existsPetInAppointment(appointment.getId(), pet.getId()) == 0) {
                appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
            }
        }

        for (Serviceforpet service : services) {
            if (appointmentRepository.existsServiceInAppointment(appointment.getId(), service.getId()) == 0) {
                appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
            }
        }

        return appointment;
    }

    // Hủy lịch hẹn
    public String cancelAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Kiểm tra nếu lịch hẹn đã bắt đầu
        if (appointment.getStartTime().isBefore(LocalTime.now())) {
            throw new RuntimeException("Cannot cancel an appointment that has already started or ended.");
        }

        // Cập nhật trạng thái thành "Canceled"
        appointment.setStatus("Canceled");
        appointmentRepository.save(appointment);

        return "Appointment has been canceled successfully. The time slot is now available for booking.";
    }

    // Lấy danh sách lịch hẹn của người dùng
    public List<Appointment> getAppointmentsByUserId(Long userId) {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    // Lấy danh sách lịch hẹn theo khung giờ và ngày
    public List<Appointment> getAppointmentsByTimeSlot(String slot, LocalDate appDate) {
        if (!ALLOWED_SLOTS.contains(slot)) {
            throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
        }

        String[] times = slot.split("-");
        LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
        LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));

        return appointmentRepository.findAll().stream()
                .filter(a -> a.getStartTime().equals(startTime) && a.getEndTime().equals(endTime) && a.getAppDate().equals(appDate))
                .collect(Collectors.toList());
    }
}
