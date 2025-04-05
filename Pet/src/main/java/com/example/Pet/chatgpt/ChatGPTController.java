package com.example.Pet.chatgpt;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.ServiceforpetRepository;

@RestController
@RequestMapping("/api/chat")
public class ChatGPTController {

    @Autowired
    private ChatGPTService chatGPTService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ServiceforpetRepository serviceforpetRepository;

    // API để gửi tin nhắn đến ChatGPT
    @PostMapping
    public String chat(@RequestParam String message) {
        return chatGPTService.getChatResponse(message);
    }
    //  API tìm kiếm sản phẩm và dịch vụ theo từ khóa

    // @GetMapping("/search")
    // public ResponseEntity<List<Map<String, Object>>> search(@RequestParam String query) {
    //     List<Map<String, Object>> results = new ArrayList<>();
    //     //  Tìm kiếm sản phẩm trong database
    //     List<Product> products = productRepository.searchByName(query);
    //     for (Product product : products) {
    //         Map<String, Object> productData = new HashMap<>();
    //         productData.put("name", product.getName());
    //         productData.put("price", product.getPrice() != null ? product.getPrice() : "Chưa có giá");
    //         productData.put("quantity", product.getQuantity() != null ? product.getQuantity() : "Không rõ");
    //         results.add(productData);
    //     }
    //     //  Tìm kiếm dịch vụ thú cưng
    //     List<Serviceforpet> services = serviceforpetRepository.searchByName(query);
    //     for (Serviceforpet service : services) {
    //         Map<String, Object> serviceData = new HashMap<>();
    //         serviceData.put("name", service.getName());
    //         serviceData.put("description", service.getDescription());
    //         serviceData.put("Duration", service.getDuration());
    //         results.add(serviceData);
    //     }
    //     return ResponseEntity.ok(results);
    // }
    @GetMapping("/search")
    public ResponseEntity<String> askChatGPT(@RequestParam String message) {
        String reply = chatGPTService.getChatResponse(message);
        return ResponseEntity.ok(reply);
    }

    @PostMapping("/ask")
    public ResponseEntity<?> handleUserMessage(@RequestBody Map<String, String> request) {
        String userMessage = request.get("userMessage");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu nội dung tin nhắn."));
        }

        String reply = chatGPTService.getChatResponse(userMessage);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    // API để reset lịch sử trò chuyện (nếu cần bắt đầu hội thoại mới)
    @PostMapping("/reset")
    public String resetChat() {
        chatGPTService.resetChatHistory();
        return "Lịch sử trò chuyện đã được đặt lại.";
    }
}
