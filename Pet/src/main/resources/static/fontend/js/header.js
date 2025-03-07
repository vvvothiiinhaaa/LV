
function checkLoginStatus() {
    // Kiểm tra trạng thái đăng nhập
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const loginBtn = document.getElementById("loginBtn");
            const userSection = document.getElementById("userSection");
            const usernameDisplay = document.getElementById("uname");
            const loginBtn1 = document.getElementById("loginBtn1"); // Nút Đăng Nhập cho màn hình nhỏ
            const logoutMenu = document.getElementById("logoutMenu"); // Menu đăng xuất
            const logoutBtn = document.getElementById("logoutBtn"); // Nút Đăng xuất
            const cartCountElement = document.getElementById("cartCount"); 
            const avatarImage = document.querySelector(".avatar"); 
            // Kiểm tra nếu người dùng đã đăng nhập
            if (data.isLoggedIn) {
                loginBtn.style.display = "none";
                loginBtn1.style.display = "none"; // Cũng ẩn nút Đăng Nhập ở màn hình nhỏ
                userSection.classList.add("d-flex");  // Hiển thị userSection

                // Lấy thông tin người dùng từ API /api/auth/info
                const userId = data.userId;  // Lấy userId từ API /check-login

                // Fetch thông tin người dùng
                fetch(`/api/auth/info/${userId}`, { credentials: 'include' })
                    .then(response => response.json())
                    .then(userInfo => {
                        if (usernameDisplay) {
                            usernameDisplay.textContent = userInfo.username;  // Hiển thị tên người dùng
                        }
                        // Lấy URL ảnh người dùng và cập nhật thẻ <img> có class "avatar"
                        if (avatarImage && userInfo.url) {
                            avatarImage.src = userInfo.url;  // Cập nhật ảnh đại diện
                        } else {
                            avatarImage.src = './img/default-avata.png';  // Nếu không có ảnh, dùng ảnh mặc định
                        }
                    })
                    .catch(error => console.error('Error fetching user info:', error));

                    // Gọi API để lấy số lượng sản phẩm trong giỏ hàng
                    fetch(`http://localhost:8080/api/cart/count/${userId}`, { credentials: 'include' })
                    .then(response => response.json())
                    .then(productCount => {
                        // Hiển thị số lượng sản phẩm trong giỏ hàng lên giao diện
                        const cartCountElement = document.getElementById("cartCount");
                        if (cartCountElement) {
                            cartCountElement.textContent = productCount; // Cập nhật số lượng vào phần tử có id="cartCount"
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
                    });

                // Fetch thông tin giỏ hàng bằng userId
                fetch(`/api/cart/${userId}`, { credentials: 'include' })
                    .then(cartResponse => cartResponse.json())
                    .then(cartData => {
                        console.log(cartData);  // In ra dữ liệu giỏ hàng để kiểm tra
                        if (cartData && cartData.cartId) {
                            const cartId = cartData.cartId;
                            console.log("Cart ID: ", cartId);  // Hiển thị cartId
                            // Bạn có thể lưu cartId vào sessionStorage/localStorage hoặc sử dụng trong các chức năng sau
                        }
                    })
                    .catch(error => console.error('Error fetching cart info:', error));
                // Hiển thị menu đăng xuất khi click vào tên người dùng
                usernameDisplay.addEventListener("click", function(event) {
                    event.stopPropagation();  // Ngừng sự kiện lan truyền để tránh ẩn menu ngay khi click
                    logoutMenu.style.display = logoutMenu.style.display === "block" ? "none" : "block";  // Toggle hiển thị menu
                });

                // Ẩn menu khi click ra ngoài
                window.addEventListener("click", function(event) {
                    if (!usernameDisplay.contains(event.target) && !logoutMenu.contains(event.target)) {
                        logoutMenu.style.display = "none";  // Ẩn menu khi click ra ngoài
                    }
                });

                // Xử lý sự kiện Đăng xuất
                logoutBtn.addEventListener("click", function(event) {
                    event.preventDefault();
                    // Gọi API đăng xuất và chuyển hướng người dùng
                    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
                        .then(response => {
                            if (response.ok) {
                                console.log("Người dùng đã đăng xuất");
                                window.location.href = '/fontend/trangchu.html';  // Chuyển hướng đến trang đăng nhập
                            }
                        })
                        .catch(error => console.error('Error logging out:', error));
                });

            } else {
                loginBtn.style.display = "block";
                loginBtn1.style.display = "block"; // Hiển thị lại nút Đăng Nhập ở màn hình nhỏ
                userSection.classList.remove("d-flex"); // Ẩn phần người dùng
            }
        })
        .catch(error => console.error('Error checking login status:', error));
}



// document.addEventListener("DOMContentLoaded", function() {
//     // Tải header
//     fetch('header.html')
//         .then(response => response.text())
//         .then(data => {
//             const headerElement = document.getElementById('header');
//             if (headerElement) {
//                 headerElement.innerHTML = data;

//                 // Sau khi header được tải, kiểm tra trạng thái đăng nhập
//                 checkLoginStatus();
//                 // attachSearchEvent();
//             } else {
//                 console.error('Không tìm thấy phần tử #header');
//             }
//         })
//         .catch(error => console.error('Error loading header:', error));
// });


//          const searchToggle = document.getElementById('searchToggle');
//         const searchToggleDesktop = document.getElementById('searchToggleDesktop');
//         const searchForm = document.getElementById('searchForm');

//         searchToggle.addEventListener('click', () => {
//             searchForm.classList.toggle('active');
//         });

//         searchToggleDesktop.addEventListener('click', () => {
//             searchForm.classList.toggle('active');
//         });
document.addEventListener("DOMContentLoaded", function() {
    // Tải header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.innerHTML = data;

                // Sau khi header được tải, kiểm tra trạng thái đăng nhập
                checkLoginStatus();
                setupSearchEvent();
                // Gán sự kiện tìm kiếm sau khi header được tải
                const searchToggle = document.getElementById('searchToggle');
                const searchToggleDesktop = document.getElementById('searchToggleDesktop');
                const searchForm = document.getElementById('searchForm');

                // Kiểm tra sự tồn tại của các phần tử trước khi gán sự kiện
                if (searchToggle) {
                    searchToggle.addEventListener('click', () => {
                        searchForm.classList.toggle('active');
                    });
                }

                if (searchToggleDesktop) {
                    searchToggleDesktop.addEventListener('click', () => {
                        searchForm.classList.toggle('active');
                    });
                }
            } else {
                console.error('Không tìm thấy phần tử #header');
            }
        })
        .catch(error => console.error('Error loading header:', error));
});
// document.addEventListener('DOMContentLoaded', function () {
//     // Kiểm tra trạng thái đăng nhập và lấy userId
//     fetch('/api/auth/check-login', { credentials: 'include' })
//         .then(response => response.json())
//         .then(data => {
//             if (data.isLoggedIn) {
//                 const userId = data.userId;

//                 // Gọi API để lấy số lượng sản phẩm trong giỏ hàng
//                 fetch(`http://localhost:8080/api/cart/count/${userId}`, { credentials: 'include' })
//                     .then(response => response.json())
//                     .then(productCount => {
//                         // Hiển thị số lượng sản phẩm trong giỏ hàng lên giao diện
//                         const cartCountElement = document.getElementById("cartCount");
//                         if (cartCountElement) {
//                             cartCountElement.textContent = productCount; // Cập nhật số lượng vào phần tử có id="cart-count"
//                         }
//                     })
//                     .catch(error => {
//                         console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
//                     });
//             } else {
//                 console.log('Bạn chưa đăng nhập');
//             }
//         })
//         .catch(error => console.error('Lỗi khi kiểm tra đăng nhập:', error));
// });


// cập nhật giỏ hàng ngay khi thêm 
// Hàm để cập nhật số lượng sản phẩm trong giỏ hàng ngay sau khi thêm




// // cập nhật số lượng có trên giỏ hàng
// function updateCartCount(userId) {
// fetch(`http://localhost:8080/api/cart/count?userId=${userId}`, { credentials: 'include' })
//     .then(response => response.json())
//     .then(productCount => {
//         // Hiển thị số lượng sản phẩm trong giỏ hàng lên giao diện
//         const cartCountElement = document.getElementById("cartCount");
//         if (cartCountElement) {
//             cartCountElement.textContent = productCount; // Cập nhật số lượng vào phần tử có id="cartCount"
//         }
//     })
//     .catch(error => {
//         console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
//     });
// }



/////////////// chức năng tìm kiếm 
// Lắng nghe sự kiện khi người dùng nhấn Enter hoặc nhấn vào biểu tượng tìm kiếm
// Lắng nghe sự kiện khi người dùng nhấn Enter hoặc nhấn vào biểu tượng tìm kiếm
// Lắng nghe sự kiện khi nhấn Enter trong ô tìm kiếm
// document.getElementById("searchInput").addEventListener("keypress", function(event) {
//     if (event.key === "Enter") { // Kiểm tra xem phím nhấn là Enter
//         const searchQuery = document.getElementById("searchInput").value.trim();
//         if (searchQuery) {
//             fetchSearchResults(searchQuery); // Gọi API tìm kiếm
//         }
//     }
// });


// document.addEventListener("DOMContentLoaded", function() {
//     const searchToggleDesktop = document.getElementById("searchToggleDesktop");
//     if (searchToggleDesktop) {
//         searchToggleDesktop.addEventListener("click", function() {
//             const searchQuery = document.getElementById("searchInput").value.trim();
//             if (searchQuery) {
//                 fetchSearchResults(searchQuery);
//             }
//         });
//     }
// });

// Hàm định dạng giá sản phẩm
// function formatPrice(price) {
//     return price.toLocaleString('vi-VN');
// }


// window.onload = function() {
//     var isLoggedIn = false; // Kiểm tra nếu người dùng đã đăng nhập (thông qua session hoặc cookie)

//     // Nếu người dùng đã đăng nhập
//     if (isLoggedIn) {
//         document.getElementById('userSection').classList.remove('hidden');
//         document.getElementById('loginBtn').style.display = 'none'; // Ẩn nút Đăng Nhập
//     } else {
//         document.getElementById('userSection').classList.add('hidden');
//         document.getElementById('loginBtn').style.display = 'block'; // Hiển thị nút Đăng Nhập
//     }
// };

// //////////////// tải ảnh đại diện 
// window.onload = function() {
//     var profileImage = document.getElementById("userAvatar");
//     var userImageUrl = "https://example.com/user-avatar.jpg";

//     if (userImageUrl) {
//         profileImage.src = userImageUrl; 
//     } else {
//         profileImage.src = "https://example.com/default-avatar.jpg"; 
//     }
// };
// ///////////////////////////// tìm kiếm sản phẩm

// Hàm gán sự kiện cho nút tìm kiếm
function setupSearchEvent() {
    const searchInput = document.getElementById("searchquery");
    const searchButton = document.getElementById("btnsearch");

    // Gán giá trị từ URL vào khung tìm kiếm khi trang tải
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        searchInput.value = query; // Gán lại giá trị vào khung tìm kiếm
    }

    if (searchButton && searchInput) {
        // Sự kiện cho nút click
        searchButton.addEventListener("click", function(event) {
            event.preventDefault();  // Ngăn hành động mặc định của nút
            performSearch();
        });

        // Sự kiện khi nhấn phím Enter
        searchInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();  // Ngăn hành động mặc định của phím Enter
                performSearch();
            }
        });

    } else {
        console.error("Không tồn tại phần tử với ID searchquery hoặc btnsearch.");
    }
}

// Hàm thực hiện tìm kiếm
function performSearch() {
    var query = document.getElementById("searchquery").value.trim(); // Loại bỏ khoảng trắng

    console.log("Từ khóa tìm kiếm: ", query); // Kiểm tra giá trị nhập vào

    if (query.length > 0) {  // Kiểm tra nếu chuỗi tìm kiếm không rỗng sau khi loại bỏ khoảng trắng
        window.location.href = "http://localhost:8080/fontend/searchproduct.html?query=" + encodeURIComponent(query);
    } else {
        alert("Vui lòng nhập từ khóa tìm kiếm!");
    }
}
////////////////////////////// fetch footẻ
