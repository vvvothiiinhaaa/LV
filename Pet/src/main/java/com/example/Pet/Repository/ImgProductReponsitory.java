package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.imgProduct;

@Repository
public interface ImgProductReponsitory extends JpaRepository<imgProduct, Long> {
}
