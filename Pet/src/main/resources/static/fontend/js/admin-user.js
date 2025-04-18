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
    tableBody.innerHTML = "";  // Clear the table before rendering

    users.forEach(user => {
        const row = document.createElement("tr");
        row.id = `user-row-${user.id}`;  // Set the id for each row

        const id = user.id ?? "Không xác định";
        const username = user.username ?? "Không xác định";
        const email = user.email ?? "Không xác định";
        const phone = user.phonenumber ?? "Không xác định";
        const birthday = user.birthday ?? "Không xác định";
        const status = user.status ? "Đang hoạt động" : "Bị khóa";
        const role = user.role ?? "Không xác định";
        
        // Find the riskStatus in the list based on userId
        const riskData = risks.find(risk => risk.userId === user.id);
        const risk = riskData ? riskData.riskStatus : "Bình Thường";

        const badgeColor = getBadgeColor(risk);
        const unlockBtn = !user.status
            ? `<button class="btn btn-sm btn-success" onclick="unlockUser(${user.id})">Mở khóa</button>`
            : `<span class="text-muted">mở khóa</span>`;

            const lockBtn = user.status
            ? `<button class="btn btn-sm btn-danger" onclick="lockUser(${user.id})">Khóa</button>`
            : `<span class="text-muted">Khóa</span>`;

        // Render the row content
        row.innerHTML = `
            <td>${id}</td>
            <td>${username}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${birthday}</td>
            <td class="status-cell"><span class="badge ${user.status ? 'bg-success' : 'bg-danger'}">${status}</span></td>
            <td>${role}</td>
            <td class="risk-cell"><span class="badge ${badgeColor}">${risk}</span></td>
            <td class="action-cell">
                ${unlockBtn}
                 ${lockBtn}
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Re-initialize DataTable
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
    // Confirm before unlocking the account
    if (!confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) return;

    // Make the PATCH request to unlock the user account
    fetch(`http://localhost:8080/api/auth/unlock/${userId}`, {
        method: 'PATCH'
    })
    .then(response => response.text())
    .then(message => {
        alert(message);

       
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
          
            row.querySelector(".status-cell").innerHTML = `<span class="badge bg-success">Đang hoạt động</span>`; 
            
          
            const unlockButton = row.querySelector(".unlock-btn");
            if (unlockButton) {
                unlockButton.disabled = true; 
                unlockButton.style.opacity = 0.5; 
            }

            // Replace "Mở khóa" button with "Khóa" button
            row.querySelector(".action-cell").innerHTML = `
                <button class="lock-btn btn-danger" style="margin-left: 10px;" onclick="lockUser(${userId})">Khóa</button>
            `;
        }

        location.reload();
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
//////
function lockUser(userId) {
    // Confirm before locking the account
    if (!confirm("Bạn có chắc chắn muốn khóa tài khoản này?")) return;

    // Prepare the data to send in the request body
    const data = {
        status: false // Set status to false to lock the user account
    };

    // Make the PUT request to update the user status
    fetch(`/api/auth/status/${userId}?status=${data.status}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(updatedUser => {
        console.log(updatedUser);

        alert("Tài khoản đã bị khóa.");

        // Update the UI: disable the "Khóa" button and show the unlock button
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
            // Update the status to "Bị khóa"
            row.querySelector(".status-cell").innerHTML = `<span class="badge bg-danger">Bị khóa</span>`;  // Update status to "Bị khóa"
            
            // Disable the "Khóa" button and visually change its state
            // const lockButton = row.querySelector(".lock-btn");
            // if (lockButton) {
            //     lockButton.disabled = true; // Disable the "Khóa" button after clicking
            //     lockButton.style.opacity = 0.5; // Visually indicate that the button is disabled
            //     lockButton.style.cursor = 'not-allowed'; // Change cursor to indicate the button is disabled
            // }

            // // Replace "Khóa" button with "Mở khóa" button
            // row.querySelector(".action-cell").innerHTML = `
            //     <button class="btn btn-sm btn-success" onclick="unlockUser(${userId})">Mở khóa</button>
            // `;
        }

        // Optionally, reload the page after the action
        location.reload(); // Use this if you want to refresh the entire table
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Có lỗi xảy ra khi cập nhật tài khoản.");
    });
}
