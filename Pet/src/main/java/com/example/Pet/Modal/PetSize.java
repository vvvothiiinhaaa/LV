package com.example.Pet.Modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet_size")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PetSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String sizeName;

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
     * @return String return the sizeName
     */
    public String getSizeName() {
        return sizeName;
    }

    /**
     * @param sizeName the sizeName to set
     */
    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

}
