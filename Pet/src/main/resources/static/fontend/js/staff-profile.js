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
            localStorage.setItem("employeeId", employee.id);

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
    loadEmployeeProfile();
    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để xem danh sách sản phẩm.");
        window.location.href = "/fontend/employee-login.html";
        return;
    }
});

// hiển thị thông tin

async function loadEmployeeProfile() {
    const empId = localStorage.getItem("employeeId");
    if (!empId) {
        alert("Không tìm thấy nhân viên đăng nhập.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch(`/employee/${empId}/detailt`);
        if (!response.ok) throw new Error("Lỗi khi lấy thông tin nhân viên");

        const data = await response.json();

        // Đổ dữ liệu vào HTML
        document.getElementById("emp-avatar").src = data.url || "img/default-avata.png";
        document.getElementById("emp-fullname").textContent = data.fullname;
        document.getElementById("emp-role").textContent = data.role;
        document.getElementById("emp-username").textContent = data.username;
        document.getElementById("emp-email").textContent = data.email;
        document.getElementById("emp-birthdate").textContent = data.birthdate;
        document.getElementById("emp-phone").textContent = data.phonenumber;

        const statusText = data.status ? "Đang hoạt động" : "Ngừng hoạt động";
        document.getElementById("emp-status").textContent = statusText;
        document.getElementById("emp-status").className = data.status ? "value status-active" : "value status-inactive";
    } catch (error) {
        console.error("Lỗi khi tải thông tin nhân viên:", error);
        alert("Không thể hiển thị thông tin nhân viên.");
    }
}
