
function sendMessage() {
    const messageInput = document.getElementById("userMessage");
    const message = messageInput.value.trim();


    if (message === "") return; // Không gửi tin nhắn trống

    //  Thêm tin nhắn người dùng vào khung chat
    appendMessage("user-message", message);

    //  Xóa nội dung input
    messageInput.value = "";


    //  Gửi tin nhắn đến ChatGPT
    askChatGPT(message);
}

//  Gửi yêu cầu đến ChatGPT nếu không có dữ liệu trong database
function askChatGPT(message) {
    fetch("http://localhost:8080/api/chat/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userMessage: message })
    })
    .then(response => response.json())
    .then(data => {
        const suggestions = document.getElementById("chatSuggestions");
        if (data.reply) {
            const formattedReply = data.reply.replace(/\n/g, "<br>");
            appendMessage("bot-message", formattedReply, true); // true = dùng innerHTML
        } else if (data.error) {
            appendMessage("bot-message",  data.error);
        }
            
            //  Sau khi gửi thì hiển thị lại gợi ý
            suggestions.style.display = "flex";
    })
    .catch(error => {
        console.error("Lỗi khi gọi ChatGPT:", error);
        appendMessage("bot-message", " Lỗi khi kết nối ChatGPT.");
    });
}


//  Thêm tin nhắn vào khung chat
function appendMessage(className, message, isHtml = false) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("div");
    messageElement.className = className;

    if (isHtml) {
        messageElement.innerHTML = message;
    } else {
        messageElement.textContent = message;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
////////////// nhập gợi ý
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("userMessage");
    const suggestions = document.getElementById("chatSuggestions");

    if (input && suggestions) {
        input.addEventListener("focus", function () {
            suggestions.style.display = "flex";
        });

        input.addEventListener("blur", function () {
            setTimeout(() => {
                suggestions.style.display = "none";
            }, 200);
        });
    }
});

// function fillSuggestion(element) {
//     const input = document.getElementById("userMessage");
//     const suggestions = document.getElementById("chatSuggestions");
//     input.value = element.innerText;
//     input.focus();
//     suggestions.style.display = "none";
// }

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("userMessage");
    const suggestions = document.getElementById("chatSuggestions");
    let hasSelectedSuggestion = false;

    if (input && suggestions) {
        // Khi người dùng focus vào ô nhập
        input.addEventListener("focus", function () {
            if (!hasSelectedSuggestion) {
                suggestions.style.display = "none";
            }
            hasSelectedSuggestion = false; // Reset lại
        });

        // Khi người dùng blur khỏi ô nhập
        input.addEventListener("blur", function () {
            setTimeout(() => {
                suggestions.style.display = "none";
            }, 200);
        });
    }

    // Hàm chọn gợi ý
    window.fillSuggestion = function (element) {
        const input = document.getElementById("userMessage");
        const suggestions = document.getElementById("chatSuggestions");
        input.value = element.innerText;
        input.focus();
        suggestions.style.display = "none";
        hasSelectedSuggestion = true;
    };
});
