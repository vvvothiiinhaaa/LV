async function fetchUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        if (!response.ok) throw new Error('Lỗi xác thực');
        const data = await response.json();
        return data.userId;
    } catch (error) {
        console.error(error);
        alert('Không thể xác thực người dùng.');
        return null;
    }
}

// Lấy danh sách đơn hàng từ API
async function fetchOrders(userId, status = null) {
    const url = status ? `/api/orders/user/${userId}/status/${status}` : `/user/${userId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách đơn hàng');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Không thể tải danh sách đơn hàng.');
        return [];
    }
}

// Lấy chi tiết đơn hàng từ API
async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Lỗi khi lấy chi tiết đơn hàng');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Không thể tải chi tiết đơn hàng.');
        return null;
    }
}

// Hiển thị danh sách đơn hàng
function renderOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // Xóa nội dung cũ

    // Kiểm tra nếu không có đơn hàng
    if (orders.length === 0) {
        orderList.innerHTML = `<tr><td colspan="6">Không có đơn hàng</td></tr>`;
        return;
    }

    // Hiển thị danh sách đơn hàng
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.id}</td>
            <td>${new Date(order.orderDate).toLocaleString() || 'N/A'}</td>
            <td>${order.orderStatus || 'N/A'}</td>
            <td>${order.paymentMethod}</td>
            <td>${(order.totalPayment || 0).toLocaleString()} VNĐ</td>
            <td>
                <button class="btn btn-custom view-details-btn" data-order-id="${order.id}" data-bs-toggle="modal" data-bs-target="#orderDetailsModal">
                    Xem
                </button>
            </td>
             
            <td> <button class="btn btn-custom complete-details-btn" data-order-id="${order.id}" data-bs-toggle="modal" data-bs-target="#">
                    Hoàn Thành
                </button>
            </td>
             <td>
            <button class="btn btn-custom cancel-order-btn" data-order-id="${order.id}">
                <i class="fas fa-times"></i> Hủy
            </button>
             
        </td>
        `;
        orderList.appendChild(row);
    });

    // Gắn sự kiện cho các nút "Xem"
    attachViewDetailsEvents();
     // Gắn sự kiện cho các nút "Hủy"
     attachCancelOrderEvents();
}
//// gắn sự kiện cho nút hủyhủy
function attachCancelOrderEvents() {
    const cancelButtons = document.querySelectorAll('.cancel-order-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            openCancelConfirmationModal(orderId);
        });
    });
}

////////mở modal cho hủy
function openCancelConfirmationModal(orderId) {
    // Tạo modal nếu chưa tồn tại
    if (!document.getElementById('cancelConfirmationModal')) {
        const modalHtml = `
            <div class="modal fade" id="cancelConfirmationModal" tabindex="-1" aria-labelledby="cancelConfirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="cancelConfirmationModalLabel">Xác nhận hủy đơn hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc chắn muốn hủy đơn hàng này không?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-custom" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-custom" id="confirmCancelOrder">Xác nhận</button>
                             
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('cancelConfirmationModal'));
    modal.show();

    // Gắn sự kiện cho nút "Xác nhận"
    const confirmButton = document.getElementById('confirmCancelOrder');
    confirmButton.onclick = () => {
        cancelOrder(orderId, modal);
    };
}
////////////////////// gọi api để hủy đơn

function cancelOrder(orderId, modal) {
    fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Đơn hàng đã được hủy thành công.');
                modal.hide();
                location.reload(); // Tải lại danh sách đơn hàng
            } else {
                response.json().then(data => {
                    alert(data.message || 'Hủy đơn hàng thất bại.');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi hủy đơn hàng.');
        });
}



// Gắn sự kiện cho các nút "Xem" chi tiết đơn hàng
function attachViewDetailsEvents() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const orderId = button.getAttribute('data-order-id');
            const orderDetails = await fetchOrderDetails(orderId);
            if (orderDetails) renderOrderDetails(orderDetails);
        });
    });
}

// Hiển thị chi tiết đơn hàng
async function renderOrderDetails(order) {
    // Lấy thông tin địa chỉ từ API
    const address = await fetchAddressDetails(order.address.userId, order.address.addressId);

    // Hiển thị thông tin địa chỉ
    if (address) {
        document.getElementById('order-address').innerText = `
            Người nhận: ${address.recipientName}, 
            Số điện thoại: ${address.phoneNumber}, 
            Địa chỉ: ${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}
        `;
    } else {
        document.getElementById('order-address').innerText = "Không thể lấy thông tin địa chỉ.";
    }

    // Xử lý bảng chi tiết sản phẩm
    const orderDetailsTable = document.getElementById('order-details');
    orderDetailsTable.innerHTML = ''; // Xóa nội dung cũ

    // Kiểm tra nếu không có sản phẩm
    if (!order.items || order.items.length === 0) {
        orderDetailsTable.innerHTML = `<tr><td colspan="6">Không có sản phẩm trong đơn hàng</td></tr>`;
        return;
    }

   // Hiển thị danh sách sản phẩm
// Hiển thị danh sách sản phẩm
// Hiển thị danh sách sản phẩm
order.items.forEach(async (item, index) => {
    console.log(`Item ${index + 1}:`, item); // Log toàn bộ dữ liệu của từng item
    try {
        
        // Tạo dòng mới trong bảng
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${item.url}" alt="" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>${(item.total / item.quantity).toLocaleString()} VNĐ</td>
            <td>${item.total.toLocaleString()} VNĐ</td>
        `;
        orderDetailsTable.appendChild(row);
    } catch (error) {
        console.error(`Không thể lấy thông tin sản phẩm với ID: ${item.productId}`, error);
    }
});


}



// // Lấy thông tin chi tiết sản phẩm từ API
// // Lấy thông tin chi tiết sản phẩm từ API
// async function fetchProductDetails(productId) {
//     const url = `/api/products/${productId}`; // Đường dẫn API để lấy sản phẩm
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             console.error(`Không thể lấy thông tin sản phẩm với ID: ${productId}`);
//             return null;
//         }
//         const data = await response.json(); // Dữ liệu trả về từ API
//         console.log("Thông tin sản phẩm:", data); // Kiểm tra dữ liệu trả về
//         return data;
//     } catch (error) {
//         console.error(`Lỗi khi gọi API sản phẩm với ID: ${productId}`, error);
//         return null;
//     }
// }



// Lấy thông tin chi tiết địa chỉ từ API
async function fetchAddressDetails(userId, addressId) {
    const url = `/api/addresses/${userId}/${addressId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorDetails = await response.text(); // Log lỗi từ server
            console.error("Lỗi từ API địa chỉ:", response.status, errorDetails);
            return null;
        }
        const data = await response.json();
        console.log("Dữ liệu địa chỉ:", data); // Log dữ liệu để kiểm tra
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API địa chỉ:", error);
        alert('Không thể tải thông tin địa chỉ.');
        return null;
    }
}



// Gắn sự kiện cho các nút lọc
function attachFilterEvents(userId) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const status = button.getAttribute('data-status'); // Lấy trạng thái từ data-status
            const orders = status === 'all'
                ? await fetchOrders(userId) // Lấy tất cả đơn hàng
                : await fetchOrders(userId, status); // Lấy đơn hàng theo trạng thái
            renderOrders(orders); // Hiển thị danh sách đơn hàng
        });
    });
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', async () => {
    const userId = await fetchUserId(); // Lấy userId từ API
    if (!userId) return;

    // Hiển thị danh sách đơn hàng mặc định với trạng thái "Chờ Xác Nhận"
    const defaultStatus = "Chờ Xác Nhận";
    const orders = await fetchOrders(userId, defaultStatus);
    renderOrders(orders);

    // Đánh dấu nút "Chờ Xác Nhận" làm trạng thái được chọn mặc định
    document.querySelectorAll('.filter-btn').forEach(button => {
        if (button.getAttribute('data-status') === defaultStatus) {
            button.classList.add('active'); // Thêm lớp "active" hoặc lớp CSS tùy chỉnh nếu muốn
        }
    });

    // Gắn sự kiện cho các nút lọc trạng thái
    attachFilterEvents(userId);
});