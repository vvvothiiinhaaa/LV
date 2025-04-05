 // JavaScript để chọn hoặc bỏ chọn tất cả các checkbox




// Hàm reset mã giảm giá khi chọn/bỏ chọn checkbox sản phẩm
// function resetDiscount() {
//     console.log("Đã chọn lại sản phẩm, mã giảm giá sẽ bị reset.");
//     localStorage.removeItem('couponCode');
//     localStorage.removeItem('discountAmount');
//     document.getElementById('coupon-code').value = ''; // Xóa ô nhập mã giảm giá
//     document.getElementById('sale').innerText = "0 VNĐ"; // Reset hiển thị tiền giảm giá

//     // Cập nhật lại tổng tiền
//     updateTotal();
// }


 // thêm sản phẩm vào giỏ hàng
//xem sản phẩm trong giỏ hàng của người dùng
// cart.js
document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra trạng thái đăng nhập và lấy userId
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                const userId = data.userId;

                // Fetch thông tin giỏ hàng từ API
                fetch(`http://localhost:8080/api/cart/view?userId=${userId}`, { credentials: 'include' })
                    .then(response => response.json())
                    .then(cartData => {
                        console.log('Dữ liệu giỏ hàng:', cartData);

                        // Kiểm tra nếu dữ liệu giỏ hàng hợp lệ
                        if (cartData && cartData.length > 0) {
                            const cartItemsContainer = document.getElementById("cart-items");

                            // Xóa nội dung cũ trong tbody (nếu có)
                            cartItemsContainer.innerHTML = "";

                            // Duyệt qua các sản phẩm trong giỏ hàng và hiển thị chúng
                            cartData.forEach((item) => {
                                const totalPrice = item.quantity * item.product.price;
                                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(item.product.price) + ' VNĐ';
                                const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(totalPrice) + ' VNĐ';

                                // Tạo một dòng mới trong bảng
                                const row = document.createElement("tr");

                                // Thêm các cột vào dòng (tr)
                                row.innerHTML = `
                                    <td><input type="checkbox" class="productCheckbox" id="checkbox-${item.product.id}"></td>
                                    <td><img id="product-image-${item.product.url}" src="${item.product.url}" alt="${item.product.name}" class="img-fluid" style="max-width: 80px;cursor: pointer;"></td>
                                    <td id="product-name-${item.product.id}">${item.product.name}</td>
                                    <td id="product-price-${item.product.id}">${formattedPrice}</td>
                                    <td> 
                                        <input style="width:80px;margin: 10px auto;display: flex;align-items: center;justify-content: center;text-align: center;font-size: 1rem;padding: 5px;" 
                                               type="number" class="form-control product-quantity"
                                               value="${item.quantity}" min="1" id="product-quantity-${item.product.id}" data-product-id="${item.product.id}">
                                    </td>
                                    <td id="product-total-${item.product.id}">${formattedTotalPrice}</td>
                                    <td><button class="btn-delete" id="delete-btn-${item.product.id}"><i class="bi bi-trash"></i></button></td>
                                `;

                                // Thêm dòng sản phẩm vào bảng
                                cartItemsContainer.appendChild(row);
 
                                // Xử lý sự kiện xóa sản phẩm
                                const deleteBtn = document.getElementById(`delete-btn-${item.product.id}`);
                                deleteBtn.addEventListener("click", function () {
                                    // Gọi API để xóa sản phẩm khỏi giỏ hàng
                                    fetch(`/api/cart/delete?userId=${userId}&productId=${item.product.id}`, { method: 'DELETE', credentials: 'include' })
                                        .then(response => {
                                            if (response.ok) {
                                                // Xóa sản phẩm khỏi bảng nếu xóa thành công
                                                row.remove();
                                                updateCartCount(userId);
                                            } else {
                                                console.error('Không thể xóa sản phẩm');
                                            }
                                        })
                                        .catch(error => console.error('Lỗi khi xóa sản phẩm:', error));
                                });

                                // Thêm sự kiện click vào ảnh sản phẩm để chuyển hướng đến trang chi tiết sản phẩm
                                const productImage = document.getElementById(`product-image-${item.product.url}`);
                                if (productImage) {
                                    productImage.addEventListener("click", function () {
                                        window.location.href = `product-detail.html?id=${item.product.id}`;
                                    });
                                }

                           // Xử lý thay đổi số lượng sản phẩm
                           const quantityInput = document.getElementById(`product-quantity-${item.product.id}`);
                           quantityInput.addEventListener('change', function () {
                               const newQuantity = parseInt(this.value, 10);
                               const stockQuantity = item.product.quantity; // Assuming `stock` is a property of product with the available stock
                           
                               if (newQuantity > stockQuantity) {
                                   alert('Số lượng mua vượt quá số lượng trong kho!');
                                   this.value = stockQuantity; // Set the input value to the max stock available
                                   return; // Stop further processing
                               }
                           
                               if (newQuantity > 0) {
                                   fetch(`/api/cart/update?userId=${userId}&productId=${item.product.id}&quantity=${newQuantity}`, {
                                       method: 'PUT',
                                       headers: {
                                           'Content-Type': 'application/json'
                                       }
                                   })
                                   .then(response => {
                                       if (response.ok) {
                                           return response.text().then(text => {
                                               try {
                                                   return JSON.parse(text);
                                               } catch (e) {
                                                   return { success: true, message: text }; 
                                               }
                                           });
                                       } else {
                                           return response.text().then(text => {
                                               throw new Error(text || 'Đã xảy ra lỗi khi cập nhật giỏ hàng!');
                                           });
                                       }
                                   })
                                   .then(result => {
                                       if (result.success) {
                                           const updatedTotalPrice = newQuantity * item.product.price;
           
                                           document.getElementById(`product-total-${item.product.id}`).textContent =   new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(updatedTotalPrice) + ' VNĐ';
                                       } else {
                                           alert(result.message || "Đã xảy ra lỗi khi cập nhật giỏ hàng!");
                                       }
                                   })
                                   .catch(error => {
                                       console.error('Lỗi khi cập nhật giỏ hàng:', error);
                                       alert(error.message || 'Đã xảy ra lỗi khi cập nhật giỏ hàng!');
                                   });
                               } else {
                                   alert('Số lượng phải lớn hơn 0!');
                               }
                           });
                           
                           
                           
                            });

                            // Hàm reset mã giảm giá khi chọn/bỏ chọn checkbox sản phẩm
                            function resetDiscount() {
                                console.log("Đã chọn lại sản phẩm, mã giảm giá sẽ bị reset.");
                                localStorage.removeItem('couponCode');
                                localStorage.removeItem('discountAmount');
                                document.getElementById('coupon-code').value = ''; // Xóa ô nhập mã giảm giá
                                document.getElementById('sale').innerText = "0 VNĐ"; // Reset hiển thị tiền giảm giá

                                // Cập nhật lại tổng tiền
                                updateTotal();
                            }

                            // Lắng nghe sự kiện khi chọn/bỏ chọn checkbox sản phẩm
                            document.querySelectorAll('.productCheckbox').forEach(checkbox => {
                                checkbox.addEventListener('change', function () {
                                    resetDiscount();
                                });
                            });

                            // Xử lý khi chọn tất cả checkbox
                            document.getElementById('selectAllCheckbox').addEventListener('change', function() {
                                resetDiscount();
                            });

                           
                            // Xử lý sự kiện "Delete All"
                            const deleteAllBtn = document.getElementById("delete-all-btn");
                            deleteAllBtn.addEventListener("click", function () {
                                // Hiển thị modal xác nhận
                                const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
                                modal.show();
                            });

                            // Xử lý khi người dùng xác nhận xóa tất cả sản phẩm
                            const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
                            confirmDeleteBtn.addEventListener("click", function () {
                                // Gửi yêu cầu xóa tất cả sản phẩm trong giỏ hàng
                                fetch(`/api/cart/delete-all?userId=${userId}`, { method: 'DELETE', credentials: 'include' })
                                    .then(response => {
                                        if (response.ok) {
                                            // Xóa tất cả dòng trong giỏ hàng
                                            cartItemsContainer.innerHTML = "<tr><td colspan='7'>Giỏ hàng của bạn đang trống.</td></tr>";
                                            updateCartCount(userId);
                                        } else {
                                            console.error('Không thể xóa tất cả sản phẩm');
                                        }
                                    })
                                    .catch(error => console.error('Lỗi khi xóa tất cả sản phẩm:', error));

                                // Đóng modal sau khi xác nhận
                                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                                modal.hide();
                            });

                            // Xử lý khi người dùng hủy xóa
                            const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
                            cancelDeleteBtn.addEventListener("click", function () {
                                // Đóng modal mà không làm gì
                                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                                modal.hide();
                            });

// //
                            // Thêm sự kiện cho tất cả hộp kiểm khi người dùng chọn hoặc bỏ chọn
                            document.querySelectorAll('.productCheckbox').forEach(checkbox => {
                                checkbox.addEventListener('change', updateTotal);
                            });

                            document.getElementById('selectAllCheckbox').addEventListener('change', function() {
                                const isChecked = this.checked;
                                document.querySelectorAll('.productCheckbox').forEach(checkbox => {
                                    checkbox.checked = isChecked;
                                    updateTotal(); // Gọi hàm updateTotal để cập nhật tổng tiền
                                });
                            });

                            // xử lý checkbox
                            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
                            selectAllCheckbox.addEventListener('change', function() {
                                const productCheckboxes = document.querySelectorAll('.productCheckbox');
                                productCheckboxes.forEach(checkbox => {
                                    checkbox.checked = this.checked;
                                });
                            });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            // // Thêm sự kiện cho tất cả hộp kiểm sản phẩm
                            // document.querySelectorAll('.productCheckbox').forEach(checkbox => {
                            //     checkbox.addEventListener('change', function () {
                            //         const productId = this.id.split('-')[1]; // Lấy ID sản phẩm từ checkbox
                            //         const isChecked = this.checked;

                            //         // Gọi hàm cập nhật trạng thái checkbox
                            //         updateCheckboxStatus(productId, isChecked);

                            //         // Cập nhật tổng tiền
                            //         updateTotal();
                            //     });
                            // });

                            // // Xử lý checkbox "Chọn tất cả"
                            // const selectAllCheckbox = document.getElementById('selectAllCheckbox');
                            // selectAllCheckbox.addEventListener('change', function () {
                            //     const productCheckboxes = document.querySelectorAll('.productCheckbox');

                            //     productCheckboxes.forEach(checkbox => {
                            //         checkbox.checked = isChecked;

                            //         const productId = checkbox.id.split('-')[1]; // Lấy ID sản phẩm
                            //         // Gọi hàm cập nhật trạng thái checkbox cho từng sản phẩm
                            //         updateCheckboxStatus(productId, isChecked);
                            //     });

                            //     // Cập nhật tổng tiền
                            //     updateTotal();
                            // });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



                            // Hàm cập nhật tổng tiền dựa vào các sản phẩm được chọn
                            function updateTotal() {
                                const checkboxes = document.querySelectorAll('.productCheckbox');
                                let total = 0;
                            
                                checkboxes.forEach(checkbox => {
                                    if (checkbox.checked) {
                                        const productId = checkbox.id.split('-')[1];
                                        const productTotalElement = document.getElementById(`product-total-${productId}`);
                                        if (productTotalElement) {
                                            // Xóa các dấu chấm và chuyển dấu phẩy thành dấu chấm nếu cần
                                            let productTotal = productTotalElement.textContent.replace(/\.|\s+/g, '').replace(',', '.');
                                            productTotal = parseFloat(productTotal);
                                            if (!isNaN(productTotal)) {
                                                total += productTotal;
                                            }
                                        }
                                    }
                                });
                            
                                // Định dạng và cập nhật DOM
                                const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(total) + ' VNĐ';
                                document.getElementById('subtotal').textContent = formattedTotal;
                                document.getElementById('total').textContent = formattedTotal;
                            }
                          

                            updateTotal(); // Gọi lần đầu để cập nhật tổng tiền khi trang tải xong

                        } else {
                            const cartItemsContainer = document.getElementById("cart-items");
                            cartItemsContainer.innerHTML = "<tr><td colspan='7'>Giỏ hàng của bạn đang trống.</td></tr>";
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
                        alert('Đã xảy ra lỗi khi lấy thông tin giỏ hàng!');
                    });
            } else {
                alert('Bạn chưa đăng nhập');
            }
        })
        .catch(error => console.error('Lỗi khi kiểm tra đăng nhập:', error));
});


function updateCartCount(userId) {
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
    }
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("checkout").addEventListener("click", function () {
    const selectedProducts = [];

    // Duyệt qua tất cả checkbox của sản phẩm
    document.querySelectorAll('.productCheckbox').forEach(checkbox => {
        if (checkbox.checked) { // Kiểm tra nếu checkbox được chọn
            const productId = checkbox.id.split('-')[1]; // Lấy ID sản phẩm từ ID của checkbox
            selectedProducts.push(productId); // Thêm ID sản phẩm vào danh sách
        }
    });

    // Nếu không có sản phẩm nào được chọn
    if (selectedProducts.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
        return;
    }
            const formatCurrency = (value) => {
                return new Intl.NumberFormat('vi-VN').format(value) + " VNĐ";
            };

        // Lấy thông tin mã giảm giá và số tiền giảm từ giao diện
        const couponCode = document.getElementById('coupon-code').value.trim();
        const discountAmountText = document.querySelector('#sale').innerText;
        const discountAmount = parseFloat(discountAmountText.replace(/\.|\s+/g, '').replace(',', '.')); // Loại bỏ ký tự không phải số từ giá trị giảm giá
    
        // Kiểm tra nếu mã giảm giá hợp lệ
        if (couponCode && discountAmount > 0) {
            // Lưu thông tin mã giảm giá và số tiền giảm vào localStorage
            // const formattedDiscountAmount = formatCurrency(discountAmount);
            localStorage.setItem('couponCode', couponCode);
            localStorage.setItem('discountAmount', discountAmount);

            // In ra thông tin đã lưu vào localStorage
    console.log("Mã giảm giá đã lưu: " + localStorage.getItem('couponCode'));
    console.log("Số tiền giảm đã lưu: " + localStorage.getItem('discountAmount'));
        }
    

    // Gọi API để lấy userId
    fetch('/api/auth/check-login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể lấy thông tin user. Vui lòng đăng nhập lại.");
        }
        return response.json();
    })
    .then(userData => {
        const userId = userData.userId;

        if (!userId) {
            throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
        }

        // Cập nhật trạng thái selected cho các sản phẩm được chọn
        return Promise.all(
            selectedProducts.map(productId => {
                return fetch(`/api/cart/update-selected?userId=${userId}&productId=${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        selected: true, // Đặt selected thành true
                    }),
                });
            })
        );
    })
    .then(responses => {
        const allSuccessful = responses.every(response => response.ok);

        if (allSuccessful) {
            console.log("Cập nhật trạng thái selected thành công cho tất cả sản phẩm được chọn.");
            // Chuyển hướng đến trang thanh toán
            window.location.href = "pay.html";
        } else {
            console.error("Có lỗi xảy ra khi cập nhật trạng thái của một hoặc nhiều sản phẩm.");
            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert(error.message || "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.");
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////



document.getElementById('apply-coupon').addEventListener('click', function() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    
    if (!couponCode) {
        alert("Vui lòng nhập mã giảm giá.");
        return;
    }

    fetch(`/api/discounts/validate/${couponCode}`)
        .then(response => response.json())
        .then(data => {
            if (!data) {
                alert("Mã giảm giá không hợp lệ.");
                return;
            }

            console.log("API Response:", data);

            const minOrderAmount = parseFloat(data.minOrderAmount) || 0;
            const usageLimit = parseInt(data.usageLimit) || 0;
            const discountPercentage = parseFloat(data.discountPercentage) || 0;

            if (usageLimit <= 0) {
                alert(`Mã Giảm Giá đã hết lượt sử dụng.`);
                return;
            }

            const subtotal = parseFloat(document.querySelector("#subtotal").innerText.replace(/\D/g, '')) || 0;
            console.log("Subtotal:", subtotal);

            if (subtotal < minOrderAmount) {
                alert(`Tổng giá trị đơn hàng không đủ để áp dụng mã giảm giá.`);
                return;
            }

            const discountAmount = (subtotal * discountPercentage) / 100;
            console.log("Discount Amount:", discountAmount);

            document.querySelector('#sale').innerText = new Intl.NumberFormat('vi-VN').format(discountAmount) + " VNĐ";

            const totalAmount = subtotal - discountAmount;
            document.querySelector('#total').innerText = new Intl.NumberFormat('vi-VN').format(totalAmount) + " VNĐ";
        })
        .catch(error => {
            console.error("Lỗi khi áp dụng mã giảm giá:", error);
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau.");
        });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


