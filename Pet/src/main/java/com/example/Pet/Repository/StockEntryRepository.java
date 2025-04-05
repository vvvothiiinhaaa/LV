package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.StockEntry;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

    // List<StockEntry> findByProductId(Long productId);
    List<StockEntry> findByProduct(Product product);

    // Lấy danh sách nhập hàng theo ID sản phẩm
    // List<StockEntry> findByProductId(Long productId);
    // Tìm bản ghi nhập hàng cuối cùng của sản phẩm theo thời gian nhập
    StockEntry findTopByProductOrderByEntryDateDesc(Product product);

    // Lấy bản ghi StockEntry mới nhất của sản phẩm
    // StockEntry findTopByProductOrderByEntryDateDesc(Product product);
}
