//    // Giả sử người dùng đã đăng nhập thành công
//    const loggedIn = true;
    
//    if (loggedIn) {
//        // Hiển thị thông tin người dùng và ẩn nút Đăng Nhập
//        document.getElementById('userSection').classList.remove('d-none');
//        document.getElementById('loginBtn').classList.add('d-none');
//        document.getElementById('username').textContent = "John Doe"; // Thay "John Doe" bằng tên người dùng thực tế
//    } else {
//        // Ẩn thông tin người dùng và hiển thị nút Đăng Nhập
//        document.getElementById('userSection').classList.add('d-none');
//        document.getElementById('loginBtn').classList.remove('d-none');
//    }


// function login() {
//     const username = document.getElementById("username-login").value.trim();
//     const passwords = document.getElementById("password-login").value.trim();
  
//     console.log("Hàm register được gọi với:", { username, passwords });
  
//     // Gửi yêu cầu đăng ký tới backend
//     fetch("http://localhost:8080/api/auth/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             username: username,
//             passwords: passwords,
//         })
//     })
//     .then((response) => {
//         if (!response.ok) {
//             return response.text().then((data) => {
//                 throw new Error(data || "Đã xảy ra lỗi");
//             });
//         }
//         // Đọc phản hồi dưới dạng JSON
//         return response.json();
//     })
//     .then((data) => {
//         console.log("Dữ liệu trả về từ API:", data);
    
//         // Kiểm tra xem có thuộc tính "redirect" trong dữ liệu trả về
//         if (data && data.redirect) {
//             window.location.href = data.redirect;  // Chuyển hướng đến trang được backend chỉ định
//         } else {
//             alert("Đăng nhập thành công!");
//         }
//     })
//     .catch((error) => {
//         console.error("Lỗi khi đăng nhập:", error);
//         const errorMessageElement = document.getElementById("error-message");
//         if (errorMessageElement) {
//             errorMessageElement.innerText = error.message;  // Hiển thị lỗi trong giao diện người dùng
//         }
//     });
    
    
    
//   }
// function login() {
//     // Lấy giá trị từ các ô input (username, password)
//     const username = document.getElementById('username-login').value;
//     const password = document.getElementById('password-login').value;

//     // Tạo đối tượng dữ liệu gửi đến backend
//     const loginRequest = {
//         username: username,
//         passwords: password
//     };

//     // Gửi yêu cầu đăng nhập tới backend
//     fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(loginRequest)
//     })
//     .then(response => {
//         if (response.status === 302) {
//             // Nếu backend trả về mã 302 (đăng nhập thành công và chuyển hướng), không cần xử lý gì thêm
//             // Hệ thống sẽ tự động chuyển hướng đến TrangChu.html
//             // Trường hợp này thường là backend sẽ thực hiện redirect.
//         } else if (response.status === 403) {
//             // Nếu trả về lỗi 403 (forbidden), thông báo lỗi cho người dùng
//             response.json().then(data => {
//                 alert(data.body); // Hiển thị thông báo lỗi từ backend
//             });
//         } else if (response.status === 400) {
//             // Nếu lỗi 400 (bad request), thông báo lỗi
//             response.json().then(data => {
//                 alert(data.body); // Hiển thị thông báo lỗi từ backend
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Đã xảy ra lỗi khi đăng nhập:', error);
//         alert('Đã có lỗi xảy ra, vui lòng thử lại.');
//     });
// }

// function login() {
//     console.log('Bắt đầu quá trình đăng nhập...');

//     // Lấy giá trị từ các ô input (username, password)
//     const username = document.getElementById('username-login').value;
//     const password = document.getElementById('password-login').value;

//     console.log('Tạo request: ', { username, password });

//     const loginRequest = {
//         username: username,
//         passwords: password
//     };

//     // Gửi yêu cầu đăng nhập tới backend
//     fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(loginRequest)
//     })
//     .then(response => {
//         console.log('Phản hồi từ backend:', response); // Kiểm tra phản hồi từ backend

//         if (response.status === 200) {
//             // Nếu đăng nhập thành công, chuyển hướng đến trang chủ
//             console.log('Đăng nhập thành công');
//             window.location.href = '/fontend/trangchu.html';  // Chuyển hướng đến trang chủ
//         } else if (response.status === 400 || response.status === 403) {
//             // Hiển thị thông báo lỗi nếu không phải là 200
//             response.text().then(errorMessage => {
//                 alert(errorMessage); // Hiển thị thông báo lỗi
//             });
//         } else {
//             // Xử lý các mã trạng thái khác nếu cần thiết
//             response.text().then(text => {
//                 alert('Đã có lỗi xảy ra: ' + text);
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Đã xảy ra lỗi khi đăng nhập:', error);
//         alert('Đã có lỗi xảy ra, vui lòng thử lại.');
//     });
// }

// function login() {
//     console.log('Bắt đầu quá trình đăng nhập...');

//     // Lấy giá trị từ các ô input (username, password)
//     const username = document.getElementById('username-login').value;
//     const password = document.getElementById('password-login').value;

//     console.log('Tạo request: ', { username, password });

//     const loginRequest = {
//         username: username,
//         passwords: password
//     };

//     // Gửi yêu cầu đăng nhập tới backend
//     fetch('http://localhost:8080/api/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(loginRequest)
//     })
//     .then(response => {
//         console.log('Phản hồi từ backend:', response); // Kiểm tra phản hồi từ backend

//         // Kiểm tra xem phản hồi có phải là văn bản (text) hay không
//         if (response.status === 200) {
//             response.text().then(message => {
//                 console.log(message);  // Hiển thị thông báo từ backend (ví dụ: "Đăng nhập thành công")
                
//                 // Cập nhật navbar với tên người dùng và giỏ hàng
//                 // Chuyển hướng đến trang chủ
//                 window.location.href = '/fontend/trangchu.html';  // Chuyển hướng đến trang chủ
                
//             });
//         } else if (response.status === 400 || response.status === 403) {
//             // Hiển thị thông báo lỗi nếu không phải là 200
//             response.text().then(errorMessage => {
//                 alert(errorMessage); // Hiển thị thông báo lỗi
//             });
//         } else {
//             // Xử lý các mã trạng thái khác nếu cần thiết
//             response.text().then(text => {
//                 alert('Đã có lỗi xảy ra: ' + text);
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Đã xảy ra lỗi khi đăng nhập:', error);
//         alert('Đã có lỗi xảy ra, vui lòng thử lại.');
//     });
// }

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