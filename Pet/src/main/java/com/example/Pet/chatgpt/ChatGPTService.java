package com.example.Pet.chatgpt;

// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;
// @Service
// public class ChatGPTService {
//     private final String API_URL = "https://api.openai.com/v1/chat/completions";
//     private final String API_KEY = "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"; // Thay bằng API Key của bạn
//     public String getChatResponse(String userMessage) {
//         RestTemplate restTemplate = new RestTemplate();
//         // Tạo headers
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         headers.setBearerAuth(API_KEY);
//         // Tạo request body
//         Map<String, Object> body = new HashMap<>();
//         body.put("model", "gpt-4-turbo");
//         body.put("temperature", 0.2);
//         // Tạo danh sách tin nhắn
//         List<Map<String, String>> messages = new ArrayList<>();
//         messages.add(Map.of("role", "user", "content", userMessage));
//         body.put("messages", messages);
//         // Gửi request
//         HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//         ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);
//         // Trích xuất phản hồi từ API
//         if (response.getBody() != null) {
//             List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
//             if (!choices.isEmpty()) {
//                 return (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
//             }
//         }
//         return "Xin lỗi, không thể xử lý yêu cầu.";
//     }
// }
/////////////////////////////////////////////////////////////// lần 2
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// @Service
// public class ChatGPTService {

//     private final String API_URL = "https://api.openai.com/v1/chat/completions";
//     private final String API_KEY = "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"; // Thay bằng API Key của bạn
//     private List<Map<String, String>> chatHistory = new ArrayList<>(); // Lưu lịch sử hội thoại

//     public String getChatResponse(String userMessage) {
//         RestTemplate restTemplate = new RestTemplate();

//         // Tạo headers
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         headers.setBearerAuth(API_KEY);

//         // Thêm tin nhắn mới của người dùng vào lịch sử
//         chatHistory.add(Map.of("role", "user", "content", userMessage));

//         // Tạo request body
//         Map<String, Object> body = new HashMap<>();
//         body.put("model", "gpt-4-turbo");
//         body.put("temperature", 0.2);
//         body.put("messages", chatHistory); // Gửi toàn bộ lịch sử hội thoại

//         // Gửi request
//         HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//         ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);

//         // Trích xuất phản hồi từ API
//         if (response.getBody() != null) {
//             List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
//             if (!choices.isEmpty()) {
//                 String botReply = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

//                 // Lưu phản hồi của ChatGPT vào lịch sử
//                 chatHistory.add(Map.of("role", "assistant", "content", botReply));

//                 return botReply;
//             }
//         }
//         return "Xin lỗi, không thể xử lý yêu cầu.";
//     }

//     // Reset lịch sử trò chuyện (khi người dùng bắt đầu cuộc trò chuyện mới)
//     public void resetChatHistory() {
//         chatHistory.clear();
//     }
// }

////////////////////////////////////////// lần 3


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.ServiceforpetRepository;

@Service
public class ChatGPTService {

    private final String API_URL = "https://api.openai.com/v1/chat/completions";
    private final String API_KEY = "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"; // Thay API Key của bạn
    private List<Map<String, String>> chatHistory = new ArrayList<>();

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ServiceforpetRepository serviceforpetRepository;

    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        // ✅ Tìm dữ liệu sản phẩm hoặc dịch vụ nếu có
        String additionalData = searchForProductOrService(userMessage);

        // ✅ Thêm tin nhắn của người dùng vào lịch sử
        chatHistory.add(Map.of("role", "user", "content", userMessage));

        // ✅ Nếu tìm thấy dữ liệu từ database, thêm vào lịch sử
        if (!additionalData.isEmpty()) {
            chatHistory.add(Map.of("role", "assistant", "content", "Thông tin từ hệ thống: " + additionalData));
        }

        // ✅ Gửi toàn bộ lịch sử chat đến API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4-turbo");
        body.put("temperature", 0.2);
        body.put("messages", chatHistory);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);

        // ✅ Nhận phản hồi từ ChatGPT
        if (response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (!choices.isEmpty()) {
                String botReply = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

                // ✅ Thêm phản hồi của ChatGPT vào lịch sử để nhớ hội thoại
                chatHistory.add(Map.of("role", "assistant", "content", botReply));

                return botReply;
            }
        }
        return "Xin lỗi, không thể xử lý yêu cầu.";
    }

    // ✅ Tìm kiếm sản phẩm/dịch vụ trong database
    private String searchForProductOrService(String userMessage) {
        StringBuilder result = new StringBuilder();

        List<Product> products = productRepository.searchByName(userMessage);
        if (!products.isEmpty()) {
            result.append("Sản phẩm phù hợp:\n");
            for (Product p : products) {
                result.append("- ").append(p.getName())
                        .append(", Giá: ").append(p.getPrice())
                        .append(", Số lượng còn: ").append(p.getQuantity()).append(" cái.\n");
            }
        }

        List<Serviceforpet> services = serviceforpetRepository.findByNameContainingIgnoreCase(userMessage);
        if (!services.isEmpty()) {
            result.append("\nDịch vụ phù hợp:\n");
            for (Serviceforpet s : services) {
                result.append("- ").append(s.getName()).append(": ").append(s.getDescription()).append("\n");
            }
        }

        return result.toString();
    }

    // ✅ Reset lịch sử hội thoại khi cần thiết
    public void resetChatHistory() {
        chatHistory.clear();
    }
}
