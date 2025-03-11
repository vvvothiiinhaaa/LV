package com.example.Pet.Modal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "servicesteps")
public class ServiceStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stepID;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ServiceID", nullable = false)
    private Serviceforpet service;

    private int stepOrder;
    private String stepTitle;
    private String stepDescription;

    // Constructor, Getter, Setter
    /**
     * @return int return the stepID
     */
    public int getStepID() {
        return stepID;
    }

    /**
     * @param stepID the stepID to set
     */
    public void setStepID(int stepID) {
        this.stepID = stepID;
    }

    /**
     * @return Serviceforpet return the service
     */
    public Serviceforpet getService() {
        return service;
    }

    /**
     * @param service the service to set
     */
    public void setService(Serviceforpet service) {
        this.service = service;
    }

    /**
     * @return int return the stepOrder
     */
    public int getStepOrder() {
        return stepOrder;
    }

    /**
     * @param stepOrder the stepOrder to set
     */
    public void setStepOrder(int stepOrder) {
        this.stepOrder = stepOrder;
    }

    /**
     * @return String return the stepTitle
     */
    public String getStepTitle() {
        return stepTitle;
    }

    /**
     * @param stepTitle the stepTitle to set
     */
    public void setStepTitle(String stepTitle) {
        this.stepTitle = stepTitle;
    }

    /**
     * @return String return the stepDescription
     */
    public String getStepDescription() {
        return stepDescription;
    }

    /**
     * @param stepDescription the stepDescription to set
     */
    public void setStepDescription(String stepDescription) {
        this.stepDescription = stepDescription;
    }

}
