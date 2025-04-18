package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Product;

import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long id);

    // Product findById1(long id);
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

    //// có thể sử dụng để truy vấn chat gpt

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

    /////////////////////////////
     @Query("SELECT DISTINCT p FROM Product p WHERE "
            + "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "LOWER(p.genre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
            + "LOWER(p.origin) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.quantity = p.quantity + :quantity, p.sold = p.sold - :quantity WHERE p.id = :productId")
    void restoreProductStock(Long productId, int quantity);

    List<Product> findTop10ByOrderBySoldDesc();

//     ///// truy vấn cho chat gpt
    // List<Product> findByNameContainingIgnoreCase(String name);
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> searchByName(@Param("name") String name);

    // Lấy 5 sản phẩm mới nhất theo ID lớn nhất
    List<Product> findTop10ByOrderByIdDesc();

    // Lấy 5 sản phẩm bán chạy nhất theo số lượng đã bán
    List<Product> findTop5ByOrderBySoldDesc();

    // Truy vấn danh mục sản phẩm (genre) khác nhau
    @Query("SELECT DISTINCT p.genre FROM Product p")
    List<String> findAllGenres();

    // // Phương thức tính tổng số lượng đã bán cho sản phẩm
    // @Query("SELECT SUM(s.sold) FROM Sale s WHERE s.product.id = :productId")
    // int sumQuantitySoldByProductId(@Param("productId") Long productId);
}
