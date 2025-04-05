package com.example.Pet.Modal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_address_new")
public class OrderAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "province_city")
    private String provinceCity;

    @Column(name = "district")
    private String district;

    @Column(name = "ward_subdistrict")
    private String wardSubdistrict;

    @Column(name = "address_detail")
    private String addressDetail;

    // Getters và Setters
    /**
     * @return Integer return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
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

    /**
     * @return Integer return the userId
     */
    public Integer getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    /**
     * @return String return the recipientName
     */
    public String getRecipientName() {
        return recipientName;
    }

    /**
     * @param recipientName the recipientName to set
     */
    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    /**
     * @return String return the phoneNumber
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * @param phoneNumber the phoneNumber to set
     */
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    /**
     * @return String return the provinceCity
     */
    public String getProvinceCity() {
        return provinceCity;
    }

    /**
     * @param provinceCity the provinceCity to set
     */
    public void setProvinceCity(String provinceCity) {
        this.provinceCity = provinceCity;
    }

    /**
     * @return String return the district
     */
    public String getDistrict() {
        return district;
    }

    /**
     * @param district the district to set
     */
    public void setDistrict(String district) {
        this.district = district;
    }

    /**
     * @return String return the wardSubdistrict
     */
    public String getWardSubdistrict() {
        return wardSubdistrict;
    }

    /**
     * @param wardSubdistrict the wardSubdistrict to set
     */
    public void setWardSubdistrict(String wardSubdistrict) {
        this.wardSubdistrict = wardSubdistrict;
    }

    /**
     * @return String return the addressDetail
     */
    public String getAddressDetail() {
        return addressDetail;
    }

    /**
     * @param addressDetail the addressDetail to set
     */
    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

}
