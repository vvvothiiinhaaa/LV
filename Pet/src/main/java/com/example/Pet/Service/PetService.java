package com.example.Pet.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Pet;
import com.example.Pet.Modal.PetSize;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.PetRepository;
import com.example.Pet.Repository.PetSizeRepository;
import com.example.Pet.Repository.UserRepository;

@Service
public class PetService {

    @Autowired
    private PetSizeRepository petSizeRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService; // Thêm xử lý ảnh

    public PetService(PetRepository petRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public Pet addPet(String name, Integer userId, LocalDate birthdate, String breed, String gender, MultipartFile file) {
        // Kiểm tra User có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Xử lý lưu ảnh
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = fileStorageService.saveFile(file);
        }

        // Tạo Pet mới
        Pet pet = new Pet();
        pet.setName(name);
        pet.setUrl(imageUrl);
        pet.setUser(user);
        pet.setBirthdate(birthdate);
        pet.setBreed(breed);
        pet.setGender(gender);

        return petRepository.save(pet);
    }

    // Lấy danh sách thú cưng của User
    public List<Pet> getPetsByUserId(Integer userId) {
        return petRepository.findByUserId(userId);
    }

    ///// lấy thông tin chi tiết
    public Pet getPetByIdAndUserId(Integer petId, Integer userId) {
        Optional<Pet> pet = petRepository.findByIdAndUserId(petId, userId);
        return pet.orElseThrow(() -> new RuntimeException("Pet not found for user with ID: " + userId)); // Nếu không tìm thấy pet, sẽ báo lỗi
    }
// Chỉnh sửa thông tin thú cưng

    public Pet updatePet(Integer petId, String name, LocalDate birthdate, String breed, String gender, MultipartFile file) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        pet.setName(name);
        pet.setBirthdate(birthdate);
        pet.setBreed(breed);
        pet.setGender(gender);

        // Xử lý cập nhật ảnh mới nếu có
        if (file != null && !file.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(file);
            pet.setUrl(imageUrl);
        }

        return petRepository.save(pet);
    }

// Xóa thú cưng khỏi danh sách người dùng
    public void deletePet(Integer petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        petRepository.delete(pet);
    }

    public Pet updatePartialPet(
            Integer petId,
            String name,
            String birthdate,
            String breed,
            String gender,
            MultipartFile file) {

        // Tìm pet trong database
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        // Cập nhật dữ liệu nếu có truyền vào (nếu null thì giữ nguyên giá trị cũ)
        if (name != null) {
            pet.setName(name);
        }
        if (birthdate != null) {
            pet.setBirthdate(LocalDate.parse(birthdate));
        }
        if (breed != null) {
            pet.setBreed(breed);
        }
        if (gender != null) {
            pet.setGender(gender);
        }

        // Nếu có ảnh mới thì cập nhật ảnh
        if (file != null && !file.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(file);
            pet.setUrl(imageUrl);
        }

        return petRepository.save(pet);
    }

    /////////////////////////////////////////////////// ngày 18 tháng 3
    
    public Pet addPet1(String name, Integer userId, LocalDate birthdate, String breed, String gender, Float weight, MultipartFile file) {
        try {
            // Kiểm tra user có tồn tại không
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Xử lý lưu ảnh
            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                imageUrl = fileStorageService.saveFile(file);
            }

            // Xác định danh mục thú cưng (Chó hoặc Mèo)
            String petCategory = breed.toLowerCase().contains("chó") ? "Chó" : breed.toLowerCase().contains("mèo") ? "Mèo" : null;
            if (petCategory == null) {
                throw new RuntimeException("Không thể xác định loại thú cưng từ giống loài: " + breed);
            }

            // Tìm kích thước phù hợp theo giống loài và cân nặng
            PetSize petSize = petSizeRepository.findBySizeNameContainingIgnoreCaseAndWeightMinLessThanEqualAndWeightMaxGreaterThanEqual(
                    petCategory, weight, weight)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước phù hợp!"));

            // Tạo thú cưng mới
            Pet pet = new Pet();
            pet.setName(name);
            pet.setUser(user);
            pet.setBirthdate(birthdate);
            pet.setBreed(breed);
            pet.setGender(gender);
            pet.setWeight(weight);
            pet.setSize(petSize);
            pet.setUrl(imageUrl);

            return petRepository.save(pet);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi thêm thú cưng: " + e.getMessage());
        }
    }

    public Pet updatePartialPet1(
            Integer petId,
            String name,
            String birthdate,
            String breed,
            String gender,
            Float weight,
            MultipartFile file) {

        //  Tìm pet trong database
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        //  Cập nhật dữ liệu nếu có truyền vào (giữ nguyên nếu null)
        if (name != null && !name.isEmpty()) {
            pet.setName(name);
        }
        if (birthdate != null && !birthdate.isEmpty()) {
            try {
                pet.setBirthdate(LocalDate.parse(birthdate));
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Lỗi định dạng ngày sinh! Định dạng phải là YYYY-MM-DD.");
            }
        }
        if (breed != null && !breed.isEmpty()) {
            pet.setBreed(breed);
        }
        if (gender != null && !gender.isEmpty()) {
            pet.setGender(gender);
        }

        //  Nếu có cân nặng mới, cập nhật size phù hợp
        if (weight != null && weight > 0) {
            pet.setWeight(weight);

            //  Xác định loại thú cưng (Chó hoặc Mèo)
            String petCategory = pet.getBreed().toLowerCase().contains("chó") ? "Chó"
                    : pet.getBreed().toLowerCase().contains("mèo") ? "Mèo"
                    : null;

            if (petCategory != null) {
                PetSize petSize = petSizeRepository.findBySizeNameContainingIgnoreCaseAndWeightMinLessThanEqualAndWeightMaxGreaterThanEqual(
                        petCategory, weight, weight)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước phù hợp!"));
                pet.setSize(petSize);
            }
        }

        //  Nếu có ảnh mới thì cập nhật ảnh
        if (file != null && !file.isEmpty()) {
            String imageUrl = fileStorageService.saveFile(file);
            pet.setUrl(imageUrl);
        }

        return petRepository.save(pet);
    }

}
