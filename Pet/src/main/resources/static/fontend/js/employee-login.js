// Hàm để xử lý đăng nhập
async function handleLogin(event) {
    event.preventDefault(); // Ngừng hành động mặc định của nút submit (không làm mới trang)

    // Lấy giá trị từ các trường nhập liệu
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kiểm tra nếu các trường không rỗng
    if (!username || !password) {
        document.getElementById('error-message').innerText = 'Tên đăng nhập và mật khẩu không được để trống';
        return;
    }

    // Tạo đối tượng dữ liệu đăng nhập
    const loginData = {
        username: username,
        password: password
    };

    try {
        // Gửi yêu cầu POST tới API đăng nhập
        const response = await fetch('/employee/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        // Kiểm tra nếu phản hồi thành công
        if (response.ok) {
            const data = await response.json();
            // Lưu trữ thông tin đăng nhập thành công, ví dụ: lưu trong sessionStorage hoặc localStorage
            sessionStorage.setItem('admin', JSON.stringify(data));

            // Chuyển hướng đến trang quản lý sau khi đăng nhập thành công
            window.location.href = '/fontend/dashboard-employee.html'; // Điều chỉnh URL trang đích của bạn
        } else {
            const errorMessage = await response.text();
            document.getElementById('error-message').innerText = errorMessage;
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        document.getElementById('error-message').innerText = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
}


//////////////////// logout
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
