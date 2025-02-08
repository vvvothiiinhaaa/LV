package com.example.Pet.Repository;

import com.example.Pet.Modal.PetSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetSizeRepository extends JpaRepository<PetSize, Integer> {

    //  Tìm kiếm kích thước thú cưng theo tên
    Optional<PetSize> findBySizeName(String sizeName);
}
