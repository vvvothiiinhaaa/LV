// lấy danh mục sản phẩm
document.addEventListener("DOMContentLoaded", async function () {
    const categorySelect = document.getElementById("productGenre");

    try {
        const response = await fetch("http://localhost:8080/api/categories"); // Đổi URL API nếu cần
        if (!response.ok) throw new Error("Lỗi khi lấy danh mục");

        const categories = await response.json();

        // Thêm danh mục vào select
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Lỗi:", error);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("productForm").addEventListener("submit", async function (event) {
        event.preventDefault();


        const isLoggedIn = await checkLoginStatus();
        if (!isLoggedIn) {
            alert("Vui lòng đăng nhập trước khi thêm sản phẩm.");
            window.location.href = "/frontend/employee-login.html";
            return;
        }
    

        let formData = new FormData();
        function addToForm(id, key) {
            let element = document.getElementById(id);
            if (element) formData.append(key, element.value);
        }

        addToForm("productName", "name");
        addToForm("productPrice", "price");
        addToForm("productSold", "sold");
        // addToForm("productGenre", "genre");
        addToForm("productOrigin", "origin");
        addToForm("productBrand", "brand");
        addToForm("productComponent", "component");
        addToForm("productDescription", "description");
        addToForm("productQuantity", "quantity");
        addToForm("productIngredient", "ingredient");

         // Lấy giá trị danh mục là tên thay vì ID
         let categoryElement = document.getElementById("productGenre");
         if (categoryElement && categoryElement.value) {
             formData.append("genre", categoryElement.value); // Lưu tên danh mục
         } else {
             alert("Vui lòng chọn danh mục sản phẩm!");
             return;
         }

        let mainImage = document.getElementById("productImage");
        if (mainImage && mainImage.files.length > 0) {
            formData.append("url", mainImage.files[0]);
        } else {
            alert("Vui lòng chọn ảnh chính!");
            return;
        }

        let galleryImages = document.getElementById("productGallery");
        if (galleryImages && galleryImages.files.length > 4) {
            alert("Vui lòng chỉ chọn tối đa 4 ảnh!");
            return;
        }

        if (galleryImages) {
            for (let i = 0; i < galleryImages.files.length; i++) {
                formData.append(`url${i + 1}`, galleryImages.files[i]);
            }
        }

        // Kiểm tra dữ liệu trước khi gửi
        console.log("Dữ liệu gửi lên API:", [...formData.entries()]);

        try {
            let response = await fetch("http://localhost:8080/api/products/add", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("Sản phẩm đã được thêm thành công!");
                window.location.href = "staff-product.html";
            } else {
                let errorMessage = await response.text();
                console.error("Lỗi từ server:", errorMessage);
                alert("Lỗi khi thêm sản phẩm: " + errorMessage);
            }
        } catch (error) {
            console.error("Lỗi gửi yêu cầu:", error);
            alert("Lỗi kết nối đến server!");
        }
    });
});
async function checkLoginStatus() {
    try {
        const response = await fetch('/employee/check-login');
        if (response.ok) {
            const employee = await response.json();
            console.log("Đã đăng nhập:", employee.username);
            return true; // Đã đăng nhập
        } else {
            console.log("Chưa đăng nhập.");
            return false; // Chưa đăng nhập
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error);
        return false;
    }
}
////////////////////////////////////// thêm 1 danh mục mới

document.addEventListener("DOMContentLoaded", function () {
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const productGenre = document.getElementById("productGenre");
    const newCategoryInput = document.getElementById("newCategoryName");
    const addCategoryModal = new bootstrap.Modal(document.getElementById("addCategoryModal"));

    //  Khi nhấn nút "+" mở modal nhập danh mục
    addCategoryBtn.addEventListener("click", function () {
        newCategoryInput.value = ""; // Reset input
        addCategoryModal.show();
    });

    //  Khi nhấn "Lưu", gọi API thêm danh mục vào cơ sở dữ liệu
    saveCategoryBtn.addEventListener("click", async function () {
        const newCategory = newCategoryInput.value.trim();
        if (newCategory === "") {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: newCategory }) // Gửi JSON với tên danh mục
            });

            if (!response.ok) {
                throw new Error("Lỗi khi thêm danh mục");
            }

            const createdCategory = await response.json();
            console.log("Danh mục mới được thêm:", createdCategory);

            //  Thêm danh mục mới vào dropdown
            const newOption = document.createElement("option");
            newOption.value = createdCategory.id; // Lấy ID từ API
            newOption.textContent = createdCategory.name;
            productGenre.appendChild(newOption);

            //  Chọn luôn danh mục vừa thêm
            productGenre.value = createdCategory.id;

            //  Ẩn modal sau khi thêm danh mục
            addCategoryModal.hide();

        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);
            alert("Không thể thêm danh mục! Hãy thử lại.");
        }
    });


});
