package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.imgProduct;
import com.example.Pet.Repository.ImgProductReponsitory;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Service.FileStorageService;
import com.example.Pet.Service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ImgProductReponsitory imgProductRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable("productId") Long productId) {
        Product product = productService.getProductById(productId);
        if (product != null) {
            return ResponseEntity.ok(product); // 200 OK
        } else {
            return ResponseEntity.status(404).body("Sản phẩm không tồn tại."); // 404 Not Found
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    /// api thêm giágiá ( test trên postman không cần body)
    @PutMapping("/{productId}/update-price")
    public String updateProductPrice(@PathVariable Long productId) {
        System.out.println("API called with productId: " + productId);
        productService.updateProductPrice(productId);
        return "Product price updated successfully!";
    }

    /// api cập nhật giá
    @PutMapping("/update-price/{productId}")
    public String updateProductPrice(@PathVariable Long productId, @RequestBody Double newPrice) {
        productService.updatePriceAndSync(productId, newPrice);
        return "ProductPrice and Product updated successfully!";
    }

    /////////////////////////////////////////// thêm sản phẩm mớimới

    @PostMapping("/add")
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("sold") Integer sold,
            @RequestParam("genre") String genre,
            @RequestParam("origin") String origin,
            @RequestParam("brand") String brand,
            @RequestParam("component") String component,
            @RequestParam("description") String description,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("ingredient") String ingredient,
            @RequestParam("url") MultipartFile urlFile,
            @RequestParam("url1") MultipartFile url1,
            @RequestParam("url2") MultipartFile url2,
            @RequestParam("url3") MultipartFile url3,
            @RequestParam("url4") MultipartFile url4) {

        // Lưu ảnh chính của sản phẩm
        String mainImageUrl = fileStorageService.saveFile(urlFile);  // Lưu ảnh chính

        // Tạo mới sản phẩm
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setSold(sold);
        product.setGenre(genre);
        product.setOrigin(origin);
        product.setBrand(brand);
        product.setComponent(component);
        product.setDescription(description);
        product.setQuantity(quantity);
        product.setIngredient(ingredient);
        product.setUrl(mainImageUrl);  // Đường dẫn của ảnh chính

        // Lưu sản phẩm vào cơ sở dữ liệu
        product = productRepository.save(product);

        // Lưu ảnh phụ
        imgProduct imgProd = new imgProduct();
        imgProd.setProductId(product.getId());
        imgProd.setUrl1(fileStorageService.saveFile(url1));  // Lưu ảnh phụ 1
        imgProd.setUrl2(fileStorageService.saveFile(url2));  // Lưu ảnh phụ 2
        imgProd.setUrl3(fileStorageService.saveFile(url3));  // Lưu ảnh phụ 3
        imgProd.setUrl4(fileStorageService.saveFile(url4));  // Lưu ảnh phụ 4

        // Lưu ảnh phụ vào cơ sở dữ liệu
        imgProductRepository.save(imgProd);

        return product;  // Trả về sản phẩm vừa được lưu
    }

    /////////////// lọc 1 sản phẩm
     @GetMapping("/filter")
    public List<Product> getFilteredProducts(
            @RequestParam(name = "category", defaultValue = "all") String category,
            @RequestParam(name = "price", defaultValue = "all") String price) {

        return productService.getFilteredProducts(category, price);
    }

    ////////////////////////////////// sreach sản phẩm
    /// // API tìm kiếm sản phẩm theo tên, thương hiệu, xuất xứ và danh mục
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String genre
    ) {
        return productService.searchProducts(name, brand, origin, genre);
    }
}
