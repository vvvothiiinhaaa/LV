async function checkLoginStatus() {
    try {
        const response = await fetch('/employee/check-login'); // Đợi phản hồi
        if (response.ok) {
            const employee = await response.json(); // Đợi chuyển đổi JSON
            console.log("Đã đăng nhập:", employee.username);

            // Lưu thông tin vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", employee.username);
            return true;
        } else {
            console.log("Chưa đăng nhập.");
            localStorage.removeItem("isLoggedIn");
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error);
        localStorage.removeItem("isLoggedIn");
        return false;
    }
}

// document.addEventListener("DOMContentLoaded", async () => {
//     const isLoggedIn = await checkLoginStatus();
//     if (isLoggedIn) {
//         // displayCurrentLoggedInEmployee();
//         // loadAnnouncements(); 
//         renderNotificationList(3);
//     } else {
//         window.location.href = "/login.html";
//     }
// });



fetch('/api/products/product/count')
.then(response => response.json())
.then(count => {
    // Gán số sản phẩm card
    document.getElementById('product-count').innerText = count;
})
.catch(error => {
    console.error('Lỗi khi lấy số sản phẩm:', error);
    document.getElementById('product-count').innerText = '0';
});

//// fetch số dịch vụ vào

fetch('/services/count')
.then(response => response.json())
.then(count => {
    // Gán số sản phẩm card
    document.getElementById('service-count').innerText = count;
})
.catch(error => {
    console.error('Lỗi khi lấy số sản phẩm:', error);
    document.getElementById('service-count').innerText = '0';
});

/// đơn hàng chưa duyệt

fetch('/api/orders/count/pending')
.then(response => response.json())
.then(count => {
    // Gán số sản phẩm card
    document.getElementById('order-count').innerText = count;
})
.catch(error => {
    console.error('Lỗi khi lấy số sản phẩm:', error);
    document.getElementById('order-count').innerText = '0';
});

/// lịch hẹn của ngày hôm nay

fetch('/api/appointments/today/count')
.then(response => response.json())
.then(count => {
    // Gán số sản phẩm card
    document.getElementById('appointment-count').innerText = count;
})
.catch(error => {
    console.error('Lỗi khi lấy số sản phẩm:', error);
    document.getElementById('appointment-count').innerText = '0';
});

/// hiểnthi mã giảm giá

    fetch('/api/discounts/all')
        .then(response => response.json())
        .then(discounts => {
            const list = document.getElementById('discount-list');
            list.innerHTML = ''; // Clear nếu có sẵn

            discounts.forEach(discount => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';

                const badgeClass = discount.status === 'EXPIRING_SOON'
                    ? 'badge bg-warning text-dark'
                    : 'badge bg-success';

                    li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${discount.code}</strong>
                        <span class="badge bg-success ms-4">${discount.discountPercentage}%</span>
                    </div>
                    <small class="text-muted fst-italic">
                        Đơn hàng có giá trị từ ${Number(discount.minOrderAmount).toLocaleString('vi-VN')}đ
                    </small>
                `;
                

                list.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy mã giảm giá:', error);
        });
/// hiển thị thông báo

async function renderNotificationList(limit = 3) {
    try {
        const res = await fetch("http://localhost:8080/admin/announcements");
        if (!res.ok) {
            throw new Error(`Lỗi HTTP ${res.status}: Không thể lấy thông báo`);
        }
        const data = await res.json();
        console.log(data);  // In dữ liệu ra để kiểm tra
        const listContainer = document.getElementById("notificationList");

        listContainer.innerHTML = "";

        if (data.length === 0) {
            listContainer.innerHTML = `<li class="list-group-item text-muted">Chưa có thông báo.</li>`;
            return;
        }

        data.slice(-limit).reverse().forEach(item => {
            const createdDate = new Date(item.createdAt);
            const formattedDate = createdDate.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                <div>
                         ${item.content}
                    <div class="text-muted small mt-1"> ${formattedDate}</div>
                </div>
            `;
            listContainer.appendChild(li);
        });
    } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderNotificationList();
});
