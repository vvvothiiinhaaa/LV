package com.example.Pet.DTO;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // Bắt buộc để Spring Boot có thể khởi tạo object từ JSON
public class ReviewUserDTO {

    private Integer reviewId;
    private String content;
    private int rating;
    private LocalDate reviewDate;
    private Long userId;
    private String username;
    private String url;

    public ReviewUserDTO(Integer reviewId, String content, int rating, LocalDate reviewDate, Long userId, String username, String url) {
        this.reviewId = reviewId;
        this.content = content;
        this.rating = rating;
        this.reviewDate = reviewDate;
        this.userId = userId;
        this.username = username;
        this.url = url;
    }

    // Getters & Setters
}
