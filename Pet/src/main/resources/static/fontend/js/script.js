/**
 * Tạo phần tử HTML hiển thị sản phẩm theo giao diện yêu cầu.
 * @param {Object} product - Đối tượng sản phẩm.
 * @returns {HTMLElement} - Thẻ HTML chứa sản phẩm.
 */



// Lắng nghe sự kiện khi người dùng chọn bộ lọc và bấm nút "Áp dụng"
document.getElementById("applyFilters").addEventListener("click", function() {
    // Lấy giá trị bộ lọc category và price
    const categoryFilter = document.getElementById("categoryFilter").value;
    const priceFilter = document.getElementById("priceFilter").value;

    // Cập nhật breadcrumb với category đã chọn
    updateBreadcrumb(categoryFilter);

    // Gọi API hoặc xử lý logic lọc sản phẩm
    fetchFilteredProducts(categoryFilter, priceFilter);
});

document.getElementById("categoryBreadcrumb").addEventListener("click", function(event) {
    event.preventDefault(); // Ngăn không cho chuyển trang khi click vào thẻ <a>
    const categoryFilter = document.getElementById("categoryFilter").value;
    // Cập nhật breadcrumb để hiển thị category đang chọn
    updateBreadcrumb(categoryFilter);

    // Lọc sản phẩm theo category đã chọn
    fetchFilteredProducts(categoryFilter);
});
// Hàm gọi API để lọc sản phẩm theo category
function fetchFilteredProducts(category) {
    // Giả sử bạn có API lọc sản phẩm theo category
    fetch(`/api/products/filter?category=${category}&price=all`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data); // Hiển thị sản phẩm đã lọc
        })
        .catch(error => {
            console.error("Error fetching filtered products:", error);
        });
}
// Hàm cập nhật breadcrumb
function updateBreadcrumb(category) {
    const categoryBreadcrumb = document.querySelector(".breadcrumb-item:last-child a");
    
    // Cập nhật nội dung của breadcrumb
    if (category === "thức ăn cho chó") {
        categoryBreadcrumb.textContent = "thức ăn cho chó";
    } else if (category === "thức ăn cho mèo") {
        categoryBreadcrumb.textContent = "thức ăn cho mèo";
    } else if (category === "Dụng cụ vệ sinh") {
        categoryBreadcrumb.textContent = "Dụng cụ vệ sinh";
    }   else if (category === "Đồ chơi cho chó mèo") {
        categoryBreadcrumb.textContent = "Đồ chơi cho chó mèo";
    } 
    else {
        categoryBreadcrumb.textContent = "Tất cả sản phẩm";
    }
}
// Hàm gọi API để lọc sản phẩm theo category
function fetchFilteredProducts(category) {
    // Giả sử bạn có một API để lọc sản phẩm theo category
    fetch(`/api/products/filter?category=${category}&price=all`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data); // Hiển thị sản phẩm sau khi lọc
        })
        .catch(error => {
            console.error("Error fetching filtered products:", error);
        });
}

// Hàm gọi API để lấy sản phẩm đã lọc
function fetchFilteredProducts(category, price) {
    // Giả sử API trả về một mảng các sản phẩm đã lọc
    fetch(`/api/products/filter?category=${category}&price=${price}`)
        .then(response => response.json())
        
        .then(data => {
            console.log("Category:", category);
            console.log("Price:", price);

            displayProducts(data); // Hiển thị sản phẩm đã lọc
        })
        .catch(error => {
            console.error("Error fetching filtered products:", error);
        });
}

// Hàm hiển thị danh sách sản phẩm
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Xóa tất cả sản phẩm hiện tại

    products.forEach(product => {
        const productDiv = createProductItem(product); // Sử dụng hàm createProductItem đã có
        productList.appendChild(productDiv); // Thêm sản phẩm vào danh sách
    });
}

// Hàm tạo một mục sản phẩm
// function createProductItem(product) {
    // function createProductItem(product) {
    //     const productDiv = document.createElement("div");
    //     productDiv.classList.add("col");
    
    //     // Kiểm tra trạng thái còn hàng
    //     const stockStatus = product.quantity === 0 
    //         ? '<span style="color:blue; font-weight:bold;">(HẾT HÀNG)</span>' 
    //         : "";
    
    //     // Chỉnh sửa URL của ảnh
    //     const imageUrl = product.url ? product.url.replace(/.*\/html\//, "/img/") : 'default-image.png';
    
    //     // Tạo HTML cho sản phẩm
    //     productDiv.innerHTML = `
    //         <div class="card product-card h-100">
    //             <a href="product-detail.html?id=${product.id}" class="product-link">
    //                 <img src="${imageUrl}" class="card-img-top product-image" alt="${product.name}">
    //             </a>
    //             <div class="card-body">
    //                 <h6 class="card-title product-title">${product.name}</h6>
    //                 <p class="card-text product-price">${formatPrice(product.price)} VND</p>
    //                 <div class="product-action">
    //                     <button class="buy-now">Mua ngay</button>
    //                     <i class="fa-solid fa-cart-shopping add-to-cart" id="add-to-cart-btn"></i>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    
       

    //     return productDiv;
    // }
    

// Hàm định dạng giá sản phẩm
function formatPrice(price) {
    return price.toLocaleString('vi-VN');
}



//////////////////////////////////////////////////////////////////////////////////////// lọc sản phẩmphẩm

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

//////////////// thêm vào giỏ hàng ( ngoài trang product)



// ========================== THÊM SẢN PHẨM VÀO GIỎ HÀNG ==========================
document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const userId = data.userId; // Lấy userId từ API

            if (!userId) {
                console.error('Không tìm thấy userId từ API');
                return;
            }

            // Lắng nghe sự kiện click trên toàn bộ document
            document.body.addEventListener("click", function (event) {
                const target = event.target;

                if (target.classList.contains("buy-now")) {
                    const productId = target.getAttribute("data-product-id"); // Lấy productId từ nút bấm

                    if (!productId) {
                        console.error(" Không tìm thấy productId trên nút bấm!", target);
                        return;
                    }

                    const isBuyNow = target.classList.contains("buy-now");
                    handleCartAction(userId, productId, 1, isBuyNow);
                }
            });
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        });
});
function handleCartAction(userId, productId, quantity = 1, buyNow = false) {
    if (!productId) {
        console.error("Không tìm thấy productId!");
        return;
    }

    console.log(`Thêm sản phẩm vào giỏ hàng: userId=${userId}, productId=${productId}, quantity=${quantity}, buyNow=${buyNow}`);

    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('productId', productId);
    params.append('quantity', quantity);

    fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    })
    .then(response => {
        if (response.ok) {
            updateCartCount(userId);
            return response.text();
        } else {
            throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
        }
    })
    .then(responseText => {
        console.log(responseText);
        alert(responseText);

        // if (buyNow) {
        //     window.location.href = "cartt.html"; // Chuyển hướng đến trang giỏ hàng
        // }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
    });
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

// //////////// go to top
document.addEventListener("DOMContentLoaded", function () {
    const goToTopBtn = document.getElementById("goToTopBtn");

    if (!goToTopBtn) {
        console.error(" Không tìm thấy nút Go to Top!");
        return;
    }

    // Cuộn lên đầu trang khi bấm vào nút
    goToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});



/// search
