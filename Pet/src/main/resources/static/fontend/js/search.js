


document.addEventListener("DOMContentLoaded", function () {


    // Lấy từ khóa từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");
    const productList = document.getElementById("productsearchList");

    if (!productList) {
        console.error("Phần tử productsearchList không tồn tại trong DOM.");
        return;
    }

    if (!searchQuery) {
        productList.innerHTML = `<p class="text-center text-warning">Vui lòng nhập từ khóa tìm kiếm!</p>`;
        return;
    }

    console.log("Đang tìm kiếm sản phẩm với từ khóa:", searchQuery);

    // Gọi API tìm kiếm sản phẩm
    fetch(`/api/products/search-products?query=${encodeURIComponent(searchQuery)}`)
        .then(response => {
            console.log("Trạng thái phản hồi từ API:", response.status);
            if (!response.ok) {
                throw new Error(`Lỗi HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            console.log("Dữ liệu sản phẩm nhận được:", products);
            productList.innerHTML = ""; // Xóa nội dung cũ

            if (products.length > 0) {
                products.forEach(product => {
                    const productItem = createProductItem(product);
                    productList.appendChild(productItem);
                });
            } else {
                productList.innerHTML = `<p class="text-center text-warning">Không tìm thấy sản phẩm nào với từ khóa "${searchQuery}".</p>`;
            }
        })
        .catch(error => {
            console.error("Lỗi khi tải sản phẩm:", error);
            productList.innerHTML = `<p class="text-center text-danger">Lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại sau!</p>`;
        });
});


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
   
    <div class="card product-card h-150">
    <a href="product-detail.html?id=${product.id}" class="product-link">
        <img src="${imageUrl || 'default-image.png'}" class="card-img-top product-image" alt="${product.name}">
    </a>
    <div class="card-body">
        <h6 class="card-title product-title">${product.name}</h6>
        <p class="card-text product-price">${formatPrice(product.price)} VND</p>
        <div class="product-actions">
            <button class="buy-now" data-product-id="${product.id}">Thêm vào giỏ hàng</button>
        </div>
    </div>
</div> `;

    return productDiv;
}
