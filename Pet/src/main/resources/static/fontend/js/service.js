document.addEventListener("DOMContentLoaded", function () {
    fetchServices();
});

function fetchServices() {
    fetch("http://localhost:8080/services/all") // Thay đổi URL nếu cần
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("services-container");
            container.innerHTML = ""; // Xóa nội dung cũ

            data.forEach(service => {
                const serviceCard = `
                  <div class="container mt-5">
                        <a href="service-detailt.html?id=${service.id}" class="text-decoration-none text-dark">
                            <div class="custom-card position-relative">
                                <div class="custom-image">
                                    <img src="${service.url}" alt="${service.name}">
                                </div>
                                <div>
                                    <h3 class="fw-bold">${service.name}</h3>
                                    <p>${service.description}</p>
                                </div>
                                <div class="custom-circle"></div>
                            </div>
                        </a>
                    </div>

                `;
                container.innerHTML += serviceCard;
            });
        })
        .catch(error => console.error("Lỗi khi tải danh sách dịch vụ:", error));
}
// CSS Styles
// const style = document.createElement("style");
// style.innerHTML = `
// .custom-image {
//     width: 500px;
//     height: 250px;
//     border-radius: 50%;
//     overflow: hidden;
// }

// .custom-image img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
// }`;
// document.head.appendChild(style);
