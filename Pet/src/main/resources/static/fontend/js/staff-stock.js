
// Hàm định dạng ngày giờ theo múi giờ Việt Nam
function formatDate(dateString) {
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
}


// Hàm lấy danh sách tất cả các nhập hàng từ API
document.addEventListener('DOMContentLoaded', fetchStockEntries);
function fetchStockEntries() {
    fetch('/api/stock/all')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Kiểm tra dữ liệu API trả về
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear existing table content

        // Tạo một mảng chứa tất cả các promises cho việc gọi API sản phẩm
        const productPromises = data.map(stock => {
            return fetch(`/api/products/${stock.productId}`)
                .then(response => response.json()) // Lấy tên sản phẩm
                .then(productData => {
                    const entryDate = formatDate(stock.entryDate); // Sử dụng hàm formatDate

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stock.productId}</td>
                        <td>${productData.name}</td> <!-- Tên sản phẩm lấy từ API -->
                        <td>${stock.quantity}</td>
                        <td>${stock.purchasePrice}</td>
                        <td>${entryDate}</td>
                    `;
                    tableBody.appendChild(row);
                })
                .catch(error => {
                    console.error(`Lỗi khi lấy sản phẩm với ID ${stock.productId}:`, error);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stock.productId}</td>
                        <td colspan="4">Không thể tải tên sản phẩm</td>
                    `;
                    tableBody.appendChild(row);
                });
        });

        // Dùng Promise.all để chờ tất cả các promise hoàn thành
        Promise.all(productPromises)
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu:', error);
            });

    })
    .catch(error => {
        console.error('Lỗi khi lấy dữ liệu kho:', error);
    });
}


