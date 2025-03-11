package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.ServiceStep;
import com.example.Pet.Modal.Serviceforpet;

@Repository
public interface ServiceStepRepository extends JpaRepository<ServiceStep, Integer> {

    void deleteByService(Serviceforpet service);
}
