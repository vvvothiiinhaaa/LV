package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long id);

    // Tìm sản phẩm theo genre và price
    List<Product> findByGenreAndPriceBetween(String genre, Double minPrice, Double maxPrice);

    // Tìm sản phẩm theo genre và không có bộ lọc giá
    List<Product> findByGenre(String genre);

    // Tìm sản phẩm theo price không có bộ lọc genre
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // Tìm tất cả sản phẩm nếu không có bộ lọc
    List<Product> findAll();

    // Tìm sản phẩm theo tên
    List<Product> findByNameContainingIgnoreCase(String name);

    // Tìm sản phẩm theo thương hiệu
    List<Product> findByBrandContainingIgnoreCase(String brand);

    // Tìm sản phẩm theo xuất xứ
    List<Product> findByOriginContainingIgnoreCase(String origin);

    // Tìm sản phẩm theo danh mục
    List<Product> findByGenreContainingIgnoreCase(String genre);

    // Tìm sản phẩm theo tất cả các thuộc tính
    List<Product> findByNameContainingIgnoreCaseAndBrandContainingIgnoreCaseAndOriginContainingIgnoreCaseAndGenreContainingIgnoreCase(
            String name, String brand, String origin, String genre
    );

}
