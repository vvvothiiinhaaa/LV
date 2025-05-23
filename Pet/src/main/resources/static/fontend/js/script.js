

// Lắng nghe sự kiện khi người dùng chọn bộ lọc và bấm nút "Áp dụng"
document.getElementById("applyFilters").addEventListener("click", function() {
    // Lấy giá trị bộ lọc category và price
    const categoryFilter = document.getElementById("categoryFilter").value;
    const priceFilter = document.getElementById("priceFilter").value;

    // Cập nhật breadcrumb với category đã chọn
    // updateBreadcrumb(categoryFilter);

    // Gọi API hoặc xử lý logic lọc sản phẩm
    fetchFilteredProducts(categoryFilter, priceFilter);
});
///////////////////////////////
// document.getElementById("categoryBreadcrumb").addEventListener("click", function(event) {
//     event.preventDefault(); // Ngăn không cho chuyển trang khi click vào thẻ <a>
//     const categoryFilter = document.getElementById("categoryFilter").value;
//     // Cập nhật breadcrumb để hiển thị category đang chọn
//     updateBreadcrumb(categoryFilter);

//     // Lọc sản phẩm theo category đã chọn
//     fetchFilteredProducts(categoryFilter);
// });
///////////////////////
// Hàm gọi API để lọc sản phẩm theo category
// function fetchFilteredProducts(category) {
//     // Giả sử bạn có API lọc sản phẩm theo category
//     fetch(`/api/products/filter?category=${category}&price=all`)
//         .then(response => response.json())
//         .then(data => {
//             displayProducts(data); // Hiển thị sản phẩm đã lọc
//         })
//         .catch(error => {
//             console.error("Error fetching filtered products:", error);
//         });
// }
// Hàm cập nhật breadcrumb
// function updateBreadcrumb(category) {
//     const categoryBreadcrumb = document.querySelector(".breadcrumb-item:last-child a");
    
//     // Cập nhật nội dung của breadcrumb
//     if (category === "thức ăn cho chó") {
//         categoryBreadcrumb.textContent = "thức ăn cho chó";
//     } else if (category === "thức ăn cho mèo") {
//         categoryBreadcrumb.textContent = "thức ăn cho mèo";
//     } else if (category === "Dụng cụ vệ sinh") {
//         categoryBreadcrumb.textContent = "Dụng cụ vệ sinh";
//     }   else if (category === "Đồ chơi cho chó mèo") {
//         categoryBreadcrumb.textContent = "Đồ chơi cho chó mèo";
//     } 
//     else {
//         categoryBreadcrumb.textContent = "Tất cả sản phẩm";
//     }
// }
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
        ? '<span style="color:blue; font-weight:bold;">HẾT HÀNG</span>' 
        : "";
    
    const imageUrl = product.url.replace(/.*\/html\//, "/img/");

    productDiv.className = "col-2 d-flex"; 
    productDiv.style.flex = "0 0 20%";
    productDiv.style.maxWidth = "20%";
    productDiv.innerHTML = `
        <div class="card product-card w-100 h-100 d-flex flex-column">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <img src="${imageUrl || 'default-image.png'}" class="card-img-top product-image" alt="${product.name}" style="height: 150px; object-fit: contain;">
            </a>
            <div class="card-body d-flex flex-column justify-content-between">
                <h6 class="card-title product-title">${product.name}</h6>
                <p class="card-text product-price">${formatPrice(product.price)} VND</p>
                <div class="product-actions mt-auto">
                    ${stockStatus}
                    ${product.quantity === 0 ? '' : '<button class="buy-now" data-product-id="' + product.id + '">Thêm vào giỏ hàng</button>'}
                </div>
            </div>
        </div>
    `;
    
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

function updateCartCount(userId) {
    fetch(`http://localhost:8080/api/cart/count/${userId}`, { credentials: 'include' })
        .then(response => response.json())
        .then(productCount => {
            // Hiển thị số lượng sản phẩm trong giỏ hàng lên giao diện
            const cartCountElement = document.getElementById("cartCount");
            if (cartCountElement) {
                cartCountElement.textContent = productCount; // Cập nhật số lượng vào phần tử có id="cartCount"
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
        });
    }


/**
 * Hàm tải và hiển thị danh sách sản phẩm từ API.

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
// document.addEventListener("DOMContentLoaded", function () {
//     loadProducts("http://localhost:8080/api/products", "productList");
//     loadProducts("http://localhost:8080/api/products/new", "newProducts");
// });
document.addEventListener("DOMContentLoaded", function () {
    // Load sản phẩm
    loadAllProducts("http://localhost:8080/api/products");
    loadProducts("http://localhost:8080/api/products/new", "newProducts");

    // Hiển thị mặc định "Tất cả sản phẩm"
    document.getElementById("productList").style.display = "flex";
    document.querySelectorAll(".filter-btn").forEach(btn => {
        if (btn.getAttribute("data-target") === "productList") {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Gán sự kiện cho các nút lọc
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");

            if (target === "bestSellers") {
                loadProducts("http://localhost:8080/api/products/best-sellers", target);
            } else if (target === "productList") {
                loadProducts("http://localhost:8080/api/products", target);
            }

            ["newProducts", "bestSellers", "productList"].forEach(id => {
                const section = document.getElementById(id);
                if (section) section.style.display = "none";
            });

            const selectedSection = document.getElementById(target);
            if (selectedSection) selectedSection.style.display = "flex";

            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
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



/// 

let allProducts = []; // Dữ liệu sản phẩm tất cả
let currentPage = 1;
const productsPerPage = 10;

// Hàm hiển thị sản phẩm theo trang
function displayPaginatedProducts(page = 1, products = allProducts) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Xóa danh sách sản phẩm hiện tại

    // Tính toán phạm vi sản phẩm cần hiển thị
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);

    // Hiển thị sản phẩm trên trang
    productsToShow.forEach(product => {
        const productDiv = createProductItem(product);
        productList.appendChild(productDiv);
    });

    // Tạo điều khiển phân trang
    createPaginationControls(products.length, page);
}

// Hàm tạo điều khiển phân trang
function createPaginationControls(totalItems, currentPage) {
    const pagination = document.getElementById("paginationContainer");
    pagination.innerHTML = ""; // Xóa các điều khiển phân trang cũ

    const totalPages = Math.ceil(totalItems / productsPerPage);

    // Kiểm tra nếu tổng số sản phẩm ít hơn hoặc bằng số sản phẩm mỗi trang
    if (totalItems <= productsPerPage) {
        pagination.style.display = "none"; // Ẩn phân trang nếu không có đủ sản phẩm để phân trang
        return;
    } else {
        pagination.style.display = "flex"; // Hiển thị phân trang nếu có đủ nhiều sản phẩm
    }

    const createButton = (label, page) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "btn btn-sm btn-outline-dark mx-1";
        if (page === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            displayPaginatedProducts(page);
        });
        return btn;
    };

    // Trang trước
    if (currentPage > 1) {
        pagination.appendChild(createButton("«", currentPage - 1));
    }

    // Số trang
    for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(createButton(i, i));
    }

    // Trang sau
    if (currentPage < totalPages) {
        pagination.appendChild(createButton("»", currentPage + 1));
    }
}



// Hàm tải tất cả sản phẩm từ API
function loadAllProducts(apiUrl) {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            displayPaginatedProducts(1); // Bắt đầu từ trang 1
        })
        .catch(err => console.error("Lỗi khi tải sản phẩm:", err));
}

// Hàm lọc sản phẩm theo category và price
function fetchFilteredProducts(category, price) {
    fetch(`/api/products/filter?category=${category}&price=${price}`)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayPaginatedProducts(1, data); // Hiển thị sản phẩm lọc
        })
        .catch(error => {
            console.error("Error fetching filtered products:", error);
        });
}

// Lắng nghe sự kiện khi người dùng chọn bộ lọc và bấm nút "Áp dụng"
document.getElementById("applyFilters").addEventListener("click", function() {
    // Lấy giá trị bộ lọc category và price
    const categoryFilter = document.getElementById("categoryFilter").value;
    const priceFilter = document.getElementById("priceFilter").value;

    // Gọi hàm lọc sản phẩm
    fetchFilteredProducts(categoryFilter, priceFilter);
});
