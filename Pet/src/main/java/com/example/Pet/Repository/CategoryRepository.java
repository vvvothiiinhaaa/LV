package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
