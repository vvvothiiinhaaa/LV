package com.example.Pet.chatgpt;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Pet.Modal.Discount;
import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.ServiceStep;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.DiscountRepository;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.ServiceforpetRepository;
import com.example.Pet.Service.ServiceforpetService;

@Service
public class ChatGPTService {

    private final String API_URL = "https://api.openai.com/v1/chat/completions";
    private final String API_KEY = "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"; // Ẩn API Key
    private List<Map<String, String>> chatHistory = new ArrayList<>();

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ServiceforpetService serviceforpetService;

    @Autowired
    private ServiceforpetRepository serviceforpetRepository;

    public String getChatResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        Set<IntentType> intents = detectIntent(userMessage);
        String additionalData = fetchDataByIntent(userMessage, intents);

        // Rút gọn dữ liệu nếu quá dài
        if (additionalData.length() > 2500) {
            additionalData = additionalData.substring(0, 2000) + "\n...(dữ liệu đã được rút gọn)";
        }

        // Nếu có dữ liệu nội bộ → ép GPT ưu tiên dùng
        if (!additionalData.isEmpty()) {
            chatHistory.add(Map.of(
                    "role", "system",
                    "content", "Dữ liệu từ hệ thống có thể giúp trả lời người dùng:\n" + additionalData
                    + "\nVui lòng ưu tiên sử dụng thông tin trên để phản hồi nếu phù hợp."
            ));
        }

        // Câu hỏi người dùng sau cùng
        chatHistory.add(Map.of("role", "user", "content", userMessage));

        // Giới hạn số lượt hội thoại gửi GPT
        int maxHistorySize = 4;
        if (chatHistory.size() > maxHistorySize) {
            chatHistory = new ArrayList<>(chatHistory.subList(chatHistory.size() - maxHistorySize, chatHistory.size()));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(API_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4-turbo");
        body.put("temperature", 0.2);
        body.put("messages", chatHistory);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        long start = System.currentTimeMillis();
        ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, Map.class);
        long duration = System.currentTimeMillis() - start;

        System.out.println(" Gọi GPT mất: " + duration + "ms");
        if (duration > 10000) {
            System.err.println(" CẢNH BÁO: GPT phản hồi quá chậm (" + duration + "ms)");
        }

        if (response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (!choices.isEmpty()) {
                String botReply = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
                chatHistory.add(Map.of("role", "assistant", "content", botReply));
                return botReply;
            }
        }

        return "Xin lỗi, không thể xử lý yêu cầu.";
    }

    public void resetChatHistory() {
        chatHistory.clear();
    }

    private String extractServiceKeyword(String message) {
        message = message.toLowerCase();
        // Loại bỏ các stop words không quan trọng, giữ lại từ "dịch vụ" vì có thể là phần của tên dịch vụ.
        String[] stopWords = {
            "quy trình", "hướng dẫn", "thực hiện",
            "là gì", "bao gồm", "chi tiết", "về", "cho", "của",
            "tôi muốn biết", "xin", "vui lòng"
        };
        for (String word : stopWords) {
            message = message.replaceAll("\\b" + word + "\\b", "");
        }
        return message.trim().replaceAll("\\s+", " ");
    }

    private static final Map<IntentType, List<String>> INTENT_KEYWORDS = Map.of(
            IntentType.ASK_PRODUCT, List.of("sản phẩm", "mua", "thức ăn", "đồ chơi", "lồng", "dụng cụ"),
            IntentType.ASK_SERVICE, List.of("dịch vụ", "răng miệng", "spa", "tắm", "cắt tỉa", "ký sinh", "chăm sóc"),
            IntentType.ASK_PRICE, List.of("bảng giá", "giá", "bao nhiêu", "rẻ", "đắt", "chi phí"),
            IntentType.ASK_STOCK, List.of("còn không", "tồn kho", "số lượng", "còn hàng"),
            IntentType.ASK_BRAND, List.of("Whiskas", "Pedigree", "Royal Canin"),
            IntentType.ASK_PET_TYPE, List.of("chó", "mèo", "hamster", "thỏ"),
            IntentType.ASK_PROMOTION, List.of("khuyến mãi", "giảm giá", "ưu đãi"),
            IntentType.ASK_STEPS, List.of("các bước", "quy trình", "hướng dẫn", "thực hiện", "trình tự", "bước nào", "bắt đầu", "bao gồm gì") // 👈 thêm từ khóa về bước

    );

    private Set<IntentType> detectIntent(String userMessage) {
        String msg = userMessage.toLowerCase();
        Set<IntentType> intents = new HashSet<>();

        for (Map.Entry<IntentType, List<String>> entry : INTENT_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (msg.contains(keyword)) {
                    intents.add(entry.getKey());
                    break;
                }
            }
        }

        if (intents.isEmpty()) {
            intents.add(IntentType.UNKNOWN);
        }
        return intents;
    }

    private Optional<String> extractBrand(String message) {
        List<String> knownBrands = List.of("whiskas", "pedigree", "royal canin");

        for (String brand : knownBrands) {
            if (message.toLowerCase().contains(brand.toLowerCase())) {
                return Optional.of(brand);
            }
        }
        return Optional.empty();
    }

    private String fetchDataByIntent(String message, Set<IntentType> intents) {
        StringBuilder result = new StringBuilder();
        String msg = message.toLowerCase();
        System.out.println("Tin nhắn người dùng: " + message);
        System.out.println("Các intent phát hiện: " + intents);

        // 2. Nếu không phải dịch vụ -> xử lý sản phẩm
        List<Product> products = productRepository.searchByKeyword(message);
        Optional<String> brandOpt = extractBrand(msg);

        if (brandOpt.isPresent()) {
            String brand = brandOpt.get();
            List<Product> brandProducts = productRepository.searchByKeyword(brand);
            if (!brandProducts.isEmpty()) {
                result.append("Sản phẩm theo thương hiệu **").append(brand).append("**:\n");
                for (Product p : brandProducts) {
                    result.append("- ").append(p.getName())
                            .append(p.getPrice() != null ? ", Giá: " + p.getPrice() + "đ" : ", Giá: chưa có")
                            .append("\n");
                }
            }
        } else if (intents.contains(IntentType.ASK_PET_TYPE) && !products.isEmpty()) {
            result.append("Sản phẩm theo loại thú cưng:\n");
            for (Product p : products) {
                result.append("- ").append(p.getName())
                        .append(p.getPrice() != null ? ", Giá: " + p.getPrice() + "đ" : ", Giá: chưa có")
                        .append("\n");
            }
        } else {
            result.append("Không tìm thấy sản phẩm phù hợp với yêu cầu.\n");
        }

        // 1. Kiểm tra nếu người dùng hỏi về mã giảm giá
        if (msg.contains("có mã giảm giá gì") || msg.contains("các mã khuyến mãi") || msg.contains("mã ưu đãi") || msg.contains("các mã giảm giá hiện tại")) {
            List<Discount> activeDiscounts = discountRepository.findAllByStartDateBeforeAndEndDateAfterAndUsageLimitGreaterThan(
                    LocalDateTime.now(), LocalDateTime.now(), 0
            );

            if (activeDiscounts.isEmpty()) {
                result.append("Hiện tại không có mã giảm giá nào đang hoạt động.\n");
            } else {
                result.append("Các mã giảm giá đang còn hiệu lực:\n");
                for (Discount d : activeDiscounts) {
                    result.append("- Mã: ").append(d.getCode())
                            .append(", Giảm ").append(d.getDiscountPercentage()).append("%")
                            .append(", Đơn tối thiểu: ").append((int) d.getMinOrderAmount()).append("đ")
                            .append(", Hạn dùng: đến ").append(d.getEndDate().toLocalDate()).append("\n");
                }
            }

            System.out.println("Nội dung gửi cho GPT:\n" + result);
            return result.toString(); // Trả về ngay nếu chỉ hỏi về giảm giá
        }

        // ======== Nếu người dùng hỏi danh sách dịch vụ hiện có ========
        if (msg.contains("có những dịch vụ gì") || msg.contains("các dịch vụ hiện có") || msg.contains("danh sách dịch vụ")) {
            List<Serviceforpet> allServices = serviceforpetRepository.findAllWithDetails2();
            if (!allServices.isEmpty()) {
                result.append("Danh sách dịch vụ hiện có:\n");
                for (Serviceforpet s : allServices) {
                    result.append("- ").append(s.getName()).append("\n");
                }
            } else {
                result.append("Hiện tại chưa có dịch vụ nào trong hệ thống.\n");
            }
            System.out.println("Nội dung gửi cho GPT:\n" + result);
            return result.toString(); //  return ngay, không xử lý tiếp
        }

        // Nhận diện mẫu câu hỏi cố định (mở rộng từ khóa)
        boolean isPriceQuery = msg.contains("giá của") || msg.contains("bảng giá của") || msg.contains("bảng giá ") || msg.contains("giá");
        boolean isStepsQuery = msg.contains("các bước của") || msg.contains("các bước thực hiện của")
                || msg.contains("quy trình của") || msg.contains("hướng dẫn của") || msg.contains("các bước");

        // Trích xuất tên dịch vụ từ mẫu cố định
        String serviceName;
        if (isPriceQuery) {
            serviceName = msg.replace("giá của", "")
                    .replace("bảng giá của", "")
                    .replace("bảng giá", "")
                    .replace("giá", "").trim();
        } else if (isStepsQuery) {
            serviceName = msg.replace("các bước của", "")
                    .replace("các bước thực hiện của", "")
                    .replace("các bước", "")
                    .replace("quy trình của", "")
                    .replace("hướng dẫn của", "").trim();
        } else {
            // Nếu không khớp mẫu cố định, xử lý bằng keyword
            serviceName = extractServiceKeyword(message);
        }

        System.out.println("Tên dịch vụ tìm kiếm: " + serviceName);
        // Tìm kiếm dịch vụ bằng tên (ở đây có thể dùng truy vấn LIKE để so khớp gần đúng)
        List<Serviceforpet> services = serviceforpetService.searchWithDetails3(serviceName);
        System.out.println("Số dịch vụ tìm thấy: " + services.size());
        // Nếu không tìm được dịch vụ, thông báo.
        if (services.isEmpty()) {
            result.append("Không tìm thấy dịch vụ phù hợp với yêu cầu.\n");
            System.out.println("Nội dung gửi cho GPT:\n" + result);
            return result.toString();
        }
        // Lấy dịch vụ đầu tiên (hoặc bạn có thể cải tiến để hiển thị danh sách)
        Serviceforpet service = services.get(0);
        // Lưu lại ngữ cảnh dịch vụ (nếu bạn đã có biến lastService, có thể cập nhật ở đây)
        // lastService = service;
        result.append("\nDịch vụ: ").append(service.getName()).append("\n");
        // Nếu người dùng hỏi theo mẫu "Giá của dịch vụ X"
        if (isPriceQuery) {
            if (service.getPrices() != null && !service.getPrices().isEmpty()) {
                result.append("Bảng giá theo kích thước thú cưng:\n");
                for (ServicePrice sp : service.getPrices()) {
                    result.append("  - ").append(sp.getPetSize().getSizeName())
                            .append(": ").append(sp.getPrice()).append("đ\n");
                }
            } else {
                result.append("Dịch vụ này chưa có bảng giá.\n");
            }
        } // Nếu người dùng hỏi theo mẫu "Các bước thực hiện của dịch vụ X" hoặc "Quy trình của dịch vụ X"
        else if (isStepsQuery) {
            if (service.getSteps() != null && !service.getSteps().isEmpty()) {
                result.append("Các bước thực hiện:\n");
                service.getSteps().stream()
                        .sorted(Comparator.comparingInt(ServiceStep::getStepOrder))
                        .forEach(step -> result.append("  • Bước ")
                        .append(step.getStepOrder()).append(": ")
                        .append(step.getStepTitle()).append(" - ")
                        .append(step.getStepDescription()).append("\n"));
            } else {
                result.append("Dịch vụ này chưa có quy trình/bước thực hiện.\n");
            }
        } // Nếu không theo mẫu cố định, hiển thị đầy đủ thông tin của dịch vụ
        else {
            result.append("Mô tả: ").append(service.getDescription()).append("\n");
            result.append("Thời gian thực hiện: ").append(service.getDuration()).append("\n");

            if (service.getPrices() != null && !service.getPrices().isEmpty()) {
                result.append("Bảng giá theo kích thước thú cưng:\n");
                for (ServicePrice sp : service.getPrices()) {
                    result.append("  - ").append(sp.getPetSize().getSizeName())
                            .append(": ").append(sp.getPrice()).append("đ\n");
                }
            } else {
                result.append("Dịch vụ này chưa có bảng giá.\n");
            }
            if (service.getSteps() != null && !service.getSteps().isEmpty()) {
                result.append("Các bước thực hiện:\n");
                service.getSteps().stream()
                        .sorted(Comparator.comparingInt(ServiceStep::getStepOrder))
                        .forEach(step -> result.append("  • Bước ")
                        .append(step.getStepOrder()).append(": ")
                        .append(step.getStepTitle()).append(" - ")
                        .append(step.getStepDescription()).append("\n"));
            } else {
                result.append("Dịch vụ này chưa có quy trình/bước thực hiện.\n");
            }
        }

        System.out.println("Nội dung gửi cho GPT:\n" + result);
        return result.toString();
    }

    enum IntentType {
        ASK_PRODUCT,
        ASK_SERVICE,
        ASK_PRICE,
        ASK_STOCK,
        ASK_BRAND,
        ASK_PET_TYPE,
        ASK_PROMOTION,
        ASK_STEPS,
        UNKNOWN
    }

    private Serviceforpet lastService;

    // Hàm fetchDataByIntent kết hợp cả sản phẩm và dịch vụ, hỗ trợ câu hỏi cố định riêng biệt cho giá và các bước của dịch vụ.
    // private String fetchDataByIntent(String message, Set<IntentType> intents) {
    //     StringBuilder result = new StringBuilder();
    //     String msg = message.toLowerCase();
    //     System.out.println("Tin nhắn người dùng: " + message);
    //     System.out.println("Các intent phát hiện: " + intents);
    //     // Tiền xử lý tên dịch vụ
    //     String cleanedKeyword = extractServiceKeyword(message);
    //     System.out.println("Từ khóa sau xử lý: " + cleanedKeyword);
    //     List<Product> products = productRepository.searchByKeyword(message);
    //     List<Serviceforpet> services = serviceforpetService.searchWithDetails3(cleanedKeyword);
    //     System.out.println("Số sản phẩm tìm thấy: " + products.size());
    //     System.out.println("Số dịch vụ tìm thấy: " + services.size());
    //     Optional<String> brandOpt = extractBrand(msg);
    //     // 1. Nếu có thương hiệu -> hiển thị sản phẩm theo thương hiệu
    //     if (brandOpt.isPresent()) {
    //         String brand = brandOpt.get();
    //         List<Product> brandProducts = productRepository.searchByKeyword(brand);
    //         if (!brandProducts.isEmpty()) {
    //             result.append("Sản phẩm theo thương hiệu **").append(brand).append("**:\n");
    //             for (Product p : brandProducts) {
    //                 result.append("- ").append(p.getName())
    //                         .append(p.getPrice() != null ? ", Giá: " + p.getPrice() + "đ" : ", Giá: chưa có")
    //                         .append("\n");
    //             }
    //         }
    //     } // 2. Nếu người dùng hỏi theo loại thú cưng -> hiển thị sản phẩm theo loại
    //     else if (intents.contains(IntentType.ASK_PET_TYPE) && !products.isEmpty()) {
    //         result.append("Sản phẩm theo loại thú cưng:\n");
    //         for (Product p : products) {
    //             result.append("- ").append(p.getName())
    //                     .append(p.getPrice() != null ? ", Giá: " + p.getPrice() + "đ" : ", Giá: chưa có")
    //                     .append("\n");
    //         }
    //     } // 3. Nếu người dùng yêu cầu danh sách dịch vụ hiện có
    //     else if (msg.contains("có những dịch vụ gì") || msg.contains("các dịch vụ hiện có") || msg.contains("danh sách dịch vụ")) {
    //         List<Serviceforpet> allServices = serviceforpetRepository.findAllWithDetails2();
    //         if (!allServices.isEmpty()) {
    //             result.append("Danh sách dịch vụ hiện có:\n");
    //             for (Serviceforpet s : allServices) {
    //                 result.append("- ").append(s.getName()).append("\n");
    //             }
    //         }
    //     } // 4. Chi tiết dịch vụ
    //     else if (!services.isEmpty()) {
    //         // Kiểm tra xem câu hỏi có theo mẫu cố định riêng cho giá hay cho các bước hay không:
    //         boolean isPriceQuery = msg.contains("giá của dịch vụ") || msg.contains("giá của") || msg.contains("bảng giá của");
    //         boolean isStepsQuery = msg.contains("các bước thực hiện của") || msg.contains("quy trình của");
    //         // Nếu theo mẫu cố định, trích xuất tên dịch vụ từ câu hỏi.
    //         String serviceName;
    //         if (isPriceQuery) {
    //             serviceName = msg.replace("giá của dịch vụ", "").trim();
    //         } else if (isStepsQuery) {
    //             if (msg.contains("các bước thực hiện của")) {
    //                 serviceName = msg.replace("các bước thực hiện của", "").trim();
    //             } else {
    //                 serviceName = msg.replace("quy trình của", "").trim();
    //             }
    //         } else {
    //             serviceName = cleanedKeyword;
    //         }
    //         System.out.println("Tên dịch vụ tìm kiếm: " + serviceName);
    //         // Tìm kiếm lại dựa trên tên dịch vụ trích xuất được (nếu cần)
    //         List<Serviceforpet> filteredServices = serviceforpetService.searchWithDetails3(serviceName);
    //         if (!filteredServices.isEmpty()) {
    //             services = filteredServices;
    //         }
    //         // Nếu vẫn không tìm được, có thể dùng dịch vụ đã lưu từ ngữ cảnh.
    //         if (services.isEmpty() && lastService != null) {
    //             System.out.println("Không tìm thấy dịch vụ với từ khóa, sử dụng dịch vụ đã lưu từ ngữ cảnh.");
    //             services.add(lastService);
    //         } else if (!services.isEmpty()) {
    //             lastService = services.get(0); // cập nhật ngữ cảnh
    //         }
    //         // Xử lý hiển thị thông tin của dịch vụ theo mẫu cố định nếu có:
    //         Serviceforpet service = services.get(0);
    //         result.append("\nDịch vụ: ").append(service.getName()).append("\n");
    //         if (isPriceQuery && !isStepsQuery) {
    //             // Chỉ hiển thị bảng giá
    //             if (service.getPrices() != null && !service.getPrices().isEmpty()) {
    //                 result.append("Bảng giá theo kích thước thú cưng:\n");
    //                 for (ServicePrice sp : service.getPrices()) {
    //                     result.append("  - ").append(sp.getPetSize().getSizeName())
    //                             .append(": ").append(sp.getPrice()).append("đ\n");
    //                 }
    //             } else {
    //                 result.append("Dịch vụ này chưa có bảng giá.\n");
    //             }
    //         } else if (isStepsQuery && !isPriceQuery) {
    //             // Chỉ hiển thị các bước thực hiện
    //             if (service.getSteps() != null && !service.getSteps().isEmpty()) {
    //                 result.append("Các bước thực hiện:\n");
    //                 service.getSteps().stream()
    //                         .sorted(Comparator.comparingInt(ServiceStep::getStepOrder))
    //                         .forEach(step -> result.append("  • Bước ")
    //                         .append(step.getStepOrder()).append(": ")
    //                         .append(step.getStepTitle()).append(" - ")
    //                         .append(step.getStepDescription()).append("\n"));
    //             } else {
    //                 result.append("Dịch vụ này chưa có quy trình/bước thực hiện.\n");
    //             }
    //         } else {
    //             // Nếu không theo mẫu cố định, hiển thị đầy đủ thông tin của dịch vụ
    //             result.append("Mô tả: ").append(service.getDescription()).append("\n");
    //             if (service.getPrices() != null && !service.getPrices().isEmpty()) {
    //                 result.append("Bảng giá theo kích thước thú cưng:\n");
    //                 for (ServicePrice sp : service.getPrices()) {
    //                     result.append("  - ").append(sp.getPetSize().getSizeName())
    //                             .append(": ").append(sp.getPrice()).append("đ\n");
    //                 }
    //             } else {
    //                 result.append("Dịch vụ này chưa có bảng giá.\n");
    //             }
    //             if (service.getSteps() != null && !service.getSteps().isEmpty()) {
    //                 result.append("Các bước thực hiện:\n");
    //                 service.getSteps().stream()
    //                         .sorted(Comparator.comparingInt(ServiceStep::getStepOrder))
    //                         .forEach(step -> result.append("  • Bước ")
    //                         .append(step.getStepOrder()).append(": ")
    //                         .append(step.getStepTitle()).append(" - ")
    //                         .append(step.getStepDescription()).append("\n"));
    //             } else {
    //                 result.append("Dịch vụ này chưa có quy trình/bước thực hiện.\n");
    //             }
    //         }
    //     } // 5. Không tìm thấy dịch vụ phù hợp
    //     else {
    //         result.append("Không tìm thấy dịch vụ phù hợp với yêu cầu.\n");
    //     }
    //     System.out.println("Nội dung gửi cho GPT:\n" + result);
    //     return result.toString();
    // }
}
