package com.example.Pet.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.imgProductRepository;
import com.example.Pet.Service.FileStorageService;
import com.example.Pet.Service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    // @Autowired
    // private ImgProductReponsitory imgProductRepository;
    @Autowired
    private imgProductRepository imgproductRepository;

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

    // @PostMapping("/add")
    // public Product addProduct(
    //         @RequestParam("name") String name,
    //         @RequestParam("price") Double price,
    //         // @RequestParam("sold") Integer sold,
    //         @RequestParam("genre") String genre,
    //         @RequestParam("origin") String origin,
    //         @RequestParam("brand") String brand,
    //         @RequestParam("component") String component,
    //         @RequestParam("description") String description,
    //         @RequestParam("quantity") Integer quantity,
    //         @RequestParam("ingredient") String ingredient,
    //         @RequestParam("url") MultipartFile urlFile,
    //         @RequestParam("url1") MultipartFile url1,
    //         @RequestParam("url2") MultipartFile url2,
    //         @RequestParam("url3") MultipartFile url3,
    //         @RequestParam("url4") MultipartFile url4) {

    //     // Lưu ảnh chính của sản phẩm
    //     String mainImageUrl = fileStorageService.saveFile(urlFile);  // Lưu ảnh chính

    //     // Tạo mới sản phẩm
    //     Product product = new Product();
    //     product.setName(name);
    //     product.setPrice(price);
    //     // product.setSold(sold);
    //     product.setGenre(genre);
    //     product.setOrigin(origin);
    //     product.setBrand(brand);
    //     product.setComponent(component);
    //     product.setDescription(description);
    //     product.setQuantity(quantity);
    //     product.setIngredient(ingredient);
    //     product.setUrl(mainImageUrl);  // Đường dẫn của ảnh chính

    //     // Lưu sản phẩm vào cơ sở dữ liệu
    //     product = productRepository.save(product);

    //     // Lưu ảnh phụ
    //     imgProduct imgProd = new imgProduct();
    //     imgProd.setProductId(product.getId());
    //     imgProd.setUrl1(fileStorageService.saveFile(url1));  // Lưu ảnh phụ 1
    //     imgProd.setUrl2(fileStorageService.saveFile(url2));  // Lưu ảnh phụ 2
    //     imgProd.setUrl3(fileStorageService.saveFile(url3));  // Lưu ảnh phụ 3
    //     imgProd.setUrl4(fileStorageService.saveFile(url4));  // Lưu ảnh phụ 4

    //     // Lưu ảnh phụ vào cơ sở dữ liệu
    //     imgproductRepository.save(imgProd);

    //     return product;  // Trả về sản phẩm vừa được lưu
    // }
    @PostMapping("/add")
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("genre") String genre,
            @RequestParam("origin") String origin,
            @RequestParam("brand") String brand,
            @RequestParam("component") String component,
            @RequestParam("description") String description,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("ingredient") String ingredient,
            @RequestParam("url") MultipartFile urlFile,
            @RequestParam(value = "url1", required = false) MultipartFile url1,
            @RequestParam(value = "url2", required = false) MultipartFile url2,
            @RequestParam(value = "url3", required = false) MultipartFile url3,
            @RequestParam(value = "url4", required = false) MultipartFile url4) {

        // Lưu ảnh chính của sản phẩm
        String mainImageUrl = fileStorageService.saveFile(urlFile);

        // Tạo mới sản phẩm với `sold = 0` mặc định
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setSold(0);  //  Mặc định giá trị `sold` là 0
        product.setGenre(genre);
        product.setOrigin(origin);
        product.setBrand(brand);
        product.setComponent(component);
        product.setDescription(description);
        product.setQuantity(quantity);
        product.setIngredient(ingredient);
        product.setUrl(mainImageUrl);

        // Lưu sản phẩm vào cơ sở dữ liệu
        product = productRepository.save(product);

        // Tạo đối tượng `imgProduct` chỉ khi có ảnh phụ
        imgProduct imgProd = new imgProduct();
        imgProd.setProductId(product.getId());

        // Chỉ lưu ảnh phụ nếu được tải lên
        imgProd.setUrl1(url1 != null && !url1.isEmpty() ? fileStorageService.saveFile(url1) : null);
        imgProd.setUrl2(url2 != null && !url2.isEmpty() ? fileStorageService.saveFile(url2) : null);
        imgProd.setUrl3(url3 != null && !url3.isEmpty() ? fileStorageService.saveFile(url3) : null);
        imgProd.setUrl4(url4 != null && !url4.isEmpty() ? fileStorageService.saveFile(url4) : null);

        // Kiểm tra nếu có ít nhất một ảnh phụ thì mới lưu vào DB
        if (imgProd.getUrl1() != null || imgProd.getUrl2() != null || imgProd.getUrl3() != null || imgProd.getUrl4() != null) {
            imgproductRepository.save(imgProd);
        }

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

    // Endpoint tìm kiếm sản phẩm
    @GetMapping("/search-products")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("query") String query) {
        List<Product> products = productService.searchProducts(query);
        return products.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(products)
                : ResponseEntity.ok(products);
    }

    ////////////////////////////////////////// cập nhật sản phẩm
    // @PutMapping("/{productId}/update")
    // public ResponseEntity<Product> updateProduct(
    //         @PathVariable Long productId,
    //         @RequestParam("name") String name,
    //         @RequestParam("sold") Integer sold,
    //         @RequestParam("genre") String genre,
    //         @RequestParam("origin") String origin,
    //         @RequestParam("brand") String brand,
    //         @RequestParam("component") String component,
    //         @RequestParam("description") String description,
    //         @RequestParam("quantity") Integer quantity,
    //         @RequestParam("ingredient") String ingredient,
    //         @RequestParam(value = "url", required = false) MultipartFile urlFile,
    //         @RequestParam(value = "url1", required = false) MultipartFile url1,
    //         @RequestParam(value = "url2", required = false) MultipartFile url2,
    //         @RequestParam(value = "url3", required = false) MultipartFile url3,
    //         @RequestParam(value = "url4", required = false) MultipartFile url4) {

    //     Optional<Product> productOptional = productRepository.findById(productId);
    //     if (!productOptional.isPresent()) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     Product product = productOptional.get();
    //     product.setName(name);  
    //     product.setSold(sold);
    //     product.setGenre(genre);
    //     product.setOrigin(origin);
    //     product.setBrand(brand);
    //     product.setComponent(component);
    //     product.setDescription(description);
    //     product.setQuantity(quantity);
    //     product.setIngredient(ingredient);

    //     if (urlFile != null) {
    //         product.setUrl(fileStorageService.saveFile(urlFile));
    //     }

    //     product = productRepository.save(product);

    //     Optional<imgProduct> imgProductOptional = imgproductRepository.findByProductId(productId);
    //     imgProduct imgProd = imgProductOptional.orElse(new imgProduct());
    //     imgProd.setProductId(product.getId());

    //     if (url1 != null) {
    //         imgProd.setUrl1(fileStorageService.saveFile(url1));
    //     }
    //     if (url2 != null) {
    //         imgProd.setUrl2(fileStorageService.saveFile(url2));
    //     }
    //     if (url3 != null) {
    //         imgProd.setUrl3(fileStorageService.saveFile(url3));
    //     }
    //     if (url4 != null) {
    //         imgProd.setUrl4(fileStorageService.saveFile(url4));
    //     }

    //     imgproductRepository.save(imgProd);

    //     return ResponseEntity.ok(product);
    // }
    // /////////////////// cậpp nhật có thể vắng các cột 
    // @PutMapping("/{productId}/update")
    // public ResponseEntity<Product> updateProduct(
    //         @PathVariable Long productId,
    //         @RequestParam(value = "name", required = false) String name,
    //         @RequestParam(value = "price", required = false) Double price,
    //         @RequestParam(value = "sold", required = false) Integer sold, // Thêm required = false
    //         @RequestParam(value = "genre", required = false) String genre,
    //         @RequestParam(value = "origin", required = false) String origin,
    //         @RequestParam(value = "brand", required = false) String brand,
    //         @RequestParam(value = "component", required = false) String component,
    //         @RequestParam(value = "description", required = false) String description,
    //         @RequestParam(value = "quantity", required = false) Integer quantity,
    //         @RequestParam(value = "ingredient", required = false) String ingredient,
    //         @RequestParam(value = "url", required = false) MultipartFile urlFile) {

    //     Optional<Product> productOptional = productRepository.findById(productId);
    //     if (!productOptional.isPresent()) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     Product product = productOptional.get();
    //     if (name != null) {
    //         product.setName(name);
    //     }
    //     if (price != null) {
    //         product.setPrice(price);
    //     }
    //     if (sold != null) {
    //         product.setSold(sold);  // Chỉ cập nhật nếu có giá trị

    //     }
    //     if (genre != null) {
    //         product.setGenre(genre);
    //     }
    //     if (origin != null) {
    //         product.setOrigin(origin);
    //     }
    //     if (brand != null) {
    //         product.setBrand(brand);
    //     }
    //     if (component != null) {
    //         product.setComponent(component);
    //     }
    //     if (description != null) {
    //         product.setDescription(description);
    //     }
    //     if (quantity != null) {
    //         product.setQuantity(quantity);
    //     }
    //     if (ingredient != null) {
    //         product.setIngredient(ingredient);
    //     }

    //     if (urlFile != null) {
    //         product.setUrl(fileStorageService.saveFile(urlFile));
    //     }

    //     product = productRepository.save(product);

    //     return ResponseEntity.ok(product);
    // }

    @PutMapping("/{productId}/update")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "sold", required = false) Integer sold,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "component", required = false) String component,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "quantity", required = false) Integer quantity,
            @RequestParam(value = "ingredient", required = false) String ingredient,
            @RequestParam(value = "url", required = false) MultipartFile urlFile,
            @RequestParam(value = "url1", required = false) MultipartFile url1,
            @RequestParam(value = "url2", required = false) MultipartFile url2,
            @RequestParam(value = "url3", required = false) MultipartFile url3,
            @RequestParam(value = "url4", required = false) MultipartFile url4) {

        // Kiểm tra sản phẩm tồn tại
        Optional<Product> productOptional = productRepository.findById(productId);
        if (!productOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOptional.get();

        // Cập nhật các trường của sản phẩm nếu có giá trị
        if (name != null) {
            product.setName(name);
        }
        if (price != null) {
            product.setPrice(price);
        }
        if (sold != null) {
            product.setSold(sold);
        }
        if (genre != null) {
            product.setGenre(genre);
        }
        if (origin != null) {
            product.setOrigin(origin);
        }
        if (brand != null) {
            product.setBrand(brand);
        }
        if (component != null) {
            product.setComponent(component);
        }
        if (description != null) {
            product.setDescription(description);
        }
        if (quantity != null) {
            product.setQuantity(quantity);
        }
        if (ingredient != null) {
            product.setIngredient(ingredient);
        }

        // Cập nhật ảnh chính nếu có
        if (urlFile != null) {
            product.setUrl(fileStorageService.saveFile(urlFile));
        }

        // Lưu sản phẩm đã cập nhật
        product = productRepository.save(product);

        // Kiểm tra ảnh phụ cũ
        Optional<imgProduct> imgProductOptional = imgproductRepository.findByProductId(productId);
        imgProduct imgProd = imgProductOptional.orElse(new imgProduct());
        imgProd.setProductId(product.getId());

        // Cập nhật ảnh phụ nếu có thay đổi
        if (url1 != null && !url1.isEmpty()) {
            imgProd.setUrl1(fileStorageService.saveFile(url1));
        }
        if (url2 != null && !url2.isEmpty()) {
            imgProd.setUrl2(fileStorageService.saveFile(url2));
        }
        if (url3 != null && !url3.isEmpty()) {
            imgProd.setUrl3(fileStorageService.saveFile(url3));
        }
        if (url4 != null && !url4.isEmpty()) {
            imgProd.setUrl4(fileStorageService.saveFile(url4));
        }

        // Lưu ảnh phụ vào cơ sở dữ liệu nếu có ít nhất một ảnh phụ
        imgproductRepository.save(imgProd);

        return ResponseEntity.ok(product);
    }

    // API lấy danh sách 10 sản phẩm bán chạy nhất
    @GetMapping("/best-sellers")
    public List<Product> getBestSellers() {
        return productService.getBestSellers();
    }

    //  API lấy 5 sản phẩm mới nhất
    @GetMapping("/new")
    public ResponseEntity<List<Product>> getNewProducts() {
        List<Product> newProducts = productService.getNewProducts();
        return ResponseEntity.ok(newProducts);
    }

    //  API lấy 5 sản phẩm bán chạy nhất
    @GetMapping("/best-seller")
    public ResponseEntity<List<Product>> getBestSellingProducts() {
        List<Product> bestSellers = productService.getBestSellingProducts();
        return ResponseEntity.ok(bestSellers);
    }

    @GetMapping("/product/count")
    public long getProductCount() {
        return productService.countAllProducts();
    }

}
