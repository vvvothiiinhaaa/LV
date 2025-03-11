// kiểm tra trạng thái đăng nhập
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

document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = await checkLoginStatus(); // Đợi kết quả

    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để truy cập trang này.");
        window.location.href = "/fontend/employee-login.html";
        return;
    }

});

async function viewOrderDetails(orderId) {
    const isLoggedIn =  checkLoginStatus();
    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập trước khi xem chi tiết đơn hàng.");
        window.location.href = "/frontend/employee-login.html";
        return;
    }

    // Nếu đã đăng nhập, chuyển hướng đến trang chi tiết đơn hàng
    window.location.href = `staff-order-detail.html?orderId=${orderId}`;
}


document.addEventListener("DOMContentLoaded", function () {

    const isLoggedIn =  checkLoginStatus(); // Kiểm tra trạng thái đăng nhập trước khi thực hiện các thao tác
        if (!isLoggedIn) {
            alert("Vui lòng đăng nhập để xem danh sách đơn hàng.");
            window.location.href = "/frontend/employee-login.html"; // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
            return;
        }

    const orderStatusSelect = document.getElementById("orderStatus");
    const searchDateInput = document.getElementById("searchDate");

    // Function to fetch and display orders based on selected status and date
    function fetchOrders(status = 'ALL', searchDate = '') {
        // Clear previous DataTable instance before fetching new data
        if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
            $('#datatablesSimple').DataTable().destroy();
        }

        // Base URL for filtering orders
        let apiUrl = 'http://localhost:8080/api/orders/filter'; // Updated API URL for filtering orders

        // Prepare query parameters
        let queryParams = [];
        
        // Add status to the query parameters if it's not "ALL"
        if (status !== 'ALL') {
            queryParams.push(`orderStatus=${encodeURIComponent(status)}`);
        }

        // Add date to the query parameters if a date is provided
        if (searchDate) {
            queryParams.push(`orderDate=${searchDate}`);
        }

        // Append query parameters to the URL if any
        if (queryParams.length > 0) {
            apiUrl += '?' + queryParams.join('&');
        }

        console.log("API Request URL:", apiUrl); // Log the final URL to ensure it's correct

        // Fetch orders from the API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data); // Log the fetched data

                const tableBody = document.getElementById("tableBody");
                tableBody.innerHTML = ''; // Clear the existing rows before adding new ones

                if (Array.isArray(data) && data.length > 0) {
                    const orderPromises = data.map(order => {
                        return fetch(`http://localhost:8080/api/auth/info/${order.userId}`)
                            .then(response => response.json())
                            .then(userData => {
                                const row = document.createElement("tr");

                                row.innerHTML = `
                                   <td><input type="checkbox" class="order-checkbox" data-order-id="${order.id}"></td>
                                    <td>${order.id}</td>
                                    <td>${userData.username}</td>
                                    <td>${new Date(order.orderDate).toLocaleString() || 'N/A'}</td>
                                    <td>${formatVND(order.totalPayment)}</td>
                                    <td>${order.paymentMethod}</td>
                                    <td>${order.orderStatus}</td>
                                    <td><button onclick="viewOrderDetails(${order.id})" class="btn btn-info">Chi tiết</button></td>
                                    <td><button onclick="approveOrder(${order.id})" class="btn btn-info">Duyệt</button></td>
                                `;
                                
                                tableBody.appendChild(row);
                            })
                            .catch(error => console.error("Error fetching user data:", error));
                    });

                    Promise.all(orderPromises).then(() => {
                        // Reinitialize the DataTable after data is added
                        $('#datatablesSimple').DataTable({
                            "stripeClasses": [],
                            "paging": true,        // Enable pagination
                            "searching": true,     // Enable search box
                            "ordering": true,      // Enable sorting
                            "info": true,          // Show record info
                            "lengthMenu": [5, 10, 30, 100], // Records per page
                            "language": {
                                "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
                                "zeroRecords": "Không tìm thấy dữ liệu",
                                "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
                                "infoEmpty": "Không có bản ghi nào",
                                "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
                                "search": "Tìm kiếm:",
                                "paginate": {
                                    "first": "Đầu",
                                    "last": "Cuối",
                                    "next": ">",
                                    "previous": "<"
                                }
                            }
                        });
                    });
                } else {
                    // If no data is found, show a "No data found" message
                    tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Không có đơn hàng nào.</td></tr>';
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                // In case of error, show a generic error message
                const tableBody = document.getElementById("tableBody");
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Có lỗi xảy ra khi tải dữ liệu.</td></tr>';
            });
    }

    // Initial fetch with "ALL" status and no date filter
    fetchOrders('ALL');

    // Event listener for the orderStatus select element
    orderStatusSelect.addEventListener('change', function () {
        const selectedStatus = orderStatusSelect.value;
        const selectedDate = searchDateInput.value; // Get the selected date
        fetchOrders(selectedStatus, selectedDate); // Fetch orders based on the selected status and date
    });

    // Event listener for the searchDate input element
    searchDateInput.addEventListener('change', function () {
        const selectedStatus = orderStatusSelect.value;
        const selectedDate = searchDateInput.value; // Get the selected date
        fetchOrders(selectedStatus, selectedDate); // Fetch orders based on the selected status and date
    });
});


function viewOrderDetails(orderId) {
    // Chuyển hướng sang trang chi tiết đơn hàng và truyền order.id qua URL
    window.location.href = `staff-order-detail.html?orderId=${orderId}`;
}

// Format function for displaying VND currency
function formatVND(amount) {
    const number = parseFloat(amount).toFixed(0);
    const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber + " VND";
}
////////////////////////////////
 


// Chức năng cho checkbox "Tất cả"
document.getElementById('checkAll').addEventListener('change', function() {
    // Lấy tất cả các checkbox trong bảng, bao gồm cả các trang không hiển thị
    const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
    
    // Đánh dấu tất cả checkbox
    checkboxes.prop('checked', this.checked);

    // Đếm số đơn hàng được checked
    const checkedCount = checkboxes.filter(':checked').length;

    // Log số đơn hàng được checked ra console
    console.log(`Số đơn hàng được chọn: ${checkedCount}`);
});

// Bổ sung sự kiện cho các checkbox đơn lẻ để log số lượng checked khi chọn từng đơn hàng
$(document).on('change', '.order-checkbox', function() {
    const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
    const checkedCount = checkboxes.filter(':checked').length;
    console.log(`Số đơn hàng được chọn: ${checkedCount}`);
});


// document.addEventListener("DOMContentLoaded", function () {
//     const approveOrderModal = new bootstrap.Modal(document.getElementById('approveOrderModal'));  // Lấy modal
//     const approveOrderBtn = document.getElementById('approveOrderBtn'); // Nút mở modal
//     const selectedOrdersCount = document.getElementById('selectedOrdersCount'); // Phần hiển thị số đơn hàng
//     const checkAllCheckbox = document.getElementById('checkAll'); // Checkbox chọn tất cả

//     // Lắng nghe sự kiện khi nhấn nút "Duyệt Đơn Hàng"
//     approveOrderBtn.addEventListener('click', function () {
//         const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
//         const checkedCount = checkboxes.filter(':checked').length; // Đếm số đơn hàng được chọn

//         // Hiển thị số đơn hàng đã chọn trong modal
//         selectedOrdersCount.textContent = `Số đơn hàng được chọn: ${checkedCount}`;

//         // Nếu không có đơn hàng nào được chọn, cảnh báo và không mở modal
//         if (checkedCount === 0) {
//             alert("Vui lòng chọn ít nhất một đơn hàng để duyệt!");
//             return;
//         }

//         // Mở modal
//         approveOrderModal.show();
//     });

//     // Cập nhật số lượng đơn hàng được chọn khi chọn checkbox "Tất cả"
//     checkAllCheckbox.addEventListener('change', function () {
//         const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
//         checkboxes.prop('checked', this.checked);

//         const checkedCount = checkboxes.filter(':checked').length;
//         console.log(`Số đơn hàng được chọn: ${checkedCount}`);
//     });

//     // Cập nhật số lượng đơn hàng được chọn khi chọn từng đơn hàng
//     $(document).on('change', '.order-checkbox', function () {
//         const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
//         const checkedCount = checkboxes.filter(':checked').length;

//         console.log(`Số đơn hàng được chọn: ${checkedCount}`);
//     });

//     // Đóng modal khi nhấn nút "Đóng"
//     const hideBtnModal = document.getElementById("hideBtnModal");
//     hideBtnModal.addEventListener('click', function () {
//         approveOrderModal.hide();
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const approveOrderModal = new bootstrap.Modal(document.getElementById('approveOrderModal')); 
    const approveOrderBtn = document.getElementById('approveOrderBtn'); 
    const selectedOrdersCount = document.getElementById('selectedOrdersCount'); 
    const checkAllCheckbox = document.getElementById('checkAll'); 

    let selectedOrderIds = []; // Mảng lưu ID đơn hàng đã chọn

    // Khi checkbox "Tất cả" thay đổi trạng thái
    checkAllCheckbox.addEventListener('change', function () {
        const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
        checkboxes.prop('checked', this.checked);

        selectedOrderIds = []; // Xóa danh sách cũ nếu có
        if (this.checked) {
            checkboxes.each(function () {
                selectedOrderIds.push($(this).data('order-id')); 
            });
        }

        localStorage.setItem('selectedOrderIds', JSON.stringify(selectedOrderIds));
        updateSelectedOrdersCount();
    });

    // Khi từng checkbox đơn hàng thay đổi
    $(document).on('change', '.order-checkbox', function () {
        const orderId = $(this).data('order-id');

        if ($(this).is(':checked')) {
            if (!selectedOrderIds.includes(orderId)) {
                selectedOrderIds.push(orderId);
            }
        } else {
            selectedOrderIds = selectedOrderIds.filter(id => id !== orderId);
        }

        localStorage.setItem('selectedOrderIds', JSON.stringify(selectedOrderIds));
        updateSelectedOrdersCount();
    });

    function updateSelectedOrdersCount() {
        const checkedCount = selectedOrderIds.length;
        selectedOrdersCount.textContent = `Số đơn hàng được chọn: ${checkedCount}`;
        console.log(`Danh sách ID đơn hàng đã chọn:`, selectedOrderIds);
    }

    approveOrderBtn.addEventListener('click', function () {
        if (selectedOrderIds.length === 0) {
            alert("Vui lòng chọn ít nhất một đơn hàng để duyệt!");
            return;
        }
        approveOrderModal.show();
    });

    document.getElementById("hideBtnModal").addEventListener('click', function () {
        approveOrderModal.hide();
    });
});

//////////////////////////// cập nhật đơn hàng
document.getElementById('updateStatusBtn').addEventListener('click', function () {
    const selectedOrderIds = JSON.parse(localStorage.getItem('selectedOrderIds')) || [];
    const newStatus = document.getElementById('orderStatusSelect').value;

    if (selectedOrderIds.length === 0) {
        alert("Vui lòng chọn ít nhất một đơn hàng để cập nhật trạng thái!");
        return;
    }

    // Tạo mảng các promise từ fetch requests
    const updatePromises = selectedOrderIds.map(orderId => {
        return fetch(`/api/orders/${orderId}/status?newStatus=${encodeURIComponent(newStatus)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi cập nhật đơn hàng ${orderId}`);
            }
            return response.text(); // Đọc phản hồi từ server
        })
        .then(data => console.log(`Đơn hàng ${orderId} cập nhật: ${data}`))
        .catch(error => console.error(error));
    });

    // Đợi tất cả request hoàn thành trước khi thông báo
    Promise.all(updatePromises)
        .then(() => {
            alert(`Cập nhật trạng thái "${newStatus}" thành công cho tất cả đơn hàng!`);
            location.reload(); // Tải lại trang sau khi hoàn tất cập nhật
        })
        .catch(error => {
            console.error("Có lỗi xảy ra:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
        });
});


///////////////////////////////// in hóa đơn

document.addEventListener("DOMContentLoaded", function () {
    const printInvoiceBtn = document.getElementById("addProductBtn");

    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener("click", function () {
            printInvoices();
        });
    }
});

async function printInvoices() {
    // Lấy danh sách đơn hàng được chọn từ tất cả các trang DataTables
    const selectedOrderIds = [];
    $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox:checked').each(function () {
        selectedOrderIds.push($(this).data('order-id'));
    });

    if (selectedOrderIds.length === 0) {
        alert("Vui lòng chọn ít nhất một đơn hàng để in hóa đơn!");
        return;
    }

    let printContent = `
        <html>
        <head>
            <title>Hóa Đơn</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; text-align: right; margin-top: 20px; }
                .invoice-container { page-break-after: always; padding: 20px; }
                .customer-info { margin-bottom: 20px; }
            </style>
        </head>
        <body>
    `;

    for (let orderId of selectedOrderIds) {
        try {
            const orderResponse = await fetch(`http://localhost:8080/api/orders/${orderId}`);
            const order = await orderResponse.json();

            const userResponse = await fetch(`http://localhost:8080/api/auth/info/${order.userId}`);
            const userData = await userResponse.json();

            const addressResponse = await fetch(`http://localhost:8080/api/addresses/${order.userId}/${order.address.addressId}`);
            const address = await addressResponse.json();

            printContent += `
                <div class="invoice-container">
                    <h2>HÓA ĐƠN ĐƠN HÀNG</h2>
                    
                    <!-- Thông tin khách hàng -->
                    <div class="customer-info">
                        <strong>Khách Hàng:</strong> ${address.recipientName} <br>
                        <strong>Số Điện Thoại:</strong> ${address.phoneNumber} <br>
                        <strong>Địa Chỉ:</strong> ${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}
                    </div>

                    <!-- Thông tin đơn hàng -->
                    <table>
                        <tr><th>Mã Đơn</th><td>${orderId}</td></tr>
                        <tr><th>Ngày Đặt</th> <td>${new Date(order.orderDate).toLocaleString() || 'N/A'}</td></tr>
                        <tr><th>Phương Thức Thanh Toán</th><td>${order.paymentMethod}</td></tr>
                    </table>

                    <!-- Danh sách sản phẩm -->
                    <h3>Chi Tiết Sản Phẩm</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã SP</th>
                                <th>Tên Sản Phẩm</th>
                                <th>Số Lượng</th>
                                <th>Đơn Giá</th>
                                <th>Thành Tiền</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            order.items.forEach(item => {
                printContent += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatVND(item.price)}</td>
                        <td>${formatVND(item.total)}</td>
                    </tr>
                `;
            });

            printContent += `
                        </tbody>
                    </table>

                    <!-- Tổng tiền và giảm giá -->
                    <table>
                        <tr>
                            <td colspan="5" style="text-align: right; font-weight: bold;">Giảm giá:</td>
                            <td>${formatVND(order.discount)}</td>
                        </tr>
                        <tr>
                            <td colspan="5" style="text-align: right; font-weight: bold;">Tổng thanh toán:</td>
                            <td>${formatVND(order.totalPayment)}</td>
                        </tr>
                    </table>
                </div>
            `;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        }
    }


    // <td><img src="${item.url}" alt="${item.productName}" style="width:50px"></td>


    printContent += `
        </body>
        </html>
    `;

    let newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
}

// Hàm định dạng tiền VND
function formatVND(amount) {
    const number = parseFloat(amount).toFixed(0);
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
}
