package com.example.Pet.Modal;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_warning_log")
public class UserWarningLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String reason;  // Ví dụ: "Hủy 3 đơn hàng"

    private LocalDateTime warningTime;

    public UserWarningLog() {
    }

    public UserWarningLog(Long userId, String reason) {
        this.userId = userId;
        this.reason = reason;
        this.warningTime = LocalDateTime.now();
    }

    // Getter & Setter
    /**
     * @return Long return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return Long return the userId
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * @return LocalDateTime return the warningTime
     */
    public LocalDateTime getWarningTime() {
        return warningTime;
    }

    /**
     * @param warningTime the warningTime to set
     */
    public void setWarningTime(LocalDateTime warningTime) {
        this.warningTime = warningTime;
    }

}
