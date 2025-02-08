package com.example.Pet.Service;

import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Modal.PetSize;
import com.example.Pet.Repository.ServicePriceRepository;
import com.example.Pet.Repository.ServiceforpetRepository;
import com.example.Pet.Repository.PetSizeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ServicePriceService {

    private final ServicePriceRepository servicePriceRepository;
    private final ServiceforpetRepository serviceforpetRepository;
    private final PetSizeRepository petSizeRepository;

    public ServicePriceService(ServicePriceRepository servicePriceRepository,
            ServiceforpetRepository serviceforpetRepository,
            PetSizeRepository petSizeRepository) {
        this.servicePriceRepository = servicePriceRepository;
        this.serviceforpetRepository = serviceforpetRepository;
        this.petSizeRepository = petSizeRepository;
    }

    // Thêm giá dịch vụ theo kích thước thú cưng
    public ServicePrice addServicePrice(Integer serviceId, Integer petSizeId, BigDecimal price) {
        Serviceforpet serviceforpet = serviceforpetRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        PetSize petSize = petSizeRepository.findById(petSizeId)
                .orElseThrow(() -> new RuntimeException("Pet size not found"));

        ServicePrice servicePrice = new ServicePrice(null, serviceforpet, petSize, price);
        return servicePriceRepository.save(servicePrice);
    }

    // Lấy danh sách giá của một dịch vụ
    public List<ServicePrice> getServicePricesByService(Integer serviceId) {
        return servicePriceRepository.findByServiceforpetId(serviceId);
    }

    // Cập nhật giá của một dịch vụ theo kích thước thú cưng
    public ServicePrice updateServicePrice(Integer id, BigDecimal price) {
        ServicePrice servicePrice = servicePriceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service price not found"));
        servicePrice.setPrice(price);
        return servicePriceRepository.save(servicePrice);
    }

    //  Xóa giá dịch vụ
    public void deleteServicePrice(Integer id) {
        ServicePrice servicePrice = servicePriceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service price not found"));
        servicePriceRepository.delete(servicePrice);
    }
}
