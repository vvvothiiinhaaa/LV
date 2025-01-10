package com.example.Pet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Pet.Modal.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findByUserId(Long userId);

    Optional<Cart> findByUser_Id(Long userId);

    // Truy vấn để tìm Cart dựa trên id_user
    @Query("SELECT c.id FROM Cart c WHERE c.user.id = :userId")
    Long findCartIdByUserId(Long userId);
}
