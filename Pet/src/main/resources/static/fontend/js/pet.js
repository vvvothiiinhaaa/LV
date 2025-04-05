
function attachPetEventListeners() {
    const savePetBtn = document.getElementById("savePetBtn");
    
    if (savePetBtn) {
        savePetBtn.addEventListener("click", savePetInfo);
        console.log(" Sự kiện `savePetBtn` đã được gán lại!");
    } else {
        console.error(" Không tìm thấy `savePetBtn`, không thể gán sự kiện!");
    }
    const updateBtn = document.getElementById("updatePetBtn");
    if(updateBtn){
        updateBtn.addEventListener("click",updatePetInfo);
        console.log(" Sự kiện `updateBtn` đã được gán lại!");
    } else {
        console.error(" Không tìm thấy `updateBt`, không thể gán sự kiện!");
    }
}

async function fetchUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        if (!response.ok) throw new Error('Lỗi xác thực');
        const data = await response.json();
        return data.userId;
    } catch (error) {
        console.error(error);
        alert('Không thể xác thực người dùng.');
        return null;
    }
}


        // async function savePetInfo() {
        // console.log("Bắt đầu lưu thú cưng...");

        // const userId = await fetchUserId(); // Gọi API để lấy userId
        // if (!userId) {
        // console.error("Không lấy được userId, hủy thao tác.");
        // alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        // return;
        // }

        // console.log("Lấy userId thành công:", userId);

        // const petName = document.getElementById("petName").value;
        // const birthdate = document.getElementById("birthdate").value;
        // const breed = document.getElementById("breed").value;
        // const gender = document.getElementById("gender").value;
        // const petImage = document.getElementById("petImage").files[0];

        // console.log("Dữ liệu thu thập:", { petName, birthdate, breed, gender, userId, petImage });

        // let formData = new FormData();
        // formData.append("name", petName);
        // formData.append("userId", userId);
        // formData.append("birthdate", birthdate);
        // formData.append("breed", breed);
        // formData.append("gender", gender);
        // if (petImage) {
        // formData.append("file", petImage);
        // }

        // console.log("Gửi request đến API...");
        // try {
        // const response = await fetch("http://localhost:8080/pets/add", {
        //     method: "POST",
        //     body: formData
        // });

        // console.log("Nhận response từ API:", response);
        // if (!response.ok) {
        //     throw new Error("Có lỗi xảy ra khi thêm thú cưng");
        // }

        // const newPet = await response.json();
        // console.log("Dữ liệu thú cưng mới:", newPet);
        // alert("Thêm thú cưng thành công!");

        // // Cập nhật danh sách thú cưng trên giao diện
        // addPetToUI(newPet);
        // loadPets(userId);

        // // Đóng modal đúng cách
        // let petModal = bootstrap.Modal.getInstance(document.getElementById("petModal"));
        // if (petModal) petModal.hide();

        // // Reset form sau khi gửi
        // document.getElementById("petForm").reset();
        // } catch (error) {
        // console.error("Lỗi khi gọi API:", error);
        // alert("Thêm thú cưng thất bại!");
        // }
        // }
function addPetToUI(pet) {
    const petList = document.getElementById("petList");
    const petDiv = document.createElement("div");
    petDiv.classList.add("pet-item", "p-3", "mb-2", "border", "rounded");
    petDiv.setAttribute("data-id", pet.id);  // Thêm thuộc tính data-id cho mỗi phần tử thú cưng

    petDiv.innerHTML = `
        <img src="${pet.url}" alt="Pet" class="pet-image" style="width: 100px; height: 100px;">
        <div><strong class="pet-name">${pet.name}</strong> (${pet.breed})</div>
        <div class="pet-birthdate">Ngày Sinh: ${pet.birthdate}</div>
        <div class="pet-gender">Giới Tính: ${pet.gender}</div>
        <button class="btn btn-custom btn-sm" class="update-btn" onclick="openUpdatePetModal(${pet.id})">Cập Nhật</button>
         <button class="btn btn-custom btn-sm" class="delete-btn" onclick="deletePet(${pet.id})">Xóa</button>
    `;
    petList.appendChild(petDiv);  // Đảm bảo phần tử đã được thêm vào DOM
}



document.addEventListener("DOMContentLoaded", async function () {
console.log("Trang đã tải, bắt đầu lấy danh sách thú cưng...");

const userId = await fetchUserId(); // Gọi API lấy userId
if (!userId) {
console.error("Không lấy được userId, không thể tải danh sách thú cưng.");
alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
return;
}

console.log("Lấy userId thành công:", userId);
loadPets(userId);
});

// Hàm gọi API để lấy danh sách thú cưng của user
async function loadPets(userId) {
        console.log(`Gọi API để lấy danh sách thú cưng của userId: ${userId}`);
        console.log(`${userId}`);
        try {
        const response = await fetch(`http://localhost:8080/pets/user/${userId}`);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách thú cưng.");
        }

        const pets = await response.json();
        console.log("Danh sách thú cưng nhận từ API:", pets);

        // Hiển thị danh sách thú cưng trên giao diện
        displayPets(pets);
        } catch (error) {
        console.error("Lỗi khi tải danh sách thú cưng:", error);
        alert("Không thể tải danh sách thú cưng.");
        }
        }

// Hàm hiển thị danh sách thú cưng trên giao diện
function displayPets(pets) {
            const petList = document.getElementById("petList");
            petList.innerHTML = ""; // Xóa danh sách cũ trước khi render mới

            if (pets.length === 0) {
            petList.innerHTML = "<p class='text-center'>Chưa có thú cưng nào.</p>";
            return;
            }

            pets.forEach((pet) => {
            const petCard = document.createElement("div");
            petCard.classList.add("card", "p-3", "mt-3", "d-flex", "flex-row", "align-items-center", "position-relative" );
            
            petCard.style.cursor = "pointer"; /// thêm ngày 7/3
            
            petCard.innerHTML = `
                <div class="col-3 text-center">
                    <img src="${pet.url || './img/default-avata.png'}" class="rounded-circle" width="100" height="100" alt="${pet.name}">
                </div>
                <div class="col-7">
                    <h5>${pet.name}</h5>
                    <p><strong>Ngày Sinh:</strong> ${pet.birthdate}</p>
                    <p><strong>Giống Loài:</strong> ${pet.breed}</p>
                    <p><strong>Giới Tính:</strong> ${pet.gender === "male" ? "Đực" : "Cái"}</p>
                </div>
                <div class="col-2 text-end">
                    <button class="btn btn-custom btn-sm update-btn" onclick="openUpdatePetModal(${pet.id})">Cập Nhật</button>
                    <button class="btn btn-custom btn-sm delete-btn" onclick="deletePet(${pet.id})">Xóa</button>

                </div>
            `;

             // Gán sự kiện click cho toàn bộ petCard  /// cập nhật ngày 13/3
                petCard.addEventListener("click", (event) => {
                    const targetElement = event.target;

                    // Kiểm tra nếu người dùng nhấn vào nút "Cập Nhật" hoặc "Xóa"
                    if (targetElement.closest(".update-btn") || targetElement.closest(".delete-btn")) {
                        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra div cha
                        return;
                    }

                    // Nếu không phải nút thì mở modal chi tiết thú cưng
                    openPetDetailModal(pet.id);
                });


            petList.appendChild(petCard);
            });

            console.log("Danh sách thú cưng đã hiển thị trên giao diện.");
            }


  // Mở modal cập nhật
//   async function openUpdatePetModal(petId) {
//     const userId = await fetchUserId(); 
//         fetch(`http://localhost:8080/pets/user/${userId}/pet/${petId}`)
//             .then(response => response.json())
//             .then(pet => {
//                 document.getElementById("updatePetId").value = pet.id;
//                 document.getElementById("updatePetName").value = pet.name;
//                 document.getElementById("updateBirthdate").value = pet.birthdate;
//                 document.getElementById("updateBreed").value = pet.breed;
//                 document.getElementById("updateGender").value = pet.gender;
//                 const modal = new bootstrap.Modal(document.getElementById('updatePetModal'));
//                 modal.show();
//             })
//             .catch(error => {
//                 console.error("Error fetching pet:", error);
//             });
//     }

//     // Cập nhật thông tin thú cưng
//     async function updatePetInfo() {
//         const petId = document.getElementById("updatePetId").value;
//         const petName = document.getElementById("updatePetName").value;
//         const birthdate = document.getElementById("updateBirthdate").value;
//         const breed = document.getElementById("updateBreed").value;
//         const gender = document.getElementById("updateGender").value;
//         const petImage = document.getElementById("updatePetImage").files[0];

//         let formData = new FormData();
//         formData.append("name", petName);
//         formData.append("birthdate", birthdate);
//         formData.append("breed", breed);
//         formData.append("gender", gender);
//         if (petImage) formData.append("file", petImage);

//         try {
//             const response = await fetch(`http://localhost:8080/pets/update/${petId}`, {
//                 method: "PUT",
//                 body: formData
//             });

//             if (!response.ok) throw new Error("Có lỗi xảy ra khi cập nhật thú cưng");
//             const updatedPet = await response.json();
//             alert("Cập nhật thành công!");
//             // Gọi lại danh sách thú cưng sau khi cập nhật
//             const userId = await fetchUserId();
//             if (userId) {
//                 loadPets(userId);
//             }

//     // Đóng modal sau khi cập nhật thành công
//     let updateModal = bootstrap.Modal.getInstance(document.getElementById("updatePetModal"));
//     if (updateModal) updateModal.hide();
//         } catch (error) {
//             console.error("Lỗi khi gọi API:", error);
//             alert("Cập nhật thất bại!");
//         }
//     }

    // function addPetToUI(pet) {
    //         const petList = document.getElementById("petList");
    //         const petDiv = document.createElement("div");
    //         petDiv.classList.add("pet-item", "p-3", "mb-2", "border", "rounded");
    //         petDiv.setAttribute("data-id", pet.id);  // Thêm thuộc tính data-id cho mỗi phần tử thú cưng

    //         petDiv.innerHTML = `
    //             <img src="${pet.imageUrl}" alt="Pet" class="pet-image" style="width: 100px; height: 100px;">
    //             <div><strong class="pet-name">${pet.name}</strong> (${pet.breed})</div>
    //             <div class="pet-birthdate">Ngày Sinh: ${pet.birthdate}</div>
    //             <div class="pet-gender">Giới Tính: ${pet.gender}</div>
    //             <button class="btn btn-warning btn-sm mt-2" onclick="openUpdatePetModal(${pet.id})">Cập Nhật</button>
    //         `;
    //         petList.appendChild(petDiv);  // Đảm bảo phần tử đã được thêm vào DOM
    //     }


        //////////////////////// thêm chi tiết cho thú cưng


        async function openPetDetailModal(petId) {
            try {
                const userId = await fetchUserId(); 
                
                // Gọi API lấy thông tin thú cưng + lịch sử khám
                const response = await fetch(`http://localhost:8080/api/appointments/pet/${petId}`);
                
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin thú cưng.");
                }
        
                const data = await response.json();  // Dữ liệu API trả về
        
                if (!data || data.length === 0) {
                    alert("Không có thông tin lịch sử đặt lịch cho thú cưng này.");
                    return;
                }
        
                const pet = data[0].pets[0];  // Lấy thông tin thú cưng
                
                // Đổ dữ liệu vào modal
                document.getElementById("detailPetName").innerText = pet.name;
                document.getElementById("detailBirthdate").innerText = pet.birthdate;
                document.getElementById("detailBreed").innerText = pet.breed;
                document.getElementById("detailGender").innerText = pet.gender === "male" ? "Đực" : "Cái";
                document.getElementById("detailPetImage").src = pet.url || "./img/default-avata.png";
        
                // Xóa dữ liệu cũ trước khi thêm mới
                const historyTableBody = document.getElementById("historyTableBody");
                historyTableBody.innerHTML = "";
        
                // Hiển thị dữ liệu lịch sử khám (nhiều dịch vụ trong 1 lịch hẹn)
                data.forEach(appointment => {
                    if (appointment.services && Array.isArray(appointment.services)) {
                        appointment.services.forEach(service => {
                            const historyRow = document.createElement("tr");
                            historyRow.innerHTML = `
                                <td>${service.name}</td>  <!-- Tên dịch vụ -->
                                <td>${appointment.startTime || "Không có dữ liệu"}</td>  <!-- Giờ bắt đầu -->
                                <td>${appointment.endTime || "Không có dữ liệu"}</td>  <!-- Giờ kết thúc -->
                                <td>${appointment.appDate || "Không có dữ liệu"}</td>  <!-- Ngày hẹn -->
                                <td>${appointment.status || "Không có dữ liệu"}</td>  <!-- Trạng thái -->
                            `;
                            historyTableBody.appendChild(historyRow);
                        });


                        
                    }
                });
        
                // Hiển thị modal
                const detailModal = new bootstrap.Modal(document.getElementById("petDetailModal"));
                detailModal.show();
            } catch (error) {
                console.error("Lỗi khi lấy thông tin chi tiết thú cưng:", error);
                alert("Không thể hiển thị thông tin thú cưng.");
            }
        }
        
        //////////////////////////////////

        async function deletePet(petId) {
            if (!confirm("Bạn có chắc chắn muốn xóa thú cưng này không?")) return;
        
            try {
                const response = await fetch(`http://localhost:8080/pets/delete/${petId}`, {
                    method: "DELETE",
                });
        
                if (!response.ok) {
                    throw new Error("Xóa thú cưng thất bại!");
                }
        
                alert("Xóa thú cưng thành công!");
                
                // Cập nhật lại danh sách thú cưng
                const userId = await fetchUserId();
                if (userId) {
                    loadPets(userId);
                }
                location.reload();
            } catch (error) {
                console.error("Lỗi khi gọi API xóa:", error);
                alert("Không thể xóa thú cưng.");
            }
        }
    //////////////////////// chỉnh sửa ngày 18 tháng 3

// Lưu danh sách petSize từ API
let petSizeData = [];

// Gọi API để lấy danh sách kích thước khi trang load
function loadPetSizes() {
    fetch("http://localhost:8080/petsizes/all")
        .then(response => response.json())
        .then(data => {
            petSizeData = data;
            console.log("Danh sách kích thước thú cưng đã tải:", petSizeData);
        })
        .catch(error => console.error("Lỗi khi tải danh sách kích thước:", error));
}

// Xác định kích thước dựa vào giống loài và cân nặng
function updateSize() {
    let weight = parseFloat(document.getElementById("weight").value);
    let breed = document.getElementById("breed").value.toLowerCase();
    let sizeField = document.getElementById("size");

    console.log("Giống loài:", breed);
    console.log("Cân nặng:", weight);

    if (!isNaN(weight) && petSizeData.length > 0 && breed.length > 0) {
        // Xác định danh mục (Chó hoặc Mèo)
        let petCategory = breed.includes("chó") ? "Chó" : breed.includes("mèo") ? "Mèo" : "";

        console.log("Danh mục thú cưng:", petCategory);

        if (petCategory) {
            let selectedSize = petSizeData.find(size => 
                size.sizeName.toLowerCase().includes(petCategory.toLowerCase()) &&
                weight >= size.weightMin && weight <= size.weightMax
            );

            console.log("Kích thước tìm thấy:", selectedSize);

            sizeField.value = selectedSize ? selectedSize.sizeName : "Không xác định";
        } else {
            sizeField.value = "Không xác định";
        }
    } else {
        sizeField.value = "";
    }
}
function updateSize2() {
    let weight = parseFloat(document.getElementById("weight").value);
    let breed = document.getElementById("breed").value.toLowerCase();
    let sizeField = document.getElementById("size");

    console.log("Giống loài:", breed);
    console.log("Cân nặng:", weight);

    if (!isNaN(weight) && petSizeData.length > 0 && breed.length > 0) {
        // Xác định danh mục (Chó hoặc Mèo)
        let petCategory = breed.includes("chó") ? "Chó" : breed.includes("mèo") ? "Mèo" : "";

        console.log("Danh mục thú cưng:", petCategory);

        if (petCategory) {
            let selectedSize = petSizeData.find(size => 
                size.sizeName.toLowerCase().includes(petCategory.toLowerCase()) &&
                weight >= size.weightMin && weight <= size.weightMax
            );

            console.log("Kích thước tìm thấy:", selectedSize);

            sizeField.value = selectedSize ? selectedSize.sizeName : "Không xác định";
        } else {
            sizeField.value = "Không xác định";
        }
    } else {
        sizeField.value = "";
    }
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", loadPetSizes);


async function savePetInfo() {
    console.log("🔄 Bắt đầu lưu thú cưng...");

    const userId = await fetchUserId();
    if (!userId) {
        console.error("❌ Không lấy được userId, hủy thao tác.");
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
    }

    const petName = document.getElementById("petName").value;
    const birthdate = document.getElementById("birthdate").value;
    const breed = document.getElementById("breed").value;
    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const sizeName = document.getElementById("size").value;
    const petImage = document.getElementById("petImage").files[0];

    console.log("📦 Dữ liệu thu thập:", { petName, birthdate, breed, gender, weight, sizeName, userId, petImage });

    if (!sizeName || sizeName === "Không xác định") {
        alert("⚠ Không tìm thấy kích thước phù hợp! Vui lòng kiểm tra lại giống loài và cân nặng.");
        return;
    }

    let formData = new FormData();
    formData.append("name", petName);
    formData.append("userId", userId);
    formData.append("birthdate", birthdate);
    formData.append("breed", breed);
    formData.append("gender", gender);
    formData.append("weight", weight);
    formData.append("sizeName", sizeName);
    if (petImage) {
        formData.append("file", petImage);
    }

    console.log(" Gửi request đến API...");
    try {
        const response = await fetch("http://localhost:8080/pets/pet/add", {
            method: "POST",
            body: formData
        });

        console.log(" Nhận response từ API:", response);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error("Lỗi khi thêm thú cưng: " + errorMessage);
        }

        const newPet = await response.json();
        console.log(" Dữ liệu thú cưng mới:", newPet);
        alert(" Thêm thú cưng thành công!");

        addPetToUI(newPet);
        loadPets(userId);

        let petModal = bootstrap.Modal.getInstance(document.getElementById("petModal"));
        if (petModal) petModal.hide();

        document.getElementById("petForm").reset();
    } catch (error) {
        console.error(" Lỗi khi gọi API:", error);
        alert("Thêm thú cưng thất bại! " + error.message);
    }
}
async function openUpdatePetModal(petId) {
    try {
        const userId = await fetchUserId();
        const response = await fetch(`http://localhost:8080/pets/user/${userId}/pet/${petId}`);

        if (!response.ok) {
            throw new Error("Không thể lấy thông tin thú cưng.");
        }

        const pet = await response.json();

        // Đổ dữ liệu vào modal
        document.getElementById("updatePetId").value = pet.id;
        document.getElementById("updatePetName").value = pet.name;
        document.getElementById("updateBirthdate").value = pet.birthdate;
        document.getElementById("updateBreed").value = pet.breed;
        document.getElementById("updateGender").value = pet.gender;
        document.getElementById("updateWeight").value = pet.weight;
        document.getElementById("updateSize").value = pet.size ? pet.size.sizeName : "Không xác định";

        // Khi thay đổi cân nặng, tự động cập nhật kích thước
        document.getElementById("updateWeight").addEventListener("input", updateSizeForUpdateModal);

        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('updatePetModal'));
        modal.show();
    } catch (error) {
        console.error(" Lỗi khi lấy thông tin thú cưng:", error);
        alert(" Không thể hiển thị thông tin thú cưng.");
    }
}
function updateSizeForUpdateModal() {
    let weight = parseFloat(document.getElementById("updateWeight").value);
    let breed = document.getElementById("updateBreed").value.toLowerCase();
    let sizeField = document.getElementById("updateSize");

    console.log(" Giống loài:", breed);
    console.log(" Cân nặng:", weight);

    if (!isNaN(weight) && breed.length > 0) {
        let petCategory = breed.includes("chó") ? "Chó" : breed.includes("mèo") ? "Mèo" : "";

        console.log(" Danh mục thú cưng:", petCategory);

        if (petCategory) {
            let selectedSize = petSizeData.find(size => 
                size.sizeName.toLowerCase().includes(petCategory.toLowerCase()) &&
                weight >= size.weightMin && weight <= size.weightMax
            );

            console.log(" Kích thước tìm thấy:", selectedSize);

            sizeField.value = selectedSize ? selectedSize.sizeName : "Không xác định";
        } else {
            sizeField.value = "Không xác định";
        }
    } else {
        sizeField.value = "";
    }
}
async function updatePetInfo() {
    console.log(" Bắt đầu cập nhật thú cưng...");

    const petId = document.getElementById("updatePetId").value;
    const petName = document.getElementById("updatePetName").value;
    const birthdate = document.getElementById("updateBirthdate").value;
    const breed = document.getElementById("updateBreed").value;
    const gender = document.getElementById("updateGender").value;
    const weight = parseFloat(document.getElementById("updateWeight").value);
    const sizeName = document.getElementById("updateSize").value;
    const petImage = document.getElementById("updatePetImage").files[0];

    console.log(" Dữ liệu thu thập:", { petId, petName, birthdate, breed, gender, weight, sizeName, petImage });

    // Kiểm tra nếu không có kích thước hợp lệ
    if (!sizeName || sizeName === "Không xác định") {
        alert(" Không tìm thấy kích thước phù hợp! Vui lòng kiểm tra lại giống loài và cân nặng.");
        return;
    }

    let formData = new FormData();
    formData.append("petId", petId);
    formData.append("name", petName);
    formData.append("birthdate", birthdate);
    formData.append("breed", breed);
    formData.append("gender", gender);
    formData.append("weight", weight);
    formData.append("sizeName", sizeName);
    if (petImage) {
        formData.append("file", petImage);
    }

    console.log(" Gửi request đến API...");
    try {
        const response = await fetch(`http://localhost:8080/pets/pet/update`, {
            method: "PUT",
            body: formData
        });

        console.log(" Nhận response từ API:", response);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error("Lỗi khi cập nhật thú cưng: " + errorMessage);
        }

        const updatedPet = await response.json();
        console.log(" Dữ liệu thú cưng cập nhật:", updatedPet);
        alert(" Cập nhật thành công!");

        // Gọi lại danh sách thú cưng sau khi cập nhật
        const userId = await fetchUserId();
        if (userId) {
            loadPets(userId);
        }

        // Đóng modal sau khi cập nhật thành công
        let updateModal = bootstrap.Modal.getInstance(document.getElementById("updatePetModal"));
        if (updateModal) updateModal.hide();

        // Reset form sau khi cập nhật
        document.getElementById("updatePetForm").reset();
    } catch (error) {
        console.error(" Lỗi khi gọi API:", error);
        alert(" Cập nhật thất bại! " + error.message);
    }
}
