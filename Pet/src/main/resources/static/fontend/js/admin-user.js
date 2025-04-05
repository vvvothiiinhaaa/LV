// Gọi API lấy danh sách người dùng
fetch('http://localhost:8080/api/auth/info')
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById("user-list");

        // Gọi tiếp API để lấy danh sách riskStatus
        fetch('http://localhost:8080/api/auth')
            .then(response => response.json())
            .then(risks => {
                // Tạo map để tra risk theo userId
                const riskMap = {};
                risks.forEach(r => {
                    riskMap[r.id] = r.riskStatus;
                });

                // Duyệt từng user và tạo hàng trong bảng
                users.forEach(user => {
                    const row = document.createElement("tr");

                    const username = user.username || 'Chưa xác định';
                    const email = user.email || 'Chưa xác định';
                    const phonenumber = user.phonenumber || 'Chưa xác định';
                    const birthdate = user.birthday || 'Chưa xác định';
                    const status = user.status ? 'Đang hoạt động' : 'Bị khóa';
                    const role = user.role || 'Chưa xác định';
                    const risk = riskMap[user.id] || 'Chưa tính';

                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${username}</td>
                        <td>${email}</td>
                        <td>${phonenumber}</td>
                        <td>${birthdate}</td>
                        <td>${status}</td>
                        <td>${role}</td>
                        <td>${risk}</td>
                    `;

                    userList.appendChild(row);
                });

                // Khởi tạo DataTable với tùy chọn hiển thị dòng
                $('#datatablesSimple').DataTable({
                    lengthMenu: [[10, 15,20, -1], [ 10,15, 20, "Tất cả"]],
                    pageLength: 10
                });
            })
            .catch(error => console.error(' Lỗi khi lấy riskStatus:', error));
    })
    .catch(error => console.error(' Lỗi khi lấy danh sách người dùng:', error));


    //// danh sách tài khoản bị cảnh cáo

    document.getElementById("disableAccountBtn").addEventListener("click", function () {
        fetch("http://localhost:8080/api/auth/warnings")
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById("warning-account-list");
                tableBody.innerHTML = ""; // clear old data
    
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
    
                // Show modal
                const warningModal = new bootstrap.Modal(document.getElementById("warningAccountsModal"));
                warningModal.show();
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách cảnh cáo:", error);
                alert("Không thể tải danh sách cảnh cáo.");
            });
    });
    
    