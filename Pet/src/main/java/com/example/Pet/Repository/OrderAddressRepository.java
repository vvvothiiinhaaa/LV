package com.example.Pet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.OrderAddress;

@Repository
public interface OrderAddressRepository extends JpaRepository<OrderAddress, Integer> {

    /// lấy địa chỉ của 1 đơn hàng
    Optional<OrderAddress> findByOrderId(Integer orderId);

}
