package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    List<Pet> findByUserId(Integer userId);

    Optional<Pet> findByIdAndUserId(Integer petId, Integer userId);  // Tìm pet theo ID và userId

}
