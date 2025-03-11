package com.example.Pet.DTO;

import java.math.BigDecimal;

public class ServicePriceDTO {

    private int petSizeId;
    private BigDecimal price;
    // Getter, Setter

    /**
     * @return int return the petSizeId
     */
    public int getPetSizeId() {
        return petSizeId;
    }

    /**
     * @param petSizeId the petSizeId to set
     */
    public void setPetSizeId(int petSizeId) {
        this.petSizeId = petSizeId;
    }

    /**
     * @return BigDecimal return the price
     */
    public BigDecimal getPrice() {
        return price;
    }

    /**
     * @param price the price to set
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

}
