package com.example.Pet.DTO;

import org.springframework.web.multipart.MultipartFile;

public class ServiceDTO {

    private String name;
    private String description;
    private Integer duration;
    private MultipartFile file;
    private String steps;  // Dữ liệu JSON (sẽ chuyển thành List<ServiceStepDTO>)
    private String prices; // Dữ liệu JSON (sẽ chuyển thành List<ServicePriceDTO>)

    // Getter, Setter
    /**
     * @return String return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return String return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return Integer return the duration
     */
    public Integer getDuration() {
        return duration;
    }

    /**
     * @param duration the duration to set
     */
    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    /**
     * @return MultipartFile return the file
     */
    public MultipartFile getFile() {
        return file;
    }

    /**
     * @param file the file to set
     */
    public void setFile(MultipartFile file) {
        this.file = file;
    }

    /**
     * @return String return the description
     */
    public String getSteps() {
        return steps;
    }

    /**
     * @param description the description to set
     */
    public void setSteps(String steps) {
        this.steps = steps;
    }

    /**
     * @return String return the description
     */
    public String getPrices() {
        return prices;
    }

    /**
     * @param description the description to set
     */
    public void setPrices(String prices) {
        this.prices = prices;
    }

}
