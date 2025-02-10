// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("savePetBtn").addEventListener("click", savePetInfo);
// });
function attachPetEventListeners() {
    const savePetBtn = document.getElementById("savePetBtn");
    if (savePetBtn) {
        savePetBtn.addEventListener("click", savePetInfo);
        console.log("✅ Sự kiện `savePetBtn` đã được gán lại!");
    } else {
        console.error("❌ Không tìm thấy `savePetBtn`, không thể gán sự kiện!");
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


async function savePetInfo() {
console.log("Bắt đầu lưu thú cưng...");

const userId = await fetchUserId(); // Gọi API để lấy userId
if (!userId) {
console.error("Không lấy được userId, hủy thao tác.");
alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
return;
}

console.log("Lấy userId thành công:", userId);

const petName = document.getElementById("petName").value;
const birthdate = document.getElementById("birthdate").value;
const breed = document.getElementById("breed").value;
const gender = document.getElementById("gender").value;
const petImage = document.getElementById("petImage").files[0];

console.log("Dữ liệu thu thập:", { petName, birthdate, breed, gender, userId, petImage });

let formData = new FormData();
formData.append("name", petName);
formData.append("userId", userId);
formData.append("birthdate", birthdate);
formData.append("breed", breed);
formData.append("gender", gender);
if (petImage) {
formData.append("file", petImage);
}

console.log("Gửi request đến API...");
try {
const response = await fetch("http://localhost:8080/pets/add", {
    method: "POST",
    body: formData
});

console.log("Nhận response từ API:", response);
if (!response.ok) {
    throw new Error("Có lỗi xảy ra khi thêm thú cưng");
}

const newPet = await response.json();
console.log("Dữ liệu thú cưng mới:", newPet);
alert("Thêm thú cưng thành công!");

// Cập nhật danh sách thú cưng trên giao diện
addPetToUI(newPet);

// Đóng modal đúng cách
let petModal = bootstrap.Modal.getInstance(document.getElementById("petModal"));
if (petModal) petModal.hide();

// Reset form sau khi gửi
document.getElementById("petForm").reset();
} catch (error) {
console.error("Lỗi khi gọi API:", error);
alert("Thêm thú cưng thất bại!");
}
}

function addPetToUI(pet) {
    const petList = document.getElementById("petList");

    const petCard = document.createElement("div");
    petCard.classList.add("card", "p-3", "mt-3", "d-flex", "flex-row", "align-items-center", "position-relative");

    petCard.innerHTML = `
        <div class="col-3 text-center">
            <img src="${pet.url || './img/default-avata.png'}" class="rounded-circle" width="100" height="100" alt="">
        </div>
        <div class="col-7">
            <h5>${pet.name}</h5>
            <p><strong>Ngày Sinh:</strong> ${pet.birthdate}</p>
            <p><strong>Giống Loài:</strong> ${pet.breed}</p>
            <p><strong>Giới Tính:</strong> ${pet.gender === "male" ? "Đực" : "Cái"}</p>
        </div>
        <div class="col-2 text-end">
            <button class="btn btn-custom btn-sm" onclick="updatePet(this)">Cập Nhật</button>
            <button class="btn btn-custom btn-sm" onclick="deletePet(this)">Xóa</button>
        </div>
    `;

    petList.appendChild(petCard);
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
petCard.classList.add("card", "p-3", "mt-3", "d-flex", "flex-row", "align-items-center", "position-relative");

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
        <button class="btn btn-custom btn-sm" onclick="updatePet(${pet.id})">Cập Nhật</button>
        <button class="btn btn-custom btn-sm" onclick="deletePet(${pet.id})">Xóa</button>
    </div>
`;

petList.appendChild(petCard);
});

console.log("Danh sách thú cưng đã hiển thị trên giao diện.");
}
