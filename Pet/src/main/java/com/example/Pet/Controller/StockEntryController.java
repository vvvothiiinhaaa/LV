package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.DTO.StockEntryRequest;
import com.example.Pet.Modal.StockEntry;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.StockEntryRepository;
import com.example.Pet.Service.OrderService;
import com.example.Pet.Service.StockEntryService;

@RestController
@RequestMapping("/api/stock")
public class StockEntryController {

    @Autowired
    private StockEntryService stockEntryService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockEntryRepository stockEntryRepository;
    @Autowired
    private OrderService orderService;

    // // API thêm nhập hàng
    // @PostMapping("/add")
    // public StockEntry addStock(@RequestParam Long productId,
    //         @RequestParam Integer quantity,
    //         @RequestParam Double purchasePrice
    // ) {
    //     return stockEntryService.addStock(productId, quantity, purchasePrice);
    // }
    // // API lấy danh sách nhập hàng theo sản phẩm (bao gồm các lần chỉnh sửa)
    // @GetMapping("/product/{productId}")
    // public List<StockEntry> getStockEntriesByProduct(@PathVariable Long productId) {
    //     return stockEntryService.getStockEntriesByProduct(productId);
    // }
    // // API lấy toàn bộ lịch sử nhập hàng
    // @GetMapping("/all")
    // public List<StockEntry> getAllStockEntries() {
    //     return stockEntryService.getAllStockEntries();
    // }
    // // API chỉnh sửa số lượng nhập hàng
    // @PutMapping("/update/{id}")
    // public StockEntry updateStockQuantity(@PathVariable Long id,
    //         @RequestParam Integer newQuantity) {
    //     return stockEntryService.updateStockQuantity(id, newQuantity);
    // }
    // // API lấy bản ghi nhập hàng mới nhất của sản phẩm
    // @GetMapping("/product/{productId}/latest")
    // public StockEntry getLatestStockEntry(@PathVariable Long productId) {
    //     Product product = new Product();
    //     product.setId(productId);
    //     return stockEntryRepository.findTopByProductOrderByEntryDateDesc(product);
    // }
    // @PostMapping("/add")
    // public ResponseEntity<String> addStock(
    //         @RequestParam Long productId,
    //         @RequestParam Integer quantity,
    //         @RequestParam Double purchasePrice) {
    //     try {
    //         // Gọi service để thêm nhập kho và cập nhật giá
    //         stockEntryService.addStock(productId, quantity, purchasePrice);
    //         return new ResponseEntity<>("Nhập hàng thành công và giá bán đã được cập nhật.", HttpStatus.OK);
    //     } catch (Exception e) {
    //         // Trả về phản hồi lỗi nếu có lỗi xảy ra
    //         return new ResponseEntity<>("Lỗi khi nhập hàng: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    //     }
    // }
    // Nhập hàng
    // DTO để truyền dữ liệu từ Postman
    public static class AddStockRequest {

        public Long productId;
        public int quantity;
        public double purchasePrice;
    }

    // API nhập hàng và cập nhật giá bán
    // @PostMapping("/add")
    // public String addStock(@RequestParam Long productId, @RequestParam Integer quantity, @RequestParam Double purchasePrice) {
    //     try {
    //         // Gọi phương thức addStock từ StockService để nhập hàng và cập nhật giá bán
    //         stockEntryService.addStock(productId, quantity, purchasePrice);
    //         return "Nhập hàng thành công và cập nhật giá bán!";
    //     } catch (Exception e) {
    //         return "Lỗi: " + e.getMessage();
    //     }
    // }
    ///////////////////////////////////////////////////////////////////  có thể sử dụng
    // @PostMapping("/add")
    // public String addStock(@RequestParam Long productId,
    //         @RequestParam Integer quantity,
    //         @RequestParam Double purchasePrice) {
    //     try {
    //         // Gọi phương thức addStock từ StockService để nhập hàng và cập nhật giá bán
    //         stockEntryService.addStock(productId, quantity, purchasePrice);
    //         return "Nhập hàng thành công và cập nhật giá bán!";
    //     } catch (Exception e) {
    //         return "Lỗi: " + e.getMessage();
    //     }
    // }

    ///////////////////////////////////////////////////////////////////////////

     @PostMapping("/add")
    public ResponseEntity<String> addStock(@RequestBody StockEntryRequest request) {
        try {
            orderService.addStock(request.getProductId(), request.getQuantity(), request.getPurchasePrice());
            return ResponseEntity.ok("Nhập hàng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

// // API lấy toàn bộ lịch sử nhập hàng
    @GetMapping("/all")
    public List<StockEntry> getAllStockEntries() {
        return stockEntryService.getAllStockEntries();
    }
// API chỉnh sửa số lượng nhập hàng
// @PutMapping("/update/{id}")
// public StockEntry updateStockQuantity(@PathVariable Long id,
//         @RequestParam Integer newQuantity) {
//     return stockEntryService.updateStockQuantity(id, newQuantity);
// }
// API lấy bản ghi nhập hàng mới nhất của sản phẩm

    @GetMapping("/product/{productId}/latest")
    public StockEntry getLatestStockEntry(@PathVariable Long productId) {
        return stockEntryService.getLatestStockEntry(productId);
    }

}
