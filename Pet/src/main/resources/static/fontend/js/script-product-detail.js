
    // JavaScript to handle quantity increase and decrease
    document.getElementById('increase').addEventListener('click', function() {
        let quantityInput = document.getElementById('quantityCart');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    document.getElementById('decrease').addEventListener('click', function() {
        let quantityInput = document.getElementById('quantityCart');
        if (parseInt(quantityInput.value) > 0) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
//lấy ảnh 
   // Lấy ID từ URL
   const urlParams = new URLSearchParams(window.location.search);
   const productId = urlParams.get("id");

   // Gọi API để lấy chi tiết sản phẩm
   if (productId) {
       fetch(`http://localhost:8080/api/products/${productId}`)
           .then(response => {
               if (!response.ok) {
                   throw new Error("Không thể lấy dữ liệu sản phẩm");
               }
               return response.json();
           })
           .then(data => {
               // Cập nhật thông tin trên trang
               document.getElementById("product-name").innerText = data.name;
               document.getElementById("product-origin").innerText = data.origin;
               document.getElementById("product-description").innerText = data.description;
               document.getElementById("product-price").innerText = formatPrice(data.price) + " VND";
               document.getElementById("mainImage").src = data.url || "default-image.png";
               document.getElementById("product-component").innerText = data.component;
               document.getElementById("nutritional-info").innerText = data.ingredient;
               document.getElementById("product-brand").innerText = data.brand;
               document.getElementById("product-quantity").innerText = data.quantity;
             
            //    cập nhật thông tin của breadcrumb
                document.getElementById("product-name2").innerText = data.name;
                document.getElementById("product-genre").innerText = data.genre;


                 // Kiểm tra nếu genre là "đồ chơi cho chó mèo" hoặc "dụng cụ vệ sinh"
            if (data.genre === "Đồ chơi cho chó mèo" || data.genre === "Dụng cụ vệ sinh") {
                // Ẩn thông tin dinh dưỡng và thành phần
                document.getElementById("nutritional-info-h5").style.display = "none";
                document.getElementById("nutritional-info").style.display = "none";
            } else {
                // Hiển thị thông tin dinh dưỡng và thành phần
                document.getElementById("nutritional-info").style.display = "block";
                document.getElementById("product-component").style.display = "block";
                // document.getElementById("nutritional-info").innerText = data.ingredient;
            }

            
           })
           .catch(error => {
               console.error("Lỗi:", error);
               alert("Không thể tải dữ liệu sản phẩm.");
           });
   } else {
       console.error("Không tìm thấy ID sản phẩm trong URL");
   }

   // Hàm định dạng giá tiền
   function formatPrice(price) {
       return new Intl.NumberFormat('vi-VN').format(price);
   }

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



// Lấy tham số ID từ URL
// document.addEventListener('DOMContentLoaded', function () {
//     const smallImgRow = document.getElementById('smallImgRow'); // Lấy phần tử smallImgRow

//     if (!smallImgRow) {
//         console.error('Không tìm thấy phần tử smallImgRow trong DOM');
//         return; // Dừng lại nếu không tìm thấy phần tử
//     }

//     // Tiếp tục xử lý ảnh thu nhỏ
//     const urlParam = new URLSearchParams(window.location.search);
//     const productIdss = urlParam.get("id");
//     fetch(`/api/images/img/${productIdss}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Lỗi API: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.images && Array.isArray(data.images)) {
//                 data.images.forEach(imageUrl => {
//                     const smallImg = document.createElement('img');
//                     smallImg.src = imageUrl; // Đường dẫn hình ảnh nhỏ
//                     smallImg.alt = 'Ảnh nhỏ sản phẩm';
//                     smallImg.className = 'thumbnail-img';  // Class để căn chỉnh ảnh nhỏ

//                     smallImg.onclick = () => {
//                         window.open(imageUrl, '_blank');  // Mở ảnh lớn trong cửa sổ mới khi click vào ảnh nhỏ
//                     };

//                     smallImgRow.appendChild(smallImg);  // Thêm ảnh nhỏ vào hàng ảnh nhỏ
//                 });
//             } else {
//                 console.error('Không tìm thấy mảng images trong dữ liệu API');
//             }
//         })
//         .catch(error => {
//             console.error('Lỗi khi tải dữ liệu hình ảnh:', error);
//         });
// });
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// xử lý ảnh nhỏ 
// document.addEventListener('DOMContentLoaded', function () {
//     const smallImgRow = document.getElementById('smallImgRow'); // Lấy phần tử smallImgRow
//     const mainImg = document.getElementById('mainImage'); // Lấy phần tử ảnh chính (giả sử có id 'mainImg')

//     if (!smallImgRow || !mainImg) {
//         console.error('Không tìm thấy phần tử smallImgRow hoặc mainImg trong DOM');
//         return; // Dừng lại nếu không tìm thấy phần tử
//     }

//     // Tiếp tục xử lý ảnh thu nhỏ
//     const urlParam = new URLSearchParams(window.location.search);
//     const productIdss = urlParam.get("id");
//     fetch(`/api/images/img/${productIdss}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Lỗi API: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.images && Array.isArray(data.images)) {
//                 data.images.forEach(imageUrl => {
//                     const smallImg = document.createElement('img');
//                     smallImg.src = imageUrl; // Đường dẫn hình ảnh nhỏ
//                     smallImg.alt = 'Ảnh nhỏ sản phẩm';
//                     smallImg.className = 'thumbnail-img';  // Class để căn chỉnh ảnh nhỏ

//                     smallImg.onclick = () => {
//                         mainImg.src = imageUrl;  // Thay thế ảnh chính khi nhấn vào ảnh nhỏ
//                     };

//                     smallImgRow.appendChild(smallImg);  // Thêm ảnh nhỏ vào hàng ảnh nhỏ
//                 });
//             } else {
//                 console.error('Không tìm thấy mảng images trong dữ liệu API');
//             }
//         })
//         .catch(error => {
//             console.error('Lỗi khi tải dữ liệu hình ảnh:', error);
//         });
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  // Thêm sản phẩm vào giỏ hàng
document.addEventListener('DOMContentLoaded', function () {
    const smallImgRow = document.getElementById('smallImgRow'); // Lấy phần tử smallImgRow
    const mainImg = document.getElementById('mainImage'); // Lấy phần tử ảnh chính

    if (!smallImgRow || !mainImg) {
        console.error('Không tìm thấy phần tử smallImgRow hoặc mainImg trong DOM');
        return; // Dừng lại nếu không tìm thấy phần tử
    }

    // Tiếp tục xử lý ảnh thu nhỏ
    const urlParam = new URLSearchParams(window.location.search);
    const productIdss = urlParam.get("id");  // Lấy ID sản phẩm từ URL (giả sử có tham số 'id')

    // Kiểm tra nếu productIdss không tồn tại
    if (!productIdss) {
        console.error('Không tìm thấy id sản phẩm trong URL');
        return; // Dừng lại nếu không có id sản phẩm
    }

    // Tải ảnh của sản phẩm từ API
    fetch(`/api/images/img/${productIdss}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.images && Array.isArray(data.images)) {
                data.images.forEach(imageUrl => {
                    const smallImg = document.createElement('img');
                    smallImg.src = imageUrl; // Đường dẫn hình ảnh nhỏ
                    smallImg.alt = 'Ảnh nhỏ sản phẩm';
                    smallImg.className = 'thumbnail-img';  // Class để căn chỉnh ảnh nhỏ

                    smallImg.onclick = () => {
                        mainImg.src = imageUrl;  // Thay thế ảnh chính khi nhấn vào ảnh nhỏ
                    };

                    smallImgRow.appendChild(smallImg);  // Thêm ảnh nhỏ vào hàng ảnh nhỏ
                });
            } else {
                console.error('Không tìm thấy mảng images trong dữ liệu API');
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu hình ảnh:', error);
        });

    // Lấy userId từ API /api/auth/check-login
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const userId = data.userId; // Lấy userId từ API

            if (!userId) {
                console.error('Không tìm thấy userId từ API');
                return; // Dừng lại nếu không có userId
            }

            const productId = urlParam.get('id');

            // Gọi hàm khi người dùng nhấn nút "Add to Cart"
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            const quantitys = document.getElementById('quantityCart');  // Lấy phần tử input có id "quantity"

            if (addToCartBtn) {
                addToCartBtn.addEventListener("click", function() {
                    // Lấy giá trị quantity từ input khi người dùng nhấn nút
                    const quantity = quantitys.value;
                    console.log("Quantity:", quantity);  // Kiểm tra giá trị của quantity

                    addToCart(userId, productId, quantity);
                });
            } else {
                console.error('Không tìm thấy nút "Add to Cart" trong DOM');
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });

    // Hàm thêm sản phẩm vào giỏ hàng
    function addToCart(userId, productId, quantity) {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('productId', productId);
        params.append('quantity', quantity);

        fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',  // Sử dụng phương thức POST
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'  // Đảm bảo dữ liệu được gửi dưới dạng URL encoded
            },
            body: params.toString()  // Chuyển các tham số thành chuỗi x-www-form-urlencoded
        })
        .then(response => {
            if (response.ok) {
                updateCartCount(userId)
                return response.text();  // Lấy dữ liệu trả về từ backend
                
            } else {
                throw new Error('Failed to add product to cart');
            }
        })
        .then(responseText => {
            console.log(responseText);  // In ra thông báo trả về từ server
            alert(responseText);  // Hiển thị thông báo cho người dùng
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding product to cart');
        });
    }
});


// cập nhật số lượng có trên giỏ hàng
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
////////////////////////////////////////////////// hiển thị đánh giá
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        console.error("Không tìm thấy ID sản phẩm trong URL");
        return;
    }

    fetchUserReviews(productId);
});

function fetchUserReviews(productId) {
    fetch(`http://localhost:8080/reviews/product/${productId}`)
        .then(response => response.json())
        .then(data => {
            displayUserReviews(data);
        })
        .catch(error => console.error("Lỗi khi tải dữ liệu đánh giá:", error));
}

function displayUserReviews(reviews) {
    const reviewsContainer = document.getElementById("user-reviews");
    reviewsContainer.innerHTML = "";

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `<p class="text-muted text-center">Chưa có đánh giá nào.</p>`;
        return;
    }

    let isExpanded = false;
    let displayedReviews = reviews.slice(0, 3);
    
    // Xóa nút nếu nó đã tồn tại trước đó
    document.getElementById("show-more-btn")?.remove();
    document.getElementById("collapse-btn")?.remove();

    // Tạo nút "Xem thêm" và "Thu gọn"
    const showMoreBtn = document.createElement("button");
    showMoreBtn.textContent = "Xem thêm";
    showMoreBtn.classList.add("btn", "btn-primary", "d-block", "mx-auto", "mt-3");
    showMoreBtn.id = "show-more-btn";

    const collapseBtn = document.createElement("button");
    collapseBtn.textContent = "Thu gọn";
    collapseBtn.classList.add("btn", "btn-primary", "d-block", "mx-auto", "mt-3");
    collapseBtn.id = "collapse-btn";
    collapseBtn.style.display = "none"; // Ẩn nút thu gọn ban đầu

    displayedReviews.forEach(review => {
        reviewsContainer.appendChild(createReviewElement(review));
    });

    if (reviews.length > 2) {
        reviewsContainer.appendChild(showMoreBtn);
    }

    showMoreBtn.addEventListener("click", function () {
        if (!isExpanded) {
            reviews.slice(2).forEach(review => {
                reviewsContainer.appendChild(createReviewElement(review));
            });

            // Ẩn nút "Xem thêm", hiển thị nút "Thu gọn"
            showMoreBtn.style.visibility  = "hidden"; 
            collapseBtn.style.visibility  = "visible"; 

            reviewsContainer.appendChild(collapseBtn); // Đưa nút "Thu gọn" xuống cuối danh sách
        }
        isExpanded = true;
    });

    collapseBtn.addEventListener("click", function () {
        reviewsContainer.innerHTML = "";
        reviews.slice(0, 2).forEach(review => {
            reviewsContainer.appendChild(createReviewElement(review));
        });

        // Hiển thị lại nút "Xem thêm", ẩn nút "Thu gọn"
        showMoreBtn.style.visibility  = "visible"; 
        collapseBtn.style.visibility  = "hidden"; 

        reviewsContainer.appendChild(showMoreBtn);
        isExpanded = false;
    });

    reviewsContainer.appendChild(showMoreBtn);
}

function createReviewElement(review) {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review-item", "d-flex", "align-items-start", "mb-4");

    reviewElement.innerHTML = `
        <div class="user-avatar">
            <img src="${review.url || './img/default-avata.png'}" alt="${review.username}" class="rounded-circle" width="50">
        </div>
        <div class="review-content ms-3">
            <h6 class="mb-1 fw-bold">${review.username}</h6>
            <div class="rating">${generateStarRating(review.rating)}</div>
            <p class="text-muted mb-1 small">${review.reviewDate}</p>
            <p class="mb-0">${review.content}</p>
        </div>
    `;

    return reviewElement;
}

function generateStarRating(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? "text-warning" : "text-secondary"}">★</span>`;
    }
    return stars;
}
