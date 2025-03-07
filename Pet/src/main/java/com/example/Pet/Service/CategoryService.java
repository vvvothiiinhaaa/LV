package com.example.Pet.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Category;
import com.example.Pet.Repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy danh sách tất cả danh mục
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy danh mục theo ID
    public Optional<Category> getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }

    // Thêm mới danh mục
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Cập nhật danh mục
    public Category updateCategory(Integer id, Category categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setDescription(categoryDetails.getDescription());
            return categoryRepository.save(category);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
    }

    // Xóa danh mục
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}
