package com.example.Pet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.PetSize;

@Repository
public interface PetSizeRepository extends JpaRepository<PetSize, Integer> {

    //  Tìm kiếm kích thước thú cưng theo tên
    Optional<PetSize> findBySizeName(String sizeName);

    Optional<PetSize> findByWeightMinLessThanEqualAndWeightMaxGreaterThanEqual(Float weightMin, Float weightMax);

    Optional<PetSize> findBySizeNameContainingIgnoreCaseAndWeightMinLessThanEqualAndWeightMaxGreaterThanEqual(
            String sizeName, Float weightMin, Float weightMax);
}
