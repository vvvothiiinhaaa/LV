package com.example.Pet.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.ProductPrice;
import com.example.Pet.Repository.ImgProductReponsitory;
import com.example.Pet.Repository.ProductPriceRepository;
import com.example.Pet.Repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImgProductReponsitory imgproductReponsitory;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.orElse(null); // Trả về sản phẩm hoặc null nếu không tìm thấy
    }

    ////////////////////////////////////////////////////////////// capạ nhật giá mới nhấtnhất
    @Autowired
    private ProductPriceRepository productPriceRepository;

    @Transactional
    public void updateProductPrice(Long productId) {
        // Lấy giá mới nhất từ ProductPrice
        ProductPrice latestPrice = productPriceRepository.findLatestPriceByProductId(productId);

        if (latestPrice != null) {
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();

                // Gán giá mới nhất vào Product
                Double oldPrice = product.getPrice();
                if (!latestPrice.getPrice().equals(oldPrice)) {
                    product.setPrice(latestPrice.getPrice());
                    productRepository.save(product);
                    System.out.println("Product price updated successfully: " + latestPrice.getPrice());
                } else {
                    System.out.println("Price is the same, no update needed.");
                }
            } else {
                throw new RuntimeException("Product not found with ID: " + productId);
            }
        } else {
            throw new RuntimeException("No latest price found for product with ID: " + productId);
        }
    }

    @Transactional
    public void updatePriceAndSync(Long productId, Double newPrice) {
        // Tìm giá mới nhất trong bảng ProductPrice
        ProductPrice latestPrice = productPriceRepository.findLatestPriceByProductId(productId);
        if (latestPrice != null) {
            // Cập nhật giá mới trong bảng ProductPrice
            latestPrice.setPrice(newPrice);
            productPriceRepository.save(latestPrice);
            System.out.println("Updated ProductPrice to new price: " + newPrice);

            // Cập nhật giá trong bảng Product
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                product.setPrice(newPrice);
                productRepository.save(product);
                System.out.println("Updated Product with new price: " + newPrice);
            } else {
                throw new RuntimeException("Product not found with ID: " + productId);
            }
        } else {
            throw new RuntimeException("No price entry found in ProductPrice for product ID: " + productId);
        }
    }

    ////////////////////////////////////// thêm sản phẩm mới
    // private static final String UPLOAD_DIR = "src/main/resources/static/fontend/img/";

    // public Product addProduct(MultipartFile mainImage, MultipartFile[] subImages, Product product) throws IOException {
    //     // Lưu ảnh chính của sản phẩm
    //     if (mainImage != null && !mainImage.isEmpty()) {
    //         String mainImagePath = saveFile(mainImage);
    //         product.setUrl(mainImagePath);
    //     }

    //     // Lưu sản phẩm vào database
    //     Product savedProduct = productRepository.save(product);

    //     // Lưu các ảnh phụ vào bảng ImgProduct
    //     imgProduct imgproduct = new imgProduct();
    //     imgproduct.setProduct(savedProduct);

    //     if (subImages != null && subImages.length >= 4) {
    //         imgproduct.setUrl1(saveFile(subImages[0]));
    //         imgproduct.setUrl2(saveFile(subImages[1]));
    //         imgproduct.setUrl3(saveFile(subImages[2]));
    //         imgproduct.setUrl4(saveFile(subImages[3]));
    //     }

    //     imgproductReponsitory.save(imgproduct);
    //     return savedProduct;
    // }

    // private String saveFile(MultipartFile file) throws IOException {
    //     String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    //     File saveFile = new File(UPLOAD_DIR + fileName);
    //     file.transferTo(saveFile);
    //     return "/img/" + fileName;
    // }


    ///////////////////////////////////// lọc sản phẩm mới
      public List<Product> getFilteredProducts(String category, String price) {
        // Nếu chọn "Tất cả", trả về tất cả sản phẩm
        if (category.equals("all") && price.equals("all")) {
            return productRepository.findAll();
        }

        // Lọc theo genre và giá
        if (!category.equals("all") && !price.equals("all")) {
            Double minPrice = 0.0, maxPrice = Double.MAX_VALUE;

            // Xử lý bộ lọc giá
            if (price.equals("0-100")) {
                maxPrice = 100000.0;
            } else if (price.equals("100-500")) {
                minPrice = 100000.0;
                maxPrice = 500000.0;
            } else if (price.equals("500")) {
                minPrice = 500000.0;
            }

            // Truy vấn theo genre và price
            return productRepository.findByGenreAndPriceBetween(category, minPrice, maxPrice);
        }

        // Nếu chỉ có một bộ lọc genre
        if (!category.equals("all")) {
            return productRepository.findByGenre(category);
        }

        // Nếu chỉ có bộ lọc giá
        if (!price.equals("all")) {
            Double minPrice = 0.0, maxPrice = Double.MAX_VALUE;

            // Xử lý bộ lọc giá
            if (price.equals("0-100")) {
                maxPrice = 100000.0;
            } else if (price.equals("100-500")) {
                minPrice = 100000.0;
                maxPrice = 500000.0;
            } else if (price.equals("500")) {
                minPrice = 500000.0;
            }

            return productRepository.findByPriceBetween(minPrice, maxPrice);
        }

        // Trả về tất cả nếu không có bộ lọc nào
        return productRepository.findAll();
    }

    // Tìm kiếm sản phẩm theo tên, thương hiệu, xuất xứ và danh mục
    public List<Product> searchProducts(String name, String brand, String origin, String genre) {
        if (name != null && brand != null && origin != null && genre != null) {
            return productRepository.findByNameContainingIgnoreCaseAndBrandContainingIgnoreCaseAndOriginContainingIgnoreCaseAndGenreContainingIgnoreCase(name, brand, origin, genre);
        }

        if (name != null) {
            return productRepository.findByNameContainingIgnoreCase(name);
        }

        if (brand != null) {
            return productRepository.findByBrandContainingIgnoreCase(brand);
        }

        if (origin != null) {
            return productRepository.findByOriginContainingIgnoreCase(origin);
        }

        if (genre != null) {
            return productRepository.findByGenreContainingIgnoreCase(genre);
        }

        // Nếu không có điều kiện nào, trả về tất cả sản phẩm
        return productRepository.findAll();
    }

}
