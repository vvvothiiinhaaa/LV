package com.example.Pet.DTO;

public class ServiceStepDTO {

    private Integer stepOrder;
    private String stepTitle;
    private String stepDescription;
    // Getter, Setter

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

    /**
     * @return Integer return the stepOrder
     */
    public Integer getStepOrder() {
        return stepOrder;
    }

    /**
     * @param stepOrder the stepOrder to set
     */
    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

}
