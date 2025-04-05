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
        const isCompleted = order.orderStatus === "Hoàn Thành" || order.orderStatus ==="Chờ Xác Nhận" || order.orderStatus=== "Đã Hủy" || order.orderStatus === "Đã Xác Nhận"; // Kiểm tra trạng thái đơn hàng
        const isCompletedOrShipping = order.orderStatus === "Đang Giao" || order.orderStatus === "Hoàn Thành"; // Kiểm tra trạng thái
        const isdelete = order.orderStatus=== "Đã Hủy" || order.orderStatus === "Hoàn Thành" || order.orderStatus === "Đang Giao" || order.orderStatus === "Đã Xác Nhận" ;
        let paymentMethodDisplay = order.paymentMethod === "ONLINE" ? "Đã Thanh Toán" : order.paymentMethod;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.id}</td>
            <td>${new Date(order.orderDate).toLocaleString() || 'N/A'}</td>
            <td>${order.orderStatus || 'N/A'}</td>
            <td>${paymentMethodDisplay}</td>
            <td>${(order.totalPayment || 0).toLocaleString()} VNĐ</td>
            <td>
                <button class="btn btn-custom view-details-btn" data-order-id="${order.id}" data-bs-toggle="modal" data-bs-target="#orderDetailsModal">
                    Xem
                </button>
            </td>
             
            <td> 
            <button class="btn btn-custom complete-details-btn" data-order-id="${order.id}" data-bs-toggle="modal" data-bs-target="#" ${isCompleted ? 'disabled' : ''}>
                    Hoàn Thành
                </button>
            </td>
             <td>
            <button class="btn btn-custom cancel-order-btn" data-order-id="${order.id}" ${isdelete ? 'disabled' : ''}>
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

     //gán sự kiện cho nút hoàn thành đơn hàng
     attachCompleteOrderEvents();
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

// // Hiển thị chi tiết đơn hàng
// async function renderOrderDetails(order) {
//     // Lấy thông tin địa chỉ từ API
//     const address = await fetchAddressDetails(order.address.userId, order.address.addressId);

//     // Hiển thị thông tin địa chỉ
//     if (address) {
//         document.getElementById('order-address').innerText = `
//             Người nhận: ${address.recipientName}, 
//             Số điện thoại: ${address.phoneNumber}, 
//             Địa chỉ: ${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}
//         `;
//     } else {
//         document.getElementById('order-address').innerText = "Không thể lấy thông tin địa chỉ.";
//     }

//     // Xử lý bảng chi tiết sản phẩm
//     const orderDetailsTable = document.getElementById('order-details');
//     orderDetailsTable.innerHTML = ''; // Xóa nội dung cũ

//     // Kiểm tra nếu không có sản phẩm
//     if (!order.items || order.items.length === 0) {
//         orderDetailsTable.innerHTML = `<tr><td colspan="6">Không có sản phẩm trong đơn hàng</td></tr>`;
//         return;
//     }

//      // Kiểm tra trạng thái đơn hàng
//     //  const isCompleted = order.orderStatus === "Hoàn Thành";
//     const isPendingOrShipping = order.orderStatus === "Chờ Xác Nhận" || order.orderStatus === "Đang Giao" || order.orderStatus === "Đã Xác Nhận"; // Kiểm tra trạng thái

//    // Hiển thị danh sách sản phẩm

// order.items.forEach(async (item, index) => {
//     console.log(`Item ${index + 1}:`, item); // Log toàn bộ dữ liệu của từng item
    
//     try {
        
//         // Tạo dòng mới trong bảng
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${item.id}</td>
//             <td><img src="${item.url}" alt="" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
//             <td>${item.productName}</td>
//             <td>${item.quantity}</td>
//             <td>${(item.total / item.quantity).toLocaleString()} VNĐ</td>
//             <td>${item.total.toLocaleString()} VNĐ</td>
//             <td>
//              <button type="button" class="btn btn-custom review-btn" data-order-item-id="${item.id}"
//               style="white-space: nowrap; display: inline-flex;"${isPendingOrShipping ? 'disabled' : ''} >Đánh Giá</button>
//             </td>
//         `;
        
//         orderDetailsTable.appendChild(row);
//     } catch (error) {
//         console.error(`Không thể lấy thông tin sản phẩm với ID: ${item.productId}`, error);
//     }
// });


//             const orderSummary = document.getElementById('order-summary');
//             orderSummary.innerHTML = `
//                 <tr>
//                     <td colspan="5" style="text-align: right; font-weight: bold;">Giảm giá:</td>
//                     <td colspan="2">${order.discount.toLocaleString()} VNĐ</td>
//                 </tr>
//                 <tr>
//                     <td colspan="5" style="text-align: right; font-weight: bold;">Tổng thanh toán:</td>
//                     <td colspan="2">${order.totalPayment.toLocaleString()} VNĐ</td>
//                 </tr>
//             `;


//          // Sau khi hiển thị sản phẩm, kiểm tra trạng thái đánh giá & vô hiệu hóa nếu cần
//         await checkAndDisableReviewButtons();
    
//         // Gắn sự kiện cho các nút "Đánh Giá"
//             attachReviewEvents();
// }

// Hiển thị chi tiết đơn hàng
async function renderOrderDetails(order) {
    try {
        // Kiểm tra xem đơn hàng có thông tin địa chỉ không
        if (!order.address) {
            document.getElementById('order-address').innerText = "Không tìm thấy thông tin địa chỉ.";
        } else {
            // Hiển thị thông tin địa chỉ từ `order.address`
            document.getElementById('order-address').innerHTML = `
            <strong>Người nhận:</strong>     ${order.address.recipientName} <br>
            <strong>Số điện thoại:</strong>     ${order.address.phoneNumber} <br>
            <strong>Địa chỉ:</strong>     ${order.address.addressDetail}, ${order.address.wardSubdistrict},  ${order.address.district}, ${order.address.provinceCity}
           
        `;
        }
        const noteElement = document.getElementById('order-note');
        if (noteElement) {
            noteElement.innerText = order.note && order.note.trim() !== "" ? order.note : "Không có ghi chú";
        }

        // Xử lý bảng chi tiết sản phẩm
        const orderDetailsTable = document.getElementById('order-details');
        orderDetailsTable.innerHTML = ''; // Xóa nội dung cũ

        // Kiểm tra nếu không có sản phẩm
        if (!order.items || order.items.length === 0) {
            orderDetailsTable.innerHTML = `<tr><td colspan="6">Không có sản phẩm trong đơn hàng</td></tr>`;
            return;
        }

        // Kiểm tra trạng thái đơn hàng
        const isPendingOrShipping = ["Chờ Xác Nhận", "Đang Giao", "Đã Xác Nhận"].includes(order.orderStatus);

        // Hiển thị danh sách sản phẩm
        order.items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, item); // Log dữ liệu từng sản phẩm

            // Tạo dòng mới trong bảng
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td><img src="${item.url}" alt="" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${(item.total / item.quantity).toLocaleString()} VNĐ</td>
                <td>${item.total.toLocaleString()} VNĐ</td>
                <td>
                    <button type="button" class="btn btn-custom review-btn" 
                        data-order-item-id="${item.id}" style="white-space: nowrap; display: inline-flex;" 
                        ${isPendingOrShipping ? 'disabled' : ''}>Đánh Giá</button>
                </td>
            `;

            orderDetailsTable.appendChild(row);
        });

        // Hiển thị tổng tiền & giảm giá
        const orderSummary = document.getElementById('order-summary');
        orderSummary.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: right; font-weight: bold;">Giảm giá:</td>
                <td colspan="2">${order.discount.toLocaleString()} VNĐ</td>
            </tr>
            <tr>
                <td colspan="5" style="text-align: right; font-weight: bold;">Tổng thanh toán:</td>
                <td colspan="2">${order.totalPayment.toLocaleString()} VNĐ</td>
            </tr>
        `;

        // Sau khi hiển thị sản phẩm, kiểm tra trạng thái đánh giá & vô hiệu hóa nếu cần
        await checkAndDisableReviewButtons();

        // Gắn sự kiện cho các nút "Đánh Giá"
        attachReviewEvents();

    } catch (error) {
        console.error("Lỗi khi hiển thị chi tiết đơn hàng:", error);
        document.getElementById('order-address').innerText = "Lỗi khi tải thông tin địa chỉ.";
    }
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



//////////////////// xác nhận hoàn thành đơn hàng
// Gắn sự kiện cho nút "Hoàn Thành"
function attachCompleteOrderEvents() {
    const completeButtons = document.querySelectorAll('.complete-details-btn');
    completeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            openCompleteConfirmationModal(orderId);
        });
    });
}

// Mở modal xác nhận hoàn thành đơn hàng
function openCompleteConfirmationModal(orderId) {
    if (!document.getElementById('completeConfirmationModal')) {
        const modalHtml = `
            <div class="modal fade" id="completeConfirmationModal" tabindex="-1" aria-labelledby="completeConfirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="completeConfirmationModalLabel">Xác nhận hoàn thành đơn hàng</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc chắn muốn đánh dấu đơn hàng này là "Hoàn Thành" không?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-custom" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-custom" id="confirmCompleteOrder">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('completeConfirmationModal'));
    modal.show();

    // Gắn sự kiện cho nút "Xác nhận"
    const confirmButton = document.getElementById('confirmCompleteOrder');
    confirmButton.onclick = () => {
        completeOrder(orderId, modal);
    };
}

// Gửi yêu cầu cập nhật trạng thái đơn hàng thành "Hoàn Thành"
function completeOrder(orderId, modal) {
    fetch(`http://localhost:8080/api/orders/${orderId}/status?newStatus=Hoàn Thành`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Đơn hàng đã được đánh dấu hoàn thành.');
                modal.hide();
                location.reload(); // Tải lại danh sách đơn hàng
            } else {
                response.json().then(data => {
                    alert(data.message || 'Cập nhật trạng thái thất bại.');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
        });
}

///////////////////// sự kiện gửi đánh giá
// Biến toàn cục để lưu userId
let loggedInUserId = null;
// 1️ Lấy userId từ API khi trang tải
async function fetchUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        if (!response.ok) throw new Error('Lỗi xác thực');
        const data = await response.json();
        loggedInUserId = data.userId || null; // Đảm bảo userId hợp lệ
        return loggedInUserId;
    } catch (error) {
        console.error(error);
        alert('Không thể xác thực người dùng.');
        return null;
    }
}

// Gọi fetchUserId khi trang load để lưu userId
document.addEventListener("DOMContentLoaded", async () => {
    await fetchUserId();
});

function attachReviewEvents() {
    document.querySelectorAll('.review-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const orderItemId = event.currentTarget.getAttribute('data-order-item-id');

            console.log(" Debug - orderItemId từ nút Đánh Giá:", orderItemId); // Kiểm tra giá trị

            if (!orderItemId) {
                alert(" Lỗi: Không thể lấy orderItemId.");
                return;
            }

            openReviewModal(orderItemId);
        });
    });
}

// 3️ Mở modal đánh giá
function openReviewModal(orderItemId) {
    // Xóa modal cũ nếu đã tồn tại
    const existingModal = document.getElementById('reviewModal');
    if (existingModal) existingModal.remove();


   
    // Chuyển focus vào textarea để đảm bảo không bị lỗi accessibility
    setTimeout(() => {
        document.getElementById("reviewText").focus();
    }, 100);

    // Tạo modal mới
    const modalHtml = `
        <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reviewModalLabel">Gửi đánh giá</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Vui lòng đánh giá sản phẩm của bạn:</p>
                        <div class="star-rating" id="starRating">
                            <span class="star" data-value="1">&#9733;</span>
                            <span class="star" data-value="2">&#9733;</span>
                            <span class="star" data-value="3">&#9733;</span>
                            <span class="star" data-value="4">&#9733;</span>
                            <span class="star" data-value="5">&#9733;</span>
                        </div>
                        <textarea id="reviewText" class="form-control mt-3" placeholder="Nhập đánh giá của bạn" rows="3"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="confirmSubmitReview">Gửi đánh giá</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thêm modal vào body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();

    // Gán lại sự kiện chọn sao
    setupStarRating();

    // Gắn sự kiện gửi đánh giá
    document.getElementById('confirmSubmitReview').onclick = () => {
        submitReview(orderItemId, modal);
    };

    //  // 💡 Khi modal đóng, gọi lại hàm disable để cập nhật nút
    //  modalElement.addEventListener('hidden.bs.modal', () => {
    //     checkAndDisableReviewButtons();
    // });
}

// 4️ Xử lý chọn số sao
function setupStarRating() {
    document.querySelectorAll('#reviewModal .star').forEach(star => {
        star.addEventListener('click', function () {
            const rating = this.getAttribute('data-value');
            document.getElementById('starRating').setAttribute('data-rating', rating);
            highlightStars(rating);
        });

        // Hiệu ứng hover
        star.addEventListener('mouseover', function () {
            highlightStars(this.getAttribute('data-value'));
        });

        star.addEventListener('mouseleave', function () {
            const currentRating = document.getElementById('starRating').getAttribute('data-rating') || 0;
            highlightStars(currentRating);
        });
    });
}

// Hiển thị số sao được chọn
function highlightStars(rating) {
    document.querySelectorAll('#reviewModal .star').forEach(star => {
        star.classList.remove('active');
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        }
    });
}

// Gửi đánh giá lên API
function submitReview(orderItemId, modal) {
    if (!loggedInUserId) {
        alert("Không thể xác thực người dùng. Vui lòng đăng nhập lại.");
        return;
    }

    // Kiểm tra nếu người dùng đã đánh giá chưa trước khi gửi POST
    fetch(`http://localhost:8080/reviews/check/${orderItemId}/${loggedInUserId}`)
        .then(response => response.json())
        .then(hasReviewed => {
            if (hasReviewed) {
                alert("Bạn đã đánh giá sản phẩm này rồi!");
                disableReviewButton(orderItemId);
                return;
            } else {
                sendReview(orderItemId, modal); // Nếu chưa đánh giá, gửi đánh giá mới
            }
        })
        .catch(error => {
            console.error("Lỗi khi kiểm tra đánh giá:", error);
            alert("Có lỗi xảy ra khi kiểm tra trạng thái đánh giá.");
        });
}

// Gửi đánh giá mới lên API
function sendReview(orderItemId, modal) {
    const rating = document.getElementById("starRating").getAttribute("data-rating");
    const content = document.getElementById("reviewText").value.trim();

    console.log("orderItemId:", orderItemId);
    console.log("loggedInUserId:", loggedInUserId);
    console.log("rating:", rating);
    console.log("content:", content);

    if (!rating || rating < 1 || rating > 5) {
        alert("Vui lòng chọn số sao từ 1 đến 5.");
        return;
    }
    if (!content) {
        alert("Vui lòng nhập nội dung đánh giá.");
        return;
    }

    fetch("http://localhost:8080/reviews/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderItemId: Number(orderItemId),
            userId: Number(loggedInUserId),
            content: content,
            rating: Number(rating),
            reviewDate: new Date().toISOString().split("T")[0]
        }),
    })
    .then(response => {
        if (response.ok) {
            alert("Đánh giá đã được gửi thành công!");
            modal.hide();
            disableReviewButton(orderItemId);
            // checkAndDisableReviewButtons();
        } else {
            response.json().then(data => {
                alert(data.message || "Không thể gửi đánh giá.");
            });
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi gửi đánh giá.");
    });
}

// Vô hiệu hóa nút đánh giá nếu đã đánh giá
// function disableReviewButton(orderItemId) {
//     const reviewButton = document.querySelector(`.review-btn[data-order-item-id="${orderItemId}"]`);
//     if (reviewButton) {
//         reviewButton.disabled = true;
//         reviewButton.textContent = "Đã đánh giá";
//         reviewButton.classList.add("btn-secondary"); // Đổi màu nút để hiển thị khác biệt
//     } else {
//         console.error(`Không tìm thấy nút Đánh Giá cho orderItemId: ${orderItemId}`);
//     }
// }

// // Kiểm tra và vô hiệu hóa nút nếu đã đánh giá khi tải trang
// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelectorAll(".review-btn").forEach(button => {
//         const orderItemId = button.getAttribute("data-order-item-id");

//         fetch(`http://localhost:8080/reviews/check/${orderItemId}/${loggedInUserId}`)
//             .then(response => response.json())
//             .then(hasReviewed => {
//                 if (hasReviewed) {
//                     disableReviewButton(orderItemId);
//                 }
//             })
//             .catch(error => console.error("Lỗi khi kiểm tra đánh giá:", error));
//     });
// });
// Vô hiệu hóa nút đánh giá nếu đã đánh giá

// Kiểm tra trạng thái đánh giá và vô hiệu hóa nút nếu cần
async function checkAndDisableReviewButtons() {
    if (!loggedInUserId) {
        console.error("Người dùng chưa đăng nhập. Không thể kiểm tra trạng thái đánh giá.");
        return;
    }

    const reviewButtons = document.querySelectorAll(".review-btn");

    const checkPromises = [...reviewButtons].map(button => {
        const orderItemId = button.getAttribute("data-order-item-id");

        return fetch(`http://localhost:8080/reviews/check/${orderItemId}/${loggedInUserId}`)
            .then(response => response.json())
            .then(hasReviewed => {
                if (hasReviewed) {
                    disableReviewButton(orderItemId);
                }
            })
            .catch(error => console.error(`Lỗi khi kiểm tra đánh giá cho orderItemId ${orderItemId}:`, error));
    });

    await Promise.all(checkPromises);
}

// Vô hiệu hóa nút đánh giá nếu đã đánh giá
function disableReviewButton(orderItemId) {
    const reviewButton = document.querySelector(`.review-btn[data-order-item-id="${orderItemId}"]`);
    if (reviewButton) {
        reviewButton.disabled = true;
        reviewButton.textContent = "Đã đánh giá";
        reviewButton.classList.add("btn-secondary"); // Đổi màu nút để hiển thị khác biệt
    } else {
        console.error(`Không tìm thấy nút Đánh Giá cho orderItemId: ${orderItemId}`);
    }
}

