document.addEventListener("DOMContentLoaded", function () {
    const productId = getProductIdFromURL(); // Hàm lấy productId từ URL
    const reviewsContainer = document.getElementById("user-reviews");

    // Gọi API để lấy danh sách đánh giá
    fetch(`/reviews/product/${productId}`)
        .then(response => response.json())
        .then(reviews => {
            reviewsContainer.innerHTML = ""; // Xóa nội dung cũ

            if (reviews.length === 0) {
                reviewsContainer.innerHTML = "<p>Chưa có đánh giá nào cho sản phẩm này.</p>";
                return;
            }

            reviews.forEach(review => {
                fetch(`/api/users/${review.user.id}`) // Gọi API để lấy thông tin người dùng
                    .then(response => response.json())
                    .then(user => {
                        const reviewElement = document.createElement("div");
                        reviewElement.classList.add("review");

                        reviewElement.innerHTML = `
                            <div class="review-header d-flex align-items-center">
                                <img src="${user.url || 'default-avatar.png'}" alt="Avatar" class="avatar">
                                <div>
                                    <strong>${user.username}</strong>
                                    <span class="review-date">${formatDate(review.reviewDate)}</span>
                                </div>
                            </div>
                            <div class="stars">
                                ${renderStars(review.rating)}
                            </div>
                            <p>${review.content}</p>
                        `;

                        reviewsContainer.appendChild(reviewElement);
                    });
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải đánh giá:", error);
            reviewsContainer.innerHTML = "<p>Không thể tải đánh giá.</p>";
        });

    // Hàm để render số sao
    function renderStars(rating) {
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += `<i class="fa fa-star"></i>`;
            } else {
                starsHTML += `<i class="fa fa-star-o"></i>`;
            }
        }
        return starsHTML;
    }

    // Hàm định dạng ngày
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    }

    // Hàm lấy productId từ URL
    function getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("productId") || 1; // Mặc định là 1 nếu không tìm thấy
    }
});
