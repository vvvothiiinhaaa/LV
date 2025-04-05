// ================= LỌC SẢN PHẨM THEO BỘ LỌC =================
document.getElementById("applyFilters").addEventListener("click", function () {
    const category = document.getElementById("categoryFilter").value;
    const price = document.getElementById("priceFilter").value;

    updateBreadcrumb(category);
    fetchFilteredProducts(category, price);
});

function updateBreadcrumb(category) {
    const categoryBreadcrumb = document.querySelector(".breadcrumb-item:last-child a");
    if (!categoryBreadcrumb) return;

    const map = {
        "thức ăn cho chó": "Thức ăn cho chó",
        "thức ăn cho mèo": "Thức ăn cho mèo",
        "Dụng cụ vệ sinh": "Dụng cụ vệ sinh",
        "Đồ chơi cho chó mèo": "Đồ chơi cho chó mèo",
        "all": "Tất cả sản phẩm"
    };
    categoryBreadcrumb.textContent = map[category] || "Tất cả sản phẩm";
}

function fetchFilteredProducts(category, price) {
    fetch(`/api/products/filter?category=${category}&price=${price}`)
        .then(res => res.json())
        .then(data => {
            showSection("productList");
            displayProducts(data, "productList");
        })
        .catch(err => console.error("Lỗi khi lọc sản phẩm:", err));
}

// ================= HIỂN THỊ SẢN PHẨM THEO LOẠI =================
document.addEventListener("DOMContentLoaded", function () {
    // Load mặc định
    loadProducts("http://localhost:8080/api/products", "productList");
    loadProducts("http://localhost:8080/api/products/new", "newProducts");

    // Gán sự kiện cho các nút toggle
    document.getElementById("btn-new").addEventListener("click", function () {
        showSection("newProducts");
    });

    document.getElementById("btn-best").addEventListener("click", function () {
        loadProducts("http://localhost:8080/api/products/best-sellers", "bestSellers");
        showSection("bestSellers");
    });

    document.getElementById("btn-all").addEventListener("click", function () {
        loadProducts("http://localhost:8080/api/products", "productList");
        showSection("productList");
    });
});

function showSection(visibleId) {
    const sections = ["newProducts", "bestSellers", "productList"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle("d-none", id !== visibleId);
        }
    });
}

// ================= TẠO SẢN PHẨM HTML =================
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    products.forEach(product => {
        const productDiv = createProductItem(product);
        container.appendChild(productDiv);
    });
}

function createProductItem(product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col");

    const imageUrl = product.url?.replace(/.*\/html\//, "/img/") || "default-image.png";
    const stockStatus = product.quantity === 0
        ? '<span style="color:blue; font-weight:bold;">SẢN PHẨM HẾT HÀNG</span>'
        : '';

    productDiv.innerHTML = `
        <div class="card product-card h-100">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img src="${imageUrl}" class="card-img-top product-image" alt="${product.name}">
            </a>
            <div class="card-body">
                <h6 class="card-title">${product.name}</h6>
                <p class="card-text">${formatPrice(product.price)} VND</p>
                <div class="product-actions">
                    ${stockStatus}
                    ${product.quantity === 0 ? "" : `<button class="buy-now btn btn-sm btn-outline-primary mt-1" data-product-id="${product.id}">Thêm vào giỏ hàng</button>`}
                </div>
            </div>
        </div>
    `;
    return productDiv;
}

function formatPrice(price) {
    return price.toLocaleString("vi-VN");
}

// ================= THÊM VÀO GIỎ HÀNG =================
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const userId = data.userId;
            if (!userId) return;

            document.body.addEventListener("click", function (e) {
                if (e.target.classList.contains("buy-now")) {
                    const productId = e.target.getAttribute("data-product-id");
                    if (productId) {
                        handleCartAction(userId, productId);
                    }
                }
            });
        })
        .catch(err => console.error("Lỗi xác thực người dùng:", err));
});

function handleCartAction(userId, productId, quantity = 1) {
    const params = new URLSearchParams({ userId, productId, quantity });

    fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
        .then(res => res.text())
        .then(text => {
            alert(text);
            updateCartCount(userId); // Nếu bạn có hàm này
        })
        .catch(err => {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            alert("Không thể thêm vào giỏ hàng");
        });
}
