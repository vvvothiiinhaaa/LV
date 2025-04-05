package com.example.Pet.DTO;

import java.time.LocalDate;

public class UserWarningDTO {

    private Long userId;
    private String username;
    private String passwords;
    private String email;
    private LocalDate birthday;
    private String phonenumber;
    private String gender;
    private Long orderCancelCount;
    private Long appointmentCancelCount;
    private String warningMessage;

    // Constructor không tham số
    public UserWarningDTO() {
    }

// Constructor đầy đủ tham số
    public UserWarningDTO(Long userId, String username, String passwords, String email,
            LocalDate birthday, String phonenumber, String gender,
            Long orderCancelCount, Long appointmentCancelCount,
            String warningMessage) {
        this.userId = userId;
        this.username = username;
        this.passwords = passwords;
        this.email = email;
        this.birthday = birthday;
        this.phonenumber = phonenumber;
        this.gender = gender;
        this.orderCancelCount = orderCancelCount;
        this.appointmentCancelCount = appointmentCancelCount;
        this.warningMessage = warningMessage;
    }

// Getters & Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswords() {
        return passwords;
    }

    public void setPasswords(String passwords) {
        this.passwords = passwords;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Long getOrderCancelCount() {
        return orderCancelCount;
    }

    public void setOrderCancelCount(Long orderCancelCount) {
        this.orderCancelCount = orderCancelCount;
    }

    public Long getAppointmentCancelCount() {
        return appointmentCancelCount;
    }

    public void setAppointmentCancelCount(Long appointmentCancelCount) {
        this.appointmentCancelCount = appointmentCancelCount;
    }

    public String getWarningMessage() {
        return warningMessage;
    }

    public void setWarningMessage(String warningMessage) {
        this.warningMessage = warningMessage;
    }
}
