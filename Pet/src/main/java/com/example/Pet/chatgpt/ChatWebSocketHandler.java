// package com.example.Pet.chatgpt;

// import java.io.IOException;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.socket.TextMessage;
// import org.springframework.web.socket.WebSocketSession;
// import org.springframework.web.socket.handler.TextWebSocketHandler;

// public class ChatWebSocketHandler extends TextWebSocketHandler {

//     @Autowired
//     private ChatGPTService chatGPTService;

//     @Override
//     protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
//         String userMessage = message.getPayload();
//         String botResponse = chatGPTService.chatWithGPT(userMessage);
//         session.sendMessage(new TextMessage(botResponse));
//     }
// }
