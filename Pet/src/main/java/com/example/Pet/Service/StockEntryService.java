package com.example.Pet.Service;

import java.util.List;

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

    // Phương thức nhập hàng vào kho và cập nhật giá bán
    public void addStock(Long productId, Integer quantity, Double purchasePrice) {
        // Tìm sản phẩm từ cơ sở dữ liệu
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
        // Tạo mới StockEntry (lô hàng nhập kho)
        StockEntry stockEntry = new StockEntry(product, quantity, purchasePrice, java.time.LocalDateTime.now());
        // Lưu StockEntry vào cơ sở dữ liệu
        stockEntryRepository.save(stockEntry);
        // Cập nhật lại số lượng của sản phẩm trong kho
        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);
        // Cập nhật giá bán của sản phẩm sau khi nhập hàng mới
        updateProductPrice(product);
    }
// Phương thức tính và cập nhật giá bán của sản phẩm

    public void updateProductPrice(Product product) {
        // Lấy tất cả các lô hàng nhập của sản phẩm
        List<StockEntry> stockEntries = stockEntryRepository.findByProductOrderByEntryDateAsc(product);
        double totalCost = 0.0;
        int totalQuantity = 0;
        // Tính tổng chi phí và tổng số lượng của tất cả các lô nhập
        for (StockEntry entry : stockEntries) {
            totalCost += entry.getPurchasePrice() * entry.getQuantity();
            totalQuantity += entry.getQuantity();
        }
        // Tính giá bán trung bình từ giá nhập (cộng thêm lợi nhuận)
        double averageCost = totalCost / totalQuantity;
        double sellingPrice = averageCost * 1.2;  // Lợi nhuận 20%
        // Cập nhật giá bán của sản phẩm trong bảng Product
        product.setPrice(sellingPrice);
        productRepository.save(product);
    }
// Nhập hàng và cập nhật giá bán theo nguyên lý FIFO

    // // Thêm mới nhập hàng
    // public StockEntry addStock(Long productId, Integer quantity, Double purchasePrice) {
    //     // Tìm sản phẩm từ cơ sở dữ liệu
    //     Product product = productRepository.findById(productId)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    //     // Cập nhật số lượng trong kho sản phẩm
    //     product.setQuantity(product.getQuantity() + quantity); // Cộng thêm số lượng vào kho
    //     productRepository.save(product);
    //     // Tạo một bản ghi StockEntry mới cho lần nhập hàng mới
    //     StockEntry stockEntry = new StockEntry(product, quantity, purchasePrice, LocalDateTime.now());
    //     // Lưu lại bản ghi StockEntry mới vào cơ sở dữ liệu (không thay thế)
    //     return stockEntryRepository.save(stockEntry);
    // }
    // // Lấy danh sách nhập hàng theo sản phẩm (bao gồm các lần chỉnh sửa)
    // public List<StockEntry> getStockEntriesByProduct(Long productId) {
    //     Product product = productRepository.findById(productId)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));
    //     // Trả về tất cả các bản ghi nhập hàng của sản phẩm
    //     return stockEntryRepository.findByProduct(product);
    // }
    // // // Lấy toàn bộ nhập hàng
    // // public List<StockEntry> getAllStockEntries() {
    // //     return stockEntryRepository.findAll();
    // // }
    // // Lấy tất cả các bản ghi nhập hàng và lấy bản ghi mới nhất cho mỗi sản phẩm
    // public List<StockEntry> getAllStockEntries() {
    //     // Lấy tất cả các bản ghi StockEntry
    //     List<StockEntry> allStockEntries = stockEntryRepository.findAll();
    //     // Sử dụng stream để nhóm theo sản phẩm và lấy bản ghi mới nhất (entryDate max) của mỗi sản phẩm
    //     Map<Product, StockEntry> latestEntries = new HashMap<>();
    //     for (StockEntry entry : allStockEntries) {
    //         Product product = entry.getProduct();
    //         // Nếu chưa có bản ghi nào cho sản phẩm này hoặc bản ghi hiện tại mới hơn bản ghi đã lưu
    //         latestEntries.merge(product, entry, (existing, newEntry) -> newEntry.getEntryDate().isAfter(existing.getEntryDate()) ? newEntry : existing);
    //     }
    //     // Trả về các bản ghi mới nhất cho mỗi sản phẩm
    //     return new ArrayList<>(latestEntries.values());
    // }
    // // Chỉnh sửa số lượng nhập hàng và cập nhật kho sản phẩm
    // // public StockEntry updateStockQuantity(Long id, Integer newQuantity) {
    // //     StockEntry stockEntry = stockEntryRepository.findById(id)
    // //             .orElseThrow(() -> new RuntimeException("Không tìm thấy nhập hàng với ID: " + id));
    // //     int oldQuantity = stockEntry.getQuantity();
    // //     int quantityDifference = newQuantity - oldQuantity;
    // //     // Cập nhật số lượng trong StockEntry
    // //     stockEntry.setQuantity(newQuantity);
    // //     stockEntryRepository.save(stockEntry); // Lưu lại StockEntry đã chỉnh sửa
    // //     // Cập nhật số lượng kho của sản phẩm
    // //     Product product = stockEntry.getProduct(); // Lấy thông tin sản phẩm liên kết
    // //     product.setQuantity(product.getQuantity() + quantityDifference); // Điều chỉnh số lượng kho
    // //     productRepository.save(product); // Lưu lại sản phẩm với số lượng kho đã cập nhật
    // //     return stockEntry;
    // // }
    // // Cập nhật số lượng nhập hàng và lưu lại ghi chú khi chỉnh sửa
    // public StockEntry updateStockQuantity(Long id, Integer newQuantity) {
    //     // Tìm bản ghi StockEntry cần chỉnh sửa
    //     StockEntry stockEntry = stockEntryRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy nhập hàng với ID: " + id));
    //     int oldQuantity = stockEntry.getQuantity();
    //     int quantityDifference = newQuantity - oldQuantity;
    //     // Cập nhật số lượng và ghi chú cho lần chỉnh sửa
    //     stockEntry.setQuantity(newQuantity);
    //     // Cập nhật lại số lượng trong kho sản phẩm
    //     Product product = stockEntry.getProduct(); // Lấy thông tin sản phẩm liên kết
    //     product.setQuantity(product.getQuantity() + quantityDifference); // Điều chỉnh số lượng kho
    //     productRepository.save(product); // Lưu lại sản phẩm với số lượng kho đã cập nhật
    //     // Lưu lại bản ghi StockEntry đã được chỉnh sửa
    //     return stockEntryRepository.save(stockEntry); // Lưu StockEntry đã chỉnh sửa
    // }
    // Phương thức bán sản phẩm theo FIFO
    // Phương thức nhập hàng
    // Thêm một bản ghi nhập kho mới và cập nhật giá bán cho sản phẩm
    // Thêm nhập hàng và tự động tính toán lại giá bán
    // Phương thức thêm sản phẩm vào kho và cập nhật giá bán theo nguyên tắc FIFO
    // public void addStock(Long productId, Integer quantity, Double purchasePrice) {
    //     // Tìm sản phẩm từ cơ sở dữ liệu
    //     Product product = productRepository.findById(productId)
    //             .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
    //     // Nếu là lần đầu nhập kho và sản phẩm chưa có giá, set giá ban đầu
    //     if (product.getPrice() == null || product.getPrice() == 0.0) {
    //         // Cập nhật giá bán lần đầu = giá nhập * 1.2
    //         double initialPrice = purchasePrice * 1.2;
    //         product.setPrice(initialPrice);  // Set giá bán lần đầu
    //     }
    //     // Cập nhật số lượng trong kho sản phẩm
    //     product.setQuantity(product.getQuantity() + quantity); // Cộng thêm số lượng vào kho
    //     // Lưu lại thông tin sản phẩm đã được cập nhật
    //     productRepository.save(product);
    //     // Tạo một bản ghi StockEntry mới cho lần nhập hàng mới
    //     StockEntry stockEntry = new StockEntry(product, quantity, purchasePrice, LocalDateTime.now());
    //     // Lưu lại bản ghi StockEntry mới vào cơ sở dữ liệu
    //     stockEntryRepository.save(stockEntry);
    //     // Cập nhật lại giá bán của sản phẩm theo FIFO (nếu có nhiều lô hàng)
    //     updateProductPrice(productId);
    // }
    // private void updateProductPrice(Product product) {
    //     // Lấy tất cả các bản ghi nhập kho theo thứ tự ngày nhập (FIFO)
    //     List<StockEntry> stockEntries = stockEntryRepository.findByProductIdOrderByEntryDateAsc(product.getId());
    //     double totalCost = 0;
    //     int totalQuantity = 0;
    //     // Duyệt qua các StockEntry để tính tổng chi phí và tổng số lượng
    //     for (StockEntry entry : stockEntries) {
    //         totalCost += entry.getPurchasePrice() * entry.getQuantity();
    //         totalQuantity += entry.getQuantity();
    //     }
    //     // Tính giá bán mới (Cộng thêm 20% giá nhập)
    //     if (totalQuantity > 0) {
    //         double averagePurchasePrice = totalCost / totalQuantity;
    //         double sellingPrice = averagePurchasePrice * 1.2;  // Cộng thêm 20%
    //         // Cập nhật giá bán sản phẩm
    //         product.setPrice(sellingPrice);
    //     }
}

// // Lấy toàn bộ lịch sử nhập hàng
// public List<StockEntry> getAllStockEntries() {
//     return stockEntryRepository.findAll();
// }
// // Chỉnh sửa số lượng nhập hàng
// public StockEntry updateStockQuantity(Long id, Integer newQuantity) {
//     StockEntry stockEntry = stockEntryRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("StockEntry không tồn tại"));
//     stockEntry.setQuantity(newQuantity);
//     return stockEntryRepository.save(stockEntry);
// }
// // Lấy bản ghi nhập hàng mới nhất của sản phẩm
// public StockEntry getLatestStockEntry(Long productId) {
//     Product product = productRepository.findById(productId)
//             .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
//     return stockEntryRepository.findTopByProductOrderByEntryDateDesc(product);
// }

