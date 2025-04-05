package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.UserWarningLog;

@Repository
public interface UserWarningLogRepository extends JpaRepository<UserWarningLog, Long> {

    List<UserWarningLog> findByUserId(Long userId);

    boolean existsByUserIdAndReason(Long userId, String reason);
}
