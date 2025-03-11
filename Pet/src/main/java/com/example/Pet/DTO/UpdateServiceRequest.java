package com.example.Pet.DTO;

import java.util.List;

public class UpdateServiceRequest {

    private List<ServiceStepDTO> steps;
    private List<ServicePriceDTO> prices;

    // Getter & Setter
    public List<ServiceStepDTO> getSteps() {
        return steps;
    }

    public void setSteps(List<ServiceStepDTO> steps) {
        this.steps = steps;
    }

    public List<ServicePriceDTO> getPrices() {
        return prices;
    }

    public void setPrices(List<ServicePriceDTO> prices) {
        this.prices = prices;
    }
}
