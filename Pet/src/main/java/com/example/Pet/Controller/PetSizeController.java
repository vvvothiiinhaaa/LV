package com.example.Pet.Controller;

import com.example.Pet.Modal.PetSize;
import com.example.Pet.Service.PetSizeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/petsizes")
public class PetSizeController {

    private final PetSizeService petSizeService;

    public PetSizeController(PetSizeService petSizeService) {
        this.petSizeService = petSizeService;
    }

    //  Thêm kích thước thú cưng mới
    @PostMapping("/add")
    public ResponseEntity<PetSize> addPetSize(@RequestParam String sizeName) {
        return ResponseEntity.ok(petSizeService.addPetSize(sizeName));
    }

    // Lấy danh sách tất cả kích thước thú cưng
    @GetMapping("/all")
    public ResponseEntity<List<PetSize>> getAllPetSizes() {
        return ResponseEntity.ok(petSizeService.getAllPetSizes());
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
