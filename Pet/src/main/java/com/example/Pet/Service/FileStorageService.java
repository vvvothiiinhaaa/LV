package com.example.Pet.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // xử lý ảnh
    public String saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            System.out.println("Tệp không hợp lệ!");
            return null;
        }

        // Đảm bảo sử dụng đường dẫn chính xác, có thể là tuyệt đối hoặc từ thư mục gốc
        String folder = "C:\\Users\\ASUS\\Downloads\\Pet\\Pet\\src\\main\\resources\\static\\fontend\\img"; // Đường dẫn lưu tệp
        String fileName = file.getOriginalFilename();

        if (fileName == null || fileName.isEmpty()) {
            System.out.println("Tên tệp không hợp lệ!");
            return null;
        }

        Path path = Paths.get(folder, fileName);

        try {
            // Kiểm tra và tạo thư mục nếu chưa tồn tại
            Files.createDirectories(path.getParent()); // Tạo thư mục nếu chưa tồn tại
            file.transferTo(path.toFile()); // Ghi tệp vào hệ thống

            System.out.println("Đã lưu ảnh tại: " + path.toString());
            return "img/" + fileName;  // Trả về đường dẫn của ảnh để lưu vào cơ sở dữ liệu
        } catch (IOException e) {
            System.err.println("Lỗi khi ghi tệp: " + e.getMessage());
            e.printStackTrace();
            return null; // Xử lý lỗi nếu cần
        }
    }

}
