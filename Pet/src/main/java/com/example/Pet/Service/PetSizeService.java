package com.example.Pet.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.Pet.Modal.PetSize;
import com.example.Pet.Repository.PetSizeRepository;

@Service
public class PetSizeService {

    private final PetSizeRepository petSizeRepository;

    public PetSizeService(PetSizeRepository petSizeRepository) {
        this.petSizeRepository = petSizeRepository;
    }

    // public PetSize addPetSize(String sizeName) {
    //     return petSizeRepository.save(new PetSize(null, sizeName));
    // }
    
    public List<PetSize> getAllPetSizes() {
        return petSizeRepository.findAll();
    }

    public PetSize updatePetSize(Integer id, String sizeName) {
        PetSize petSize = petSizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet size not found"));
        petSize.setSizeName(sizeName);
        return petSizeRepository.save(petSize);
    }

    public void deletePetSize(Integer id) {
        PetSize petSize = petSizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet size not found"));
        petSizeRepository.delete(petSize);
    }
}
