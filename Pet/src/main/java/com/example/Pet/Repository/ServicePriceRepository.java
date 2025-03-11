package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.Serviceforpet;

@Repository
public interface ServicePriceRepository extends JpaRepository<ServicePrice, Integer> {

    //  Lấy danh sách giá dịch vụ theo Service ID
    List<ServicePrice> findByServiceforpetId(Integer serviceId);

    //  Tìm giá dịch vụ theo Service ID và PetSize ID
    Optional<ServicePrice> findByServiceforpetIdAndPetSizeId(Integer serviceId, Integer petSizeId);

    void deleteByServiceforpet(Serviceforpet service);
}
