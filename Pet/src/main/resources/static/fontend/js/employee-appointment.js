
// kiểm tra trạng thái đăng nhập
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
    fetchAppointments();
    // fetchAppointmentsByTimeSlot();
});


function fetchAppointments() {
    fetch("http://localhost:8080/api/appointments")
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error("Lỗi khi lấy danh sách lịch hẹn:", error));
}
//// chức năng tiềm kiếm 
document.addEventListener("DOMContentLoaded", function () {
    // Gắn sự kiện click cho nút tìm kiếm
    document.getElementById("searchBtn").addEventListener("click", fetchAppointmentsByTimeSlot);
});

async function fetchAppointmentsByTimeSlot() {
    const date = document.getElementById("dateInput").value;
    const timeSlot = document.getElementById("timeSlotSelect").value;

    if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
        $('#datatablesSimple').DataTable().destroy();
    }

    let apiUrl = "http://localhost:8080/api/appointments/time-slot";
    let params = new URLSearchParams();

    if (date) params.append("date", date);
    if (timeSlot) params.append("slot", timeSlot);

    apiUrl += "?" + params.toString();
    
    console.log(" Đang gửi yêu cầu đến API:", apiUrl); // Debug URL gửi đi

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Lỗi khi lấy lịch hẹn");

        const appointments = await response.json();
        console.log(" Dữ liệu nhận được:", appointments); // Debug dữ liệu nhận về
        populateTable(appointments);
        // fetchAppointments();
    } catch (error) {
        console.error(" Lỗi khi gửi yêu cầu:", error);
        alert("Không thể lấy danh sách lịch hẹn, vui lòng thử lại!");
    }
}


function populateTable(appointments) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    if (!appointments || appointments.length === 0) {
        console.log(" Không có lịch hẹn nào khớp!");
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Không có lịch hẹn nào</td></tr>`;
        return;
    }

    console.log("Hiển thị danh sách lịch hẹn:", appointments);
    appointments.forEach(appointment => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="checkbox" class="appointment-checkbox" data-order-id="${appointment.id}"></td>
            <td>${appointment.id}</td>
            <td>${appointment.pets[0].user.username}</td>
            <td>${formatPets(appointment.pets)}</td>
            <td>${formatServices(appointment.services)}</td>
            <td>${appointment.startTime} - ${appointment.endTime}</td>
            <td>${appointment.appDate}</td>
            <td>${appointment.status}</td>
            <td><button class="btn btn-info" onclick="viewDetails(${appointment.id})">Chi Tiết</button></td>
        `;

        tableBody.appendChild(row);
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
}

function formatPets(pets) {
    return pets.map(pet => pet.name).join(", ");
}

function formatServices(services) {
    return services.map(service => service.name).join(", ");
}

// function viewDetails(appointmentId) {
//     alert("Xem chi tiết lịch hẹn ID: " + appointmentId);
// }
document.addEventListener("DOMContentLoaded", function () {
    const statusSelect = document.getElementById("statusSelect");

    // Gọi fetchAppointmentsByStatus() mỗi khi chọn trạng thái
    statusSelect.addEventListener("change", fetchAppointmentsByStatus);
});


async function fetchAppointmentsByStatus() {
    const status = document.getElementById("statusSelect").value;

    if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
        $('#datatablesSimple').DataTable().destroy();
    }
    console.log("select" , status);
    // Mã hóa status để tránh lỗi URL encoding
    const encodedStatus = encodeURIComponent(status); 

    const apiUrl = `http://localhost:8080/api/appointments/filter?status=${encodedStatus}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Lỗi khi lấy lịch hẹn: ${response.statusText}`);

        const appointments = await response.json();
        populateTable(appointments);
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Không thể lấy danh sách lịch hẹn, vui lòng thử lại!");
    }
}



/// sự kiện chọn checkbox
document.addEventListener("DOMContentLoaded", function () {
    const selectAllCheckbox = document.getElementById("selectAll");
    const tableBody = document.getElementById("tableBody");
    const selectedCount = document.getElementById("selectedCount");

    // Hàm cập nhật danh sách ID được chọn vào localStorage
    function updateSelectedAppointments() {
        let selected = Array.from(document.querySelectorAll(".appointment-checkbox:checked"))
                            .map(checkbox => checkbox.dataset.orderId);

        localStorage.setItem("selectedAppointments", JSON.stringify(selected));
        selectedCount.innerText = selected.length; // Hiển thị số lượng đã chọn
    }

    // Chọn tất cả checkbox
    selectAllCheckbox.addEventListener("change", function () {
        let checkboxes = document.querySelectorAll(".appointment-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSelectedAppointments();
    });

    // Cập nhật danh sách khi thay đổi trạng thái checkbox đơn lẻ
    tableBody.addEventListener("change", function (event) {
        if (event.target.classList.contains("appointment-checkbox")) {
            updateSelectedAppointments();
        }
    });

   
});




// document.addEventListener("DOMContentLoaded", function () {
//     let statusSelect = document.getElementById("statusSelect");


//     // Xử lý khi nhấn "Xác Nhận" cập nhật trạng thái
//     document.getElementById("confirmUpdateStatus").addEventListener("click", async function () {
//         if (!statusSelect) {
//             alert("Lỗi: Không tìm thấy phần tử chọn trạng thái.");
//             console.error("Lỗi: Không tìm thấy phần tử select có id='statusSelect'");
//             return;
//         }

//         let newStatus = statusS.value; // Lấy giá trị trạng thái
//         console.log("Giá trị trạng thái lấy được:", newStatus); // Kiểm tra giá trị trong console

//         if (!newStatus) {
//             alert("Vui lòng chọn trạng thái mới.");
//             return;
//         }

//         let storedAppointments = localStorage.getItem("selectedAppointments");
//         let selectedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
//         selectedAppointments = selectedAppointments.map(id => parseInt(id, 10));

//         if (selectedAppointments.length === 0) {
//             alert("Vui lòng chọn ít nhất một cuộc hẹn.");
//             return;
//         }

//         console.log("Danh sách lịch hẹn được chọn:", selectedAppointments);
//         console.log("Trạng thái cập nhật:", newStatus);

//         let confirmUpdate = confirm(`Bạn có chắc chắn muốn cập nhật trạng thái của ${selectedAppointments.length} lịch hẹn không?`);
//         if (!confirmUpdate) return;

//         try {
//             let response = await fetch("http://localhost:8080/api/appointments/update-status", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     ids: selectedAppointments,
//                     status: newStatus,
//                 }),
//             });

//             if (!response.ok) {
//                 let errorText = await response.text();
//                 throw new Error(`Lỗi API: ${response.status} - ${response.statusText}. Chi tiết: ${errorText}`);
//             }

//             let result = await response.text();
//             alert(result);
//             localStorage.removeItem("selectedAppointments");
//             location.reload();
//         } catch (error) {
//             console.error("Lỗi khi cập nhật trạng thái:", error);
//             alert("Không thể cập nhật trạng thái, vui lòng kiểm tra console.");
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    let statusSelect = document.getElementById("statusSelect");

    // Kiểm tra nếu không tìm thấy phần tử select
    if (!statusSelect) {
        alert("Lỗi: Không tìm thấy phần tử chọn trạng thái.");
        console.error("Lỗi: Không tìm thấy phần tử select có id='statusSelect'");
        return;
    }

    // Xử lý khi nhấn "Xác Nhận" cập nhật trạng thái
    document.getElementById("confirmUpdateStatus").addEventListener("click", async function () {
        let newStatus = statusS.value; // Lấy giá trị trạng thái từ phần tử select
        console.log("Giá trị trạng thái lấy được:", newStatus); // Kiểm tra giá trị trong console

        if (!newStatus) {
            alert("Vui lòng chọn trạng thái mới.");
            return;
        }

        // Lấy danh sách các lịch hẹn đã chọn từ localStorage
        let storedAppointments = localStorage.getItem("selectedAppointments");
        let selectedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];

        // Chuyển đổi thành mảng các ID kiểu số
        selectedAppointments = selectedAppointments.map(id => parseInt(id, 10));

        if (selectedAppointments.length === 0) {
            alert("Vui lòng chọn ít nhất một cuộc hẹn.");
            return;
        }

        console.log("Danh sách lịch hẹn được chọn:", selectedAppointments);
        console.log("Trạng thái cập nhật:", newStatus);

        // Xác nhận trước khi gửi yêu cầu
        let confirmUpdate = confirm(`Bạn có chắc chắn muốn cập nhật trạng thái của ${selectedAppointments.length} lịch hẹn không?`);
        if (!confirmUpdate) return;

        // Thực hiện yêu cầu API
        try {
            let response = await fetch("http://localhost:8080/api/appointments/update-status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selectedAppointments,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                let errorText = await response.text();
                throw new Error(`Lỗi API: ${response.status} - ${response.statusText}. Chi tiết: ${errorText}`);
            }

            let result = await response.text();
            alert(result);

            // Sau khi cập nhật thành công, xóa danh sách cuộc hẹn đã chọn và tải lại trang
            localStorage.removeItem("selectedAppointments");
            location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái, vui lòng kiểm tra console.");
        }
    });
});



function viewDetails(appointmentId) {
    fetch(`/api/appointments/${appointmentId}`)
        .then(response => response.json())
        .then(data => {
            // Hiển thị thông tin khách hàng
            document.getElementById("customer-info").innerHTML = `
                <p><strong>Tên:</strong> ${data.pets[0].user.username}</p>
                <p><strong>Email:</strong> ${data.pets[0].user.email}</p>
                <p><strong>Điện thoại:</strong> ${data.pets[0].user.phonenumber}</p>
            `;

            // Hiển thị danh sách thú cưng
            let petHtml = "";
            data.pets.forEach(pet => {
                petHtml += `
                    <div class="pet-card">
                        <p><strong>${pet.name}</strong></p>
                        <p><strong>Giống:</strong> ${pet.breed}</p>
                         <p><strong>Giới Tính: </strong>${pet.gender}</p>
                        <p><strong>Ngày Sinh: </strong>${pet.birthdate}</p>
                    </div>
                `;
            });
            document.getElementById("pet-info").innerHTML = petHtml;

            // Hiển thị danh sách dịch vụ
            let serviceHtml = "";
            data.services.forEach(service => {
                serviceHtml += `
                    <div class="mb-2">
                        <p><strong>${service.name}</strong></p>
                        <p>${service.description}</p>
                        <p><strong>Thời Gian Dự Kiến: ${service.duration}</strong></p>
                    </div>
                `;
            });
            document.getElementById("service-info").innerHTML = serviceHtml;

            // Hiển thị thông tin lịch hẹn
            document.getElementById("appointment-info").innerHTML = `
                <p><strong>Ngày hẹn:</strong> ${data.appDate}</p>
                <p><strong>Thời gian:</strong> ${data.startTime} - ${data.endTime}</p>
                <p><strong>Trạng thái:</strong> ${data.status}</p>
                    <button class="btn btn-primary mt-2 d-flex mx-auto" onclick="printInvoice(${appointmentId})">
                        <i class="fas fa-print me-2"></i> In Hóa Đơn
                    </button>

            `;

            // Hiển thị modal
            new bootstrap.Modal(document.getElementById('appointmentModal')).show();
        })
        .catch(error => console.error('Lỗi:', error));
}


/// in hóa đơn cho lịch hẹn
function printInvoice(appointmentId) {
    fetch(`/api/appointments/${appointmentId}/invoice`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(msg => {
                    throw new Error(msg); // ném lỗi với message trả về
                });
            }
            return response.json();
        })
        .then(data => {
            const content = `
                <p><strong>Mã lịch hẹn:</strong> ${data.appointmentId}</p>
                <p><strong>Khách hàng:</strong> ${data.customerName}</p>
                <p><strong>Ngày hẹn:</strong> ${data.appointmentDate.replace("T", " ")}</p>
                <p><strong>Trạng thái:</strong> ${data.appointmentStatus}</p>
                <hr/>
                <h5>Dịch vụ:</h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Thú cưng</th>
                            <th>Kích cỡ</th>
                            <th>Dịch vụ</th>
                            <th>Giá (VNĐ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.services.map(s => `
                            <tr>
                                <td>${s.petName}</td>
                                <td>${s.petSize}</td>
                                <td>${s.serviceName}</td>
                                <td>${s.price.toLocaleString('vi-VN')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h5 class="text-end text-danger">Tổng tiền: ${data.totalPrice.toLocaleString('vi-VN')} VNĐ</h5>
            `;

            document.getElementById("invoiceContent").innerHTML = content;
            new bootstrap.Modal(document.getElementById('invoiceModal')).show();
        })
        .catch(err => {
            alert("Không thể lấy hóa đơn: " + err.message);
            console.error(err);
        });
}

function printOnlyInvoice() {
    const printContents = document.getElementById("invoiceContent").innerHTML;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Hóa Đơn Dịch Vụ</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h4 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                table, th, td { border: 1px solid black; }
                th, td { padding: 8px; text-align: center; }
                .text-danger { color: red; font-weight: bold; }
                .text-end { text-align: right; }
            </style>
        </head>
        <body>
            <h4>Hóa Đơn Dịch Vụ</h4>
            ${printContents}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
