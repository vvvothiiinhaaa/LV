package com.example.Pet.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

//     @Transactional
//     public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
//         // Kiểm tra danh sách thú cưng
//         Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
//         if (pets.isEmpty() || pets.size() != petIds.size()) {
//             throw new RuntimeException("Some pets not found");
//         }
//         // Kiểm tra danh sách dịch vụ
//         Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
//         if (services.isEmpty() || services.size() != serviceIds.size()) {
//             throw new RuntimeException("Some services not found");
//         }
//         // **Chuyển đổi `timeSlot` thành `LocalTime` (chỉ lưu giờ và phút)**
//         String[] times = timeSlot.split("-");
//         LocalTime startTime = LocalTime.parse(times[0]);
//         LocalTime endTime = LocalTime.parse(times[1]);
//         // Kiểm tra số lượng lịch hẹn trong khung giờ đó
//         Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
//         if (appointmentCount >= 4) {
//             throw new RuntimeException("This time slot is fully booked! Choose another slot.");
//         }
//         // Tạo lịch hẹn
//         Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");
//         appointment = appointmentRepository.save(appointment);
//         // **Thêm dữ liệu vào bảng trung gian**
//         for (Pet pet : pets) {
//             if (appointmentRepository.existsPetInAppointment(appointment.getId(), pet.getId()) == 0) {
//                 appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
//             }
//         }
//         for (Serviceforpet service : services) {
//             if (appointmentRepository.existsServiceInAppointment(appointment.getId(), service.getId()) == 0) {
//                 appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
//             }
//         }
//         return appointment;
//     }
// }
    @Transactional
    public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
        // Kiểm tra danh sách thú cưng
        Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
        if (pets.isEmpty() || pets.size() != petIds.size()) {
            throw new RuntimeException("Some pets not found");
        }

        // Kiểm tra danh sách dịch vụ
        Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
        if (services.isEmpty() || services.size() != serviceIds.size()) {
            throw new RuntimeException("Some services not found");
        }

        // **Chuyển đổi `timeSlot` thành `LocalTime` (chỉ lưu giờ và phút)**
        String[] times = timeSlot.split("-");
        LocalTime startTime = LocalTime.parse(times[0].trim()); // Trim to avoid leading/trailing spaces
        LocalTime endTime = LocalTime.parse(times[1].trim());   // Trim to avoid leading/trailing spaces

        // Kiểm tra số lượng lịch hẹn trong khung giờ đó của ngày hôm nay
        Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
        if (appointmentCount >= 4) {
            throw new RuntimeException("Vui Lòng Chọn Thời Gian Khác!!!!!");
        }

        // Tạo lịch hẹn
        Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");

        // Lưu lịch hẹn vào cơ sở dữ liệu
        appointment = appointmentRepository.save(appointment);

        // **Thêm dữ liệu vào bảng trung gian giữa appointment và pets**
        addPetsToAppointment(appointment, pets);

        // **Thêm dữ liệu vào bảng trung gian giữa appointment và services**
        addServicesToAppointment(appointment, services);

        return appointment;
    }

// Thêm thú cưng vào lịch hẹn
    private void addPetsToAppointment(Appointment appointment, Set<Pet> pets) {
        for (Pet pet : pets) {
            if (appointmentRepository.existsPetInAppointment(appointment.getId(), pet.getId()) == 0) {
                appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
            }
        }
    }

// Thêm dịch vụ vào lịch hẹn
    private void addServicesToAppointment(Appointment appointment, Set<Serviceforpet> services) {
        for (Serviceforpet service : services) {
            if (appointmentRepository.existsServiceInAppointment(appointment.getId(), service.getId()) == 0) {
                appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
            }
        }
    }
    //  Hủy lịch hẹn

    // public String cancelAppointment(Integer appointmentId) {
    //     Appointment appointment = appointmentRepository.findById(appointmentId)
    //             .orElseThrow(() -> new RuntimeException("Appointment not found"));
    //     // Kiểm tra nếu lịch hẹn đã bắt đầu
    //     if (appointment.getStartTime().isBefore(LocalTime.now())) {
    //         throw new RuntimeException("Cannot cancel an appointment that has already started or ended.");
    //     }
    //     // Cập nhật trạng thái thành "Canceled"
    //     appointment.setStatus("Canceled");
    //     appointmentRepository.save(appointment);
    //     return "Appointment has been canceled successfully. The time slot is now available for booking.";
    // }
    public String cancelAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        LocalDate today = LocalDate.now(); // Ngày hiện tại
        LocalTime nowTime = LocalTime.now(); // Giờ hiện tại
        LocalDateTime now = LocalDateTime.of(today, nowTime); // Thời điểm hiện tại

        // Lấy ngày và giờ bắt đầu của lịch hẹn
        LocalDate appointmentDate = appointment.getAppDate();
        LocalTime appointmentStartTime = appointment.getStartTime();
        LocalDateTime appointmentDateTime = LocalDateTime.of(appointmentDate, appointmentStartTime);

        // Kiểm tra nếu lịch hẹn thuộc về quá khứ
        if (appointmentDate.isBefore(today)) {
            throw new IllegalStateException("Cannot cancel past appointments.");
        }

        // Nếu lịch hẹn là hôm nay, kiểm tra thời gian bắt đầu
        if (appointmentDate.equals(today) && appointmentDateTime.isBefore(now.plusMinutes(15))) {
            throw new IllegalStateException("Cannot cancel an appointment that has already started or is too close to start time.");
        }

        // Nếu lịch hẹn ở tương lai hoặc thỏa điều kiện -> Cho phép hủy
        appointment.setStatus("Đã hủy lịch");
        appointmentRepository.save(appointment);

        return "Appointment has been canceled successfully. The time slot is now available for booking.";
    }

    // Lấy danh sách lịch hẹn của người dùng
    public List<Appointment> getAppointmentsByUserId(Long userId) {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    // lấy tất cả lịch hẹn của khách hàng ( dành cho staff)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Lấy danh sách lịch hẹn theo khung giờ và ngày
    public List<Appointment> getAppointmentsByTimeSlot(String slot, LocalDate appDate) {
        Stream<Appointment> appointments = appointmentRepository.findAll().stream();

        // Nếu có slot, lọc theo khung giờ
        if (slot != null && !slot.isEmpty()) {
            if (!ALLOWED_SLOTS.contains(slot)) {
                throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
            }
            String[] times = slot.split("-");
            LocalTime startTime = LocalTime.of(Integer.parseInt(times[0].split(":")[0]), Integer.parseInt(times[0].split(":")[1]));
            LocalTime endTime = LocalTime.of(Integer.parseInt(times[1].split(":")[0]), Integer.parseInt(times[1].split(":")[1]));

            appointments = appointments.filter(a -> a.getStartTime().equals(startTime) && a.getEndTime().equals(endTime));
        }

        // Nếu có appDate, lọc theo ngày
        if (appDate != null) {
            appointments = appointments.filter(a -> a.getAppDate().equals(appDate));
        }

        return appointments.collect(Collectors.toList());
    }

    // lọc theoo trạng thái
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    //// lấy chi tiết lịch hẹn
    public Appointment getAppointmentById(Integer id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.orElse(null);
    }

    public List<Appointment> getAppointmentsByStatus(Long userId, String status) {
        return appointmentRepository.findAll().stream()
                .filter(app -> (userId == null || app.getUserId().equals(userId))) // Lọc theo user
                .filter(app -> (status == null || app.getStatus().equalsIgnoreCase(status))) // Lọc theo trạng thái
                .collect(Collectors.toList());
    }

    public List<Appointment> getAppointmentsByTimeSlot(Long userId, String slot, LocalDate appDate) {
        Stream<Appointment> appointments = appointmentRepository.findAll().stream();

        // Lọc theo userId (nếu có)
        if (userId != null) {
            appointments = appointments.filter(a -> a.getUserId().equals(userId));
        }

        // Lọc theo khung giờ (nếu có)
        if (slot != null && !slot.isEmpty()) {
            if (!ALLOWED_SLOTS.contains(slot)) {
                throw new RuntimeException("Invalid time slot! Choose from: " + ALLOWED_SLOTS);
            }
            String[] times = slot.split("-");
            LocalTime startTime = LocalTime.parse(times[0]);
            LocalTime endTime = LocalTime.parse(times[1]);

            appointments = appointments.filter(a -> a.getStartTime().equals(startTime) && a.getEndTime().equals(endTime));
        }

        // Lọc theo ngày (nếu có)
        if (appDate != null) {
            appointments = appointments.filter(a -> a.getAppDate().equals(appDate));
        }

        return appointments.collect(Collectors.toList());
    }

    /// lấy chi tiết các lịch hẹn của người dùng

    public List<Appointment> getAppointmentsByPetId(Integer petId) {
        return appointmentRepository.findByPets_Id(petId);
    }

}

//
///////////////// kiểm tra trùng lịch hẹn
/// @Transactional
// public Appointment createAppointment(Long userId, Set<Integer> petIds, Set<Integer> serviceIds, String timeSlot, LocalDate appDate) {
//     // Kiểm tra danh sách thú cưng
//     Set<Pet> pets = petRepository.findAllById(petIds).stream().collect(Collectors.toSet());
//     if (pets.isEmpty() || pets.size() != petIds.size()) {
//         throw new RuntimeException("Some pets not found");
//     }

//     // Kiểm tra danh sách dịch vụ
//     Set<Serviceforpet> services = serviceRepository.findAllById(serviceIds).stream().collect(Collectors.toSet());
//     if (services.isEmpty() || services.size() != serviceIds.size()) {
//         throw new RuntimeException("Some services not found");
//     }

//     // Chuyển đổi chuỗi slot thành thời gian
//     String[] times = timeSlot.split("-");
//     LocalTime startTime = LocalTime.parse(times[0]);
//     LocalTime endTime = LocalTime.parse(times[1]);

//     // **Kiểm tra trùng lặp lịch hẹn**
//     Long duplicateCount = appointmentRepository.countDuplicateAppointments(userId, petIds, serviceIds, startTime, endTime, appDate);
//     if (duplicateCount > 0) {
//         throw new RuntimeException("Duplicate appointment detected! This pet and service already have a booking at this time.");
//     }

//     // Kiểm tra số lượng lịch hẹn trong khung giờ đó
//     Long appointmentCount = appointmentRepository.countByStartTimeAndEndTimeAndAppDate(startTime, endTime, appDate);
//     if (appointmentCount >= 4) {
//         throw new RuntimeException("This time slot is fully booked! Choose another slot.");
//     }

//     // Tạo lịch hẹn
//     Appointment appointment = new Appointment(userId, pets, services, startTime, endTime, appDate, "Đã đặt lịch");
//     appointment = appointmentRepository.save(appointment);

//     // **Thêm dữ liệu vào bảng trung gian**
//     for (Pet pet : pets) {
//         if (appointmentRepository.existsPetInAppointment(appointment.getId(), pet.getId()) == 0) {
//             appointmentRepository.addPetToAppointment(appointment.getId(), pet.getId());
//         }
//     }

//     for (Serviceforpet service : services) {
//         if (appointmentRepository.existsServiceInAppointment(appointment.getId(), service.getId()) == 0) {
//             appointmentRepository.addServiceToAppointment(appointment.getId(), service.getId());
//         }
//     }

//     return appointment;
// }
