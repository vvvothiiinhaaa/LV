function sendMessage() {
    let messageInput = document.getElementById("userMessage");
    let message = messageInput.value.trim();

    if (message === "") return; // Không gửi tin nhắn trống

    // Thêm tin nhắn của người dùng vào khung chat
    appendMessage("user-message", message);

    // Xóa nội dung input sau khi gửi
    messageInput.value = "";

    // Gửi yêu cầu đến API
    fetch("http://localhost:8080/api/chat?message=" + encodeURIComponent(message), {
        method: "POST"
    })
    .then(response => response.text())
    .then(data => {
        // Hiển thị phản hồi từ ChatGPT
        appendMessage("bot-message", data);
    })
    .catch(error => console.error("Lỗi:", error));
}

// Thêm tin nhắn vào khung chat
function appendMessage(className, message) {
    let chatBox = document.getElementById("chatBox");
    let messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);

    // Cuộn xuống cuối cùng
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Bắt sự kiện nhấn Enter để gửi tin nhắn
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
// /// đóng close

document.getElementById("closeChat").addEventListener("click", function () {
    document.querySelector(".chat-container").style.display = "none";
});
