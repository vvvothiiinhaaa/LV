
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
