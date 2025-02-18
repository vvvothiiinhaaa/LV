// Hàm lấy userId từ API check-login
async function getUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin đăng nhập');
        }
        const data = await response.json();
        return data.userId;  // Giả sử API trả về userId trong response
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}

async function getUserImageUrl(userId) {
    const userId = await getUserId();
    try {
        const response = await fetch(`/api/auth/${userId}/image`);
        if (response.ok) {
            const imageUrl = await response.text();
            document.getElementById("#avata").src = imageUrl;  // Cập nhật URL ảnh vào thẻ <img>
        } else {
            console.log("Không tìm thấy ảnh người dùng.");
            document.getElementById("#avata").src = './img/default-avata.png';  // Ảnh mặc định
        }
    } catch (error) {
        console.error("Lỗi khi lấy URL ảnh:", error);
        document.getElementById("#avata").src = './img/default-avata.png';  // Ảnh mặc định nếu có lỗi
    }
}
