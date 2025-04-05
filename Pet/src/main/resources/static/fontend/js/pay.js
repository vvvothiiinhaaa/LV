
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Lấy địa chỉ mặc định
async function fetchDefaultAddress() {
    try {
        // Gọi API lấy userId
        const authResponse = await fetch('/api/auth/check-login');
        const addAddressBtn = document.getElementById("add-address-btn");
        if (!authResponse.ok) throw new Error('Không thể lấy thông tin đăng nhập.');
        const authData = await authResponse.json();

        if (authData.userId) {
            const userId = authData.userId;

            // Gọi API lấy danh sách địa chỉ của user
            const addressResponse = await fetch(`/api/addresses/user/${userId}`);
            if (!addressResponse.ok) throw new Error('Không thể lấy danh sách địa chỉ.');
            const addressData = await addressResponse.json();

            // Tìm địa chỉ mặc định
            const defaultAddress = addressData.find(addr => addr.defaultAddress === true);

            if (defaultAddress) {
                // Hiển thị thông tin địa chỉ mặc định lên giao diện
                selectAddress(defaultAddress);
                document.getElementById('address-container').style.display = 'none'; // Ẩn nút "Thêm Địa Chỉ"
            } else {
                console.warn('Không tìm thấy địa chỉ mặc định.');
                document.getElementById('address-box').style.display = 'none'; // Ẩn thông tin địa chỉ nếu không có địa chỉ mặc định
                document.getElementById('address-container').style.display = 'block'; // Hiển thị nút "Thêm Địa Chỉ"
            }
        } else {
            console.warn('Không thể lấy userId.');
        }
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ mặc định:', error);
    }
}


// Hiển thị địa chỉ được chọn trên giao diện chính
function selectAddress(address) {
    // Hiển thị thông tin địa chỉ nhận hàng
    document.getElementById('address-name').innerHTML =
        `<strong>${address.recipientName || 'Không có tên'}</strong> ${address.phoneNumber || 'Không có số'}`;
    document.getElementById('address-location').innerText =
        `${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}`;

    // Lưu ID địa chỉ vào thuộc tính data-address-id
    const addressBox = document.getElementById('address-box');
    addressBox.setAttribute('data-address-id', address.id);

    // Hiển thị khung địa chỉ
    addressBox.style.display = 'block';
    document.getElementById('address-modal').style.display = 'none';
}

// Hiển thị danh sách địa chỉ trong modal
async function openAddressSelectionModal() {
    try {
        // Gọi API lấy userId
        const authResponse = await fetch('/api/auth/check-login');
        if (!authResponse.ok) throw new Error('Không thể lấy thông tin đăng nhập.');
        const authData = await authResponse.json();

        if (authData.userId) {
            const userId = authData.userId;

            // Gọi API lấy danh sách địa chỉ của user
            const addressResponse = await fetch(`/api/addresses/user/${userId}`);
            if (!addressResponse.ok) throw new Error('Không thể lấy danh sách địa chỉ.');
            const addressData = await addressResponse.json();

            // Tạo nội dung modal danh sách địa chỉ
            const modalBody = document.getElementById('address-modal-body');
            modalBody.innerHTML = ''; // Xóa nội dung cũ

            addressData.forEach((address) => {
                const addressHtml = `
                    <div class="address-item" onclick="selectAddressFromModal(${address.id})">
                        <p><strong>${address.recipientName}</strong> - ${address.phoneNumber}</p>
                        <p>${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
                    </div>
                `;
                modalBody.insertAdjacentHTML('beforeend', addressHtml);
            });

            // Hiển thị modal
            const modalElement = document.getElementById('addressModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            console.warn('Không thể lấy userId.');
        }
    } catch (error) {
        console.error('Lỗi khi mở modal chọn địa chỉ:', error);
    }
}

// Chọn địa chỉ từ modal và đóng modal
async function selectAddressFromModal(addressId) {
    try {
        // Gọi API lấy thông tin địa chỉ
        const response = await fetch(`/api/addresses/${addressId}`);
        if (!response.ok) throw new Error('Không thể lấy thông tin địa chỉ.');
        const address = await response.json();

        if (address) {
            // Cập nhật giao diện với địa chỉ được chọn
            selectAddress(address);
          
        
        } else {
            console.warn('Không tìm thấy địa chỉ với ID:', addressId);
        }
    } catch (error) {
        console.error('Lỗi khi chọn địa chỉ từ modal:', error);
    }
}





///////////////////////////////////////////////////////////////

// Gọi hàm khi tải trang
fetchDefaultAddress();



async function changeAddress() {
    try {
        // Gọi API lấy userId
        const authResponse = await fetch('/api/auth/check-login');
        if (!authResponse.ok) {
            throw new Error('Không thể lấy thông tin đăng nhập.');
        }
        const authData = await authResponse.json();

        if (authData.userId) {
            const userId = authData.userId;

            // Gọi API lấy danh sách địa chỉ
            const addressResponse = await fetch(`/api/addresses/user/${userId}`);
            if (!addressResponse.ok) {
                throw new Error('Không thể lấy danh sách địa chỉ.');
            }
            const addressData = await addressResponse.json();

            // Hiển thị danh sách địa chỉ trong modal
            const addressList = document.getElementById('address-list');
            addressList.innerHTML = ''; // Xóa nội dung cũ

            addressData.forEach((address) => {
                const listItem = document.createElement('li');
                listItem.classList.add('address-item'); // Thêm class CSS nếu cần

                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center" onclick='selectAddress(${JSON.stringify(address)})' style="cursor: pointer;">
                        <div>
                             <strong style="display:none;">${address.id || 'Không có id'}</strong>
                            <strong>${address.recipientName || 'Không có tên'}</strong>
                            <span>Số điện thoại : ${address.phoneNumber || 'Không có số'}</span>
                            <span>${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</span>
                        </div>
                        <div>
                                <button class="btn btn-sm btn-primary" onclick="openUpdateModal(${address.id})">Cập nhật</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAddress(${address.id}); event.stopPropagation();">Xóa</button>
                        </div>
                    </div>
                `;

                addressList.appendChild(listItem);
            });

            // Hiển thị modal
            document.getElementById('address-modal').style.display = 'flex';
        } else {
            console.error('Không thể lấy userId.');
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    }
}



// Hàm đóng modal
function closeModal() {
    document.getElementById('address-modal').style.display = 'none';
}



// Hàm đóng modal
function closeModal() {
    const modal = document.getElementById('address-modal');
    modal.style.display = 'none';
}

/////////////////////////////////////////////////////////////////////////////// chức năng hiển thị hình ảnh số lượng
// Lắng nghe sự kiện khi trang bị thoát hoặc reload
// window.addEventListener("beforeunload", function () {
//     // Xóa dữ liệu trong localStorage khi người dùng thoát khỏi trang
//     localStorage.removeItem('couponCode');
//     localStorage.removeItem('discountAmount');
//     console.log("Dữ liệu trong localStorage đã được reset.");
// });
//// chỉnh sửa ngày 13 / 3
// Đánh dấu trang đã reload trong sessionStorage
window.addEventListener("load", function () {
    sessionStorage.setItem("reloaded", "true");
});

window.addEventListener("beforeunload", function (event) {
    if (sessionStorage.getItem("reloaded")) {
        // Nếu trang được reload, không xóa dữ liệu localStorage
        sessionStorage.removeItem("reloaded");
    } else {
        // Nếu người dùng thoát khỏi trang, xóa dữ liệu trong localStorage
        localStorage.removeItem("couponCode");
        localStorage.removeItem("discountAmount");
        console.log("Dữ liệu trong localStorage đã được reset.");
    }
});


document.addEventListener("DOMContentLoaded", async function () {
    // === Hàm định dạng tiền tệ theo chuẩn VNĐ ===
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value) + " VNĐ";
    };

    // === Hàm cập nhật thông tin đơn hàng ===
    const updateOrderSummary = (products) => {
        const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        // const shippingFee = totalPrice > 0 ? 30000 : 0; // Phí vận chuyển
        // const discount = totalPrice >= 100000 ? 50000 : 0; // Khuyến mãi
        const shippingFee = 0;
        // const discount = 0;
   
        let discountAmount = parseFloat(localStorage.getItem('discountAmount')) || 0; // Đảm bảo là số thực

        // Định dạng số tiền giảm theo kiểu tiền tệ
        const formattedDiscountAmount = formatCurrency(discountAmount);

        // Hiển thị lên giao diện
        document.querySelector("#discount").innerText = formattedDiscountAmount;

        console.log("Số tiền giảm đã lưu: " + localStorage.getItem('formattedDiscountAmount'));
        const totalPayment = totalPrice + shippingFee - discountAmount; // Tổng thanh toán
        // Cập nhật giao diện
        document.querySelector("#total-price").innerText = formatCurrency(totalPrice);
        document.querySelector("#shipping-fee").innerText = formatCurrency(shippingFee);
        // document.querySelector("#discount").innerText = discountAmount;
        document.querySelector("#total-payment").innerText = formatCurrency(totalPayment);
    };

    // === Quy trình chính ===
    try {
        // Gọi API lấy userId
        const authResponse = await fetch('/api/auth/check-login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!authResponse.ok) {
            throw new Error('Không thể lấy thông tin userId từ API /api/auth/check-login');
        }

        const authData = await authResponse.json();
        if (!authData.userId) {
            throw new Error('userId không tồn tại trong phản hồi từ API /api/auth/check-login');
        }

        const userId = authData.userId;

        // Gọi API để lấy danh sách sản phẩm được chọn với số lượng
        const selectedProductsResponse = await fetch(`/api/cart/selected-products?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!selectedProductsResponse.ok) {
            throw new Error('Không thể lấy danh sách sản phẩm được chọn từ API');
        }

        const selectedProducts = await selectedProductsResponse.json();

        if (selectedProducts.length === 0) {
            console.log('Không có sản phẩm nào được chọn.');
            document.getElementById("checkout-items").innerHTML = `<tr><td colspan="4">Không có sản phẩm nào được chọn.</td></tr>`;
            updateOrderSummary([]); // Cập nhật tổng tiền với 0
            return;
        }

        // Gọi API lấy chi tiết từng sản phẩm
        const productDetailsPromises = selectedProducts.map(async ({ productId, quantity }) => {
            const productResponse = await fetch(`/api/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!productResponse.ok) {
                throw new Error(`Không thể lấy thông tin sản phẩm với ID: ${productId}`);
            }

            const product = await productResponse.json();
            return { ...product, quantity };
        });

        const products = await Promise.all(productDetailsPromises);

        // Hiển thị sản phẩm trong bảng
        const tableBody = document.getElementById("checkout-items");
        tableBody.innerHTML = ""; // Xóa các hàng cũ nếu có
        products.forEach((product) => {
            const row = `
                <tr>
                    <td><img src="${product.url}"  data-product-id="${product.id}" alt="${product.name}" style="width: 100px;"></td>
                    <td>${product.name}</td>
                     <td>${formatCurrency(product.price)}</td>
                    <td>${product.quantity}</td>
                    <td>${formatCurrency(product.price * product.quantity)}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });

        // Cập nhật thông tin đơn hàng
        updateOrderSummary(products);

        // // Gọi API reset trạng thái selected
        // const resetResponse = await fetch(`/api/cart/reset-selected?userId=${userId}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'include',
        // });

        // if (!resetResponse.ok) {
        //     throw new Error('Không thể reset trạng thái sản phẩm được chọn');
        // }
         // Kiểm tra xem trang có phải đang được reload không
    if (performance.navigation.type === 1) { 
        console.log("Trang chỉ reload, không reset giỏ hàng.");
        return; // Không reset sản phẩm nếu chỉ reload
    }

    console.log("Người dùng thoát trang, reset giỏ hàng...");

    try {
        const resetResponse = await fetch(`/api/cart/reset-selected?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!resetResponse.ok) {
            throw new Error('Không thể reset trạng thái sản phẩm được chọn');
        }

        console.log("Reset sản phẩm thành công khi thoát trang.");
    } catch (error) {
        console.error("Lỗi khi reset sản phẩm:", error);
    }

        console.log('Trạng thái sản phẩm được chọn đã được reset thành công.');
    } catch (error) {
        console.error('Lỗi trong quy trình:', error.message);
        document.getElementById("checkout-items").innerHTML = `<tr><td colspan="4">Đã xảy ra lỗi khi tải sản phẩm.</td></tr>`;
        updateOrderSummary([]); // Cập nhật tổng tiền với 0
    }
});


////////////////////////////////////////////////////////////////////////////////////// thanh toán

//////////////////////////////////////////////////////// thanh toán chỉnh sửa
// Hàm submitPayment được cập nhật
async function submitPayment() {
    try {
        // Lấy userId từ API /api/auth/check-login
        const authResponse = await fetch('/api/auth/check-login', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Gửi cookie xác thực
        });

        if (!authResponse.ok) {
            throw new Error('Không thể lấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
        }

        const authData = await authResponse.json();
        const userId = authData.userId;

        if (!userId) {
            throw new Error('Không thể lấy userId. Vui lòng đăng nhập lại.');
        }

        // Lấy phương thức thanh toán được chọn
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Lấy ID địa chỉ nhận hàng
        const addressBox = document.getElementById('address-box');
        const addressId = addressBox.getAttribute('data-address-id');
        const note = document.getElementById("orderNote")?.value?.trim() || ""; /// thêm vào ngày 23

        if (!addressId) {
            console.error('Vui lòng chọn địa chỉ nhận hàng!');
            return;
        }

        // Lấy danh sách sản phẩm từ bảng
        const checkoutItems = document.querySelectorAll('#checkout-items tr');
        if (checkoutItems.length === 0) {
            console.error('Không có sản phẩm nào để thanh toán!');
            return;
        }
        // Lấy số tiền giảm giá từ ID "discount"
        const discountElement = document.getElementById('discount');
        const discount = discountElement ? parseFloat(discountElement.innerText.replace(' VNĐ', '').replace(/\./g, '')) || 0 : 0;


        const orderItems = [];
        checkoutItems.forEach((row) => {
            const productImage = row.querySelector('img');
            const productId = productImage.getAttribute('data-product-id'); // Lấy productId từ thuộc tính data-product-id
            const quantity = row.querySelector('td:nth-child(4)').innerText.trim();
            const total = row.querySelector('td:nth-child(5)').innerText.trim().replace(' VNĐ', '').replace(/\./g, '');
            
            if (!productId) {
                console.error('Không thể lấy productId từ hàng:', row);
                throw new Error('Không thể lấy productId từ sản phẩm. Vui lòng kiểm tra lại giao diện.');
            }

            orderItems.push({
                productId: parseInt(productId),
                quantity: parseInt(quantity),
                total: parseInt(total),
            });
        });

        // Lấy tổng tiền thanh toán
        const totalPayment = document
            .getElementById('total-payment')
            .innerText.trim()
            .replace(' VNĐ', '')
            .replace(/\./g, '');
            

        // Gửi orderItems qua body và các thông tin khác qua query parameters
        const queryParams = new URLSearchParams({
            userId: userId,
            discount: discount,
            totalPayment: parseInt(totalPayment),
            paymentMethod: paymentMethod.toUpperCase(),
            addressId: parseInt(addressId),
             note: note,
        }).toString();

        console.log('orderItems:', orderItems);

        // Gọi API tạo đơn hàng
        const response = await fetch(`http://localhost:8080/api/orders/create?${queryParams}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderItems),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Xử lý lỗi nếu không phải JSON
            throw new Error(errorText || 'Đã xảy ra lỗi khi tạo đơn hàng!');
        }

        // Nếu phản hồi JSON, parse JSON, nếu không, xử lý text
        let responseData;
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text(); // Xử lý text nếu không phải JSON
            console.log('Phản hồi dạng plain text:', responseData);
        }

        ///////////////////////////// nhã thêm tại đây ngày 21 thấng 2
          // Sau khi tạo đơn hàng thành công, giảm usageLimit nếu có mã giảm giá
          const couponCode = localStorage.getItem('couponCode');
          if (couponCode) {
              // Gửi yêu cầu API để giảm usageLimit của mã giảm giá
              const discountResponse = await fetch(`/api/discounts/update-UsageLimit/${couponCode}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ usageLimit: -1 }), // Giảm usageLimit đi 1
              });
  
              if (!discountResponse.ok) {
                  const errorText = await discountResponse.text();
                  throw new Error(errorText || 'Đã xảy ra lỗi khi cập nhật usageLimit.');
              }
  
              console.log('Cập nhật usageLimit thành công.');
          }
        /////////////////////////////////////////
         // Sau khi tạo đơn hàng thành công
         const deleteCartPromises = orderItems.map(async (item) => {
            try {
                const deleteResponse = await fetch(`/api/cart/delete?userId=${userId}&productId=${item.productId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!deleteResponse.ok) {
                    throw new Error(`Không thể xóa sản phẩm ID: ${item.productId}`);
                }
                console.log(`Đã xóa sản phẩm ID: ${item.productId} khỏi giỏ hàng.`);
            } catch (error) {
                console.error(`Lỗi khi xóa sản phẩm ID: ${item.productId} khỏi giỏ hàng:`, error.message);
            }
        });


        // Đợi tất cả các sản phẩm được xóa khỏi giỏ hàng
        await Promise.all(deleteCartPromises);

        // Nếu thanh toán online, gọi API backend để tạo URL VNPay
        if (paymentMethod === 'online') {

            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('addressId', addressId);
            sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
            try {
                // Gọi API tạo URL thanh toán VNPay với thông tin từ đơn hàng vừa tạo
                const vnpayResponse = await fetch(
                    `http://localhost:8080/api/payment/create-payment?amount=${parseInt(totalPayment)}&orderInfo=orders${responseData.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
        
                if (!vnpayResponse.ok) {
                    const errorData = await vnpayResponse.text();
                    throw new Error(errorData || 'Đã xảy ra lỗi khi tạo URL VNPay!');
                }
        
                // Lấy URL từ phản hồi
                const vnpayUrl = await vnpayResponse.text();
        
                // Kiểm tra URL có hợp lệ không
                if (!vnpayUrl.startsWith('http')) {
                    throw new Error('URL VNPay không hợp lệ: ' + vnpayUrl);
                }
        
               
                console.log('VNPay URL:', vnpayUrl);
        
                // Chuyển hướng người dùng đến trang thanh toán VNPay
                window.location.href = vnpayUrl;
            } catch (error) {
                console.error('Lỗi khi tạo URL VNPay:', error.message);
            }
        } else {
            // Nếu thanh toán COD
            alert('Đặt hàng thành công'); 
            window.location.href = '/fontend/order.html'; // Chuyển đến trang cảm ơn hoặc trạng thái đơn hàng
        }
    } catch (error) {
        console.error('Lỗi trong quá trình thanh toán:', error.message);
    }
}


///////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    console.log('Message:', message);

    if (message === 'success') {
        alert('Thanh toán thành công! Đang xử lý đơn hàng của bạn...');
        try {
            const userId = sessionStorage.getItem('userId');
            const addressId = sessionStorage.getItem('addressId');
            const orderItems = JSON.parse(sessionStorage.getItem('orderItems')) || [];
            const totalPayment = urlParams.get('amount');

            console.log('userId:', userId);
            console.log('addressId:', addressId);
            console.log('orderItems:', orderItems);
            console.log('totalPayment:', totalPayment);

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    totalPayment: parseInt(totalPayment),
                    discount: 0,
                    paymentMethod: 'ONLINE',
                    addressId: parseInt(addressId),
                    orderItems: orderItems,
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Đã xảy ra lỗi khi tạo đơn hàng!');
            }

            alert('Đơn hàng đã được tạo thành công!');

            // Xóa sản phẩm khỏi giỏ hàng
            const deleteCartPromises = orderItems.map(async (item) => {
                try {
                    const deleteResponse = await fetch(`/api/cart/delete?userId=${userId}&productId=${item.productId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!deleteResponse.ok) {
                        throw new Error(`Không thể xóa sản phẩm ID: ${item.productId}`);
                    }
                    console.log(`Đã xóa sản phẩm ID: ${item.productId} khỏi giỏ hàng.`);
                } catch (error) {
                    console.error(`Lỗi khi xóa sản phẩm ID: ${item.productId}:`, error.message);
                }
            });

            await Promise.all(deleteCartPromises);

            console.log('Xóa giỏ hàng xong, chuyển hướng...');
            setTimeout(() => {
                window.location.href = '/fontend/order.html';
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.message);
            alert(error.message || 'Đã xảy ra lỗi trong quá trình tạo đơn hàng.');
        }
    } else if (message === 'failure') {
        alert('Thanh toán thất bại! Vui lòng thử lại.');
        window.location.href = '/fontend/order.html';
    }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function () {
    var addressModal = document.getElementById('addressModal');
    if (!addressModal) {
        console.error("Không tìm thấy modal 'addressModal'");
        return;
    }

    var modalInstance = new bootstrap.Modal(addressModal);

    var openModalBtn = document.querySelector('[data-bs-toggle="modal"]');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function () {
            modalInstance.show();
        });
    } else {
        console.error("Không tìm thấy button mở modal");
    }

    addressModal.addEventListener('hidden.bs.modal', function () {
        console.log('Modal đã được đóng');
    });

    addressModal.addEventListener('shown.bs.modal', function () {
        console.log('Modal đã được hiển thị');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    initializeProvinceDropdown();
    setupAddressEventListeners();
});

/**
 * Hàm lấy danh sách tỉnh/thành phố và đổ vào dropdown
 */
function initializeProvinceDropdown() {
    fetch('https://provinces.open-api.vn/api/p/')
        .then(response => response.json())
        .then(data => {
            const provinceSelect = document.getElementById('provinceSelect');
            if (!provinceSelect) {
                console.error("Không tìm thấy phần tử provinceSelect trên DOM.");
                return;
            }
            provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>'; // Reset dropdown
            data.forEach(province => {
                provinceSelect.options.add(new Option(province.name, province.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error));
}

/**
 * Hàm thiết lập sự kiện thay đổi cho dropdown
 */
function setupAddressEventListeners() {
    const provinceSelect = document.getElementById('provinceSelect');
    const districtSelect = document.getElementById('districtSelect');
    const wardSelect = document.getElementById('wardSelect');

    if (!provinceSelect || !districtSelect || !wardSelect) {
        console.error("Không tìm thấy một hoặc nhiều phần tử select trên DOM.");
        return;
    }

    // Xử lý sự kiện thay đổi tỉnh/thành phố
    provinceSelect.addEventListener('change', function () {
        const provinceCode = this.value;
        if (!provinceCode) {
            resetDropdown(districtSelect, "Chọn Quận/Huyện");
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            return;
        }
        fetchDistricts(provinceCode);
    });

    // Xử lý sự kiện thay đổi quận/huyện
    districtSelect.addEventListener('change', function () {
        const districtCode = this.value;
        if (!districtCode) {
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            return;
        }
        fetchWards(districtCode);
    });
}

/**
 * Hàm lấy danh sách quận/huyện theo tỉnh/thành phố đã chọn
 * @param {string} provinceCode - Mã tỉnh/thành phố
 */
function fetchDistricts(provinceCode) {
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            const districtSelect = document.getElementById('districtSelect');
            if (!districtSelect) return;
            resetDropdown(districtSelect, "Chọn Quận/Huyện");
            data.districts.forEach(district => {
                districtSelect.options.add(new Option(district.name, district.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
}

/**
 * Hàm lấy danh sách phường/xã theo quận/huyện đã chọn
 * @param {string} districtCode - Mã quận/huyện
 */
function fetchWards(districtCode) {
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            const wardSelect = document.getElementById('wardSelect');
            if (!wardSelect) return;
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            data.wards.forEach(ward => {
                wardSelect.options.add(new Option(ward.name, ward.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
}

/**
 * Hàm đặt lại dropdown về trạng thái mặc định
 * @param {HTMLElement} selectElement - Phần tử dropdown cần reset
 * @param {string} placeholderText - Văn bản mặc định hiển thị
 */
function resetDropdown(selectElement, placeholderText) {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">${placeholderText}</option>`;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    // Ensuring the DOM is fully loaded before attaching the event listener
    var form = document.getElementById('addressForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // First, check the login and retrieve the user ID
            fetch('http://localhost:8080/api/auth/check-login', {
                method: 'GET', // Assuming it's a GET request; adjust if needed
                headers: {
                    'Content-Type': 'application/json',
                    // Include authentication headers if required
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.userId) {
                    submitAddressForm(data.userId);
                } else {
                    throw new Error('Not logged in or no user ID available');
                }
            })
            .catch(error => {
                // console.error('Login check failed:', error);
                // Handle login check failure, e.g., redirect to login page
            });
        });
    } else {
        console.error('Form not found. Ensure that the form exists and the ID is correct.');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addressForm');
    if (form) {
        form.addEventListener('submit', handleAddressFormSubmit);
    } else {
        console.error('Không tìm thấy form `addressForm` trên DOM.');
    }
});

/**
 * Xử lý submit form thêm địa chỉ
 * @param {Event} event - Sự kiện submit
 */
async function handleAddressFormSubmit(event) {
    if (!event) {
        console.error("Không nhận được sự kiện submit!");
        return;
    }
    
    event.preventDefault(); // Đảm bảo chặn form submit

    const form = event.target; // Lấy form từ sự kiện
    const formData = new FormData(form);

    const userId = await getUserId();
    if (!userId) {
        console.error("Không thể lấy userId.");
        alert("Bạn cần đăng nhập để thêm địa chỉ!");
        return;
    }

    const data = {
        userId: userId,
        recipientName: document.querySelector('#addressForm input[placeholder="Họ và tên"]').value,
        phoneNumber: document.querySelector('#addressForm input[placeholder="Số điện thoại"]').value,
        provinceCity: document.getElementById("provinceSelect")?.selectedOptions[0]?.text || "",
        district: document.getElementById("districtSelect")?.selectedOptions[0]?.text || "",
        wardSubdistrict: document.getElementById("wardSelect")?.selectedOptions[0]?.text || "",
        addressDetail: document.querySelector('#addressForm textarea').value,
        defaultAddress: document.getElementById("defaultAddressCheck")?.checked || false,
    };

    try {
        const response = await fetch("http://localhost:8080/api/addresses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Lỗi khi thêm địa chỉ!");
        }

        alert("Thêm địa chỉ thành công!");
        form.reset(); // Xóa dữ liệu sau khi thêm thành công
        loadUserAddresses(); // Cập nhật danh sách địa chỉ
        fetchDefaultAddress();
        // Đóng modal sau khi thêm địa chỉ thành công
        const addressModal = document.getElementById("addressModal");
        const modalInstance = bootstrap.Modal.getInstance(addressModal);
        if (modalInstance) {
            modalInstance.hide();
        }
        // Xóa lớp backdrop nếu còn tồn tại
        setTimeout(() => {
            document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open'); // Xóa class gây hiệu ứng mờ
            document.body.style.paddingRight = ''; // Reset padding nếu có
        }, 500);

    } catch (error) {
        console.error("Lỗi khi gửi địa chỉ:", error);
        alert("Không thể thêm địa chỉ. Vui lòng thử lại sau!");
    }
}


/**
 * Hàm gọi API để lấy userId
 */
async function getUserId() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/check-login');
        if (!response.ok) throw new Error('Không thể lấy userId');

        const data = await response.json();
        return data.userId || null;
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}

/**
 * Hàm tải danh sách địa chỉ của người dùng
 */
async function loadUserAddresses() {
    const userId = await getUserId();
    if (!userId) {
        console.error('Không thể lấy userId.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/user/${userId}`);
        if (!response.ok) throw new Error('Không thể lấy danh sách địa chỉ');

        const addresses = await response.json();
        const container = document.getElementById('address');
        container.innerHTML = '';

        addresses.forEach(address => {
            container.innerHTML += renderAddressCard(address);
        });
        setupUpdateAddressEvents();
    } catch (error) {
        // console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// hiển thị danh sách địa chỉ
// Hàm gọi API để lấy userId
async function getUserId() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/check-login');
        if (!response.ok) {
            throw new Error('Không thể lấy userId');
        }
        const data = await response.json();
        return data.userId; // Điều chỉnh dựa vào cấu trúc trả về của API
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}
////// delete address
async function deleteAddress(addressId) {
    try {
        const userId = await getUserId();
        if (!userId) {
            alert('Bạn cần đăng nhập để xóa địa chỉ.');
            return;
        }

        // Xác nhận trước khi xóa
        const confirmDelete = confirm("Bạn có chắc chắn muốn xóa địa chỉ này?");
        if (!confirmDelete) return;

        // Gửi yêu cầu DELETE đến API
        const response = await fetch(`http://localhost:8080/api/addresses/delete/${userId}/${addressId}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi khi xóa địa chỉ!");
        }

        alert("Xóa địa chỉ thành công!");
        location.reload();
        // Cập nhật danh sách địa chỉ ngay lập tức trong modal
        await changeAddress();

    } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
    }
}
////////////////////////////////////////////


// Hàm mở modal và tải dữ liệu của địa chỉ vào modal

async function openUpdateModal(addressId) {
    const userId = await getUserId();
    if (!userId) {
        alert('Bạn cần đăng nhập để cập nhật địa chỉ!');
        return;
    }

    try {
        // Lấy thông tin địa chỉ từ API
        const response = await fetch(`http://localhost:8080/api/addresses/${userId}/${addressId}`);
        if (!response.ok) throw new Error('Không thể lấy thông tin địa chỉ');

        const address = await response.json();
        console.log('Dữ liệu địa chỉ nhận được:', address); // Kiểm tra dữ liệu

        // Điền dữ liệu vào form trong modal
        // populateUpdateAddressForm(address);

       await loadAddressIntoModal(address);

        // Gán lại sự kiện "Lưu" cho địa chỉ
        setupSaveAddressEvent(addressId);

        // Mở modal
        const modal = new bootstrap.Modal(document.getElementById('updateAddressModal'));
        modal.show();
    } catch (error) {
        console.error('Lỗi khi mở modal cập nhật địa chỉ:', error);
    }
}


// Hàm điền dữ liệu vào form trong modal cập nhật
// Hàm điền dữ liệu vào form trong modal cập nhật
function populateUpdateAddressForm(address) {
    console.log('Điền dữ liệu vào form cập nhật...');

    // Điền dữ liệu vào các trường trong form
    document.getElementById('recipientName').value = address.recipientName || '';
    document.getElementById('phoneNumber').value = address.phoneNumber || '';
    document.getElementById('addressDetail').value = address.addressDetail || '';
    document.getElementById('defaultAddress').checked = address.defaultAddress || false;

    console.log('Điền xong dữ liệu, tiếp tục tải danh sách tỉnh/thành phố...');

    // Tải danh sách tỉnh/thành phố và thiết lập giá trị mặc định cho tỉnh
    loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceS', address.provinceCity);
    loadOptionsFromAPI('https://provinces.open-api.vn/api/d/', 'districtS', address.district);
    loadOptionsFromAPI('https://provinces.open-api.vn/api/w/', 'wardSubdistrictS', address.wardSubdistrict);
    
}



// Hàm gán sự kiện "Lưu" cho nút lưu địa chỉ
function setupSaveAddressEvent(addressId) {
    console.log(`Gán lại sự kiện "Lưu" cho địa chỉ ID: ${addressId}`);

    const saveButton = document.getElementById('saveAddressBtn');
    if (!saveButton) {
        console.error('Không tìm thấy nút "Lưu"!'); 
        return;
    }

    // Xóa sự kiện cũ và gán sự kiện mới
    saveButton.removeEventListener('click', saveUpdatedAddress);
    saveButton.addEventListener('click', function () {
        saveUpdatedAddress(addressId);
    });
}

// Hàm lưu địa chỉ cập nhật
async function saveUpdatedAddress(addressId) {
    const userId = await getUserId();
    if (!userId) {
        alert('Bạn cần đăng nhập để cập nhật địa chỉ!');
        return;
    }

    const updatedData = {
        recipientName: document.getElementById('recipientName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        addressDetail: document.getElementById('addressDetail').value.trim(),
        provinceCity: document.getElementById('provinceS').selectedOptions[0]?.text || '',
        district: document.getElementById('districtS').selectedOptions[0]?.text || '',
        wardSubdistrict: document.getElementById('wardSubdistrictS').selectedOptions[0]?.text || '',
        defaultAddress: document.getElementById('defaultAddress').checked
    };

    console.log('🔍 Dữ liệu gửi lên API:', updatedData); // Debug

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/update/user/${userId}/address/${addressId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi khi cập nhật địa chỉ: ${errorText}`);
        }

        alert('Cập nhật địa chỉ thành công!');
        bootstrap.Modal.getInstance(document.getElementById("updateAddressModal")).hide();
        loadUserAddresses(); // Cập nhật danh sách địa chỉ sau khi sửa
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật địa chỉ:', error);
        alert('Không thể cập nhật địa chỉ.');
    }
}


// Hàm tải danh sách tỉnh/thành phố
async function loadProvinces() {
    const provinceSelect = document.getElementById('provinceS');
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';

    try {
        console.log('Start fetching provinces...');
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const provinces = await response.json();
        console.log('Provinces data:', provinces);

        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });

        console.log('Provinces added to dropdown.');
    } catch (error) {
        console.error('Error while fetching provinces:', error);
    }
}

// Hàm tải danh sách quận/huyện
async function loadDistricts(provinceCode, selectedDistrict = null, selectedWard = null) {
    const districtSelect = document.getElementById('districtS');
    const wardSelect = document.getElementById('wardSubdistrictS');
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>'; // Reset danh sách quận/huyện
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>'; // Reset danh sách phường/xã

    try {
        console.log(`Fetching districts for province code: ${provinceCode}...`);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Districts data:', data.districts);

        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.code;
            option.textContent = district.name;
            districtSelect.appendChild(option);

            if (district.code === selectedDistrict) {
                option.selected = true;
            }
        });

        // Tải danh sách phường/xã nếu quận/huyện được chọn
        if (selectedDistrict) {
            await loadWards(selectedDistrict, selectedWard);
        }

        console.log('Districts added to dropdown.');
    } catch (error) {
        console.error('Error while fetching districts:', error);
    }
}

// Hàm tải danh sách phường/xã
async function loadWards(districtCode, selectedWard = null) {
    const wardSelect = document.getElementById('wardSubdistrictS');
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>'; // Reset danh sách phường/xã

    try {
        console.log(`Fetching wards for district code: ${districtCode}...`);
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Wards data:', data.wards);

        data.wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.code;
            option.textContent = ward.name;
            wardSelect.appendChild(option);

            if (ward.code === selectedWard) {
                option.selected = true;
            }
        });

        console.log('Wards added to dropdown.');
    } catch (error) {
        console.error('Error while fetching wards:', error);
    }
}
// Xử lý khi người dùng chọn tỉnh/thành phố
document.getElementById('provinceS').addEventListener('change', async (event) => {
    const provinceCode = event.target.value;
    if (provinceCode) {
        console.log(`Province selected: ${provinceCode}`);
        await loadDistricts(provinceCode); // Tải danh sách quận/huyện
    } else {
        document.getElementById('districtS').innerHTML = '<option value="">Chọn quận/huyện</option>';
        document.getElementById('wardSubdistrictS').innerHTML = '<option value="">Chọn phường/xã</option>';
    }
});

// Xử lý khi người dùng chọn quận/huyện
document.getElementById('districtS').addEventListener('change', async (event) => {
    const districtCode = event.target.value;
    if (districtCode) {
        console.log(`District selected: ${districtCode}`);
        await loadWards(districtCode); // Tải danh sách phường/xã
    } else {
        document.getElementById('wardSubdistrictS').innerHTML = '<option value="">Chọn phường/xã</option>';
    }
});

// Hàm tải dữ liệu từ API và đặt giá trị mặc định
async function loadOptionsFromAPI(apiUrl, selectId, defaultValue = null) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error(`Không tìm thấy thẻ <select> với id: ${selectId}`);
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Không thể tải dữ liệu');

        const data = await response.json();

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });

        if (defaultValue) {
            selectElement.value = defaultValue;
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////

async function loadAddressIntoModal(address) {
    try {
        // Điền dữ liệu vào input text
        document.getElementById('recipientName').value = address.recipientName || '';
        document.getElementById('phoneNumber').value = address.phoneNumber || '';
        document.getElementById('addressDetail').value = address.addressDetail || '';
        document.getElementById('defaultAddress').checked = address.defaultAddress || false;

        // Lấy các select elements
        const provinceSelect = document.getElementById('provinceS');
        const districtSelect = document.getElementById('districtS');
        const wardSelect = document.getElementById('wardSubdistrictS');

        // Load danh sách tỉnh/thành phố và chọn giá trị
        const selectedProvinceCode = await loadProvinces(address.provinceCity);

        // Nếu có tỉnh/thành phố, tải danh sách quận/huyện và chọn giá trị
        if (selectedProvinceCode) {
            const selectedDistrictCode = await loadDistricts(selectedProvinceCode, address.district);
            
            // Nếu có quận/huyện, tải danh sách phường/xã và chọn giá trị
            if (selectedDistrictCode) {
                await loadWards(selectedDistrictCode, address.wardSubdistrict);
            }
        }

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu vào modal:', error);
    }
}
async function loadProvinces(selectedProvinceName = null) {
    const provinceSelect = document.getElementById('provinceS');
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';
    let selectedProvinceCode = null;

    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        if (!response.ok) throw new Error('Không thể tải danh sách tỉnh/thành phố.');

        const provinces = await response.json();

        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name;
            provinceSelect.appendChild(option);

            // Nếu tên tỉnh/thành phố trùng khớp, đặt làm selected
            if (province.name === selectedProvinceName) {
                provinceSelect.value = province.code;
                selectedProvinceCode = province.code;
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải tỉnh/thành phố:', error);
    }

    return selectedProvinceCode; // Trả về mã tỉnh/thành phố để load quận/huyện
}
async function loadDistricts(provinceCode, selectedDistrictName = null) {
    const districtSelect = document.getElementById('districtS');
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    let selectedDistrictCode = null;

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        if (!response.ok) throw new Error('Không thể tải danh sách quận/huyện.');

        const data = await response.json();
        
        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.code;
            option.textContent = district.name;
            districtSelect.appendChild(option);

            // Nếu tên quận/huyện trùng khớp, đặt làm selected
            if (district.name === selectedDistrictName) {
                districtSelect.value = district.code;
                selectedDistrictCode = district.code;
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải quận/huyện:', error);
    }

    return selectedDistrictCode; // Trả về mã quận/huyện để load phường/xã
}
async function loadWards(districtCode, selectedWardName = null) {
    const wardSelect = document.getElementById('wardSubdistrictS');
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        if (!response.ok) throw new Error('Không thể tải danh sách phường/xã.');

        const data = await response.json();

        data.wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.code;
            option.textContent = ward.name;
            wardSelect.appendChild(option);

            // Nếu tên phường/xã trùng khớp, đặt làm selected
            if (ward.name === selectedWardName) {
                wardSelect.value = ward.code;
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải phường/xã:', error);
    }
}

