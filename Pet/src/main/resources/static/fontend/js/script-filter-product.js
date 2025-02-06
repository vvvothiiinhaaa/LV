document.addEventListener("DOMContentLoaded", function() {
    fetchProducts();  // Gọi API khi trang tải xong

    document.getElementById('applyFilters').addEventListener('click', function() {
        fetchProducts();
    });
});

// Hàm gọi API lấy danh sách sản phẩm
function fetchProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    let apiUrl = `http://localhost:8080/api/products/filter?`;
    if (categoryFilter !== "all") {
        apiUrl += `category=${encodeURIComponent(categoryFilter)}&`;
    }
    if (priceFilter !== "all") {
        apiUrl += `price=${encodeURIComponent(priceFilter)}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Không thể tải dữ liệu sản phẩm.");
        });
}

//Hiển thị sản phẩm
function displayProducts(products) {
    const productListContainer = document.getElementById('productList');
    productListContainer.innerHTML = ''; // Xóa danh sách cũ

    if (products.length === 0) {
        productListContainer.innerHTML = '<p class="text-center text-muted">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = createProductItem(product);
        productListContainer.appendChild(productElement);
    });
}



// Hàm định dạng giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}
