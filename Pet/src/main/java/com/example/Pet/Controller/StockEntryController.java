package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.StockEntry;
import com.example.Pet.Repository.StockEntryRepository;
import com.example.Pet.Service.StockEntryService;

@RestController
@RequestMapping("/api/stock")
public class StockEntryController {

    @Autowired
    private StockEntryService stockEntryService;

    @Autowired
    private StockEntryRepository stockEntryRepository;

    // API thêm nhập hàng
    @PostMapping("/add")
    public StockEntry addStock(@RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam Double purchasePrice
    ) {
        return stockEntryService.addStock(productId, quantity, purchasePrice);
    }

    // API lấy danh sách nhập hàng theo sản phẩm (bao gồm các lần chỉnh sửa)
    @GetMapping("/product/{productId}")
    public List<StockEntry> getStockEntriesByProduct(@PathVariable Long productId) {
        return stockEntryService.getStockEntriesByProduct(productId);
    }

    // API lấy toàn bộ lịch sử nhập hàng
    @GetMapping("/all")
    public List<StockEntry> getAllStockEntries() {
        return stockEntryService.getAllStockEntries();
    }

    // API chỉnh sửa số lượng nhập hàng
    @PutMapping("/update/{id}")
    public StockEntry updateStockQuantity(@PathVariable Long id,
            @RequestParam Integer newQuantity) {
        return stockEntryService.updateStockQuantity(id, newQuantity);
    }

    // API lấy bản ghi nhập hàng mới nhất của sản phẩm
    @GetMapping("/product/{productId}/latest")
    public StockEntry getLatestStockEntry(@PathVariable Long productId) {
        Product product = new Product();
        product.setId(productId);
        return stockEntryRepository.findTopByProductOrderByEntryDateDesc(product);
    }

}
