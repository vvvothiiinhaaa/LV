package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.StockEntry;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

    // List<StockEntry> findByProductId(Long productId);
    List<StockEntry> findByProduct(Product product);

    // Lấy danh sách nhập hàng theo ID sản phẩm
    // List<StockEntry> findByProductId(Long productId);
    // Tìm bản ghi nhập hàng cuối cùng của sản phẩm theo thời gian nhập
    // List<StockEntry> findByProductOrderByEntryDateAsc(Product product);
    // Lấy bản ghi StockEntry mới nhất của sản phẩm
    // StockEntry findTopByProductOrderByEntryDateDesc(Product product);
    // Lấy danh sách các lần nhập kho theo sản phẩm và sắp xếp theo ngày nhập
    List<StockEntry> findByProductOrderByEntryDateAsc(Product product);

    @Query("SELECT se FROM StockEntry se WHERE se.product.id = :productId ORDER BY se.entryDate ASC")
    List<StockEntry> findByProductIdOrderByEntryDateAsc(Long productId);

    // List<StockEntry> findByProductIdOrderByEntryDateAsc(Long productId);
    List<StockEntry> findByProductAndRemainingQuantityGreaterThanOrderByEntryDateAsc(Product product, int remainingQuantity);

}
