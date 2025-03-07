function updateNavbar(userID) {
    // Kiểm tra sự tồn tại của các phần tử trước khi thay đổi
    const loginBtn = document.getElementById('loginBtn');
    const userSection = document.getElementById('userSection');
    const usernameElement = document.getElementById('username');
    const cartIcon = document.querySelector('.bi-cart-fill');

    if (loginBtn) {
        loginBtn.classList.add('d-none'); // Ẩn nút "Đăng Nhập"
    }

    if (userSection) {
        userSection.classList.remove('d-none'); // Hiển thị phần tử người dùng
    }

    if (usernameElement) {
        usernameElement.textContent = username; // Cập nhật tên người dùng
    }

    // Lấy giỏ hàng của người dùng từ backend, sử dụng username làm userId
    fetch(`http://localhost:8080/api/cart/${userID}`)
        .then(response => response.json())
        .then(cart => {
            // Kiểm tra nếu giỏ hàng trống
            if (cartIcon) {
                const cartCount = cart.items.length; // Giả sử cart.items chứa các sản phẩm trong giỏ hàng
                const cartBadge = document.createElement('span');
                cartBadge.classList.add('badge', 'bg-danger');
                cartBadge.textContent = cartCount; // Số lượng sản phẩm trong giỏ hàng

                // Nếu giỏ hàng trống, hiển thị "0"
                if (cartCount === 0) {
                    cartBadge.textContent = '0'; // Giỏ hàng trống
                }

                // Gắn số lượng giỏ hàng vào icon giỏ hàng
                cartIcon.appendChild(cartBadge);
            } else {
                console.error('Không tìm thấy icon giỏ hàng');
            }
        })
        .catch(error => {
            console.error('Không thể tải giỏ hàng:', error);
        });
}

function login() {
    console.log('Bắt đầu quá trình đăng nhập...');

    // Lấy giá trị từ các ô input (username, password)
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    console.log('Tạo request: ', { username, password });

    const loginRequest = {
        username: username,
        passwords: password
    };
// Gửi yêu cầu đăng nhập tới backend
fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginRequest)
})
.then(response => {
    console.log('Phản hồi từ backend:', response); // Kiểm tra phản hồi từ backend

    // Kiểm tra xem phản hồi có phải là thành công (status 200)
    if (response.status === 200) {
        response.json().then(data => {
            console.log(data);  // Hiển thị dữ liệu trả về từ backend (thông tin người dùng và giỏ hàng)
            // Chuyển hướng đến trang chủ
            window.location.href = '/fontend/trangchu.html';  // Chuyển hướng đến trang chủ
        });
    } else if (response.status === 400 || response.status === 403) {
        // Hiển thị thông báo lỗi nếu không phải là 200
        response.text().then(errorMessage => {
            alert(errorMessage); // Hiển thị thông báo lỗi
        });
    } else {
        // Xử lý các mã trạng thái khác nếu cần thiết
        response.text().then(text => {
            alert('Đã có lỗi xảy ra: ' + text);
        });
    }
})
.catch(error => {
    console.error('Đã xảy ra lỗi khi đăng nhập:', error);
    alert('Đã có lỗi xảy ra, vui lòng thử lại.');
});
}