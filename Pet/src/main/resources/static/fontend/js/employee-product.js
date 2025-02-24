document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/api/products")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("tableBody");

            const products = Array.isArray(data) ? data : [data];

            products.forEach(product => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.url}" alt="${product.name}" width="50"></td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.origin}</td>
                    <td>${product.brand}</td>
                    <td>${product.sold}</td>
                    <td><button onclick="viewDetails(${product.id})" class="btn btn-info">Xem</button>
                    <button onclick="update(${product.id})" class="btn btn-info">Chỉnh Sửa</button>
                    </td>
                    
                `;

                tableBody.appendChild(row);
            });

            // Khởi tạo DataTables
            $('#datatablesSimple').DataTable({
                "stripeClasses": [],
                "paging": true,        // Phân trang
                "searching": true,     // Ô tìm kiếm
                "ordering": true,      // Cho phép sắp xếp
                "info": true,          // Hiển thị số lượng bản ghi
                "lengthMenu": [5, 10, 30, 100], // Chọn số bản ghi mỗi trang
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
        })
        .catch(error => console.error("Error fetching data:", error));
});

function viewDetails(id) {
    alert("Chi tiết sản phẩm với ID: " + id);
}
/// mở html thêm sản phẩm 
document.getElementById("addProductBtn").addEventListener("click", function() {
    // Chuyển hướng đến trang thêm sản phẩm
    window.location.href = "add-product.html";
});
