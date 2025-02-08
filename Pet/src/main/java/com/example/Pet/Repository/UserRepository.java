package com.example.Pet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);

    User findByRole(String role);

    // Tìm User theo ID
    Optional<User> findById(Integer id);
}
