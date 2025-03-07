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


document.addEventListener("DOMContentLoaded", async function () {
    const userId = await fetchUserId(); // Đợi kết quả
    console.log("userId", userId);
    if (!userId) {
        alert("Vui lòng đăng nhập để truy cập trang này.");
        window.location.href = "/fontend/login-user.html";
        return;
    }
    fetchAppointments(userId);
});

//  Lấy danh sách lịch hẹn của user đang đăng nhập
function fetchAppointments(userId) {
    const apiUrl = `http://localhost:8080/api/appointments/user/${userId}`; // API lấy lịch hẹn theo userId
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error("Lỗi khi lấy danh sách lịch hẹn:", error));
}


function formatPets(pets) {
    return pets.map(pet => pet.name).join(", ");
}

function formatServices(services) {
    return services.map(service => service.name).join(", ");
}
//  Hiển thị dữ liệu lên bảng
function populateTable(appointments) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    if (!appointments || appointments.length === 0) {
        console.log("Không có lịch hẹn nào!");
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Không có lịch hẹn nào</td></tr>`;
        return;
    }

    console.log("Hiển thị danh sách lịch hẹn:", appointments);
    appointments.forEach(appointment => {
        const isDisabled = (appointment.status === "Hoàn Thành" || appointment.status === "Đã hủy lịch") ? "disabled" : "";
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.pets[0].user.username}</td>
            <td>${formatPets(appointment.pets)}</td>
            <td>${formatServices(appointment.services)}</td>
            <td>${appointment.startTime} - ${appointment.endTime}</td>
            <td>${appointment.appDate}</td>
            <td>${appointment.status}</td>
            <td><button class="btn btn-info" onclick="cancelAppointment(${appointment.id})" ${isDisabled}>Hủy</button></td>
        `;

        tableBody.appendChild(row);
    });

  
    if (typeof $ !== "undefined" && $.fn.DataTable) {
        if ($.fn.DataTable.isDataTable('#datatablesSimple')) {
            $('#datatablesSimple').DataTable().destroy();
        }
    }
    

        // Khởi tạo lại DataTables
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


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchBtn").addEventListener("click", searchAppointments);
});

async function searchAppointments() {
    const userId = await fetchUserId(); // Đợi kết quả
    const date = document.getElementById("dateInput").value;
    const timeSlot = document.getElementById("timeSlotSelect").value;
    if ($.fn.dataTable.isDataTable('#datatablesSimple')) {
        $('#datatablesSimple').DataTable().destroy();
    }

    if (!userId) {
        alert("Vui lòng nhập User ID!");
        return;
    }

    let apiUrl = "http://localhost:8080/api/appointments/filter-time-slot";
    let params = new URLSearchParams();

    params.append("userId", userId);
    if (date) params.append("date", date);
    if (timeSlot) params.append("slot", timeSlot);

    apiUrl += "?" + params.toString();
    console.log(" API Request:", apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Lỗi khi lấy lịch hẹn");

        const appointments = await response.json();
        console.log(" Data received:", appointments);
        
        populateTable(appointments);
    } catch (error) {
        console.error(" Lỗi khi gửi yêu cầu:", error);
        alert("Không thể lấy danh sách lịch hẹn, vui lòng thử lại!");
    }
}

/// hủy lịch hẹn dành cho ngời dùng
async function cancelAppointment(appointmentId) {
    const confirmCancel = confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?");
    if (!confirmCancel) return;

    try {
        const response = await fetch(`/api/appointments/cancel/${appointmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.text(); // Lấy phản hồi dưới dạng text

        if (!response.ok) {
            throw new Error(result);
        }

        alert("Hủy lịch hẹn thành công!");
        location.reload(); // Refresh lại trang sau khi hủy
    } catch (error) {
        console.error("Lỗi hủy lịch hẹn:", error);
        alert("Không thể hủy lịch hẹn: " + error.message);
    }
}
