package com.example.Pet.Modal;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "service_price")
@Getter
@Setter
@NoArgsConstructor

public class ServicePrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Serviceforpet serviceforpet;

    @ManyToOne
    @JoinColumn(name = "pet_size_id", nullable = false)
    private PetSize petSize;

    @Column(nullable = false)
    private BigDecimal price;

    public ServicePrice(Integer id, Serviceforpet serviceforpet, PetSize petSize, BigDecimal price) {
        this.id = id;
        this.serviceforpet = serviceforpet;
        this.petSize = petSize;
        this.price = price;
    }

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
     * @return Serviceforpet return the serviceforpet
     */
    public Serviceforpet getServiceforpet() {
        return serviceforpet;
    }

    /**
     * @param serviceforpet the serviceforpet to set
     */
    public void setServiceforpet(Serviceforpet serviceforpet) {
        this.serviceforpet = serviceforpet;
    }

    /**
     * @return PetSize return the petSize
     */
    public PetSize getPetSize() {
        return petSize;
    }

    /**
     * @param petSize the petSize to set
     */
    public void setPetSize(PetSize petSize) {
        this.petSize = petSize;
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
