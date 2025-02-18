package com.example.Pet.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.Pet.Modal.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // @Query(value = "SELECT COUNT(*) FROM appointment WHERE start_time = :startTime AND end_time = :endTime AND app_date = :appDate", nativeQuery = true)
    // Long countByStartTimeAndEndTimeAndAppDate(@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime, @Param("appDate") LocalDate appDate);
    @Query(value = "SELECT COUNT(*) FROM appointment WHERE CONVERT(time, start_time) = CONVERT(time, :startTime) AND CONVERT(time, end_time) = CONVERT(time, :endTime) AND app_date = :appDate", nativeQuery = true)
    Long countByStartTimeAndEndTimeAndAppDate(@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime, @Param("appDate") LocalDate appDate);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM appointment_pets WHERE appointment_id = :appointmentId AND pet_id = :petId", nativeQuery = true)
    int existsPetInAppointment(@Param("appointmentId") Integer appointmentId, @Param("petId") Integer petId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM appointment_services WHERE appointment_id = :appointmentId AND service_id = :serviceId", nativeQuery = true)
    int existsServiceInAppointment(@Param("appointmentId") Integer appointmentId, @Param("serviceId") Integer serviceId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO appointment_pets (appointment_id, pet_id) VALUES (:appointmentId, :petId)", nativeQuery = true)
    void addPetToAppointment(@Param("appointmentId") Integer appointmentId, @Param("petId") Integer petId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO appointment_services (appointment_id, service_id) VALUES (:appointmentId, :serviceId)", nativeQuery = true)
    void addServiceToAppointment(@Param("appointmentId") Integer appointmentId, @Param("serviceId") Integer serviceId);
}
