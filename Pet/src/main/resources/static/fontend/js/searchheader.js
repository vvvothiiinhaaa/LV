function setupSearchEvent() {
    console.log(" `setupSearchEvent()` đã được gọi.");

    const searchButton = document.getElementById("btnsearch");
    const searchInput = document.getElementById("searchquery");

    console.log(" Kiểm tra phần tử trong DOM...");
    console.log(" searchButton:", searchButton);
    console.log(" searchInput:", searchInput);

    if (!searchButton || !searchInput) {
        console.error(" Không tìm thấy `btnsearch` hoặc `searchquery`.");
        return;
    }

    console.log(" Gán sự kiện thành công!");

    // Sự kiện khi nhấn nút tìm kiếm
    searchButton.addEventListener("click", function(event) {
        event.preventDefault(); // Chặn reload trang
        console.log(" Nút tìm kiếm được click");
        performSearch();
    });

    // Sự kiện khi nhấn phím Enter trong ô tìm kiếm
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            console.log(" Nhấn Enter để tìm kiếm");
            event.preventDefault();
            performSearch();
        }
    });

    // Gán giá trị từ URL vào khung tìm kiếm khi trang tải
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    console.log(" Từ khóa lấy từ URL:", query);

    if (query) {
        searchInput.value = query; // Gán lại giá trị vào khung tìm kiếm
        console.log(" Gán giá trị từ URL vào ô tìm kiếm:", query);
    }
}
function performSearch() {
    console.log("🔍 Hàm `performSearch()` đã được gọi.");

    const searchInput = document.getElementById("searchquery");

    if (!searchInput) {
        console.error("Không tìm thấy `searchquery`.");
        return;
    }

    const query = searchInput.value.trim();
    console.log(" Từ khóa tìm kiếm:", query);

    if (query.length === 0) {
        alert(" Vui lòng nhập từ khóa tìm kiếm!");
        return;
    }

    // Chuyển hướng đến trang tìm kiếm
    const searchUrl = "product.html?query=" + encodeURIComponent(query);
    console.log(" Chuyển hướng đến:", searchUrl);
    window.location.href = searchUrl;
}
