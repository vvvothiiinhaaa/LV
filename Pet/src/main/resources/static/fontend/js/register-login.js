// chức năng đăng kí
// Đăng ký 
function register() {
    const username = document.getElementById("username").value.trim();
    const passwords = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
    console.log("Hàm register được gọi với:", { username, password, confirmPassword });
  
    // Gửi yêu cầu đăng ký tới backend
    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          passwords: passwords,
          confirmPassword: confirmPassword
      })
    })
    .then((response) => {
        // Đọc phản hồi dưới dạng văn bản và kiểm tra mã trạng thái
        return response.text().then((data) => {
            if (!response.ok) {
                // Nếu phản hồi không phải là 2xx, ném lỗi
                throw new Error(data || "Đã xảy ra lỗi");
            }
            // Nếu dữ liệu không phải JSON, xử lý dưới dạng văn bản
            try {
                return JSON.parse(data);  // Nếu có thể, thử phân tích JSON
            } catch (e) {
                return data;  // Nếu không phải JSON, trả về dữ liệu dưới dạng văn bản
            }
        });
    })
    .then((data) => {
        console.log("Dữ liệu trả về từ API:", data);
  
        // Nếu dữ liệu là văn bản, hiển thị thông báo thành công
        if (typeof data === 'string') {
            alert(data);  // Hiển thị thông báo như "Đăng ký thành công"
        } else {
            // Xử lý dữ liệu JSON nếu có (ví dụ: lỗi hoặc thông tin khác)
            alert("Đăng ký thành công!");
            window.location.href = ""; // Thay đổi đường dẫn nếu cần
        }
    })
    .catch((error) => {
        console.error("Lỗi khi đăng ký:", error);     
        document.getElementById("error-message").innerText = error.message;  // Hiển thị lỗi trong giao diện
    });
  }
  