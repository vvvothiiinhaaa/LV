
document.addEventListener("DOMContentLoaded", function () {
    fetchAppointmentsToday();
    fetchPendingOrders();
});
function fetchAppointmentsToday() {
    fetch("http://localhost:8080/api/appointments/today/status?status=Đã Đặt Lịch")
        .then(res => res.json())
        .then(data => {
            const tableId = '#appointmentTable'; // ID bảng
            const tbody = document.querySelector('#appTable'); // tbody element
            tbody.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">Không có lịch hẹn nào hôm nay.</td>
                    </tr>
                `;
                return;
            }

            data.forEach(appointment => {
                const user = appointment.pets[0]?.user?.username || "Không rõ";
                const petNames = appointment.pets.map(p => p.name).join(", ");
                const serviceNames = appointment.services.map(s => s.name).join(", ");
                const startTime = appointment.startTime;
                const endTime = appointment.endTime;
                const appDate = appointment.appDate;
                const status = appointment.status;

                const row = `
                    <tr>
                        <td>${user}</td>
                        <td>${petNames}</td>
                        <td>${serviceNames}</td>
                        <td>${startTime} - ${endTime}</td>
                        <td>${appDate}</td>
                        <td><span class="badge bg-success">${status}</span></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

            // Nếu bảng đã được khởi tạo bằng DataTables → hủy trước khi khởi tạo lại
            if ($.fn.DataTable.isDataTable(tableId)) {
                $(tableId).DataTable().destroy();
            }

            $(tableId).DataTable({
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
                    infoFiltered: "(lọc từ _MAX_ bản ghi)",
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
        .catch(err => {
            console.error("Lỗi khi lấy lịch hẹn:", err);
            const tbody = document.querySelector('#appTable');
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">Lỗi khi tải dữ liệu!</td>
                </tr>
            `;
        });
}


///// fetch gọi đơn hàng
function formatVND(amount) {
    const number = parseFloat(amount).toFixed(0);
    const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber + " VND";
}
async function fetchPendingOrders() {
    const tableId = '#orderTable';
    const tbodyId = 'pendingOrdersTableBody';

    try {
        const response = await fetch("http://localhost:8080/api/orders/status/Chờ Xác Nhận");
        const orders = await response.json();

        // Sắp xếp giảm dần theo ngày
        orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        const tbody = document.getElementById(tbodyId);
        if (!tbody) {
            console.error(`Không tìm thấy tbody với id '${tbodyId}'`);
            return;
        }

        tbody.innerHTML = "";

        // Duyệt từng đơn hàng và lấy tên người dùng từ API
        for (const order of orders) {
            const orderId = order.id;
            const userId = order.userId;
            const totalPayment = formatVND(order.totalPayment).toLocaleString('vi-VN');
            const paymentMethod = order.paymentMethod || "N/A";
            const createdAt = new Date(order.orderDate).toLocaleString('vi-VN');
            const status = order.orderStatus;

            // Gọi API lấy tên user
            let userName = "Không rõ";
            try {
                const userRes = await fetch(`http://localhost:8080/api/auth/info/${userId}`);
                const userData = await userRes.json();
                userName = userData.username || "Không rõ";
            } catch (userErr) {
                console.warn(`Không lấy được tên cho userId: ${userId}`, userErr);
            }

            const row = `
                <tr>
                    <td>${orderId}</td>
                    <td>${userName}</td>
                    <td>${totalPayment}</td>
                    <td>${paymentMethod}</td>
                    <td>${createdAt}</td>
                    <td><span class="badge bg-warning text-dark">${status}</span></td>
                </tr>
            `;
            tbody.innerHTML += row;
        }

        // Khởi tạo lại DataTable
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        $(tableId).DataTable({
            stripeClasses: [],
            paging: true,
            searching: true,
            ordering: true,
            order: [[4, 'desc']],
            lengthMenu: [5, 10, 30, 100],
            language: {
                lengthMenu: "Hiển thị _MENU_ đơn hàng mỗi trang",
                zeroRecords: "Không tìm thấy đơn hàng",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_ đơn hàng",
                infoEmpty: "Không có đơn hàng nào",
                infoFiltered: "(Lọc từ _MAX_ đơn hàng)",
                search: "Tìm kiếm:",
                paginate: {
                    first: "Đầu",
                    last: "Cuối",
                    next: ">",
                    previous: "<"
                }
            }
        });

    } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
}
