document.addEventListener("DOMContentLoaded", function () {
    const viewAllCouponsButton = document.getElementById("view-all-coupons");
    const couponsModal = new bootstrap.Modal(document.getElementById("couponsModal"));
    
    // Khi nhấn vào nút "Tất cả mã giảm giá", mở modal và hiển thị mã giảm giá còn hiệu lực
    viewAllCouponsButton.addEventListener("click", function () {
        couponsModal.show();
        
        // Gọi API để lấy danh sách mã giảm giá còn hiệu lực
        fetch("/api/discounts/all")  // URL API lấy tất cả mã giảm giá còn hiệu lực
            .then(response => response.json())  // Chuyển đổi phản hồi thành JSON
            .then(data => {
                const couponsList = document.getElementById("coupons-list");
                couponsList.innerHTML = "";  // Xóa nội dung cũ

                // Duyệt qua danh sách mã giảm giá và thêm vào modal
                data.forEach(coupon => {
                    const couponElement = document.createElement("div");
                    couponElement.classList.add("coupon-item");

                    // Cấu trúc của mỗi mã giảm giá
                    couponElement.innerHTML = `
                        <h5>Mã Giảm Giá: ${coupon.code}</h5>
                        <p class="coupon-code">${coupon.discountPercentage}% Giảm Giá</p>
                        <p class="conditions">Áp dụng cho đơn hàng từ: ${formatCurrency(coupon.minOrderAmount)} VNĐ</p>
                        <p class="dates">Hiệu lực từ ${new Date(coupon.startDate).toLocaleString()} đến ${new Date(coupon.endDate).toLocaleString()}</p>
                        <button class="copy-btn" data-code="${coupon.code}">Sao chép mã</button>
                    `;

                    couponsList.appendChild(couponElement);

                    // Xử lý sự kiện sao chép mã giảm giá
                    const copyButton = couponElement.querySelector(".copy-btn");
                    copyButton.addEventListener("click", function () {
                        const couponCode = this.getAttribute("data-code");
                        navigator.clipboard.writeText(couponCode)
                            .then(() => {
                                alert("Mã giảm giá đã được sao chép!");
                            })
                            .catch((error) => {
                                console.error("Lỗi khi sao chép mã giảm giá:", error);
                            });
                    });
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải mã giảm giá:", error);
                document.getElementById("coupons-list").innerHTML = "<p>Không thể tải mã giảm giá.</p>";
            });
    });
});

// Hàm định dạng số tiền
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        // style: 'currency',
        // currency: 'VND',
    }).format(amount);
}
