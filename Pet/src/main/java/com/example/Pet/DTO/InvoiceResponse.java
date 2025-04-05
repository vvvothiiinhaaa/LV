package com.example.Pet.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class InvoiceResponse {

    private Long appointmentId;
    private String customerName;
    private String appointmentStatus;
    private LocalDateTime appointmentDate;
    private BigDecimal totalPrice;
    private List<ServiceDetail> services;

    // ==== GETTER & SETTER ====
    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<ServiceDetail> getServices() {
        return services;
    }

    public void setServices(List<ServiceDetail> services) {
        this.services = services;
    }

    // ==== INNER CLASS CHI TIẾT DỊCH VỤ ====
    public static class ServiceDetail {

        private String petName;
        private String petSize;
        private String serviceName;
        private BigDecimal price;

        // Getter & Setter
        public String getPetName() {
            return petName;
        }

        public void setPetName(String petName) {
            this.petName = petName;
        }

        public String getPetSize() {
            return petSize;
        }

        public void setPetSize(String petSize) {
            this.petSize = petSize;
        }

        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }
    }
}
