package com.example.Pet.Repository;

import com.example.Pet.Modal.Serviceforpet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceforpetRepository extends JpaRepository<Serviceforpet, Integer> {
}
