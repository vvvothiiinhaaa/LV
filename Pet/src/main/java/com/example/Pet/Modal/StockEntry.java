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
@Table(name = "Stock_entry")
public class StockEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity; // Số lượng nhập

    @Column(name = "purchase_price", nullable = false)
    private Double purchasePrice; // Giá nhập

    // @Column(name = "supplier", nullable = false)
    // private String supplier; // Nhà cung cấp
    @Column(name = "entry_date", nullable = false)
    private LocalDateTime entryDate; // Ngày nhập hàng

    @Column(name = "remaining_quantity", nullable = false)
    private Integer remainingQuantity;

    public StockEntry() {
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // Getter cho productId
    public Long getProductId() {
        return this.product != null ? this.product.getId() : null;
    }

    public StockEntry(Product product, Integer quantity, Double purchasePrice, LocalDateTime entryDate) {
        this.product = product;
        this.quantity = quantity;
        this.remainingQuantity = quantity; // ban đầu bằng số lượng nhập
        this.purchasePrice = purchasePrice;
        this.entryDate = entryDate;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // public Product getProduct() {
    //     return product;
    // }
    // public void setProduct(Product product) {
    //     this.product = product;
    // }
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    // public String getSupplier() {
    //     return supplier;
    // }
    // public void setSupplier(String supplier) {
    //     this.supplier = supplier;
    // }
    public LocalDateTime getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDateTime entryDate) {
        this.entryDate = entryDate;
    }

    /**
     * @return Integer return the remainingQuantity
     */
    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    /**
     * @param remainingQuantity the remainingQuantity to set
     */
    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

}
