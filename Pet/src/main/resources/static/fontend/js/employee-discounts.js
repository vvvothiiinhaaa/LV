document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

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
    fetchDiscounts();
});
function fetchDiscounts() {
    fetch("http://localhost:8080/api/discounts")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";
            data.forEach(discount => {
                tableBody.innerHTML += `
                    <tr>
                        <td style="text-align: center;">${discount.id}</td>
                        <td style="text-align: center;">${discount.code}</td>
                        <td style="text-align: center;">${discount.discountPercentage}%</td>
                        <td style="text-align: center;">${formatDateTime(discount.startDate)}</td>
                        <td style="text-align: center;">${formatDateTime(discount.endDate)}</td>
                        <td style="text-align: right;">${formatVND(discount.minOrderAmount)}</td>
                        <td style="text-align: center;">${discount.usageLimit}</td>
                        <td style="text-align: center;">
                          <div class="btn-group" style="text-align: center;">
                                <button onclick="openUpdateModal('${discount.id}')" class="btn-update">
                                    <i class="fas fa-edit"></i> Cập Nhật
                                </button>
                                <button onclick="deleteDiscount(${discount.id})" class="btn-delete">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

             // Kiểm tra nếu DataTable đã khởi tạo thì hủy trước
            if ($.fn.DataTable.isDataTable('#datatablesSimple')) {
                $('#datatablesSimple').DataTable().destroy();
            }


            // Khởi tạo DataTables
            $('#datatablesSimple').DataTable({
                "stripeClasses": [],
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "lengthMenu": [5, 10, 30, 100],
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
        .catch(error => console.error("Lỗi tải dữ liệu:", error));
}

function deleteDiscount(id) {
    if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
        fetch(`http://localhost:8080/api/discounts/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        .then(response => {
            if (response.ok) {
                alert("Xóa mã giảm giá thành công!");
                fetchDiscounts(); // Cập nhật danh sách sau khi xóa
                location.reload();

            } else {
                alert("Không thể xóa mã giảm giá!");
            }
        })
        .catch(error => console.error("Lỗi xóa mã giảm giá:", error));
    }
}

// Mở modal cập nhật và tải dữ liệu
function openUpdateModal(id) {
    fetch(`http://localhost:8080/api/discounts/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải chi tiết mã giảm giá");
            return response.json();
        })
        .then(data => {
            document.getElementById("discountId").value = data.id;
            document.getElementById("discountCode").value = data.code;
            document.getElementById("discountPercentage1").value = data.discountPercentage;
            document.getElementById("startDate1").value = formatDateForInput(data.startDate);
            document.getElementById("endDate1").value = formatDateForInput(data.endDate);
            document.getElementById("minOrderAmount1").value = data.minOrderAmount;
            document.getElementById("usageLimit1").value = data.usageLimit;

            // Hiển thị modal cập nhật
            const modal = new bootstrap.Modal(document.getElementById("discountupdateModal"));
            modal.show();
        })
        .catch(error => alert("Lỗi khi tải chi tiết: " + error.message));
}

// Cập nhật mã giảm giá
function updateDiscount() {
    const id = document.getElementById("discountId").value;
    const code = document.getElementById("discountCode").value; // Lấy code từ input
    const updatedDiscount = {
        code: code,
        discountPercentage: parseFloat(document.getElementById("discountPercentage1").value),
        startDate: document.getElementById("startDate1").value,
        endDate: document.getElementById("endDate1").value,
        minOrderAmount: parseFloat(document.getElementById("minOrderAmount1").value),
        usageLimit: parseInt(document.getElementById("usageLimit1").value, 10)
    };

    fetch(`http://localhost:8080/api/discounts/update/${code}`, { // API cập nhật theo code
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDiscount)
    })
    .then(response => {
        if (!response.ok) throw new Error("Cập nhật thất bại!");
        return response.json();
    })
    .then(() => {
        alert("Cập nhật thành công!");
        window.location.reload();
    })
    .catch(error => alert("Lỗi: " + error.message));
}



function formatDateForInput(dateString) {
    return dateString ? dateString.substring(0, 16) : "";
}


function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}
function formatVND(amount) {
    const number = parseFloat(amount).toFixed(0);
    const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber + " VND";
}

//// thêm 

// document.getElementById("discountForm").addEventListener("submit", function (event) {
//     event.preventDefault(); // Ngăn chặn reload trang

//     // Lấy dữ liệu từ form
//     const discountData = {
//         code: document.getElementById("code").value,
//         discountPercentage: document.getElementById("discountPercentage").value,
//         startDate: document.getElementById("startDate").value,
//         endDate: document.getElementById("endDate").value,
//         minOrderAmount: document.getElementById("minOrderAmount").value,
//         usageLimit: document.getElementById("usageLimit").value
//     };

//     // Gửi dữ liệu lên server bằng Fetch API
//     fetch("http://localhost:8080/api/discounts", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(discountData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert("Mã giảm giá đã được thêm thành công!");
//         document.getElementById("discountForm").reset(); // Reset form sau khi gửi thành công
//         let modal = bootstrap.Modal.getInstance(document.getElementById('discountModal'));
//         modal.hide(); // Đóng modal
//         location.reload();
//     })
//     .catch(error => {
//         console.error("Lỗi khi thêm mã giảm giá:", error);
//         alert("Có lỗi xảy ra, vui lòng thử lại!");
//     });
// });


document.getElementById("discountForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn reload trang

    // Lấy dữ liệu từ form
    const discountData = {
        code: document.getElementById("code").value,
        discountPercentage: parseFloat(document.getElementById("discountPercentage").value),
        startDate: convertToISOWithTimezone(document.getElementById("startDate").value),
        endDate: convertToISOWithTimezone(document.getElementById("endDate").value),
        minOrderAmount: parseFloat(document.getElementById("minOrderAmount").value),
        usageLimit: parseInt(document.getElementById("usageLimit").value)
    };

    // Gửi dữ liệu lên server bằng Fetch API
    fetch("http://localhost:8080/api/discounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(discountData)
    })
    .then(response => response.json())
    .then(data => {
        alert("Mã giảm giá đã được thêm thành công!");
        document.getElementById("discountForm").reset(); 
        let modal = bootstrap.Modal.getInstance(document.getElementById('discountModal'));
        modal.hide(); // Đóng modal
        location.reload();
    })
    .catch(error => {
        console.error("Lỗi khi thêm mã giảm giá:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    });
});


function convertToISOWithTimezone(dateStr) {
    if (!dateStr) return null; // Nếu không có dữ liệu, trả về null

    let date = new Date(dateStr);
    let offset = 7 * 60; // UTC+7 => 7 giờ * 60 phút

    // Chuyển đổi thành chuỗi ISO 8601 với múi giờ +07:00
    let localISO = new Date(date.getTime() + offset * 60000).toISOString();
    
    // Thay thế 'Z' (UTC) bằng múi giờ +07:00
    return localISO.replace('Z', '+07:00');
}
