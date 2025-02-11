document.addEventListener("DOMContentLoaded", async function () {
    await loadProvinces(); // Tải danh sách tỉnh/thành phố khi trang tải lần đầu
    setupEventListeners(); // Gán sự kiện xử lý dropdown tỉnh/thành phố, quận/huyện, phường/xã
    loadUserAddresses(); // Tải danh sách địa chỉ của người dùng
});

// 🟢 1. Hàm tải danh sách tỉnh/thành phố
async function loadProvinces() {
    const provinceSelect = document.getElementById("provinceSelect");
    if (!provinceSelect) return;

    try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const provinces = await response.json();
        provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';
        provinces.forEach(province => {
            provinceSelect.options.add(new Option(province.name, province.code));
        });
    } catch (error) {
        console.error("Lỗi khi tải tỉnh/thành phố:", error);
    }
}

// 🟢 2. Hàm tải danh sách quận/huyện khi chọn tỉnh/thành phố
async function loadDistricts(provinceCode) {
    const districtSelect = document.getElementById("districtSelect");
    if (!districtSelect) return;

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await response.json();
        districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        data.districts.forEach(district => {
            districtSelect.options.add(new Option(district.name, district.code));
        });
    } catch (error) {
        console.error("Lỗi khi tải quận/huyện:", error);
    }
}

// 🟢 3. Hàm tải danh sách phường/xã khi chọn quận/huyện
async function loadWards(districtCode) {
    const wardSelect = document.getElementById("wardSelect");
    if (!wardSelect) return;

    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await response.json();
        wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        data.wards.forEach(ward => {
            wardSelect.options.add(new Option(ward.name, ward.code));
        });
    } catch (error) {
        console.error("Lỗi khi tải phường/xã:", error);
    }
}

// 🟢 4. Gán sự kiện thay đổi cho dropdown tỉnh/thành phố, quận/huyện, phường/xã
function setupEventListeners() {
    document.getElementById("provinceSelect")?.addEventListener("change", function () {
        loadDistricts(this.value);
        document.getElementById("wardSelect").innerHTML = '<option value="">Chọn phường/xã</option>';
    });

    document.getElementById("districtSelect")?.addEventListener("change", function () {
        loadWards(this.value);
    });
}

// 🟢 5. Hàm thêm địa chỉ mới
async function addNewAddress(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const formData = {
        userId: await getUserId(),
        recipientName: document.getElementById("recipientName").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        provinceCity: document.getElementById("provinceSelect").selectedOptions[0].text,
        district: document.getElementById("districtSelect").selectedOptions[0].text,
        wardSubdistrict: document.getElementById("wardSelect").selectedOptions[0].text,
        addressDetail: document.getElementById("addressDetail").value,
        defaultAddress: document.getElementById("defaultAddressCheck").checked
    };

    try {
        const response = await fetch("http://localhost:8080/api/addresses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Thêm địa chỉ thành công!");
            loadUserAddresses(); // Load lại danh sách địa chỉ
        } else {
            throw new Error("Không thể thêm địa chỉ.");
        }
    } catch (error) {
        console.error("Lỗi khi thêm địa chỉ:", error);
    }
}

// 🟢 6. Hàm hiển thị danh sách địa chỉ của người dùng
async function loadUserAddresses() {
    const userId = await getUserId();
    if (!userId) return;

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/user/${userId}`);
        const addresses = await response.json();

        const container = document.getElementById("address");
        container.innerHTML = addresses.map(address => renderAddressCard(address)).join("");
    } catch (error) {
        console.error("Lỗi khi tải danh sách địa chỉ:", error);
    }
}

// 🟢 7. Hàm xóa địa chỉ
async function deleteAddress(addressId) {
    const userId = await getUserId();
    if (!userId) return;

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/delete/${userId}/${addressId}`, { method: "DELETE" });
        if (response.ok) {
            alert("Đã xóa địa chỉ!");
            loadUserAddresses(); // Load lại danh sách sau khi xóa
        } else {
            throw new Error("Lỗi khi xóa địa chỉ.");
        }
    } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
    }
}

// 🟢 8. Hàm cập nhật địa chỉ
async function updateAddress(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const userId = await getUserId();
    const addressId = document.getElementById("addressId").value;
    if (!userId || !addressId) return;

    const updatedData = {
        recipientName: document.getElementById("recipientName").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        addressDetail: document.getElementById("addressDetail").value,
        provinceCity: document.getElementById("provinceSelect").selectedOptions[0].text,
        district: document.getElementById("districtSelect").selectedOptions[0].text,
        wardSubdistrict: document.getElementById("wardSelect").selectedOptions[0].text,
        defaultAddress: document.getElementById("defaultAddressCheck").checked
    };

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/update/user/${userId}/address/${addressId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Cập nhật địa chỉ thành công!");
            loadUserAddresses(); // Load lại danh sách địa chỉ
        } else {
            throw new Error("Lỗi khi cập nhật địa chỉ.");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error);
    }
}

// 🟢 9. Hàm hiển thị thông tin địa chỉ trong card
function renderAddressCard(address) {
    return `
        <div class="card">
            <div class="card-body">
                <h5>${address.recipientName}</h5>
                <p>${address.phoneNumber}</p>
                <p>${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
                <button onclick="deleteAddress(${address.id})">Xóa</button>
            </div>
        </div>
    `;
}
