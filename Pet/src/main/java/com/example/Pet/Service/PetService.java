package com.example.Pet.Service;

import com.example.Pet.DTO.PetDTO;
import com.example.Pet.Repository.PetRepository;
import com.example.Pet.Repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Pet;
import com.example.Pet.Modal.User;

@Service
public class PetService {

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

}
