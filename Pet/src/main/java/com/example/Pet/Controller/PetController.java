package com.example.Pet.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Pet;
import com.example.Pet.Service.PetService;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // API thêm thú cưng với hỗ trợ upload ảnh
    @PostMapping("/add")
    public ResponseEntity<Pet> addPet(
            @RequestParam("name") String name,
            @RequestParam("userId") Integer userId,
            @RequestParam("birthdate") String birthdate, // Nhận dạng String, sau đó parse thành LocalDate
            @RequestParam("breed") String breed,
            @RequestParam("gender") String gender,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        // Chuyển birthdate từ String sang LocalDate
        LocalDate parsedBirthdate = LocalDate.parse(birthdate);

        // Gọi service để thêm thú cưng
        Pet newPet = petService.addPet(name, userId, parsedBirthdate, breed, gender, file);
        return ResponseEntity.ok(newPet);
    }

    //  API Lấy danh sách thú cưng của User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Pet>> getPetsByUser(@PathVariable Integer userId) {
        List<Pet> pets = petService.getPetsByUserId(userId);
        return ResponseEntity.ok(pets);
    }

    @PutMapping("/update/{petId}")
    public ResponseEntity<Pet> updatePartialPet(
            @PathVariable Integer petId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "birthdate", required = false) String birthdate,
            @RequestParam(value = "breed", required = false) String breed,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Pet updatedPet = petService.updatePartialPet(petId, name, birthdate, breed, gender, file);
        return ResponseEntity.ok(updatedPet);
    }

    //  API Xóa thú cưng khỏi danh sách
    @DeleteMapping("/delete/{petId}")
    public ResponseEntity<String> deletePet(@PathVariable Integer petId) {
        petService.deletePet(petId);
        return ResponseEntity.ok("Pet deleted successfully.");
    }

    // lấy chi tiết địa chỉchỉ
    @GetMapping("/user/{userId}/pet/{petId}")
    public Pet getPetDetails(@PathVariable Integer userId, @PathVariable Integer petId) {
        return petService.getPetByIdAndUserId(petId, userId);
    }
}
