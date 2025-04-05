package com.example.Pet.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.PetSize;
import com.example.Pet.Service.PetSizeService;

@RestController
@RequestMapping("/petsizes")
public class PetSizeController {

    private final PetSizeService petSizeService;

    public PetSizeController(PetSizeService petSizeService) {
        this.petSizeService = petSizeService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<PetSize>> getAllPetSizes() {
        List<PetSize> petSizes = petSizeService.getAllPetSizes();
        return ResponseEntity.ok(petSizes);
    }

    //  Cập nhật tên kích thước thú cưng
    @PutMapping("/update/{id}")
    public ResponseEntity<PetSize> updatePetSize(@PathVariable Integer id, @RequestParam String sizeName) {
        return ResponseEntity.ok(petSizeService.updatePetSize(id, sizeName));
    }

    //  Xóa kích thước thú cưng
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePetSize(@PathVariable Integer id) {
        petSizeService.deletePetSize(id);
        return ResponseEntity.ok("Pet size deleted successfully!");
    }
}
