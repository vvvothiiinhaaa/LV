package com.example.Pet.Modal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "province_city", nullable = false, length = 100)
    private String provinceCity;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "ward_subdistrict", nullable = false, length = 100)
    private String wardSubdistrict;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "default_address")
    private boolean defaultAddress;

    // Getters and Setters
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

    /**
     * @return boolean return the defaultAddress
     */
    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    /**
     * @param defaultAddress the defaultAddress to set
     */
    public void setDefaultAddress(boolean defaultAddress) {
        this.defaultAddress = defaultAddress;
    }

}
