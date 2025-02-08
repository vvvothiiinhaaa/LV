// package com.example.Pet.Service;
// import com.example.Pet.Modal.PetSize;
// import com.example.Pet.Modal.Serviceforpet;
// import com.example.Pet.Modal.ServicePrice;
// import com.example.Pet.Repository.PetSizeRepository;
// import com.example.Pet.Repository.ServiceforpetRepository;
// import com.example.Pet.Repository.ServicePriceRepository;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import java.math.BigDecimal;
// import java.util.List;
// @Service
// public class ServiceforpetService {
//     private final ServiceforpetRepository serviceforpetRepository;
//     private final PetSizeRepository petSizeRepository;
//     private final ServicePriceRepository servicePriceRepository;
//     public ServiceforpetService(ServiceforpetRepository serviceforpetRepository,
//             PetSizeRepository petSizeRepository,
//             ServicePriceRepository servicePriceRepository) {
//         this.serviceforpetRepository = serviceforpetRepository;
//         this.petSizeRepository = petSizeRepository;
//         this.servicePriceRepository = servicePriceRepository;
//     }
//     //  Thêm dịch vụ mới (Kèm giá theo PetSize)
//     @Transactional
//     public Serviceforpet addServiceWithPrices(String name, String description, Integer duration, BigDecimal defaultPrice) {
//         // Thêm dịch vụ mới
//         Serviceforpet serviceforpet = new Serviceforpet(name, description, duration);
//         serviceforpet = serviceforpetRepository.save(serviceforpet);
//         // Lấy danh sách kích thước thú cưng
//         List<PetSize> petSizes = petSizeRepository.findAll();
//         // Thêm giá dịch vụ theo từng kích thước thú cưng
//         for (PetSize petSize : petSizes) {
//             ServicePrice servicePrice = new ServicePrice();
//             servicePrice.setServiceforpet(serviceforpet);
//             servicePrice.setPetSize(petSize);
//             servicePrice.setPrice(defaultPrice); // Giá mặc định hoặc tuỳ chỉnh
//             servicePriceRepository.save(servicePrice);
//         }
//         return serviceforpet;
//     }
//     // Cập nhật giá cho một dịch vụ theo PetSize
//     @Transactional
//     public ServicePrice updateServicePrice(Integer serviceId, Integer petSizeId, BigDecimal newPrice) {
//         ServicePrice servicePrice = servicePriceRepository.findByServiceforpetIdAndPetSizeId(serviceId, petSizeId)
//                 .orElseThrow(() -> new RuntimeException("Service price not found"));
//         servicePrice.setPrice(newPrice);
//         return servicePriceRepository.save(servicePrice);
//     }
//     //  Lấy tất cả giá của một dịch vụ theo PetSize
//     public List<ServicePrice> getServicePricesByService(Integer serviceId) {
//         return servicePriceRepository.findByServiceforpetId(serviceId);
//     }
// }
package com.example.Pet.Service;

import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.ServiceforpetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceforpetService {

    private final ServiceforpetRepository serviceforpetRepository;

    public ServiceforpetService(ServiceforpetRepository serviceforpetRepository) {
        this.serviceforpetRepository = serviceforpetRepository;
    }

    public Serviceforpet addService(String name, String description, Integer duration) {
        Serviceforpet serviceforpet = new Serviceforpet(name, description, duration);
        return serviceforpetRepository.save(serviceforpet);
    }

    public Serviceforpet updateService(Integer id, String name, String description, Integer duration) {
        Serviceforpet service = serviceforpetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (name != null) {
            service.setName(name);
        }
        if (description != null) {
            service.setDescription(description);
        }
        if (duration != null) {
            service.setDuration(duration);
        }

        return serviceforpetRepository.save(service);
    }

    public void deleteService(Integer id) {
        Serviceforpet service = serviceforpetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        serviceforpetRepository.delete(service);
    }

    public List<Serviceforpet> getAllServices() {
        return serviceforpetRepository.findAll();
    }
}
