package com.example.Pet.Modal;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "service")
public class Serviceforpet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer duration; // Thời gian dịch vụ (phút)

    @Column(nullable = false)
    private String url;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ServiceStep> steps;

    @OneToMany(mappedBy = "serviceforpet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ServicePrice> prices;

    // Constructors
    public Serviceforpet() {
    }

    public Serviceforpet(String name, String description, Integer duration, String url) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.url = url;
    }

    // Getters & Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    /**
     * @return String return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * @param url the url to set
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * @return List<ServiceStep> return the steps
     */
    public Set<ServiceStep> getSteps() {
        return steps;
    }

    /**
     * @param steps the steps to set
     */
    public void setSteps(Set<ServiceStep> steps) {
        this.steps = steps;
    }

    /**
     * @return List<ServicePrice> return the prices
     */
    public Set<ServicePrice> getPrices() {
        return prices;
    }

    /**
     * @param prices the prices to set
     */
    public void setPrices(Set<ServicePrice> prices) {
        this.prices = prices;
    }

}
