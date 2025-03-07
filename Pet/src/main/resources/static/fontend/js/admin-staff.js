function openModal() {
    document.getElementById("addModal").style.display = "flex";
    }
    function closeModal() {
        document.getElementById("addModal").style.display = "none";
    }

                async function addEmployee() {
            const fullname = document.getElementById('fullname').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!fullname || !username || !password) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
            }

            const employeeData = {
            fullname: fullname,
            username: username,
            password: password
            };

            try {
            const response = await fetch('/admin/create-employee', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
            });

            // Kiểm tra xem phản hồi có hợp lệ (status 2xx) không
            if (!response.ok) {
            const errorResponse = await response.text(); // Lấy văn bản nếu phản hồi không phải JSON
            console.error('Lỗi:', errorResponse);
            alert(`Lỗi: ${errorResponse}`);
            return;
            }

            const result = await response.json(); // Phân tích cú pháp JSON khi phản hồi hợp lệ
            alert('Tạo tài khoản thành công!');
            closeModal(); // Đóng modal sau khi tạo tài khoản thành công
            location.reload(); 
            } catch (error) {
            console.error('Lỗi khi tạo tài khoản:', error);
            alert('Không thể kết nối với máy chủ.');
            }
            }
            // hiển thị ds tài khoản vào bảng
            // Hàm để lấy danh sách nhân viên từ API và hiển thị vào bảng
            async function fetchAndDisplayEmployees() {
            try {
            // Gửi yêu cầu GET đến API để lấy danh sách nhân viên
            const response = await fetch('http://localhost:8080/employees');

            if (response.ok) {
            // Lấy dữ liệu JSON từ phản hồi
            const employees = await response.json();

            // Lấy phần tử tbody trong bảng
            const staffList = document.getElementById('staff-list');
            staffList.innerHTML = '';  // Xóa các hàng hiện tại trong bảng

            // Duyệt qua tất cả nhân viên và tạo các dòng trong bảng
            employees.forEach(employee => {
            const row = document.createElement('tr');

            // Tạo các ô trong bảng cho từng thuộc tính của nhân viên
            row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.username}</td>
            <td>${employee.fullname}</td>
            <td>${employee.status ? 'Active' : 'Inactive'}</td>
            <td>${employee.role}</td>
            <td>
                <button class="btn btn-info" onclick="editEmployee(${employee.id})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">Xóa</button>
            </td>
            `;

            // Thêm dòng vào bảng
            staffList.appendChild(row);
            });
            } else {
            console.error('Không thể tải danh sách nhân viên.');
            alert('Có lỗi khi lấy danh sách nhân viên.');
            }
            } catch (error) {
            console.error('Lỗi khi kết nối với máy chủ:', error);
            alert('Không thể kết nối với máy chủ.');
            }
            }

            // Gọi hàm để hiển thị danh sách nhân viên khi trang được tải
            window.onload = fetchAndDisplayEmployees;

