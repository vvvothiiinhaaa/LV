package com.example.Pet.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.imgProduct;
import com.example.Pet.Service.imgProductService;

@RestController
@RequestMapping("/api/images")
public class imgProductController {

    @Autowired
    private imgProductService imgproductService;

    @GetMapping("/{productId}")
    public imgProduct getImagesByProductId(@PathVariable Long productId) {
        return imgproductService.getImagesByProductId(productId);
    }

    @GetMapping("/img/{productId}")
    public Map<String, Object> imgByProduct(@PathVariable Long productId) {
        imgProduct imageproduct = imgproductService.imgByProduct(productId);
        Map<String, Object> response = new HashMap<>();
        if (imageproduct != null) {
            response.put("id", imageproduct.getId());
            response.put("productId", imageproduct.getProductId());
            List<String> images = new ArrayList<>();
            if (imageproduct.getUrl1() != null) {
                images.add(imageproduct.getUrl1());
            }
            if (imageproduct.getUrl2() != null) {
                images.add(imageproduct.getUrl2());
            }
            if (imageproduct.getUrl3() != null) {
                images.add(imageproduct.getUrl3());
            }
            if (imageproduct.getUrl4() != null) {
                images.add(imageproduct.getUrl4());
            }
            response.put("images", images);
        } else {
            response.put("message", "Không tìm thấy hình ảnh cho sản phẩm ID: " + productId);
        }
        return response;
    }
}

// package com.example.Pet.Controller;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.example.Pet.Modal.imgProduct;
// import com.example.Pet.Service.imgProductService;
// @RestController
// @RequestMapping("/api/images")
// public class imgProductController {
//     @Autowired
//     private imgProductService imgproductService;
//     // Lấy ảnh dựa theo productId (Trả về một imgProduct duy nhất)
//     @GetMapping("/{productId}")
//     public imgProduct getImagesByProductId(@PathVariable Long productId) {
//         return imgproductService.getImagesByProductId(productId);
//     }
//     // Trả về danh sách ảnh của sản phẩm dưới dạng Map JSON
//     @GetMapping("/img/{productId}")
//     public Map<String, Object> imgByProduct(@PathVariable Long productId) {
//         imgProduct imageproduct = imgproductService.imgByProduct(productId);
//         Map<String, Object> response = new HashMap<>();
//         if (imageproduct != null) {
//             response.put("id", imageproduct.getId());
//             // Lấy ID của sản phẩm (Tránh sử dụng productId bị lỗi)
//             if (imageproduct.getProduct() != null) {
//                 response.put("productId", imageproduct.getProduct().getId());
//             } else {
//                 response.put("productId", null);
//             }
//             // Lấy danh sách ảnh
//             List<String> images = new ArrayList<>();
//             if (imageproduct.getUrl1() != null) {
//                 images.add(imageproduct.getUrl1());
//             }
//             if (imageproduct.getUrl2() != null) {
//                 images.add(imageproduct.getUrl2());
//             }
//             if (imageproduct.getUrl3() != null) {
//                 images.add(imageproduct.getUrl3());
//             }
//             if (imageproduct.getUrl4() != null) {
//                 images.add(imageproduct.getUrl4());
//             }
//             response.put("images", images);
//         } else {
//             response.put("message", "Không tìm thấy hình ảnh cho sản phẩm ID: " + productId);
//         }
//         return response;
//     }
// }
