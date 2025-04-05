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
                    <div class="coupon-icon">
                        <img src="./img/price-tag.png" alt="Discount" style="width:80px;height:80px;">
                    </div>
                    <div class="coupon-details">
                        <h5>Mã Giảm Giá: ${coupon.code}</h5>
                        <p class="coupon-code">${coupon.discountPercentage}% Giảm Giá</p>
                        <p class="conditions">Áp dụng cho đơn hàng từ: ${formatCurrency(coupon.minOrderAmount)} VNĐ</p>
                        <p class="dates">Hiệu lực từ ${new Date(coupon.startDate).toLocaleString()} đến ${new Date(coupon.endDate).toLocaleString()}</p>
                        <button class="copy-btn" data-code="${coupon.code}">Sao chép mã</button>
                    </div>
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


/// hiệu ứng sao chép
// Xử lý sự kiện sao chép mã giảm giá
// copyButton.addEventListener("click", function () {
//     const couponCode = couponElement.querySelector(".copy-btn");
//     navigator.clipboard.writeText(couponCode)
//         .then(() => {
//             // Thay đổi nội dung nút khi đã sao chép
//             this.textContent = "Đã sao chép ";
//             this.style.backgroundColor = "#28a745"; // Chuyển màu xanh lá
//             this.style.cursor = "default"; // Ngăn bấm lại liên tục
            
//             // Khóa nút trong 3 giây rồi chuyển về trạng thái ban đầu
//             setTimeout(() => {
//                 this.textContent = "Sao chép mã";
//                 this.style.backgroundColor = "#007bff"; // Trả về màu ban đầu
//                 this.style.cursor = "pointer";
//             }, 3000);
//         })
//         .catch((error) => {
//             console.error("Lỗi khi sao chép mã giảm giá:", error);
//         });
// });
