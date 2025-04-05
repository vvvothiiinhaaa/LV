async function checkLoginStatus() {
    try {
        const response = await fetch('/employee/check-login'); // gọi từ backend
        if (response.ok) {
            const employee = await response.json(); // nhận dữ liệu JSON
            console.log("Đã đăng nhập:", employee.username);

            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("employeeId", employee.id);
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
async function displayCurrentLoggedInEmployee() {
    const empId = localStorage.getItem("employeeId");
    if (!empId) return;

    try {
        const res = await fetch(`/employee/${empId}/detailt`);
        if (!res.ok) throw new Error("Không tìm thấy nhân viên");

        const emp = await res.json();

        const tbody = document.getElementById("staff-active-body");
        tbody.innerHTML = `
            <tr>
                <td>1</td>
                <td>${emp.fullname}</td>
                <td>${emp.username}</td>
                <td>${emp.email}</td>
                <td>
                    <span class="badge bg-success">Đang hoạt động</span>
                </td>
            </tr>
        `;
    } catch (error) {
        console.error("Lỗi khi hiển thị nhân viên:", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
        displayCurrentLoggedInEmployee();
        // loadAnnouncements(); 
    } 
});
    // Gửi thông báo mới từ form
    document.getElementById("announcementForm").addEventListener("submit", async (e) => {
        e.preventDefault(); // Ngăn reload trang
        const content = document.getElementById("announcementText").value.trim();
        if (!content) return alert("Vui lòng nhập nội dung thông báo!");

        try {
            const res = await fetch("/admin/announcement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                alert("Đã gửi thông báo thành công!");
                document.getElementById("announcementText").value = ""; // Xoá nội dung form
                loadAnnouncements(); // Tải lại danh sách thông báo
                location.reload();
            } else {
                alert("Gửi thông báo thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi gửi thông báo:", err);
        }
    });

    // Tải danh sách thông báo và hiển thị lên giao diện
    async function loadAnnouncements() {
        try {
            const res = await fetch("/admin/announcements");
            const data = await res.json();

            const container = document.getElementById("announcementList");
            container.innerHTML = ""; // Xóa cũ

            if (data.length === 0) {
                container.innerHTML = `<div class="alert alert-secondary">Chưa có thông báo nào.</div>`;
                return;
            }

            // Hiển thị mỗi thông báo
            data.reverse().forEach((notice, index) => {
                const div = document.createElement("div");
                div.className = "alert alert-info d-flex justify-content-between align-items-center";

                div.innerHTML = `
                    <div>
                        <strong>Thông báo ${index + 1}:</strong> ${notice.content}
                        <div class="text-muted small">${new Date(notice.createdAt).toLocaleString()}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteAnnouncement(${notice.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                container.appendChild(div);
            });
        } catch (err) {
            console.error("Lỗi khi tải thông báo:", err);
        }
    }

    // Xoá thông báo
    async function deleteAnnouncement(id) {
        if (!confirm("Bạn chắc chắn muốn xoá thông báo này?")) return;

        try {
            const res = await fetch(`/admin/announcement/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Đã xoá thông báo!");
                loadAnnouncements();
            } else {
                alert("Xoá thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xoá thông báo:", err);
        }
    }

    // Gọi khi DOM load xong
    document.addEventListener("DOMContentLoaded", async () => {
        const isLoggedIn = await checkLoginStatus();
        if (isLoggedIn) {
            displayCurrentLoggedInEmployee();
            loadAnnouncements(); //  Gọi ở đây
        } else {
            // window.location.href = "/login.html";
        }
    });


