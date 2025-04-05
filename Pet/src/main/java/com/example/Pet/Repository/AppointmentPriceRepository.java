package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.AppointmentPrice;

@Repository
public interface AppointmentPriceRepository extends JpaRepository<AppointmentPrice, Long> {
}
