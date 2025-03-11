package com.example.Pet.chatgpt;

// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// @RestController
// @RequestMapping("/api/chat")
// public class ChatGPTController {
//     private final ChatGPTService chatGPTService;
//     public ChatGPTController(ChatGPTService chatGPTService) {
//         this.chatGPTService = chatGPTService;
//     }
//     @PostMapping
//     public String chatWithGPT(@RequestParam String message) {
//         return chatGPTService.getChatResponse(message);
//     }
// }
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatGPTController {

    @Autowired
    private ChatGPTService chatGPTService;

    // API để gửi tin nhắn đến ChatGPT
    @PostMapping
    public String chat(@RequestParam String message) {
        return chatGPTService.getChatResponse(message);
    }

    // API để reset lịch sử trò chuyện (nếu cần bắt đầu hội thoại mới)
    @PostMapping("/reset")
    public String resetChat() {
        chatGPTService.resetChatHistory();
        return "Lịch sử trò chuyện đã được đặt lại.";
    }
}
