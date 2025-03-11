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
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// package com.example.Pet.Service;

// import com.example.Pet.Modal.Serviceforpet;
// import com.example.Pet.Repository.ServiceforpetRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class ServiceforpetService {

//     private final ServiceforpetRepository serviceforpetRepository;

//     public ServiceforpetService(ServiceforpetRepository serviceforpetRepository) {
//         this.serviceforpetRepository = serviceforpetRepository;
//     }

//     public Serviceforpet addService(String name, String description, Integer duration) {
//         Serviceforpet serviceforpet = new Serviceforpet(name, description, duration);
//         return serviceforpetRepository.save(serviceforpet);
//     }

//     public Serviceforpet updateService(Integer id, String name, String description, Integer duration) {
//         Serviceforpet service = serviceforpetRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Service not found"));

//         if (name != null) {
//             service.setName(name);
//         }
//         if (description != null) {
//             service.setDescription(description);
//         }
//         if (duration != null) {
//             service.setDuration(duration);
//         }

//         return serviceforpetRepository.save(service);
//     }

//     public void deleteService(Integer id) {
//         Serviceforpet service = serviceforpetRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Service not found"));
//         serviceforpetRepository.delete(service);
//     }

//     public List<Serviceforpet> getAllServices() {
//         return serviceforpetRepository.findAll();
//     }
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.DTO.ServiceDTO;
import com.example.Pet.DTO.ServicePriceDTO;
import com.example.Pet.DTO.ServiceStepDTO;
import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.ServiceStep;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.PetSizeRepository;
import com.example.Pet.Repository.ServicePriceRepository;
import com.example.Pet.Repository.ServiceStepRepository;
import com.example.Pet.Repository.ServiceforpetRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@Service
public class ServiceforpetService {

    private final ServiceforpetRepository serviceforpetRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    private ServiceStepRepository serviceStepRepository;

    @Autowired
    private PetSizeRepository petSizeRepository;

    @Autowired
    private ServicePriceRepository servicePriceRepository;

    public ServiceforpetService(ServiceforpetRepository serviceforpetRepository, FileStorageService fileStorageService) {
        this.serviceforpetRepository = serviceforpetRepository;
        this.fileStorageService = fileStorageService;
    }

    // public Serviceforpet addService(String name, String description, Integer duration, MultipartFile file) {
    //     String url = fileStorageService.saveFile(file); // Lưu ảnh và lấy đường dẫn
    //     if (url == null) {
    //         throw new RuntimeException("Lưu ảnh thất bại!");
    //     }
    //     Serviceforpet serviceforpet = new Serviceforpet(name, description, duration, url);
    //     return serviceforpetRepository.save(serviceforpet);
    // }
    // public Serviceforpet updateService(Integer id, String name, String description, Integer duration, MultipartFile file) {
    //     Serviceforpet service = serviceforpetRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Service not found"));
    //     if (name != null) {
    //         service.setName(name);
    //     }
    //     if (description != null) {
    //         service.setDescription(description);
    //     }
    //     if (duration != null) {
    //         service.setDuration(duration);
    //     }
    //     if (file != null && !file.isEmpty()) {
    //         String url = fileStorageService.saveFile(file);
    //         if (url != null) {
    //             service.setUrl(url);
    //         }
    //     }
    //     return serviceforpetRepository.save(service);
    // }
    public void deleteService(Integer id) {
        Serviceforpet service = serviceforpetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        serviceforpetRepository.delete(service);
    }

    // public List<Serviceforpet> getAllServices() {
    //     return serviceforpetRepository.findAll();
    // }
    public Serviceforpet getServiceById(Integer id) {
        return serviceforpetRepository.findById(id).orElse(null);
    }

    ///////////////////////////////////////////////////////////////////// chỉnh sửa ngày 10 tháng 3
    @Transactional
    public Serviceforpet addService(ServiceDTO serviceDTO) {
        try {
            // Lưu ảnh và lấy đường dẫn
            String url = fileStorageService.saveFile(serviceDTO.getFile());
            if (url == null) {
                throw new RuntimeException("Lưu ảnh thất bại!");
            }

            // Tạo dịch vụ mới
            Serviceforpet serviceforpet = new Serviceforpet();
            serviceforpet.setName(serviceDTO.getName());
            serviceforpet.setDescription(serviceDTO.getDescription());
            serviceforpet.setDuration(serviceDTO.getDuration());
            serviceforpet.setUrl(url);
            serviceforpet = serviceforpetRepository.save(serviceforpet);

            // **Chuyển đổi JSON `steps` từ String thành List<ServiceStepDTO>**
            ObjectMapper objectMapper = new ObjectMapper();
            List<ServiceStepDTO> steps = objectMapper.readValue(serviceDTO.getSteps(), new TypeReference<List<ServiceStepDTO>>() {
            });

            // Lưu các bước
            int order = 1;
            for (ServiceStepDTO stepDTO : steps) {
                ServiceStep step = new ServiceStep();
                step.setService(serviceforpet);
                step.setStepOrder(order++);
                step.setStepTitle(stepDTO.getStepTitle());
                step.setStepDescription(stepDTO.getStepDescription());
                serviceStepRepository.save(step);
            }

            // **Chuyển đổi JSON `prices` từ String thành List<ServicePriceDTO>**
            List<ServicePriceDTO> prices = objectMapper.readValue(serviceDTO.getPrices(), new TypeReference<List<ServicePriceDTO>>() {
            });

            // Lưu giá theo kích thước thú cưng
            for (ServicePriceDTO priceDTO : prices) {
                ServicePrice servicePrice = new ServicePrice();
                servicePrice.setServiceforpet(serviceforpet);
                servicePrice.setPetSize(petSizeRepository.findById(priceDTO.getPetSizeId())
                        .orElseThrow(() -> new RuntimeException("Kích thước không tồn tại")));
                servicePrice.setPrice(priceDTO.getPrice());
                servicePriceRepository.save(servicePrice);
            }

            return serviceforpet;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xử lý dữ liệu: " + e.getMessage());
        }
    }

    public List<Serviceforpet> getAllServices() {
        return serviceforpetRepository.findAllWithDetails();
    }

    // // chỉnh sửa ngày 10 tháng 3
    @Transactional
    public Serviceforpet updateService(Integer id, ServiceDTO serviceDTO) {
        try {
            // Tìm dịch vụ theo ID
            Serviceforpet serviceforpet = serviceforpetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));

            // Cập nhật thông tin chung
            if (serviceDTO.getName() != null) {
                serviceforpet.setName(serviceDTO.getName());
            }
            if (serviceDTO.getDescription() != null) {
                serviceforpet.setDescription(serviceDTO.getDescription());
            }
            if (serviceDTO.getDuration() != null) {
                serviceforpet.setDuration(serviceDTO.getDuration());
            }

            // Nếu có ảnh mới, cập nhật ảnh
            if (serviceDTO.getFile() != null && !serviceDTO.getFile().isEmpty()) {
                String url = fileStorageService.saveFile(serviceDTO.getFile());
                if (url != null) {
                    serviceforpet.setUrl(url);
                }
            }

            // Cập nhật các bước thực hiện
            ObjectMapper objectMapper = new ObjectMapper();

            if (serviceDTO.getSteps() != null && !serviceDTO.getSteps().isEmpty()) {
                List<ServiceStepDTO> steps = objectMapper.readValue(serviceDTO.getSteps(),
                        new TypeReference<List<ServiceStepDTO>>() {
                });

                // Xóa các bước cũ
                serviceStepRepository.deleteByService(serviceforpet);

                // Thêm bước mới
                int order = 1;
                for (ServiceStepDTO stepDTO : steps) {
                    ServiceStep step = new ServiceStep();
                    step.setService(serviceforpet);
                    step.setStepOrder(order++);
                    step.setStepTitle(stepDTO.getStepTitle());
                    step.setStepDescription(stepDTO.getStepDescription());
                    serviceStepRepository.save(step);
                }
            }

            // Cập nhật giá theo kích thước thú cưng
            if (serviceDTO.getPrices() != null && !serviceDTO.getPrices().isEmpty()) {
                List<ServicePriceDTO> prices = objectMapper.readValue(serviceDTO.getPrices(),
                        new TypeReference<List<ServicePriceDTO>>() {
                });

                // Xóa giá cũ
                servicePriceRepository.deleteByServiceforpet(serviceforpet);

                // Thêm giá mới
                for (ServicePriceDTO priceDTO : prices) {
                    ServicePrice servicePrice = new ServicePrice();
                    servicePrice.setServiceforpet(serviceforpet);
                    servicePrice.setPetSize(petSizeRepository.findById(priceDTO.getPetSizeId())
                            .orElseThrow(() -> new RuntimeException("Kích thước không tồn tại")));
                    servicePrice.setPrice(priceDTO.getPrice());
                    servicePriceRepository.save(servicePrice);
                }
            }

            return serviceforpetRepository.save(serviceforpet);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật dịch vụ: " + e.getMessage());
        }
    }

}
