package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Serviceforpet;

@Repository
public interface ServiceforpetRepository extends JpaRepository<Serviceforpet, Integer> {

    @Query("SELECT s FROM Serviceforpet s LEFT JOIN FETCH s.steps LEFT JOIN FETCH s.prices")
    List<Serviceforpet> findAllWithDetails();

    ////////////////// sử dụng cho chat gpt truy vấn 
    List<Serviceforpet> findByNameContainingIgnoreCase(String name);
}
