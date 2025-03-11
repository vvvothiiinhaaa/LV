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
            alert("Vui lòng đăng nhập để truy cập trang này.");
            window.location.href = "/fontend/employee-login.html";
            return;
        }
    
    });
                ///////////////////////////////
        function loadServices() {
        fetch("http://localhost:8080/services/all")
            .then(response => response.json())
            .then(data => {
                const serviceList = document.getElementById("service-list");
                serviceList.innerHTML = ""; // Xóa nội dung cũ trước khi tải mới
    
                data.forEach(service => {
                    const serviceCard = `
                     <div class="col-md-4 mb-4">
                            <a href="pet-service-detaitl.html?id=${service.id}" class="card" ">
                                <img src="${service.url}" class="card-img-top" alt="${service.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${service.name}</h5>
                                    <p class="card-text">${service.description}</p>
                                    <p><strong>Thời gian:</strong> ${service.duration} phút</p>
                                    
                                    <!-- Dùng div để chứa 2 button bên trong thẻ <a> -->
                                    <div class="d-flex justify-content-between mt-2">
                                       <button class="btn-service" onclick="event.preventDefault(); updateServiceDetail(${service.id})">Sửa</button>
    
                                        <button class="btn-service" onclick="event.preventDefault(); deleteService(${service.id})">Xóa</button>
                                    </div>
                                </div>
                            </a>
                        </div>
    
                    `;
    
                    serviceList.innerHTML += serviceCard;
                });
            })
            .catch(error => console.error("Lỗi khi tải dịch vụ:", error));
            }
    
    
            
    //////////////////////////////////////// cập nhật dịch vụ
    function updateServiceDetail(serviceId) { 
        fetch(`http://localhost:8080/services/${serviceId}`)
            .then(response => response.json())
            .then(service => {
                console.log(" Dữ liệu API trả về:", service);
                console.log(" Các bước thực hiện:", service.steps);
    
                // Điền thông tin dịch vụ
                document.getElementById("serviceId").value = service.id;
                document.getElementById("serviceDetailName").value = service.name;
                document.getElementById("serviceDetailImage").src = service.url;
                document.getElementById("serviceDetailDesc").value = service.description;
                document.getElementById("serviceDetailDuration").value = service.duration;
    
                // Xóa nội dung cũ
                const stepsContainer = document.getElementById("steps");
                stepsContainer.innerHTML = "";
    
                // Kiểm tra nếu `steps` có dữ liệu không
                if (service.steps && Array.isArray(service.steps) && service.steps.length > 0) {
                    console.log(" Có bước thực hiện, hiển thị...");
                    
                    // Sắp xếp steps theo `stepOrder`
                    service.steps.sort((a, b) => a.stepOrder - b.stepOrder).forEach(step => {
                        console.log(` Thêm bước: ${step.stepOrder} - ${step.stepTitle}`);
                        addStepInput(step.stepOrder, step.stepTitle, step.stepDescription);
                    });
                } else {
                    console.warn(" Không có bước nào trong dịch vụ này!");
                }
    
                // Hiển thị bảng giá
                const pricesContainer = document.getElementById("pricesContainer");
                pricesContainer.innerHTML = "";
    
                if (service.prices && Array.isArray(service.prices) && service.prices.length > 0) {
                    console.log(" Hiển thị bảng giá...");
                    service.prices.forEach(price => {
                        addPriceInput(price.petSize.id, price.petSize.sizeName, price.price);
                    });
                } else {
                    console.warn(" Không có bảng giá nào được thiết lập!");
    
                     // Nếu không có giá -> Gọi API lấy danh sách kích thước thú cưng
                     fetch("http://localhost:8080/petsizes/all")
                        .then(response => response.json())
                        .then(petSizes => {
                            console.log(" Danh sách kích thước thú cưng:", petSizes);
                            
                            petSizes.forEach(petSize => {
                                addPriceInput(petSize.id, petSize.sizeName, ""); // Giá trị trống để nhập vào
                            });
                        })
                        .catch(error => console.error(" Lỗi khi tải danh sách kích thước thú cưng:", error));
                
                }
    
                // Hiển thị modal
                document.getElementById("serviceDetailModal").style.display = "flex";
            })
            .catch(error => console.error(" Lỗi khi tải chi tiết dịch vụ:", error));
    }
    
    function addStepInput(stepOrder, stepTitle, stepDescription) {
        const stepsContainer = document.getElementById("steps");
        
        if (!stepsContainer) {
            console.error("Không tìm thấy stepsContainer!");
            return;
        }
    
        const stepDiv = document.createElement("div");
        stepDiv.className = "step-item";
        //   <label>Bước ${stepOrder}:</label>
        stepDiv.innerHTML = `
      
            <input type="text" class="step-title" value="${stepTitle}" placeholder="Tiêu đề" required>
            <input type="text" class="step-description" value="${stepDescription}" placeholder="Mô tả" required>
            <button type="button" class="remove-step" onclick="this.parentElement.remove()">X</button>
        `;
    
        stepsContainer.appendChild(stepDiv);
    }
    
    
    
    
    function removeStep(button) {
        button.parentElement.remove();
    }
    function addPriceInput(petSizeId, sizeName, priceValue = "") {
        const pricesContainer = document.getElementById("pricesContainer");
    
        const priceDiv = document.createElement("div");
        priceDiv.className = "price-item"; // Áp dụng CSS flexbox để căn chỉnh hàng ngang
    
        priceDiv.innerHTML = `
            <label style="flex: 1; font-weight: bold;">${sizeName}:</label>
            <input type="number" class="price-input" data-size-id="${petSizeId}" 
                   placeholder="Nhập giá" value="${priceValue}" 
                   style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        `;
    
        pricesContainer.appendChild(priceDiv);
    }
    // function updateServiceDetail(serviceId) {
    //     // Gọi API lấy tất cả petSize trước
    //     fetch("http://localhost:8080/petsizes/all")
    //         .then(response => response.json())
    //         .then(allPetSizes => {
    //             // Sau khi có danh sách tất cả petSize, gọi API lấy chi tiết dịch vụ
    //             fetch(`http://localhost:8080/services/${serviceId}`)
    //                 .then(response => response.json())
    //                 .then(service => {
    //                     console.log(" Dữ liệu API trả về:", service);
    //                     console.log(" Các bước thực hiện:", service.steps);
    //                     console.log(" Danh sách kích thước thú cưng:", allPetSizes);
    
    //                     // Điền thông tin dịch vụ
    //                     document.getElementById("serviceId").value = service.id;
    //                     document.getElementById("serviceDetailName").value = service.name;
    //                     document.getElementById("serviceDetailImage").src = service.url;
    //                     document.getElementById("serviceDetailDesc").value = service.description;
    //                     document.getElementById("serviceDetailDuration").value = service.duration;
    
    //                     // Xóa nội dung cũ
    //                     const stepsContainer = document.getElementById("steps");
    //                     stepsContainer.innerHTML = "";
    
    //                     // Hiển thị các bước thực hiện
    //                     if (service.steps && Array.isArray(service.steps) && service.steps.length > 0) {
    //                         service.steps.sort((a, b) => a.stepOrder - b.stepOrder).forEach(step => {
    //                             console.log(` Thêm bước: ${step.stepOrder} - ${step.stepTitle}`);
    //                             addStep(step.stepOrder, step.stepTitle, step.stepDescription);
    //                         });
    //                     } else {
    //                         console.warn(" Không có bước nào trong dịch vụ này!");
    //                     }
    
    //                     // Xóa bảng giá cũ
    //                     const pricesContainer = document.getElementById("pricesContainer");
    //                     pricesContainer.innerHTML = "";
    
    //                     // Chuyển đổi danh sách giá của dịch vụ thành Map để tra cứu nhanh
    //                     const priceMap = new Map();
    //                     service.prices.forEach(price => {
    //                         priceMap.set(price.petSize.id, price.price);
    //                     });
    
    //                     // Duyệt qua tất cả petSize để hiển thị bảng giá
    //                     allPetSizes.forEach(petSize => {
    //                         const priceValue = priceMap.has(petSize.id) ? priceMap.get(petSize.id) : "";
    //                         addPriceInput(petSize.id, petSize.sizeName, priceValue);
    //                     });
    
    //                     // Hiển thị modal
    //                     document.getElementById("serviceDetailModal").style.display = "flex";
    //                 })
    //                 .catch(error => console.error(" Lỗi khi tải chi tiết dịch vụ:", error));
    //         })
    //         .catch(error => console.error(" Lỗi khi tải danh sách petSize:", error));
    // }
    
    function updateService() {
        const serviceId = document.getElementById("serviceId").value;
        const name = document.getElementById("serviceDetailName").value.trim();
        const description = document.getElementById("serviceDetailDesc").value.trim();
        const duration = document.getElementById("serviceDetailDuration").value.trim();
        const imageInput = document.getElementById("serviceImageUpload").files[0];
    
        if (!serviceId) {
            alert("Không tìm thấy ID dịch vụ!");
            return;
        }
    
        //  Lấy danh sách các bước thực hiện
        const steps = [];
        document.querySelectorAll("#steps .step-item").forEach((step, index) => {
            steps.push({
                stepOrder: index + 1, // Đảm bảo số thứ tự đúng
                stepTitle: step.querySelector(".step-title")?.value.trim() || "",
                stepDescription: step.querySelector(".step-description")?.value.trim() || ""
            });
        });
    
        //  Lấy danh sách giá theo kích thước thú cưng
        const prices = [];
        document.querySelectorAll(".price-input").forEach(price => {
            prices.push({
                petSizeId: parseInt(price.getAttribute("data-size-id"), 10),
                price: parseFloat(price.value) || 0
            });
        });
    
        //  Tạo FormData để gửi dữ liệu
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("duration", duration);
        if (imageInput) {
            formData.append("file", imageInput);
        }
    
        // Chuyển `steps` và `prices` thành chuỗi JSON (KHÔNG DÙNG Blob)
        if (steps.length > 0) {
            formData.append("steps", JSON.stringify(steps));
        } else {
            formData.append("steps", "[]"); // Gửi mảng rỗng nếu không có bước nào
        }
    
        if (prices.length > 0) {
            formData.append("prices", JSON.stringify(prices));
        } else {
            formData.append("prices", "[]"); // Gửi mảng rỗng nếu không có giá nào
        }
    
        // Gửi API cập nhật dịch vụ
        fetch(`http://localhost:8080/services/update/${serviceId}`, {
            method: "PUT",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi khi cập nhật dịch vụ!");
            }
            return response.json();
        })
        .then(data => {
            alert("Cập nhật dịch vụ thành công!");
            closeServiceDetailModal();
            location.reload();
        })
        .catch(error => {
            console.error(" Lỗi khi cập nhật dịch vụ:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        });
    }
    
    
    function closeServiceDetailModal() {
        document.getElementById("serviceDetailModal").style.display = "none";
    }
    
    // Đóng modal khi click bên ngoài
    window.onclick = function(event) {
        let modal = document.getElementById("serviceDetailModal");
        if (event.target === modal) {
            closeServiceDetailModal();
        }
    };
    
    
            function deleteService(serviceId) {
                if (confirm("Bạn có chắc muốn xóa dịch vụ này không?")) {
                    fetch(`http://localhost:8080/services/delete/${serviceId}`, {
                        method: "DELETE"
                    })
                    .then(response => {
                        if (response.ok) {
                            alert("Xóa dịch vụ thành công!");
                            loadServices(); // Tải lại danh sách sau khi xóa
                        } else {
                            alert("Lỗi khi xóa dịch vụ!");
                        }
                    })
                    .catch(error => console.error("Lỗi khi xóa dịch vụ:", error));
                }
            }
    
            // Gọi API khi trang được tải
            document.addEventListener("DOMContentLoaded", loadServices);
    
                        function openModal() {
                    document.getElementById("serviceModal").style.display = "flex";
                }
    
                function closeModal() {
                    document.getElementById("serviceModal").style.display = "none";
                }
    
                // Đóng modal khi click bên ngoài
                window.onclick = function(event) {
                    let modal = document.getElementById("serviceModal");
                    if (event.target === modal) {
                        closeModal();
                    }
                };
                // thêm dịch vụ mới
                // document.getElementById("serviceForm").addEventListener("submit", function(event) {
                //     event.preventDefault(); // Ngăn chặn tải lại trang
    
                //     let serviceName = document.getElementById("serviceName").value;
                //     let serviceDesc = document.getElementById("serviceDesc").value;
                //     let serviceDuration = document.getElementById("serviceDuration").value;
                //     let serviceImage = document.getElementById("serviceImage").files[0];
    
                //     // Tạo FormData để gửi dữ liệu
                //     let formData = new FormData();
                //     formData.append("name", serviceName);
                //     formData.append("description", serviceDesc);
                //     formData.append("duration", serviceDuration);
                //     formData.append("file", serviceImage);
    
                //     // Gửi API thêm dịch vụ
                //     fetch("http://localhost:8080/services/add", {
                //         method: "POST",
                //         body: formData
                //     })
                //     .then(response => response.json())
                //     .then(data => {
                //         alert("Dịch vụ đã được thêm thành công!");
                //         closeModal();
                //         location.reload(); // Refresh trang để cập nhật danh sách dịch vụ
                //     })
                //     .catch(error => {
                //         console.error("Lỗi:", error);
                //         alert("Có lỗi xảy ra khi thêm dịch vụ!");
                //     });
                // });
    
    
                document.addEventListener("DOMContentLoaded", function () {
        loadPetSizes(); // Gọi API lấy danh sách pet size khi mở modal
    });
    
    // Thêm Bước Thực Hiện
    function addStep() {
        const stepsContainer = document.getElementById("stepsContainer");
        const stepCount = stepsContainer.children.length + 1;
        
        const stepDiv = document.createElement("div");
        stepDiv.className = "step-item";
        stepDiv.innerHTML = `
            <input type="text" placeholder="Bước ${stepCount} - Tiêu đề" required>
            <input type="text" placeholder="Mô tả" required>
            <button type="button" onclick="removeElement(this)">X</button>
        `;
        stepsContainer.appendChild(stepDiv);
    }
    function addStep2() {
        const stepsContainer = document.getElementById("steps");
        const stepCount = stepsContainer.children.length + 1;
        
        const stepDiv = document.createElement("div");
        stepDiv.className = "step-item";
        stepDiv.innerHTML = `
            <input type="text" placeholder="Bước ${stepCount} - Tiêu đề" required>
            <input type="text" placeholder="Mô tả" required>
            <button type="button" onclick="removeElement(this)">X</button>
        `;
        stepsContainer.appendChild(stepDiv);
    }
    
    
    //  Gọi API lấy danh sách kích thước thú cưng
    function loadPetSizes() {
        fetch("http://localhost:8080/petsizes/all")
            .then(response => response.json())
            .then(data => {
                const priceContainer = document.getElementById("priceContainer");
                priceContainer.innerHTML = ""; // Xóa dữ liệu cũ
                
                data.forEach(size => {
                    const div = document.createElement("div");
                    div.className = "price-item";
                    div.innerHTML = `
                        <label>${size.sizeName}:</label>
                        <input type="number" placeholder="Nhập giá cho ${size.sizeName}" required>
                    `;
                    priceContainer.appendChild(div);
                });
            })
            .catch(error => console.error("Lỗi khi tải danh sách pet size:", error));
    }
    
    //  Gửi dữ liệu lên server
    document.getElementById("serviceForm").addEventListener("submit", function(event) {
        event.preventDefault(); 
    
        let serviceName = document.getElementById("serviceName").value;
        let serviceDesc = document.getElementById("serviceDesc").value;
        let serviceDuration = document.getElementById("serviceDuration").value;
        let serviceImage = document.getElementById("serviceImage").files[0];
    
        // Lấy danh sách bước thực hiện
        let steps = [];
        document.querySelectorAll(".step-item").forEach((step, index) => {
            let inputs = step.querySelectorAll("input");
            steps.push({
                stepOrder: index + 1,
                stepTitle: inputs[0].value,
                stepDescription: inputs[1].value
            });
        });
    
        // Lấy danh sách giá theo kích thước thú cưng
        let prices = [];
        document.querySelectorAll(".price-item").forEach((price, index) => {
            let inputs = price.querySelectorAll("input");
            prices.push({
                petSizeId: index + 1,
                price: inputs[0].value
            });
        });
    
        const formData = new FormData();
        formData.append("name", serviceName);
        formData.append("description", serviceDesc);
        formData.append("duration", serviceDuration);
        formData.append("file", serviceImage);
        formData.append("steps", JSON.stringify(steps));
        formData.append("prices", JSON.stringify(prices));
    
        fetch("http://localhost:8080/services/add", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("dịch vụ mới", data);
            alert("Dịch vụ đã được thêm thành công!");
            closeModal();
            location.reload();
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi thêm dịch vụ!");
        });
    });
    
    //  Xóa phần tử
    function removeElement(button) {
        button.parentElement.remove();
    }
    
    // Đóng modal
    function closeModal() {
        document.getElementById("serviceModal").style.display = "none";
    }
    
    
    