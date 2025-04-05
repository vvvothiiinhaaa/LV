package com.example.Pet.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.StockEntry;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.StockEntryRepository;

@Service
public class StockEntryService {

    @Autowired
    private StockEntryRepository stockEntryRepository;

    @Autowired
    private ProductRepository productRepository;

    // Thêm mới nhập hàng
    public StockEntry addStock(Long productId, Integer quantity, Double purchasePrice) {
        // Tìm sản phẩm từ cơ sở dữ liệu
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Cập nhật số lượng trong kho sản phẩm
        product.setQuantity(product.getQuantity() + quantity); // Cộng thêm số lượng vào kho
        productRepository.save(product);

        // Tạo một bản ghi StockEntry mới cho lần nhập hàng mới
        StockEntry stockEntry = new StockEntry(product, quantity, purchasePrice, LocalDateTime.now());

        // Lưu lại bản ghi StockEntry mới vào cơ sở dữ liệu (không thay thế)
        return stockEntryRepository.save(stockEntry);
    }

    // Lấy danh sách nhập hàng theo sản phẩm (bao gồm các lần chỉnh sửa)
    public List<StockEntry> getStockEntriesByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        // Trả về tất cả các bản ghi nhập hàng của sản phẩm
        return stockEntryRepository.findByProduct(product);
    }

    // // Lấy toàn bộ nhập hàng
    // public List<StockEntry> getAllStockEntries() {
    //     return stockEntryRepository.findAll();
    // }
    // Lấy tất cả các bản ghi nhập hàng và lấy bản ghi mới nhất cho mỗi sản phẩm
    public List<StockEntry> getAllStockEntries() {
        // Lấy tất cả các bản ghi StockEntry
        List<StockEntry> allStockEntries = stockEntryRepository.findAll();

        // Sử dụng stream để nhóm theo sản phẩm và lấy bản ghi mới nhất (entryDate max) của mỗi sản phẩm
        Map<Product, StockEntry> latestEntries = new HashMap<>();

        for (StockEntry entry : allStockEntries) {
            Product product = entry.getProduct();
            // Nếu chưa có bản ghi nào cho sản phẩm này hoặc bản ghi hiện tại mới hơn bản ghi đã lưu
            latestEntries.merge(product, entry, (existing, newEntry) -> newEntry.getEntryDate().isAfter(existing.getEntryDate()) ? newEntry : existing);
        }

        // Trả về các bản ghi mới nhất cho mỗi sản phẩm
        return new ArrayList<>(latestEntries.values());
    }

    // Chỉnh sửa số lượng nhập hàng và cập nhật kho sản phẩm
    // public StockEntry updateStockQuantity(Long id, Integer newQuantity) {
    //     StockEntry stockEntry = stockEntryRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy nhập hàng với ID: " + id));
    //     int oldQuantity = stockEntry.getQuantity();
    //     int quantityDifference = newQuantity - oldQuantity;
    //     // Cập nhật số lượng trong StockEntry
    //     stockEntry.setQuantity(newQuantity);
    //     stockEntryRepository.save(stockEntry); // Lưu lại StockEntry đã chỉnh sửa
    //     // Cập nhật số lượng kho của sản phẩm
    //     Product product = stockEntry.getProduct(); // Lấy thông tin sản phẩm liên kết
    //     product.setQuantity(product.getQuantity() + quantityDifference); // Điều chỉnh số lượng kho
    //     productRepository.save(product); // Lưu lại sản phẩm với số lượng kho đã cập nhật
    //     return stockEntry;
    // }
    // Cập nhật số lượng nhập hàng và lưu lại ghi chú khi chỉnh sửa
    public StockEntry updateStockQuantity(Long id, Integer newQuantity) {
        // Tìm bản ghi StockEntry cần chỉnh sửa
        StockEntry stockEntry = stockEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhập hàng với ID: " + id));

        int oldQuantity = stockEntry.getQuantity();
        int quantityDifference = newQuantity - oldQuantity;

        // Cập nhật số lượng và ghi chú cho lần chỉnh sửa
        stockEntry.setQuantity(newQuantity);

        // Cập nhật lại số lượng trong kho sản phẩm
        Product product = stockEntry.getProduct(); // Lấy thông tin sản phẩm liên kết
        product.setQuantity(product.getQuantity() + quantityDifference); // Điều chỉnh số lượng kho
        productRepository.save(product); // Lưu lại sản phẩm với số lượng kho đã cập nhật

        // Lưu lại bản ghi StockEntry đã được chỉnh sửa
        return stockEntryRepository.save(stockEntry); // Lưu StockEntry đã chỉnh sửa
    }

}
