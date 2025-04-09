// // Gọi API lấy danh sách người dùng
// fetch('http://localhost:8080/api/auth/info')
//     .then(response => response.json())
//     .then(users => {
//         const userList = document.getElementById("user-list");

//         // Gọi tiếp API để lấy danh sách riskStatus
//         fetch('http://localhost:8080/api/auth')
//             .then(response => response.json())
//             .then(risks => {
//                 // Tạo map để tra risk theo userId
//                 const riskMap = {};
//                 risks.forEach(r => {
//                     riskMap[r.id] = r.riskStatus;
//                 });

//                 // Duyệt từng user và tạo hàng trong bảng
//                 users.forEach(user => {
//                     const row = document.createElement("tr");

//                     const username = user.username || 'Chưa xác định';
//                     const email = user.email || 'Chưa xác định';
//                     const phonenumber = user.phonenumber || 'Chưa xác định';
//                     const birthdate = user.birthday || 'Chưa xác định';
//                     const status = user.status ? 'Đang hoạt động' : 'Bị khóa';
//                     const role = user.role || 'Chưa xác định';
//                     const risk = riskMap[user.id] || 'Chưa tính';

//                     row.innerHTML = `
//                         <td>${user.id}</td>
//                         <td>${username}</td>
//                         <td>${email}</td>
//                         <td>${phonenumber}</td>
//                         <td>${birthdate}</td>
//                         <td>${status}</td>
//                         <td>${role}</td>
//                         <td>${risk}</td>
//                     `;

//                     userList.appendChild(row);
//                 });

//                 // Khởi tạo DataTable với tùy chọn hiển thị dòng
//                 $('#datatablesSimple').DataTable({
//                     lengthMenu: [[10, 15,20, -1], [ 10,15, 20, "Tất cả"]],
//                     pageLength: 10
//                 });
//             })
//             .catch(error => console.error(' Lỗi khi lấy riskStatus:', error));
//     })
//     .catch(error => console.error(' Lỗi khi lấy danh sách người dùng:', error));


//     //// danh sách tài khoản bị cảnh cáo

//     document.getElementById("disableAccountBtn").addEventListener("click", function () {
//         fetch("http://localhost:8080/api/auth/warnings")
//             .then(response => response.json())
//             .then(data => {
//                 const tableBody = document.getElementById("warning-account-list");
//                 tableBody.innerHTML = ""; // clear old data
    
//                 data.forEach(user => {
//                     const row = `
//                         <tr>
//                             <td>${user.userId ?? 'Không xác định'}</td>
//                             <td>${user.username ?? 'Không xác định'}</td>
//                             <td>${user.email ?? 'Không xác định'}</td>
//                             <td>${user.phonenumber ?? 'Không xác định'}</td>
//                             <td>${user.birthday ?? 'Không xác định'}</td>
//                             <td>${user.gender ?? 'Không xác định'}</td>
//                             <td>${user.orderCancelCount ?? 0}</td>
//                             <td>${user.appointmentCancelCount ?? 0}</td>
//                             <td>${user.warningMessage ?? ''}</td>
//                         </tr>
//                     `;
//                     tableBody.insertAdjacentHTML("beforeend", row);
//                 });
    
//                 // Show modal
//                 const warningModal = new bootstrap.Modal(document.getElementById("warningAccountsModal"));
//                 warningModal.show();
//             })
//             .catch(error => {
//                 console.error("Lỗi khi tải danh sách cảnh cáo:", error);
//                 alert("Không thể tải danh sách cảnh cáo.");
//             });
//     });
document.addEventListener("DOMContentLoaded", () => {
    // Gọi dữ liệu người dùng và hiển thị bảng
    fetchUserDataAndRenderTable();
    // Cài đặt modal cho danh sách cảnh cáo
    setupWarningListModal();
});
function fetchUserDataAndRenderTable() {
    // Lấy tất cả người dùng từ API /info
    fetch('http://localhost:8080/api/auth/info')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP ${response.status}: Không thể lấy danh sách người dùng.`);
            }
            return response.json();
        })
        .then(users => {
            // Sau khi lấy người dùng, tiếp tục lấy danh sách người dùng có cảnh báo
            fetch('http://localhost:8080/api/auth')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Lỗi HTTP ${response.status}: Không thể lấy danh sách người dùng có cảnh báo.`);
                    }
                    return response.json();
                })
                .then(risks => {
                    // Gọi hàm để render danh sách người dùng và trạng thái cảnh báo
                    renderUserList(users, risks);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy dữ liệu người dùng có cảnh báo:', error);
                    alert(`Lỗi khi lấy danh sách người dùng có cảnh báo: ${error.message}`);
                });
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            alert(`Lỗi khi lấy danh sách người dùng: ${error.message}`);
        });
}

function renderUserList(users, risks) {
    const tableBody = document.getElementById("user-list");
    tableBody.innerHTML = "";  // Xóa bảng trước khi render lại

    users.forEach(user => {
        const row = document.createElement("tr");
        row.id = `user-row-${user.id}`;  // Đặt id cho từng dòng

        const id = user.id ?? "Không xác định";
        const username = user.username ?? "Không xác định";
        const email = user.email ?? "Không xác định";
        const phone = user.phonenumber ?? "Không xác định";
        const birthday = user.birthday ?? "Không xác định";
        const status = user.status ? "Đang hoạt động" : "Bị khóa";
        const role = user.role ?? "Không xác định";
        
        // Tìm riskStatus trong danh sách risks dựa vào userId
        const riskData = risks.find(risk => risk.userId === user.id);
        const risk = riskData ? riskData.riskStatus : "Bình Thường";

        const badgeColor = getBadgeColor(risk);
        const unlockBtn = !user.status
            ? `<button class="btn btn-sm btn-success" onclick="unlockUser(${user.id})">Mở khóa</button>`
            : `<span class="text-muted">Không cần</span>`;

        row.innerHTML = `
            <td>${id}</td>
            <td>${username}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${birthday}</td>
            <td class="status-cell"><span class="badge ${user.status ? 'bg-success' : 'bg-danger'}">${status}</span></td>
            <td>${role}</td>
            <td class="risk-cell"><span class="badge ${badgeColor}">${risk}</span></td>
            <td class="action-cell">${unlockBtn}</td>
        `;

        tableBody.appendChild(row);
    });

    // Cấu hình lại DataTable
    $('#datatablesSimple').DataTable({
        lengthMenu: [[10, 15, 20, -1], [10, 15, 20, "Tất cả"]],
        pageLength: 10,
        destroy: true
    });
}

// Function to get badge color based on risk status
function getBadgeColor(risk) {
    switch (risk) {
        case 'Cao': return 'bg-danger';
        case 'Cảnh báo': return 'bg-warning text-dark';
        case 'Bình Thường': return 'bg-success';
        default: return 'bg-secondary';
    }
}




function unlockUser(userId) {
    if (!confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) return;

    fetch(`http://localhost:8080/api/auth/unlock/${userId}`, {
        method: 'PATCH'
    })
        .then(response => response.text())
        .then(message => {
            alert(message);

            const row = document.getElementById(`user-row-${userId}`);
            if (row) {
                // Cập nhật trạng thái tài khoản sau khi mở khóa
                row.querySelector(".status-cell").innerHTML = `<span class="badge bg-success">Đang hoạt động</span>`;
                row.querySelector(".action-cell").innerHTML = `<span class="text-muted">Không cần</span>`;
                row.querySelector(".risk-cell").innerHTML = `<span class="badge bg-success">Bình Thường</span>`;
            } else {
                fetchUserDataAndRenderTable();  // Fallback nếu không tìm thấy người dùng
            }
        })
        .catch(error => {
            console.error("Lỗi khi mở khóa tài khoản:", error);
            alert("Không thể mở khóa tài khoản.");
        });
}

function setupWarningListModal() {
    const btn = document.getElementById("disableAccountBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        // Gọi API để lấy danh sách tài khoản có cảnh báo
        fetch("http://localhost:8080/api/auth/warnings")
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById("warning-account-list");
                tableBody.innerHTML = "";  // Xóa bảng trước khi thêm mới

                data.forEach(user => {
                    const row = `
                        <tr>
                            <td>${user.userId ?? 'Không xác định'}</td>
                            <td>${user.username ?? 'Không xác định'}</td>
                            <td>${user.email ?? 'Không xác định'}</td>
                            <td>${user.phonenumber ?? 'Không xác định'}</td>
                            <td>${user.birthday ?? 'Không xác định'}</td>
                            <td>${user.gender ?? 'Không xác định'}</td>
                            <td>${user.orderCancelCount ?? 0}</td>
                            <td>${user.appointmentCancelCount ?? 0}</td>
                            <td>${user.warningMessage ?? ''}</td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML("beforeend", row);
                });

                // Mở modal hiển thị danh sách cảnh báo
                const modal = new bootstrap.Modal(document.getElementById("warningAccountsModal"));
                modal.show();
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách cảnh cáo:", error);
                alert("Không thể tải danh sách cảnh cáo.");
            });
    });
}
