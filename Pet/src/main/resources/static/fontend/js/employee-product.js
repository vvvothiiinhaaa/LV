document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/api/products")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("tableBody");

            const products = Array.isArray(data) ? data : [data];

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
                    <td><button onclick="viewDetails(${product.id})" class="btn btn-info">Xem</button>
                    </td>
                    
                `;

                tableBody.appendChild(row);
            });

            // Khởi tạo DataTables
            $('#datatablesSimple').DataTable({
                "stripeClasses": [],
                "paging": true,        // Phân trang
                "searching": true,     // Ô tìm kiếm
                "ordering": true,      // Cho phép sắp xếp
                "info": true,          // Hiển thị số lượng bản ghi
                "lengthMenu": [5, 10, 30, 100], // Chọn số bản ghi mỗi trang
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
        .catch(error => console.error("Error fetching data:", error));
});


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
            document.getElementById("editProductDescription").value = product.description;
            document.getElementById("editProductGenre").value = product.genre;

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
