package com.example.Pet.Modal;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_price")
public class ProductPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @ManyToOne
    // @JoinColumn(name = "product_id", nullable = false)
    // private Product productId;
    @Column(nullable = false)
    private Double price;

    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // Đây là liên kết với bảng Product

    public void setProduct(Product product) {
        this.product = product;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public LocalDateTime getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    // /**
    //  * @return Product return the productId
    //  */
    // public Product getProductId() {
    //     return productId;
    // }
    // /**
    //  * @param productId the productId to set
    //  */
    // public void setProductId(Product productId) {
    //     this.productId = productId;
    // }
}
