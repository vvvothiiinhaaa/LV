
//////////////////////////////////////////////////
// Hàm mở modal Thêm Nhân Viên
function openAddModal() {
    document.getElementById("addModal").style.display = "flex"; // Mở modal Thêm
}

// Hàm đóng modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";  // Ẩn modal
}

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
                row.innerHTML = `
                    <td><input type="checkbox" class="employeeCheckbox" value="${employee.id}" onclick="toggleSelectAll()"></td>
                    <td>${employee.id}</td>
                    <td>${employee.username}</td>
                    <td>${employee.fullname}</td>
                    <td>${employee.status ? 'Đang Hoạt Động' : 'Đã Khóa'}</td>
                    <td>${employee.role}</td>
                    <td>
                        <button class="btn btn-info" onclick="editEmployee(${employee.id})">Sửa</button>
                        <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">Xóa</button>
                    </td>
                `;
                staffList.appendChild(row);
            });

            // 🛠 Kiểm tra nếu DataTable đã khởi tạo thì hủy trước
            if ($.fn.DataTable.isDataTable('#datatablesSimple')) {
                $('#datatablesSimple').DataTable().destroy();
            }

            //  Khởi tạo lại DataTables
            $('#datatablesSimple').DataTable({
                "stripeClasses": [],
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "lengthMenu": [3, 10, 30, 100],
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

        } else {
            alert('Có lỗi khi lấy danh sách nhân viên.');
        }
    } catch (error) {
        alert('Không thể kết nối với máy chủ.');
        console.error("Lỗi:", error);
    }
}

// Gọi hàm khi trang tải xong
document.addEventListener("DOMContentLoaded", fetchAndDisplayEmployees);


// Gọi hàm để hiển thị danh sách nhân viên khi trang được tải
window.onload = fetchAndDisplayEmployees;

// Hàm thêm nhân viên mới
async function addEmployee() {
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    const phonenumber = document.getElementById('phonenumber').value;
    const password = document.getElementById('password').value;
    const file = document.getElementById('file').files[0];

    if (!fullname || !username || !password || !email) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("birthdate", birthdate);
    formData.append("phonenumber", phonenumber);
    formData.append("password", password);
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await fetch('/admin/create-employee', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('Lỗi:', errorResponse);
            alert(`Lỗi: ${errorResponse}`);
            return;
        }

        alert('Tạo tài khoản thành công!');
        closeModal1() ;
        location.reload();
    } catch (error) {
        alert('Không thể kết nối với máy chủ.');
    }
}

    function closeModal1() {
        document.getElementById("addModal").style.display = "none";
    
        let backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();  // Xóa hẳn khỏi HTML
        }
    }

    function closeModal2() {
        document.getElementById("editModal").style.display = "none";
    
        let backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();  // Xóa hẳn khỏi HTML
        }
    }
      function closeModal3() {
        document.getElementById("disableAccountModal").style.display = "none";
    
        let backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
            backdrop.remove();  // Xóa hẳn khỏi HTML
        }
    }
    
    

// Hàm lấy chi tiết thông tin nhân viên từ server
function editEmployee(id) {
    fetch(`/employee/${id}/detailt`)
        .then(response => response.json())
        .then(employee => {
            document.getElementById('editEmployeeId').value = employee.id;
            document.getElementById('editFullname').value = employee.fullname;
            document.getElementById('editUsername').value = employee.username;
            document.getElementById('editEmail').value = employee.email;
            document.getElementById('editBirthdate').value = employee.birthdate;
            document.getElementById('editPhonenumber').value = employee.phonenumber;
            document.getElementById('editPassword').value = employee.password;
            document.getElementById('editRole').value = 'STAFF';  // Role mặc định là STAFF
            document.getElementById('editStatus').checked = employee.status;

            // Hiển thị URL ảnh hiện tại trong input
            document.getElementById('editUrl').value = employee.url;  // Hiển thị ảnh hiện tại

            // Mở modal sửa thông tin nhân viên
            openModal('editModal');
        })
        .catch(error => {
            alert('Có lỗi xảy ra khi lấy thông tin nhân viên.');
        });
}

// Hàm cập nhật thông tin nhân viên (gửi dưới dạng FormData)
async function updateEmployee() {
    const id = document.getElementById('editEmployeeId').value;
    const fullname = document.getElementById('editFullname').value.trim();
    const username = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const birthdate = document.getElementById('editBirthdate').value;
    const phonenumber = document.getElementById('editPhonenumber').value.trim();
    const password = document.getElementById('editPassword').value.trim();
    const status = document.getElementById('editStatus').checked;
    const url = document.getElementById('editUrl').value.trim();
    const file = document.getElementById('editFile').files[0]; // Lấy ảnh mới (nếu có)

    // Kiểm tra các trường bắt buộc có được điền hay không
    if (!fullname || !username || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    // Tạo FormData để gửi file ảnh cùng với các dữ liệu khác
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("birthdate", birthdate);
    formData.append("phonenumber", phonenumber);
    formData.append("password", password);
    formData.append("role", 'STAFF');  // Role mặc định là STAFF
    formData.append("status", status);
    formData.append("url", file ? file.name : url); // Nếu có file, gửi tên file, nếu không gửi url hiện tại

    // Thêm file nếu có
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await fetch(`/employee/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            console.error('Lỗi:', errorResponse);
            alert(`Lỗi khi cập nhật thông tin: ${errorResponse}`);
            return;
        }

        alert('Cập nhật thông tin thành công!');
        closeModal('editModal');  // Đóng modal Sửa
        fetchAndDisplayEmployees();  // Làm mới danh sách nhân viên
        location.reload();
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin:', error);
        alert('Không thể kết nối với máy chủ.');
    }
}


// // Hàm cập nhật thông tin nhân viên
// async function updateEmployee() {
//     const id = document.getElementById('editEmployeeId').value;
//     const fullname = document.getElementById('editFullname').value.trim();
//     const username = document.getElementById('editUsername').value.trim();
//     const email = document.getElementById('editEmail').value.trim();
//     const birthdate = document.getElementById('editBirthdate').value;
//     const phonenumber = document.getElementById('editPhonenumber').value.trim();
//     const password = document.getElementById('editPassword').value.trim();
//     const status = document.getElementById('editStatus').checked;
//     const url = document.getElementById('editUrl').value.trim();

//     // Kiểm tra các trường bắt buộc có được điền hay không
//     if (!fullname || !username || !email || !password) {
//         alert("Vui lòng điền đầy đủ thông tin.");
//         return;
//     }

//     const params = new URLSearchParams();
//     params.append("fullname", fullname);
//     params.append("username", username);
//     params.append("email", email);
//     params.append("birthdate", birthdate);
//     params.append("phonenumber", phonenumber);
//     params.append("password", password);
//     params.append("role", "STAFF");
//     params.append("status", status);
//     params.append("url", url);

//     try {
//         // Gửi yêu cầu PUT với dữ liệu dạng `x-www-form-urlencoded`
//         const response = await fetch(`/employee/${id}`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/x-www-form-urlencoded' // Định dạng phù hợp với `@RequestParam`
//             },
//             body: params.toString() // Chuyển dữ liệu thành chuỗi URL encoded
//         });

//         // Kiểm tra nếu phản hồi không hợp lệ
//         if (!response.ok) {
//             const errorResponse = await response.text();
//             console.error('Lỗi:', errorResponse);
//             alert(`Lỗi khi cập nhật thông tin: ${errorResponse}`);
//             return;
//         }

//         // Nếu thành công, thông báo và làm mới danh sách nhân viên
//         alert('Cập nhật thông tin thành công!');
//         modal.hide();   // Đóng modal Sửa
//         fetchAndDisplayEmployees();  // Làm mới danh sách nhân viên

//     } catch (error) {
//         console.error('Lỗi khi cập nhật thông tin:', error);
//         alert('Không thể kết nối với máy chủ.');
//     }
// }



// Mảng lưu các ID của nhân viên đã chọn
let selectedEmployee = [];

// Hàm chọn tất cả checkbox
function selectAllCheckboxes() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.employeeCheckbox');

    selectedEmployee = selectAllCheckbox.checked ? Array.from(checkboxes).map(checkbox => checkbox.value) : [];

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Hàm khi một checkbox thay đổi trạng thái
function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.employeeCheckbox');
    const selectAllCheckbox = document.getElementById('selectAll');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            if (!selectedEmployee.includes(checkbox.value)) {
                selectedEmployee.push(checkbox.value);
            }
        } else {
            const index = selectedEmployee.indexOf(checkbox.value);
            if (index !== -1) {
                selectedEmployee.splice(index, 1);
            }
        }
    });

    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    selectAllCheckbox.checked = allChecked;
}

// Hàm khi chọn một checkbox riêng lẻ
function handleIndividualCheckboxChange() {
    const checkboxes = document.querySelectorAll('.employeeCheckbox');
    selectedEmployee = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedEmployee.push(checkbox.value);
        }
    });
}

// Hàm để mở modal xác nhận vô hiệu hóa tài khoản
function disableAccount() {
    if (selectedEmployee.length === 0) {
        alert("Vui lòng chọn ít nhất một tài khoản để vô hiệu hóa.");
        return;
    }

    // Mở modal xác nhận
    const modal = new bootstrap.Modal(document.getElementById('disableAccountModal'));
    modal.show();
}
// Hàm xác nhận cập nhật trạng thái tài khoản
async function confirmDisableAccount() {
    const status = document.getElementById('statusSelect').value === 'true';  // true: kích hoạt, false: vô hiệu hóa

    for (let i = 0; i < selectedEmployee.length; i++) {
        const employeeId = selectedEmployee[i];

        try {
            // Lấy URL của nhân viên nếu có, nếu không thì gán giá trị mặc định

            const response = await fetch(`/employee/${employeeId}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorResponse = await response.text();
                console.error('Lỗi:', errorResponse);
                alert(`Lỗi: ${errorResponse}`);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            alert('Không thể kết nối với máy chủ.');
        }
    }

    alert('Cập nhật trạng thái tài khoản thành công!');
    fetchAndDisplayEmployees(); // Làm mới danh sách nhân viên
    location.reload();
}


// Hàm mở modal
function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement, {
            backdrop: 'true', // Cho phép đóng khi nhấn bên ngoài modal
            keyboard: true  // Cho phép đóng bằng phím ESC
        });
        modal.show();
    } else {
        console.error(`Modal với ID ${modalId} không tồn tại.`);
    }
}

// Hàm đóng modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    modal.hide();  // Đảm bảo modal bị đóng
}

function disableAccountclose() {
    closeModal('disableAccountModal');
}


// ///// xóa tài khoản nhân viên
function deleteEmployee(employeeId) {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
        fetch(`/employee/${employeeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.status === 204) {
                alert("Xóa tài khoản thành công!");
                location.reload(); // Reload trang để cập nhật danh sách
            } else if (response.status === 404) {
                alert("Không tìm thấy tài khoản!");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối đến server!");
        });
    }
}