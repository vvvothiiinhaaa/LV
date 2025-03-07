function handleLogout() {
    // Gửi yêu cầu đăng xuất tới backend
    fetch('http://localhost:8080/employee/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.text())  // Nhận phản hồi dưới dạng văn bản
    .then(data => {
        console.log(data);  // Log thông báo từ backend

        if (data.includes("Đăng xuất thành công")) {
            // Nếu đăng xuất thành công, chuyển hướng về trang đăng nhập
            window.location.href = 'employee-login.html';
        } else {
            // Nếu có lỗi xảy ra khi đăng xuất
            console.error("Có lỗi khi đăng xuất:", data);
            alert("Có lỗi khi đăng xuất, vui lòng thử lại.");
        }
    })
    .catch(error => {
        // Xử lý lỗi khi gửi yêu cầu
        console.error("Lỗi khi gửi yêu cầu đăng xuất:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại.");
    });
}
