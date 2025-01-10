package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    // câpj nhật địa chỉ
    Optional<Address> findByUserIdAndId(Long userId, Long Id);
}
