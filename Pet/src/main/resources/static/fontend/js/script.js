/**
 * Tạo phần tử HTML hiển thị sản phẩm theo giao diện yêu cầu.
 * @param {Object} product - Đối tượng sản phẩm.
 * @returns {HTMLElement} - Thẻ HTML chứa sản phẩm.
 */
function createProductItem(product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col");

    // Kiểm tra trạng thái còn hàng
    const stockStatus = product.quantity === 0 
        ? '<span style="color:blue; font-weight:bold;">(HẾT HÀNG)</span>' 
        : "";
    const imageUrl = product.url.replace(/.*\/html\//, "/img/");

    // Nội dung HTML của sản phẩm
    productDiv.innerHTML = `
   
    <div class="card product-card h-100">
    <a href="product-detail.html?id=${product.id}" class="product-link">
        <img src="${imageUrl || 'default-image.png'}" class="card-img-top product-image" alt="${product.name}">
    </a>
    <div class="card-body">
        <h6 class="card-title product-title">${product.name}</h6>
        <p class="card-text product-price">${formatPrice(product.price)} VND</p>
        <div class="product-actions">
            <button class="btn btn-success buy-now">Mua ngay</button>
             <i class="fa-solid fa-cart-shopping add-to-cart" id="add-to-cart-btn"></i>
        </div>
    </div>
</div>





    `;

    return productDiv;
}

/**
 * Hàm tải và hiển thị danh sách sản phẩm từ API.
 * @param {string} apiUrl - Đường dẫn API.
 * @param {string} containerId - ID của thẻ chứa sản phẩm.
 */
function loadProducts(apiUrl, containerId) {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const productContainer = document.getElementById(containerId);
            productContainer.innerHTML = ""; // Xóa nội dung cũ

            data.forEach((product) => {
                const productDiv = createProductItem(product);
                productContainer.appendChild(productDiv);
            });
        })
        .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu từ API:", error);
        });
}

/**
 * Định dạng giá tiền với dấu phân cách hàng nghìn.
 * @param {number} price - Giá tiền.
 * @returns {string} - Chuỗi giá đã được định dạng.
 */
function formatPrice(price) {
    return price.toLocaleString("vi-VN");
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    loadProducts("http://localhost:8080/api/products", "productList");
});


