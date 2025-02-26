// document.addEventListener("DOMContentLoaded", function () {
//     // Fetch orders data from the API
//     fetch(`http://localhost:8080/api/orders/employee`)
//         .then(response => response.json())
//         .then(data => {
//             const tableBody = document.getElementById("tableBody");

//             // Check if the data is an array
//             const orders = Array.isArray(data) ? data : [data];

//             // Process each order and fetch username
//             const orderPromises = orders.map(order => {
//                 return fetch(`http://localhost:8080/api/auth/info/${order.userId}`)
//                     .then(response => response.json())
//                     .then(userData => {
//                         const row = document.createElement("tr");

//                         // Populate the table row with order data and username
//                         row.innerHTML = `
//                             <td><input type="checkbox" class="order-checkbox"></td> <!-- Checkbox -->
//                             <td>${order.id}</td>
//                             <td>${userData.username}</td> <!-- Display username -->
//                             <td>${new Date(order.orderDate).toLocaleDateString()}</td>
//                             <td>${formatVND(order.totalPayment)}</td>
//                             <td>${order.paymentMethod}</td>
//                             <td>${order.orderStatus}</td>
//                             <td><button onclick="viewOrderDetails(${order.id})" class="btn btn-info">Chi tiết</button></td>
//                             <td><button onclick="approveOrder(${order.id})" class="btn btn-info">Duyệt</button></td>
//                         `;

//                         // Append the row to the table body
//                         tableBody.appendChild(row);
//                     })
//                     .catch(error => console.error("Error fetching user data:", error));
//             });

//             // Wait for all user data to be fetched before initializing DataTables
//             Promise.all(orderPromises).then(() => {
//                 // Initialize DataTables
//                 $('#datatablesSimple').DataTable({
//                     "stripeClasses": [],
//                     "paging": true,        // Enable pagination
//                     "searching": true,     // Enable search box
//                     "ordering": true,      // Enable sorting
//                     "info": true,          // Show record info
//                     "lengthMenu": [5, 10, 30, 100], // Records per page
//                     "language": {
//                         "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
//                         "zeroRecords": "Không tìm thấy dữ liệu",
//                         "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
//                         "infoEmpty": "Không có bản ghi nào",
//                         "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
//                         "search": "Tìm kiếm:",
//                         "paginate": {
//                             "first": "Đầu",
//                             "last": "Cuối",
//                             "next": ">",
//                             "previous": "<"
//                         }
//                     }
//                 });
//             });
//         })
//         .catch(error => console.error("Error fetching data:", error));
// });
// function formatVND(amount) {
//     const number = parseFloat(amount).toFixed(0);
    
//     const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//     return formattedNumber + " VND";
// }
// ////////////////////////////////////////////////////////////////////

// document.addEventListener("DOMContentLoaded", function () {
//     const orderStatusSelect = document.getElementById("orderStatus");

//     // Function to fetch and display orders based on selected status
//     function fetchOrders(status = 'ALL') {
//         // Clear previous DataTable instance before fetching new data
//         if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
//             $('#datatablesSimple').DataTable().destroy();
//         }

//         let apiUrl = '';

//         if (status === 'ALL') {
//             // Fetch all orders (no status filter)
//             apiUrl = 'http://localhost:8080/api/orders/employee';
//         } else {
//             // Fetch orders filtered by status
//             apiUrl = `http://localhost:8080/api/orders/status/${encodeURIComponent(status)}`;
//         }

//         // Fetch orders from the API
//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(data => {
//                 console.log("Fetched Data:", data); // Log the fetched data

//                 const tableBody = document.getElementById("tableBody");
//                 tableBody.innerHTML = ''; // Clear the existing rows before adding new ones

//                 if (Array.isArray(data) && data.length > 0) {
//                     const orderPromises = data.map(order => {
//                         return fetch(`http://localhost:8080/api/auth/info/${order.userId}`)
//                             .then(response => response.json())
//                             .then(userData => {
//                                 const row = document.createElement("tr");

//                                 // Populate the table row with order data and username
//                                 row.innerHTML = `
//                                     <td><input type="checkbox" class="order-checkbox"></td> <!-- Checkbox -->
//                                     <td>${order.id}</td>
//                                     <td>${userData.username}</td> <!-- Display username -->
//                                     <td>${new Date(order.orderDate).toLocaleDateString()}</td>
//                                     <td>${formatVND(order.totalPayment)}</td>
//                                     <td>${order.paymentMethod}</td>
//                                     <td>${order.orderStatus}</td>
//                                     <td><button onclick="viewOrderDetails(${order.id})" class="btn btn-info">Chi tiết</button></td>
//                                     <td><button onclick="approveOrder(${order.id})" class="btn btn-info">Duyệt</button></td>
//                                 `;
                                
//                                 console.log("Row added:", row); // Log the row being added

//                                 // Append the row to the table body
//                                 tableBody.appendChild(row);
//                             })
//                             .catch(error => console.error("Error fetching user data:", error));
//                     });

//                     Promise.all(orderPromises).then(() => {
//                         // Reinitialize the DataTable after data is added
//                         $('#datatablesSimple').DataTable({
//                             "stripeClasses": [],
//                             "paging": true,        // Enable pagination
//                             "searching": true,     // Enable search box
//                             "ordering": true,      // Enable sorting
//                             "info": true,          // Show record info
//                             "lengthMenu": [5, 10, 30, 100], // Records per page
//                             "language": {
//                                 "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
//                                 "zeroRecords": "Không tìm thấy dữ liệu",
//                                 "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
//                                 "infoEmpty": "Không có bản ghi nào",
//                                 "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
//                                 "search": "Tìm kiếm:",
//                                 "paginate": {
//                                     "first": "Đầu",
//                                     "last": "Cuối",
//                                     "next": ">",
//                                     "previous": "<"
//                                 }
//                             }
//                         });
//                     });
//                 } else {
//                     console.log("No data found for status:", status);
//                 }
//             })
//             .catch(error => console.error("Error fetching data:", error));
//     }

//     // Initial fetch with "ALL" status
//     fetchOrders('ALL');

//     // Event listener for the orderStatus select element
//     orderStatusSelect.addEventListener('change', function () {
//         const selectedStatus = orderStatusSelect.value;
//         fetchOrders(selectedStatus); // Fetch orders based on the selected status
//     });
// });

// // Format function for displaying VND currency
// function formatVND(amount) {
//     const number = parseFloat(amount).toFixed(0);
//     const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return formattedNumber + " VND";
// }
//////////////////////////////////////////////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//     const orderStatusSelect = document.getElementById("orderStatus");

//     // Function to fetch and display orders based on selected status
//     function fetchOrders(status = 'ALL') {
//         // Clear previous DataTable instance before fetching new data
//         if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
//             $('#datatablesSimple').DataTable().destroy();
//         }

//         let apiUrl = '';

//         if (status === 'ALL') {
//             // Fetch all orders (no status filter)
//             apiUrl = 'http://localhost:8080/api/orders/employee';
//         } else {
//             // Fetch orders filtered by status
//             apiUrl = `http://localhost:8080/api/orders/status/${encodeURIComponent(status)}`;
//         }

//         // Fetch orders from the API
//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(data => {
//                 console.log("Fetched Data:", data); // Log the fetched data

//                 const tableBody = document.getElementById("tableBody");
//                 tableBody.innerHTML = ''; // Clear the existing rows before adding new ones

//                 if (Array.isArray(data) && data.length > 0) {
//                     const orderPromises = data.map(order => {
//                         return fetch(`http://localhost:8080/api/auth/info/${order.userId}`)
//                             .then(response => response.json())
//                             .then(userData => {
//                                 const row = document.createElement("tr");

//                                 // Populate the table row with order data and username
//                                 row.innerHTML = `
//                                     <td><input type="checkbox" class="order-checkbox"></td> <!-- Checkbox -->
//                                     <td>${order.id}</td>
//                                     <td>${userData.username}</td> <!-- Display username -->
//                                     <td>${new Date(order.orderDate).toLocaleDateString()}</td>
//                                     <td>${formatVND(order.totalPayment)}</td>
//                                     <td>${order.paymentMethod}</td>
//                                     <td>${order.orderStatus}</td>
//                                     <td><button onclick="viewOrderDetails(${order.id})" class="btn btn-info">Chi tiết</button></td>
//                                     <td><button onclick="approveOrder(${order.id})" class="btn btn-info">Duyệt</button></td>
//                                 `;
                                
//                                 console.log("Row added:", row); // Log the row being added

//                                 // Append the row to the table body
//                                 tableBody.appendChild(row);
//                             })
//                             .catch(error => console.error("Error fetching user data:", error));
//                     });

//                     Promise.all(orderPromises).then(() => {
//                         // Reinitialize the DataTable after data is added
//                         $('#datatablesSimple').DataTable({
//                             "stripeClasses": [],
//                             "paging": true,        // Enable pagination
//                             "searching": true,     // Enable search box
//                             "ordering": true,      // Enable sorting
//                             "info": true,          // Show record info
//                             "lengthMenu": [5, 10, 30, 100], // Records per page
//                             "language": {
//                                 "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
//                                 "zeroRecords": "Không tìm thấy dữ liệu",
//                                 "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
//                                 "infoEmpty": "Không có bản ghi nào",
//                                 "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
//                                 "search": "Tìm kiếm:",
//                                 "paginate": {
//                                     "first": "Đầu",
//                                     "last": "Cuối",
//                                     "next": ">",
//                                     "previous": "<"
//                                 }
//                             }
//                         });
//                     });
//                 } else {
//                     console.log("No data found for status:", status);
//                 }
//             })
//             .catch(error => console.error("Error fetching data:", error));
//     }

//     // Initial fetch with "ALL" status
//     fetchOrders('ALL');

//     // Event listener for the orderStatus select element
//     orderStatusSelect.addEventListener('change', function () {
//         const selectedStatus = orderStatusSelect.value;
//         fetchOrders(selectedStatus); // Fetch orders based on the selected status
//     });
// });

// // Format function for displaying VND currency
// function formatVND(amount) {
//     const number = parseFloat(amount).toFixed(0);
//     const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return formattedNumber + " VND";
// }
// document.addEventListener("DOMContentLoaded", function () {
//     const orderStatusSelect = document.getElementById("orderStatus");
//     const searchDateInput = document.getElementById("searchDate");

//     // Function to fetch and display orders based on selected status and date
//     function fetchOrders(status = 'ALL', searchDate = '') {
//         // Clear previous DataTable instance before fetching new data
//         if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
//             $('#datatablesSimple').DataTable().destroy();
//         }

//         let apiUrl = '';

//         if (status === 'ALL') {
//             // Fetch all orders (no status filter)
//             apiUrl = 'http://localhost:8080/api/orders/employee';
//         } else {
//             // Fetch orders filtered by status
//             apiUrl = `http://localhost:8080/api/orders/status/${encodeURIComponent(status)}`;
//         }

//         // Add the searchDate parameter if available
//         if (searchDate) {
//             apiUrl = `http://localhost:8080/api/orders/date?orderDate=${searchDate}`;
//         }

//         console.log("API Request URL:", apiUrl); // Check the final URL to ensure it's correct

//         // Fetch orders from the API
//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(data => {
//                 console.log("Fetched Data:", data); // Log the fetched data

//                 const tableBody = document.getElementById("tableBody");
//                 tableBody.innerHTML = ''; // Clear the existing rows before adding new ones

//                 if (Array.isArray(data) && data.length > 0) {
//                     const orderPromises = data.map(order => {
//                         return fetch(`http://localhost:8080/api/auth/info/${order.userId}`)
//                             .then(response => response.json())
//                             .then(userData => {
//                                 const row = document.createElement("tr");

//                                 row.innerHTML = `
//                                     <td><input type="checkbox" class="order-checkbox"></td>
//                                     <td>${order.id}</td>
//                                     <td>${userData.username}</td>
//                                     <td>${new Date(order.orderDate).toLocaleDateString()}</td>
//                                     <td>${formatVND(order.totalPayment)}</td>
//                                     <td>${order.paymentMethod}</td>
//                                     <td>${order.orderStatus}</td>
//                                     <td><button onclick="viewOrderDetails(${order.id})" class="btn btn-info">Chi tiết</button></td>
//                                     <td><button onclick="approveOrder(${order.id})" class="btn btn-info">Duyệt</button></td>
//                                 `;
                                
//                                 tableBody.appendChild(row);
//                             })
//                             .catch(error => console.error("Error fetching user data:", error));
//                     });

//                     Promise.all(orderPromises).then(() => {
//                         // Reinitialize the DataTable after data is added
//                         $('#datatablesSimple').DataTable({
//                             "stripeClasses": [],
//                             "paging": true,        // Enable pagination
//                             "searching": true,     // Enable search box
//                             "ordering": true,      // Enable sorting
//                             "info": true,          // Show record info
//                             "lengthMenu": [5, 10, 30, 100], // Records per page
//                             "language": {
//                                 "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
//                                 "zeroRecords": "Không tìm thấy dữ liệu",
//                                 "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
//                                 "infoEmpty": "Không có bản ghi nào",
//                                 "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
//                                 "search": "Tìm kiếm:",
//                                 "paginate": {
//                                     "first": "Đầu",
//                                     "last": "Cuối",
//                                     "next": ">",
//                                     "previous": "<"
//                                 }
//                             }
//                         });
//                     });
//                 } else {
//                     console.log("No data found for status:", status);
//                 }
//             })
//             .catch(error => console.error("Error fetching data:", error));
//     }

//     // Initial fetch with "ALL" status and no date filter
//     fetchOrders('ALL');

//     // Event listener for the orderStatus select element
//     orderStatusSelect.addEventListener('change', function () {
//         const selectedStatus = orderStatusSelect.value;
//         const selectedDate = searchDateInput.value; // Get the selected date
//         fetchOrders(selectedStatus, selectedDate); // Fetch orders based on the selected status and date
//     });

//     // Event listener for the searchDate input element
//     searchDateInput.addEventListener('change', function () {
//         const selectedStatus = orderStatusSelect.value;
//         const selectedDate = searchDateInput.value; // Get the selected date
//         fetchOrders(selectedStatus, selectedDate); // Fetch orders based on the selected status and date
//     });
// });

// // Format function for displaying VND currency
// function formatVND(amount) {
//     const number = parseFloat(amount).toFixed(0);
//     const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return formattedNumber + " VND";
// }
document.addEventListener("DOMContentLoaded", function () {
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
                                    <td><input type="checkbox" class="order-checkbox"></td>
                                    <td>${order.id}</td>
                                    <td>${userData.username}</td>
                                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
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

// function viewOrderDetails(orderId) {
//     // Lưu order.id vào localStorage hoặc sessionStorage
//     localStorage.setItem('orderId', orderId);

//     // Chuyển đến trang chi tiết đơn hàng
//     window.location.href = 'employee-order-detail.html';
// }

function viewOrderDetails(orderId) {
    // Chuyển hướng sang trang chi tiết đơn hàng và truyền order.id qua URL
    window.location.href = `employee-order-detail.html?orderId=${orderId}`;
}

// Format function for displaying VND currency
function formatVND(amount) {
    const number = parseFloat(amount).toFixed(0);
    const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber + " VND";
}
////////////////////////////////
    //  // Chức năng cho checkbox "Tất cả"
    //  document.getElementById('checkAll').addEventListener('change', function() {
    //     // Lấy tất cả các checkbox trong bảng, bao gồm cả các trang không hiển thị
    //     const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
        
    //     // Đánh dấu tất cả checkbox
    //     checkboxes.prop('checked', this.checked);
    // });


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


document.addEventListener("DOMContentLoaded", function () {
    const approveOrderModal = new bootstrap.Modal(document.getElementById('approveOrderModal'));  // Lấy modal
    const approveOrderBtn = document.getElementById('approveOrderBtn'); // Nút mở modal
    const selectedOrdersCount = document.getElementById('selectedOrdersCount'); // Phần hiển thị số đơn hàng
    const checkAllCheckbox = document.getElementById('checkAll'); // Checkbox chọn tất cả

    // Lắng nghe sự kiện khi nhấn nút "Duyệt Đơn Hàng"
    approveOrderBtn.addEventListener('click', function () {
        const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
        const checkedCount = checkboxes.filter(':checked').length; // Đếm số đơn hàng được chọn

        // Hiển thị số đơn hàng đã chọn trong modal
        selectedOrdersCount.textContent = `Số đơn hàng được chọn: ${checkedCount}`;

        // Nếu không có đơn hàng nào được chọn, cảnh báo và không mở modal
        if (checkedCount === 0) {
            alert("Vui lòng chọn ít nhất một đơn hàng để duyệt!");
            return;
        }

        // Mở modal
        approveOrderModal.show();
    });

    // Cập nhật số lượng đơn hàng được chọn khi chọn checkbox "Tất cả"
    checkAllCheckbox.addEventListener('change', function () {
        const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
        checkboxes.prop('checked', this.checked);

        const checkedCount = checkboxes.filter(':checked').length;
        console.log(`Số đơn hàng được chọn: ${checkedCount}`);
    });

    // Cập nhật số lượng đơn hàng được chọn khi chọn từng đơn hàng
    $(document).on('change', '.order-checkbox', function () {
        const checkboxes = $('#datatablesSimple').DataTable().rows().nodes().to$().find('.order-checkbox');
        const checkedCount = checkboxes.filter(':checked').length;

        console.log(`Số đơn hàng được chọn: ${checkedCount}`);
    });

    // Đóng modal khi nhấn nút "Đóng"
    const hideBtnModal = document.getElementById("hideBtnModal");
    hideBtnModal.addEventListener('click', function () {
        approveOrderModal.hide();
    });
});
