package com.example.Pet.DTO;

import java.time.LocalDate;

public class reviewDTO {

    private Integer orderItemId;
    private Integer orderId;
    private Long userId;
    private String content;
    private int rating;
    private LocalDate reviewDate;

    // Constructor mặc định
    public reviewDTO() {
    }

    // Constructor có tham số
    public reviewDTO(Integer orderItemId, Integer orderId, Long userId, String content, int rating, LocalDate reviewDate) {
        this.orderItemId = orderItemId;
        this.userId = userId;
        this.orderId = orderId;
        this.content = content;
        this.rating = rating;
        this.reviewDate = reviewDate;
    }

    // Getter và Setter
    public Integer getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Integer orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    /**
     * @return Integer return the orderId
     */
    public Integer getOrderId() {
        return orderId;
    }

    /**
     * @param orderId the orderId to set
     */
    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

}
