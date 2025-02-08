package com.example.Pet.Repository;

import com.example.Pet.Modal.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // Đếm số lượng lịch hẹn trong một khung giờ
    long countByStartTimeAndEndTime(LocalDateTime startTime, LocalDateTime endTime);
}
