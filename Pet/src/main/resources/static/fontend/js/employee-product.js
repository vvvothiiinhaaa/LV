// kiểm tra trạng thái đăng nhập
async function checkLoginStatus() {
    try {
        const response = await fetch('/employee/check-login'); // Đợi phản hồi
        if (response.ok) {
            const employee = await response.json(); // Đợi chuyển đổi JSON
            console.log("Đã đăng nhập:", employee.username);

            // Lưu thông tin vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", employee.username);
            return true;
        } else {
            console.log("Chưa đăng nhập.");
            localStorage.removeItem("isLoggedIn");
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error);
        localStorage.removeItem("isLoggedIn");
        return false;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = await checkLoginStatus(); // Đợi kết quả

    if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để xem danh sách sản phẩm.");
        window.location.href = "/fontend/employee-login.html";
        return;
    }

    fetchProducts();
});

function fetchProducts() {
    fetch("http://localhost:8080/api/products")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("tableBody");

            const products = Array.isArray(data) ? data : [data];

            tableBody.innerHTML = ""; // Xóa nội dung cũ trước khi thêm mới

            products.forEach(product => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.url}" alt="${product.name}" width="50"></td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.origin}</td>
                    <td>${product.brand}</td>
                    <td>${product.sold}</td>
                    <td>
                    <div>
                       <button onclick="viewDetails(${product.id})" class="btn btn-info">Chỉnh Sửa</button>
                        <button onclick="viewDetailsProduct(${product.id})" class="btn btn-info">Xem</button>
                    </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Khởi tạo DataTables
            $('#datatablesSimple').DataTable({
                "stripeClasses": [],
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "lengthMenu": [5, 10, 30, 100],
                "language": {
                    "lengthMenu": "Hiển thị _MENU_ bản ghi mỗi trang",
                    "zeroRecords": "Không tìm thấy dữ liệu",
                    "info": "Hiển thị _START_ đến _END_ của _TOTAL_ bản ghi",
                    "infoEmpty": "Không có bản ghi nào",
                    "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
                    "search": "Tìm kiếm:",
                    "paginate": {
                        "first": "Đầu",
                        "last": "Cuối",
                        "next": ">",
                        "previous": "<"
                    }
                }
            });
        })
        .catch(error => console.error("Lỗi khi lấy dữ liệu sản phẩm:", error));
}

function viewDetailsProduct(productId) {
    // Fetch product details by product ID
    fetch(`http://localhost:8080/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Điền thông tin sản phẩm vào modal
            document.getElementById("viewProductName").textContent = product.name;
            document.getElementById("viewProductUrl").src = product.url;
            document.getElementById("viewProductPrice").textContent = product.price.toLocaleString() + " VNĐ";
            document.getElementById("viewProductQuantity").textContent = product.quantity;
            document.getElementById("viewProductBrand").textContent = product.brand;
            document.getElementById("viewProductOrigin").textContent = product.origin;
            document.getElementById("viewProductSold").textContent = product.sold;
            document.getElementById("viewProductIngredient").textContent = product.ingredient;
            document.getElementById("viewProductComponent").textContent = product.component;
            document.getElementById("viewProductDescription").textContent = product.description;
            document.getElementById("viewProductGenre").textContent = product.genre;

            // Fetch images
            fetch(`http://localhost:8080/api/images/img/${productId}`)
                .then(response => response.json())
                .then(images => {
                    if (images && images.images) {
                        const imagesArray = images.images;
                        document.getElementById("viewProductImage1").src = imagesArray[0] || 'https://via.placeholder.com/100';
                        document.getElementById("viewProductImage2").src = imagesArray[1] || 'https://via.placeholder.com/100';
                        document.getElementById("viewProductImage3").src = imagesArray[2] || 'https://via.placeholder.com/100';
                        document.getElementById("viewProductImage4").src = imagesArray[3] || 'https://via.placeholder.com/100';
                    }
                })
                .catch(error => console.error("Lỗi khi tải ảnh:", error));

            // Mở modal
            $('#viewproductDetailModal').modal('show');
        })
        .catch(error => console.error("Lỗi khi tải thông tin sản phẩm:", error));
}


/// mở html thêm sản phẩm 
document.getElementById("addProductBtn").addEventListener("click", function() {
    // Chuyển hướng đến trang thêm sản phẩm
    window.location.href = "add-product.html";
});


// View details of a product and open the modal
function viewDetails(productId) {
   

    // Fetch product details by product ID
    fetch(`http://localhost:8080/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Populate the modal with product details
            document.getElementById("editProductName").value = product.name;
            document.getElementById("editProductUrl").src = product.url;
            document.getElementById("editProductPrice").value = product.price;
            document.getElementById("editProductQuantity").value = product.quantity;
            document.getElementById("editProductBrand").value = product.brand;
            document.getElementById("editProductOrigin").value = product.origin;
            document.getElementById("editProductSold").value = product.sold;
            document.getElementById("editProductIngredient").value = product.ingredient;
            document.getElementById("editProductComponent").value = product.component;
            document.getElementById("editProductDescription").value = product.description;
            document.getElementById("editProductGenre").value = product.genre;
            console.log("id của danh mục", product.genre);

            // fetch(`http://localhost:8080/api/categories/${product.genre}`) // Giả sử genre lưu ID của danh mục
            // .then(response => response.json())
            // .then(category => {
            //     document.getElementById("editProductGenre").value = category.name; // Lưu tên danh mục
            // })
            // .catch(error => {
            //     console.error("Lỗi lấy danh mục:", error);
            //     document.getElementById("editProductGenre").value = "Không xác định";
            // });

           // Fetch images from the API
           fetch(`http://localhost:8080/api/images/img/${productId}`)
           .then(response => response.json())
           .then(images => {
               // Check if images array exists and has data
               if (images && images.images) {
                   const imagesArray = images.images;

                   // Show images (if available)
                  // Show additional images
                  document.getElementById("editProductImage1").src = imagesArray[0] || 'https://via.placeholder.com/100';
                  document.getElementById("editProductImage2").src = imagesArray[1] || 'https://via.placeholder.com/100';
                  document.getElementById("editProductImage3").src = imagesArray[2] || 'https://via.placeholder.com/100';
                  document.getElementById("editProductImage4").src = imagesArray[3] || 'https://via.placeholder.com/100';

              }
           })
           .catch(error => {
               console.error("Error fetching images:", error);
           });

            // Open the modal
            $('#productDetailModal').modal('show');
            document.getElementById("saveProductChanges").onclick = function() {
                updateProduct(product.id); // Pass productId to the update function
            };
        })
        .catch(error => console.error("Error fetching product details:", error));
}
// Function to update the product
function updateProduct(productId) {
   
    const updatedProduct = {
        name: document.getElementById("editProductName").value,
        price: document.getElementById("editProductPrice").value,
        quantity: document.getElementById("editProductQuantity").value,
        brand: document.getElementById("editProductBrand").value,
        origin: document.getElementById("editProductOrigin").value,
        sold: document.getElementById("editProductSold").value,
        ingredient: document.getElementById("editProductIngredient").value,
        component: document.getElementById("editProductComponent").value,
        description: document.getElementById("editProductDescription").value,
        genre: document.getElementById("editProductGenre").value,
        // Check if image files are updated
        urlFile: document.getElementById("editProductImageUrl").files[0],
        url1: document.getElementById("editProductImage1File").files[0],
        url2: document.getElementById("editProductImage2File").files[0],
        url3: document.getElementById("editProductImage3File").files[0],
        url4: document.getElementById("editProductImage4File").files[0]
    };

    // Send PUT request to update the product
    const formData = new FormData();
    for (const key in updatedProduct) {
        formData.append(key, updatedProduct[key]);
    }

    fetch(`http://localhost:8080/api/products/${productId}/update`, {
        method: "PUT",
        body: formData
    })
    .then(response => response.json())
    .then(updatedProduct => {
        alert("Sản phẩm đã được cập nhật thành công!");
        $('#productDetailModal').modal('hide');
        // Optionally, reload the table or update the UI
        window.location.reload();
    })
    .catch(error => {
        console.error("Error updating product:", error);
        alert("Cập nhật sản phẩm không thành công!");
    });
}
// /////////////// nhập hàng
document.addEventListener("DOMContentLoaded", function () {
    const stockEntryBtn = document.getElementById("StockEntryBtn");
    const stockEntryModal = new bootstrap.Modal(document.getElementById("stockEntryModal"));
    
    // Mở modal khi bấm nút "Nhập Hàng"
    stockEntryBtn.addEventListener("click", function () {
        stockEntryModal.show();
        loadProductOptions(); // Load danh sách sản phẩm
    });

    // Lấy danh sách sản phẩm từ API và hiển thị trong dropdown
    async function loadProductOptions() {
        try {
            const response = await fetch("http://localhost:8080/api/products");
            if (!response.ok) throw new Error("Lỗi khi tải danh sách sản phẩm");
            const products = await response.json();

            const productSelect = document.getElementById("productSelect");
            productSelect.innerHTML = `<option value="">-- Chọn Sản Phẩm --</option>`;

            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    }
});
//     // Xử lý gửi dữ liệu nhập hàng lên API
//     document.getElementById("stockEntryForm").addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const productId = document.getElementById("productSelect").value;
//         const quantity = document.getElementById("quantity").value;
//         const purchasePrice = document.getElementById("purchasePrice").value;
//         // const supplier = document.getElementById("supplier").value;

//         if (!productId) {
//             alert("Vui lòng chọn sản phẩm.");
//             return;
//         }

//         // Tạo FormData để gửi dưới dạng form-data như trên Postman
//         const formData = new FormData();
//         formData.append("productId", productId);
//         formData.append("quantity", quantity);
//         formData.append("purchasePrice", purchasePrice);
//         // formData.append("supplier", supplier);

//         try {
//             const response = await fetch("http://localhost:8080/api/stock/add", {
//                 method: "POST",
//                 body: formData // Gửi dữ liệu dưới dạng form-data
//             });

//             if (!response.ok) throw new Error("Lỗi khi lưu nhập hàng");

//             alert("Nhập hàng thành công!");
//             stockEntryModal.hide();
//             document.getElementById("stockEntryForm").reset();
//             location.reload();
//         } catch (error) {
//             console.error("Lỗi khi gửi dữ liệu nhập hàng:", error);
//             alert("Không thể lưu nhập hàng. Vui lòng thử lại!");
//         }
//     });
document.getElementById('stockEntryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get values from the form inputs
    const productId = document.getElementById('productSelect').value;
    const quantity = document.getElementById('quantity').value;
    const purchasePrice = document.getElementById('purchasePrice').value;

    // Check if all required fields are filled
    if (!productId || !quantity || !purchasePrice) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    // Prepare the request payload
    const requestBody = {
        productId: productId,
        quantity: parseInt(quantity),
        purchasePrice: parseFloat(purchasePrice)
    };

    // Make the API call to add stock
    fetch('/api/stock/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.text()) // Sử dụng .text() thay vì .json() để lấy phản hồi dưới dạng chuỗi
    .then(data => {
        console.log(data); // Xem thông tin phản hồi
        alert(data); // Hiển thị thông báo trả về từ API
        $('#stockEntryModal').modal('hide');
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi nhập kho!');
    });
    
});