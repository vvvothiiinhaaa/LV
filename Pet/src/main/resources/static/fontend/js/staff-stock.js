        // Hàm định dạng ngày giờ theo múi giờ Việt Nam
  // Định dạng ngày giờ theo múi giờ Việt Nam
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

// Lấy danh sách tất cả các nhập hàng từ API
function fetchStockEntries() {
    fetch('/api/stock/all')
        .then(response => response.json())
        .then(data => {
            // Xóa nội dung cũ trong bảng
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            // Thêm các dòng mới vào bảng
            data.forEach(stock => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stock.productId}</td>
                    <td>${stock.product.name}</td>
                    <td>${stock.quantity}</td>
                    <td>${formatDate(stock.entryDate)}</td>
                    <td class="btn-group">
                         <button onclick="updateStockQuantity(${stock.id})" class="btn-update">
                                    <i class="fas fa-edit"></i> Cập Nhật
                         </button>

                          <button onclick="fetchStockHistory(${stock.product.id})" class="btn-update">
                                    Lịch Sử Nhập Hàng
                         </button>

                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Nếu DataTable đã khởi tạo, hủy bỏ trước khi khởi tạo lại
            if ($.fn.DataTable.isDataTable('#datatablesSimple')) {
                $('#datatablesSimple').DataTable().clear().destroy();
            }

            // Khởi tạo DataTable sau khi dữ liệu được tải
            $('#datatablesSimple').DataTable({
                stripeClasses: [],
                paging: true,
                searching: true,
                ordering: true,
                info: true,
                lengthMenu: [5, 10, 30, 100],
                language: {
                    lengthMenu: "Hiển thị _MENU_ bản ghi mỗi trang",
                    zeroRecords: "Không tìm thấy dữ liệu",
                    info: "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
                    infoEmpty: "Không có bản ghi nào",
                    infoFiltered: "(Lọc từ _MAX_ bản ghi)",
                    search: "Tìm kiếm:",
                    paginate: {
                        first: "Đầu",
                        last: "Cuối",
                        next: ">",
                        previous: "<"
                    }
                }
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}

// Gọi API khi trang tải
document.addEventListener('DOMContentLoaded', fetchStockEntries);

// Chỉnh sửa nhập hàng
function editStock(id) {
    alert('Chỉnh sửa nhập hàng với ID: ' + id);
    // Logic chỉnh sửa có thể được thêm vào đây
}

// Xóa nhập hàng
function deleteStock(id) {
    if (confirm('Bạn có chắc chắn muốn xóa mục nhập này?')) {
        fetch(`/api/stock/delete/${id}`, { method: 'DELETE' })
            .then(() => {
                fetchStockEntries();  // Tải lại danh sách sau khi xóa
            })
            .catch(error => {
                console.error('Lỗi khi xóa dữ liệu:', error);
            });
    }
}


///// chỉnh sửa 
// Hàm cập nhật số lượng nhập hàng
function updateStockQuantity(id) {
    const newQuantity = prompt("Nhập số lượng mới:");

    if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
        fetch(`/api/stock/update/${id}?newQuantity=${newQuantity}`, {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(updatedStock => {
            alert("Số lượng đã được cập nhật!");
            location.reload();
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật số lượng:', error);
        });
    } else {
        alert("Vui lòng nhập số lượng hợp lệ!");
    }
}


// Gọi hàm này từ giao diện khi muốn sửa số lượng nhập hàng

function fetchStockHistory(productId) {
    fetch(`/api/stock/product/${productId}`)
        .then(response => response.json())
        .then(data => {
            const historyTableBody = document.getElementById('historyTableBody');
            historyTableBody.innerHTML = ''; // Xóa nội dung cũ

            if (data.length === 0) {
                historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Không có lịch sử nhập hàng</td></tr>';
                return;
            }

            // Thêm dữ liệu vào bảng lịch sử nhập hàng
            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.id}</td>
                    <td>${entry.quantity}</td>
                    <td>${formatDate(entry.entryDate)}</td>
                `;
                historyTableBody.appendChild(row);
            });

            // Mở modal hiển thị lịch sử nhập hàng
            $('#stockHistoryModal').modal('show');
        })
        .catch(error => console.error('Lỗi khi tải lịch sử nhập hàng:', error));
}
