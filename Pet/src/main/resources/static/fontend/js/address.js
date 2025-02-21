document.addEventListener('DOMContentLoaded', async function () {
    let currentUserId = null;
    let currentAddressId = null; // To store the ID of the address being edited

    async function initializeUserId() {
        try {
            const response = await fetch('http://localhost:8080/api/auth/check-login');
            if (!response.ok) throw new Error('Unable to retrieve user ID');
            const data = await response.json();
            currentUserId = data.userId;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            alert('Please log in to continue.');
        }
    }

    // Fetch and populate provinces, districts, and wards
    async function loadOptionsFromAPI(apiUrl, selectId, defaultValue = null) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) {
            console.error(`Không tìm thấy phần tử: ${selectId}`);
            return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);

            const data = await response.json();
            selectElement.innerHTML = '<option value="">Chọn</option>';

            const districts = data.districts || data.wards || [];
            districts.forEach(item => {
                const option = document.createElement('option');
                option.value = item.code;
                option.textContent = item.name;
                if (item.name === defaultValue) option.selected = true;
                selectElement.appendChild(option);
            });

        } catch (error) {
            console.error('Lỗi tải danh sách:', error);
            selectElement.innerHTML = '<option value="">Không thể tải dữ liệu</option>';
        }
    }

    // Load provinces and attach event listeners for cascading selects
    await loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceSelect');
    document.getElementById('provinceSelect')?.addEventListener('change', async function () {
        // Reset district and ward selects when province is changed
        resetSelectOptions('districtSelect', 'Chọn Quận/Huyện');
        resetSelectOptions('wardSelect', 'Chọn Phường/Xã');
        
        if (this.value) {
            // Load districts for the selected province
            await loadOptionsFromAPI(`https://provinces.open-api.vn/api/p/${this.value}?depth=2`, 'districtSelect');
        }
    });

    document.getElementById('districtSelect')?.addEventListener('change', async function () {
        // Reset ward select when district is changed
        resetSelectOptions('wardSelect', 'Chọn Phường/Xã');
        
        if (this.value) {
            // Load wards for the selected district
            await loadOptionsFromAPI(`https://provinces.open-api.vn/api/d/${this.value}?depth=2`, 'wardSelect');
        }
    });

    // Reset District and Ward Select elements when changing Province or District
    function resetSelectOptions(selectId, defaultText = "Chọn") {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
    }

    // Submit address form
    document.getElementById('addressForm')?.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!currentUserId) {
            alert('Please log in to submit an address.');
            return;
        }

        const formData = {
            userId: currentUserId,
            recipientName: document.querySelector('#addressForm input[placeholder="Họ và tên"]').value,
            phoneNumber: document.querySelector('#addressForm input[placeholder="Số điện thoại"]').value,
            provinceCity: document.getElementById('provinceSelect').selectedOptions[0]?.text,
            district: document.getElementById('districtSelect').selectedOptions[0]?.text,
            wardSubdistrict: document.getElementById('wardSelect').selectedOptions[0]?.text,
            addressDetail: document.querySelector('#addressForm textarea').value,
            defaultAddress: document.getElementById('defaultAddressCheck').checked
        };

        try {
            const response = await fetch('http://localhost:8080/api/addresses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Thêm địa chỉ mới thành công.');
                const modal = bootstrap.Modal.getInstance(document.getElementById('addressModal'));
                modal.hide();
                loadUserAddresses();
            } else {
                alert('Failed to add address.');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    });

    // Load and render user addresses
    async function loadUserAddresses() {
        if (!currentUserId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/addresses/user/${currentUserId}`);
            if (!response.ok) throw new Error('Failed to fetch addresses');

            const addresses = await response.json();
            const container = document.getElementById('address');
            container.innerHTML = '';

            addresses.forEach(address => {
                container.innerHTML += renderAddressCard(address);
            });
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    }

    // Render address card
    function renderAddressCard(address) {
        return `
            <div class="card custom-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${address.recipientName}</h5>
                        <div>
                            <button class="btn btn-outline-lg btn-sm" onclick="loadAddressIntoModal(${address.id})">Cập Nhật</button>
                            <button class="btn btn-outline-lg btn-sm" onclick="deleteAddress(${address.id})">Xóa</button>
                        </div>
                    </div>
                    <p>${address.phoneNumber}</p>
                    <p>${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
                    ${address.defaultAddress ? '<small class="text-muted">Mặc Định</small>' : ''}
                </div>
            </div>
        `;
    }

    // Delete address
    async function deleteAddress(addressId) {
        try {
            const response = await fetch(`http://localhost:8080/api/addresses/delete/${currentUserId}/${addressId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Address deleted successfully.');
                loadUserAddresses();
            } else {
                alert('Failed to delete address.');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    }

    // Initialize user ID and load addresses
    await initializeUserId();
    loadUserAddresses();
});


//////////////////////////////////////////////////// profile js

// document.addEventListener('DOMContentLoaded', function () {
//     // Lấy tham chiếu đến modal
//     var addressModal = document.getElementById('addressModal');

//     // Khởi tạo modal bằng Bootstrap Modal API
//     var modalInstance = new bootstrap.Modal(addressModal);

//     // Lắng nghe sự kiện click trên button mở modal
//     document.querySelector('[data-bs-toggle="modal"]').addEventListener('click', function () {
//         modalInstance.show();
//     });

//     // Tùy chọn: Xử lý khi modal được đóng
//     addressModal.addEventListener('hidden.bs.modal', function () {
//         console.log('Modal đã được đóng');
//     });

//     // Tùy chọn: Xử lý khi modal được hiển thị
//     addressModal.addEventListener('shown.bs.modal', function () {
//         console.log('Modal đã được hiển thị');
//     });
// });
////////////////////////////////////////////////////////////////////
// JavaScript to load and switch between content from address.html and user.html in profile.html
// JavaScript to dynamically fetch and load content based on data-target

/////////////////////////////////////////////////////////////////////////////////////

//   document.addEventListener('DOMContentLoaded', function () {
//     // Fetch and populate provinces
//     fetch('https://provinces.open-api.vn/api/p/')
//         .then(response => response.json())
//         .then(data => {
//             const provinceSelect = document.getElementById('provinceSelect');
//             data.forEach(province => {
//                 provinceSelect.options.add(new Option(province.name, province.code));
//             });
//         });

//     // Handle province change
//     document.getElementById('provinceSelect').addEventListener('change', function () {
//         const provinceCode = this.value;
//         fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
//             .then(response => response.json())
//             .then(data => {
//                 const districtSelect = document.getElementById('districtSelect');
//                 districtSelect.innerHTML = '<option selected>Chọn Quận/Huyện</option>';
//                 data.districts.forEach(district => {
//                     districtSelect.options.add(new Option(district.name, district.code));
//                 });
//             });
//     });

//     // Handle district change
//     document.getElementById('districtSelect').addEventListener('change', function () {
//         const districtCode = this.value;
//         fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
//             .then(response => response.json())
//             .then(data => {
//                 const wardSelect = document.getElementById('wardSelect');
//                 wardSelect.innerHTML = '<option selected>Chọn Phường/Xã</option>';
//                 data.wards.forEach(ward => {
//                     wardSelect.options.add(new Option(ward.name, ward.code));
//                 });
//             });
//     });
// });
document.addEventListener('DOMContentLoaded', function () {
    initializeProvinceDropdown();
    setupAddressEventListeners();
});

/**
 * Hàm lấy danh sách tỉnh/thành phố và đổ vào dropdown
 */
function initializeProvinceDropdown() {
    fetch('https://provinces.open-api.vn/api/p/')
        .then(response => response.json())
        .then(data => {
            const provinceSelect = document.getElementById('provinceSelect');
            if (!provinceSelect) {
                console.error("Không tìm thấy phần tử provinceSelect trên DOM.");
                return;
            }
            provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>'; // Reset dropdown
            data.forEach(province => {
                provinceSelect.options.add(new Option(province.name, province.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error));
}

/**
 * Hàm thiết lập sự kiện thay đổi cho dropdown
 */
function setupAddressEventListeners() {
    const provinceSelect = document.getElementById('provinceSelect');
    const districtSelect = document.getElementById('districtSelect');
    const wardSelect = document.getElementById('wardSelect');

    if (!provinceSelect || !districtSelect || !wardSelect) {
        console.error("Không tìm thấy một hoặc nhiều phần tử select trên DOM.");
        return;
    }

    // Xử lý sự kiện thay đổi tỉnh/thành phố
    provinceSelect.addEventListener('change', function () {
        const provinceCode = this.value;
        if (!provinceCode) {
            resetDropdown(districtSelect, "Chọn Quận/Huyện");
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            return;
        }
        fetchDistricts(provinceCode);
    });

    // Xử lý sự kiện thay đổi quận/huyện
    districtSelect.addEventListener('change', function () {
        const districtCode = this.value;
        if (!districtCode) {
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            return;
        }
        fetchWards(districtCode);
    });
}

/**
 * Hàm lấy danh sách quận/huyện theo tỉnh/thành phố đã chọn
 * @param {string} provinceCode - Mã tỉnh/thành phố
 */
function fetchDistricts(provinceCode) {
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            const districtSelect = document.getElementById('districtSelect');
            if (!districtSelect) return;
            resetDropdown(districtSelect, "Chọn Quận/Huyện");
            data.districts.forEach(district => {
                districtSelect.options.add(new Option(district.name, district.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
}

/**
 * Hàm lấy danh sách phường/xã theo quận/huyện đã chọn
 * @param {string} districtCode - Mã quận/huyện
 */
function fetchWards(districtCode) {
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
        .then(response => response.json())
        .then(data => {
            const wardSelect = document.getElementById('wardSelect');
            if (!wardSelect) return;
            resetDropdown(wardSelect, "Chọn Phường/Xã");
            data.wards.forEach(ward => {
                wardSelect.options.add(new Option(ward.name, ward.code));
            });
        })
        .catch(error => console.error("Lỗi khi lấy danh sách phường/xã:", error));
}

/**
 * Hàm đặt lại dropdown về trạng thái mặc định
 * @param {HTMLElement} selectElement - Phần tử dropdown cần reset
 * @param {string} placeholderText - Văn bản mặc định hiển thị
 */
function resetDropdown(selectElement, placeholderText) {
    if (!selectElement) return;
    selectElement.innerHTML = `<option value="">${placeholderText}</option>`;
}

// ///////////////////////////////////////////////////////////////////////////////////form câpj nhậtnhật

// document.addEventListener('DOMContentLoaded', function () {
    // Fetch and populate provinces
//     fetch('https://provinces.open-api.vn/api/p/')
//         .then(response => response.json())
//         .then(data => {
//             const provinceSelect = document.getElementById('provinceCity');
//             data.forEach(provinces => {
//                 provinceSelect.options.add(new Option(provinces.name, provinces.code));
//             });
//         });

//     // Handle province change
//     document.getElementById('district').addEventListener('change', function () {
//         const provinceCode = this.value;
//         fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
//             .then(response => response.json())
//             .then(data => {
//                 const districtSelect = document.getElementById('districtSelect');
//                 districtSelect.innerHTML = '<option selected>Chọn Quận/Huyện</option>';
//                 data.districts.forEach(districts => {
//                     districtSelect.options.add(new Option(districts.name, districts.code));
//                 });
//             });
//     });

//     // Handle district change
//     document.getElementById('defaultAddress').addEventListener('change', function () {
//         const districtCode = this.value;
//         fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
//             .then(response => response.json())
//             .then(data => {
//                 const wardSelect = document.getElementById('wardSelect');
//                 wardSelect.innerHTML = '<option selected>Chọn Phường/Xã</option>';
//                 data.wards.forEach(wards => {
//                     wardSelect.options.add(new Option(wards.name, wards.code));
//                 });
//             });
//     });
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    // Ensuring the DOM is fully loaded before attaching the event listener
    var form = document.getElementById('addressForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // First, check the login and retrieve the user ID
            fetch('http://localhost:8080/api/auth/check-login', {
                method: 'GET', // Assuming it's a GET request; adjust if needed
                headers: {
                    'Content-Type': 'application/json',
                    // Include authentication headers if required
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.userId) {
                    submitAddressForm(data.userId);
                } else {
                    throw new Error('Not logged in or no user ID available');
                }
            })
            .catch(error => {
                console.error('Login check failed:', error);
                // Handle login check failure, e.g., redirect to login page
                alert('Please log in to continue.'); // Adding user feedback
            });
        });
    } else {
        console.error('Form not found. Ensure that the form exists and the ID is correct.');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addressForm');
    if (form) {
        form.addEventListener('submit', handleAddressFormSubmit);
    } else {
        console.error('Không tìm thấy form `addressForm` trên DOM.');
    }
});

/**
 * Xử lý submit form thêm địa chỉ
 * @param {Event} event - Sự kiện submit
 */
async function handleAddressFormSubmit(event) {
    if (!event) {
        console.error("Không nhận được sự kiện submit!");
        return;
    }
    
    event.preventDefault(); // Đảm bảo chặn form submit

    const form = event.target; // Lấy form từ sự kiện
    const formData = new FormData(form);

    const userId = await getUserId();
    if (!userId) {
        console.error("Không thể lấy userId.");
        alert("Bạn cần đăng nhập để thêm địa chỉ!");
        return;
    }

    const data = {
        userId: userId,
        recipientName: document.querySelector('#addressForm input[placeholder="Họ và tên"]').value,
        phoneNumber: document.querySelector('#addressForm input[placeholder="Số điện thoại"]').value,
        provinceCity: document.getElementById("provinceSelect")?.selectedOptions[0]?.text || "",
        district: document.getElementById("districtSelect")?.selectedOptions[0]?.text || "",
        wardSubdistrict: document.getElementById("wardSelect")?.selectedOptions[0]?.text || "",
        addressDetail: document.querySelector('#addressForm textarea').value,
        defaultAddress: document.getElementById("defaultAddressCheck")?.checked || false,
    };

    try {
        const response = await fetch("http://localhost:8080/api/addresses/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Lỗi khi thêm địa chỉ!");
        }

        alert("Thêm địa chỉ thành công!");
        form.reset(); // Xóa dữ liệu sau khi thêm thành công
        loadUserAddresses(); // Cập nhật danh sách địa chỉ

    } catch (error) {
        console.error("Lỗi khi gửi địa chỉ:", error);
        alert("Không thể thêm địa chỉ. Vui lòng thử lại sau!");
    }
}


/**
 * Hàm gọi API để lấy userId
 */
async function getUserId() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/check-login');
        if (!response.ok) throw new Error('Không thể lấy userId');

        const data = await response.json();
        return data.userId || null;
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}

/**
 * Hàm tải danh sách địa chỉ của người dùng
 */
async function loadUserAddresses() {
    const userId = await getUserId();
    if (!userId) {
        console.error('Không thể lấy userId.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/user/${userId}`);
        if (!response.ok) throw new Error('Không thể lấy danh sách địa chỉ');

        const addresses = await response.json();
        const container = document.getElementById('address');
        container.innerHTML = '';

        addresses.forEach(address => {
            container.innerHTML += renderAddressCard(address);
        });
        setupUpdateAddressEvents();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    }
}


// function submitAddressForm(userId) {
//     const recipientName = document.querySelector('#addressForm input[placeholder="Họ và tên"]').value;
//     const phoneNumber = document.querySelector('#addressForm input[placeholder="Số điện thoại"]').value;
//     const provinceCity = provinceSelect.options[provinceSelect.selectedIndex].text;
//     const district =  districtSelect.options[districtSelect.selectedIndex].text;
//     const wardSubdistrict = wardSelect.options[wardSelect.selectedIndex].text;
//     const addressDetail = document.querySelector('#addressForm textarea').value;
//     const defaultAddress = document.getElementById('defaultAddressCheck').checked;

//     // Create JSON payload with the user ID from login check
//     const data = {
//         userId: userId,
//         recipientName: recipientName,
//         phoneNumber: phoneNumber,
//         provinceCity: provinceCity,
//         district: district,
//         wardSubdistrict: wardSubdistrict,
//         addressDetail: addressDetail,
//         defaultAddress: defaultAddress
//     };

//     // Send data to the server
//     fetch('http://localhost:8080/api/addresses/create', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         alert('Address added successfully.'); // Providing feedback to the user
//         // Close modal and refresh page or show success message
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         alert('Failed to add address.'); // Providing feedback to the user
//     });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// hiển thị danh sách địa chỉ
// Hàm gọi API để lấy userId
async function getUserId() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/check-login');
        if (!response.ok) {
            throw new Error('Không thể lấy userId');
        }
        const data = await response.json();
        return data.userId; // Điều chỉnh dựa vào cấu trúc trả về của API
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}

// Hàm gọi API để lấy danh sách địa chỉ của user
async function getUserAddress(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/addresses/user/${userId}`);
        if (!response.ok) {
            throw new Error('Không thể lấy danh sách địa chỉ');
        }
        const addresses = await response.json();
        return addresses; // Danh sách địa chỉ (mảng object)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        return [];
    }
}

// // Hàm render (tạo HTML) cho mỗi thẻ địa chỉ
// function renderAddressCard(address) {
//     const addressCard = `
//         <div class="card custom-card"> <!-- Sử dụng custom-card -->
//             <div class="card-body">
//                 <div class="d-flex justify-content-between align-items-center">
//                     <h5 class="card-title">${address.recipientName}</h5>
//                     <div>
//                         <button class="btn btn-outline-lg btn-sm" onclick="loadAddressIntoModal(${address.id})">Cập nhật</button>
//                         <button class="btn btn-outline-lg btn-sm" onclick="deleteAddress(${address.id})">Xóa</button>
//                     </div>
//                 </div>
//                 <p class="card-text">${address.phoneNumber}</p>
//                 <p class="card-text">${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
//                 ${address.defaultAddress ? `<p class="card-text"><small class="text-muted">Mặc định</small></p>` : ''}
//             </div>
//         </div>
//     `;
//     return addressCard;
// }

// function renderAddressCard(address) {
//     const addressCard = `
//         <div class="card custom-card"> <!-- Sử dụng custom-card -->
//             <div class="card-body">
//                 <div class="d-flex justify-content-between align-items-center">
//                     <h5 class="card-title">${address.recipientName}</h5>
//                     <div>
//                         <!-- Nút Cập nhật -->
//                         <button class="btn btn-outline-lg btn-sm" onclick="(function() {
//                              currentAddressId = ${address.id};
//                             // Điền dữ liệu vào modal
//                             document.getElementById('recipientName').value = '${address.recipientName}';
//                             document.getElementById('phoneNumber').value = '${address.phoneNumber}';
//                             document.getElementById('addressDetail').value = '${address.addressDetail}';
//                             document.getElementById('provinceCity').value = '${address.provinceCity}';
//                             document.getElementById('district').value = '${address.district}';
//                             document.getElementById('wardSubdistrict').value = '${address.wardSubdistrict}';
//                             document.getElementById('defaultAddress').checked = ${address.defaultAddress};
                            
//                             // Hiển thị modal
//                             const updateModal = new bootstrap.Modal(document.getElementById('updateAddressModal'));
//                             updateModal.show();
//                         })()">Cập nhật</button>
                        
//                         <!-- Nút Xóa -->
//                         <button class="btn btn-outline-lg btn-sm" onclick="deleteAddress(${address.id})">Xóa</button>
//                     </div>
//                 </div>
//                 <p class="card-text">${address.phoneNumber}</p>
//                 <p class="card-text">${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
//                 ${address.defaultAddress ? `<p class="card-text"><small class="text-muted">Mặc định</small></p>` : ''}
//             </div>
//         </div>
//     `;
//     return addressCard;
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
function renderAddressCard(address) {
    const addressCard = `
        <div class="card custom-card"> <!-- Sử dụng custom-card -->
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">${address.recipientName}</h5>
                    <div>
                        <!-- Nút Cập nhật -->
                        <button class="btn btn-outline-lg btn-sm" onclick="(function() {
                             currentAddressId = ${address.id};
                            // Điền dữ liệu vào modal
                            document.getElementById('addressId').value = '${address.id}';
                            document.getElementById('recipientName').value = '${address.recipientName}';
                            document.getElementById('phoneNumber').value = '${address.phoneNumber}';
                             document.getElementById('addressDetail').value = '${address.addressDetail}';
                            // Tải dữ liệu và đặt giá trị mặc định cho các thẻ <select>
                            loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceS', '${address.provinceCity}');
                            loadOptionsFromAPI('https://provinces.open-api.vn/api/d/', 'districtS', '${address.district}');
                            loadOptionsFromAPI('https://provinces.open-api.vn/api/w/', 'wardSubdistrictS', '${address.wardSubdistrict}');
                            document.getElementById('defaultAddress').checked = ${address.defaultAddress};

                            // Hiển thị modal
                            const updateModal = new bootstrap.Modal(document.getElementById('updateAddressModal'));
                            updateModal.show();
                        })()">Cập nhật</button>
                        
                        <!-- Nút Xóa -->
                        <button class="btn btn-outline-lg btn-sm" onclick="deleteAddress(${address.id})">Xóa</button>
                    </div>
                </div>
                <p class="card-text">${address.phoneNumber}</p>
                <p class="card-text">${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
                ${address.defaultAddress ? `<p class="card-text"><small class="text-muted">Mặc định</small></p>` : ''}
            </div>
        </div>
    `;
    return addressCard;
}

// Hàm tải dữ liệu từ API và đặt giá trị mặc định
async function loadOptionsFromAPI(apiUrl, selectId, defaultValue = null) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error(`Không tìm thấy thẻ <select> với id: ${selectId}`);
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Không thể tải dữ liệu từ API: ${response.status}`);
        }

        const data = await response.json();

        // Xóa các tùy chọn hiện tại
        selectElement.innerHTML = '';

        // Thêm tùy chọn trống hoặc mặc định
        if (defaultValue) {
            const defaultOption = document.createElement('option');
            defaultOption.value = defaultValue;
            defaultOption.textContent = defaultValue;
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);
        } else {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Chọn';
            placeholderOption.selected = true;
            selectElement.appendChild(placeholderOption);
        }

        // Thêm dữ liệu từ API
        data.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = item.name;

            // Nếu item khớp với giá trị mặc định, đặt làm selected
            if (item.name === defaultValue) {
                option.selected = true;
            }

            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        selectElement.innerHTML = '<option value="">Lỗi khi tải dữ liệu</option>';
    }
}

// Gọi hàm sau khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceS');
});

// // Hàm để gán giá trị vào các thẻ <select> và đặt giá trị đầu tiên
// function setDefaultOption(selectId, value) {
//     const selectElement = document.getElementById(selectId);

//     // Xóa tất cả các tùy chọn hiện tại
//     selectElement.innerHTML = '';

//     // Tạo tùy chọn mặc định với giá trị được truyền vào
//     const defaultOption = document.createElement('option');
//     defaultOption.value = value; // Gán giá trị
//     defaultOption.textContent = value; // Hiển thị giá trị
//     defaultOption.selected = true; // Đặt làm tùy chọn mặc định

//     // Thêm tùy chọn mặc định vào đầu danh sách
//     selectElement.appendChild(defaultOption);

//     // Nếu muốn thêm các tùy chọn khác (từ dữ liệu API hoặc tĩnh), bạn có thể thêm ở đây
//     // Ví dụ thêm các tỉnh/thành phố khác
//     async function loadOptionsFromAPI(apiUrl, selectId, defaultValue) {
//         const selectElement = document.getElementById(selectId);
//         if (!selectElement) {
//             console.error(`Không tìm thấy thẻ <select> với id: ${selectId}`);
//             return;
//         }
    
//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) {
//                 throw new Error(`Không thể tải dữ liệu từ API: ${response.status}`);
//             }
    
//             const data = await response.json();
//             console.log(data); // Kiểm tra dữ liệu trả về
    
//             // Xóa các tùy chọn hiện tại
//             selectElement.innerHTML = '';
    
//             // Nếu có giá trị mặc định, thêm vào đầu danh sách
//             if (defaultValue) {
//                 const defaultOption = document.createElement('option');
//                 defaultOption.value = defaultValue;
//                 defaultOption.textContent = defaultValue;
//                 defaultOption.selected = true;
//                 selectElement.appendChild(defaultOption);
//             }
    
//             // Thêm các giá trị từ API
//             data.forEach((item) => {
//                 const option = document.createElement('option');
//                 option.value = item.code;
//                 option.textContent = item.name;
//                 selectElement.appendChild(option);
//             });
//         } catch (error) {
//             console.error('Lỗi khi tải dữ liệu:', error);
//             selectElement.innerHTML = '<option value="">Lỗi khi tải dữ liệu</option>';
//         }
//     }
    
//     // Gọi hàm sau khi DOM đã tải xong
//     document.addEventListener('DOMContentLoaded', () => {
//         loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceCity');
//     });
    
// }



// async function fetchWithErrorHandling(url) {
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Lỗi khi fetch API:', error);
//         throw error; // Ném lỗi ra ngoài để xử lý tiếp
//     }
// }

// Hàm chính để tải dữ liệu vào modal
// Hàm chính để tải dữ liệu vào modal
// Hàm tải dữ liệu vào modal
async function loadAddressIntoModal(address) {
    try {
        // Điền dữ liệu vào các trường trong modal
        document.getElementById('recipientName').value = address.recipientName || '';
        document.getElementById('phoneNumber').value = address.phoneNumber || '';
        document.getElementById('addressDetail').value = address.addressDetail || '';
        document.getElementById('defaultAddress').checked = address.defaultAddress || false;

        // Lấy các select elements
        const provinceSelect = document.getElementById('provinceS');
        const districtSelect = document.getElementById('districtS');
        const wardSelect = document.getElementById('wardSubdistrictS');

        // // Tải danh sách tỉnh/thành phố và gán giá trị đã chọn
        // const provinces = await loadProvinces();
        // provinceSelect.innerHTML = provinces.map(province => `<option value="${province.code}">${province.name}</option>`).join('');
        // provinceSelect.value = address.provinceCity || '';

        // // Nếu có tỉnh/thành phố được chọn, tải danh sách quận/huyện
        // if (address.provinceCity) {
        //     await loadDistricts(address.provinceCity, address.district, address.wardSubdistrict);
        // } else {
        //     districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
        //     wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        // }

        // Thêm sự kiện onchange cho tỉnh/thành phố
        provinceSelect.addEventListener('change', async () => {
            const provinceCode = provinceSelect.value;
            if (provinceCode) {
                await loadDistricts(provinceCode);
            } else {
                districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
                wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
            }
        });

        // Thêm sự kiện onchange cho quận/huyện
        districtSelect.addEventListener('change', async () => {
            const districtCode = districtSelect.value;
            if (districtCode) {
                await loadWards(districtCode);
            } else {
                wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
            }
        });

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu vào modal:', error);
    }
}

async function loadDistricts(provinceCode, selectedDistrict, selectedWard) {
    try {
        const districts = await fetchDistricts(provinceCode);
        const districtSelect = document.getElementById('districtS');
        districtSelect.innerHTML = districts.map(district => `<option value="${district.name}">${district.name}</option>`).join('');

        if (selectedDistrict) {
            districtSelect.value = selectedDistrict;
            await loadWards(selectedDistrict, selectedWard);
        } else {
            const wardSelect = document.getElementById('wardSubdistrictS');
            wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách quận/huyện:', error);
    }
}

async function loadWards(districtCode, selectedWard) {
    try {
        const wards = await fetchWards(districtCode);
        const wardSelect = document.getElementById('wardSubdistrictS');
        wardSelect.innerHTML = wards.map(ward => `<option value="${ward.code}">${ward.name}</option>`).join('');

        if (selectedWard) {
            wardSelect.value = selectedWard;
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách phường/xã:', error);
    }
}


// Hàm tải danh sách tỉnh/thành phố
async function loadProvinces() {
    const provinceSelect = document.getElementById('provinceS');
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';

    try {
        console.log('Start fetching provinces...');
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const provinces = await response.json();
        console.log('Provinces data:', provinces);

        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });

        console.log('Provinces added to dropdown.');
    } catch (error) {
        console.error('Error while fetching provinces:', error);
    }
}

// Hàm tải danh sách quận/huyện
async function loadDistricts(provinceCode, selectedDistrict = null, selectedWard = null) {
    const districtSelect = document.getElementById('districtS');
    const wardSelect = document.getElementById('wardSubdistrictS');
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>'; // Reset danh sách quận/huyện
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>'; // Reset danh sách phường/xã

    try {
        console.log(`Fetching districts for province code: ${provinceCode}...`);
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Districts data:', data.districts);

        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.code;
            option.textContent = district.name;
            districtSelect.appendChild(option);

            if (district.code === selectedDistrict) {
                option.selected = true;
            }
        });

        // Tải danh sách phường/xã nếu quận/huyện được chọn
        if (selectedDistrict) {
            await loadWards(selectedDistrict, selectedWard);
        }

        console.log('Districts added to dropdown.');
    } catch (error) {
        console.error('Error while fetching districts:', error);
    }
}

// Hàm tải danh sách phường/xã
async function loadWards(districtCode, selectedWard = null) {
    const wardSelect = document.getElementById('wardSubdistrictS');
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>'; // Reset danh sách phường/xã

    try {
        console.log(`Fetching wards for district code: ${districtCode}...`);
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Wards data:', data.wards);

        data.wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.code;
            option.textContent = ward.name;
            wardSelect.appendChild(option);

            if (ward.code === selectedWard) {
                option.selected = true;
            }
        });

        console.log('Wards added to dropdown.');
    } catch (error) {
        console.error('Error while fetching wards:', error);
    }
}

// Gọi hàm khi tải trang
// Gọi hàm khi tải trang
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded. Initializing...');

    // Tải danh sách tỉnh/thành phố
    await loadProvinces();

    console.log('Page initialization complete.');
});

// Xử lý khi người dùng chọn tỉnh/thành phố
document.getElementById('provinceS').addEventListener('change', async (event) => {
    const provinceCode = event.target.value;
    if (provinceCode) {
        console.log(`Province selected: ${provinceCode}`);
        await loadDistricts(provinceCode); // Tải danh sách quận/huyện
    } else {
        document.getElementById('districtS').innerHTML = '<option value="">Chọn quận/huyện</option>';
        document.getElementById('wardSubdistrictS').innerHTML = '<option value="">Chọn phường/xã</option>';
    }
});

// Xử lý khi người dùng chọn quận/huyện
document.getElementById('districtS').addEventListener('change', async (event) => {
    const districtCode = event.target.value;
    if (districtCode) {
        console.log(`District selected: ${districtCode}`);
        await loadWards(districtCode); // Tải danh sách phường/xã
    } else {
        document.getElementById('wardSubdistrictS').innerHTML = '<option value="">Chọn phường/xã</option>';
    }
});

/////////////////////////////////////////////////////////test thử
// Hiển thị địa chỉ trong card

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Hàm tải và hiển thị danh sách địa chỉ
async function loadUserAddresses() {
    const userId = await getUserId();
    if (!userId) {
        console.error('Không thể lấy userId.');
        return;
    }

    const addresses = await getUserAddress(userId);
    if (addresses.length === 0) {
        console.warn('Không tìm thấy địa chỉ nào.');
        return;
    }

    const container = document.getElementById('address');
    container.innerHTML = ''; // Xóa nội dung cũ

    addresses.forEach(address => {
        container.innerHTML += renderAddressCard(address);
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Các hàm xử lý khi nhấn nút Cập nhật hoặc Xóa
// function updateAddress(addressId) {
//     console.log('Cập nhật địa chỉ ID:', addressId);
//     // Thêm logic cập nhật ở đây
// }

async function deleteAddress(addressId) {
    try {
        // Lấy userId từ API check-login
        const userId = await getUserId();
        if (!userId) {
            console.error('Không thể lấy userId.');
            return;
        }

        // Gửi yêu cầu DELETE đến API
        const response = await fetch(`http://localhost:8080/api/addresses/delete/${userId}/${addressId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Đã xóa địa chỉ ID: ${addressId}`);
            // Cập nhật lại danh sách địa chỉ sau khi xóa thành công
            loadUserAddresses();
        } else {
            console.error(`Lỗi khi xóa địa chỉ ID: ${addressId}, Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API xóa địa chỉ:', error);
    }
}

// Tải danh sách địa chỉ khi trang được load
document.addEventListener('DOMContentLoaded', loadUserAddresses);
////////////////////////////////////////////////////////////////////////////////////////////////


///// chức năng cập nhật địa chỉ

// Hàm cập nhật địa chỉ
// async function updateAddress(userId, addressId) {

//     const apiUrl = `http://localhost:8080/api/addresses/update/user/${userId}/address/${addressId}`;

//     // Lấy dữ liệu từ các trường trong modal
//     const recipientName = document.getElementById('recipientName').value;
//     const phoneNumber = document.getElementById('phoneNumber').value;
//     const addressDetail = document.getElementById('addressDetail').value;
//     const provinceCity = document.getElementById('provinceCity').value;
//     const district = document.getElementById('district').value;
//     const wardSubdistrict = document.getElementById('wardSubdistrict').value;
//     const defaultAddress = document.getElementById('defaultAddress').checked;

//     // Tạo object chứa thông tin địa chỉ cập nhật
//     const updatedAddress = {
//         recipientName,
//         phoneNumber,
//         addressDetail,
//         provinceCity,
//         district,
//         wardSubdistrict,
//         defaultAddress
//     };

//     try {
//         // Gửi yêu cầu PUT đến API
//         const response = await fetch(apiUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedAddress) // Chuyển dữ liệu thành JSON
//         });

//         if (response.ok) {
//             const data = await response.json();
//             alert('Cập nhật địa chỉ thành công!');
//             console.log('Địa chỉ đã cập nhật:', data);

//             // Đóng modal
//             const modal = document.getElementById('updateAddressModal');
//             const modalInstance = bootstrap.Modal.getInstance(modal);
//             modalInstance.hide();

//             // Tải lại danh sách địa chỉ
//             loadUserAddresses();
//         } else {
//             const errorData = await response.json();
//             console.error('Lỗi từ server:', errorData);
//             alert('Cập nhật thất bại: ' + (errorData.message || 'Lỗi không xác định'));
//         }
//     } catch (error) {
//         console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
//         alert('Đã xảy ra lỗi trong quá trình cập nhật địa chỉ!');
//     }
// }


// Hàm lưu địa chỉ cập nhật
// Hàm khởi tạo userId
async function initializeUserId() {
    currentUserId = await getUserIdFromCheckLogin();
    if (!currentUserId) {
        alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!');
    } else {
        loadUserAddresses(); // Gọi hàm tải danh sách địa chỉ khi đã có userId
    }
}
/////////////////////////////////////////////////// cập nhật
// async function saveUpdatedAddress() {
//     const currentAddressId = document.getElementById('addressId').value;
//     const userId = await getUserId();
//     if (!userId) {
//         console.error('Không thể lấy userId.');
//         alert('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
//         return;
//     }

//     const apiUrl = `http://localhost:8080/api/addresses/update/user/${userId}/address/${currentAddressId}`;

//     const recipientName = document.getElementById('recipientName').value.trim();
//     const phoneNumber = document.getElementById('phoneNumber').value.trim();
//     const addressDetail = document.getElementById('addressDetail').value.trim();

//     const provinceSelect = document.getElementById('provinceS');
//     const districtSelect = document.getElementById('districtS');
//     const wardSubdistrictSelect = document.getElementById('wardSubdistrictS');

//     if (!recipientName || !phoneNumber || !addressDetail) {
//         alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
//         return;
//     }

//     const provinceS = provinceSelect.options[provinceSelect.selectedIndex]?.text || '';
//     const districtS = districtSelect.options[districtSelect.selectedIndex]?.text || '';
//     const wardSubdistrictS = wardSubdistrictSelect.options[wardSubdistrictSelect.selectedIndex]?.text || '';
//     const defaultAddress = document.getElementById('defaultAddress').checked;

    
//     const updatedAddress = {
//         recipientName: recipientName,
//         phoneNumber: phoneNumber,
//         addressDetail: addressDetail,
//         provinceCity: provinceS,
//         district: districtS,
//         wardSubdistrict: wardSubdistrictS,
//         defaultAddress: defaultAddress
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updatedAddress)
//         });

//         if (response.ok) {
//             alert('Cập nhật địa chỉ thành công!');
//             const modal = bootstrap.Modal.getInstance(document.getElementById('updateAddressModal'));
//             modal.hide();
//             loadUserAddresses();
//         } else {
//             const error = await response.json();
//             alert('Cập nhật thất bại: ' + (error.message || 'Lỗi không xác định'));
//         }
//     } catch (error) {
//         console.error('Lỗi khi cập nhật địa chỉ:', error);
//         alert('Đã xảy ra lỗi trong quá trình cập nhật địa chỉ. Vui lòng thử lại sau.');
//     }

//     // Reset District and Ward Select elements when changing Province or District
//     function resetSelectOptions(selectId, defaultText = "Chọn") {
//         const selectElement = document.getElementById(selectId);
//         selectElement.innerHTML = `<option value="">${defaultText}</option>`;
//     }

//     // Lắng nghe sự kiện thay đổi tỉnh thành phố
//     document.getElementById('provinceS').addEventListener('change', async function () {
//         const provinceCode = this.value;

//         // Nếu tỉnh thành phố thay đổi thì reset Quận/Huyện và Phường/Xã
//         if (provinceCode) {
//             resetSelectOptions('districtS', 'Chọn Quận/Huyện');
//             resetSelectOptions('wardSubdistrictS', 'Chọn Phường/Xã');
//             await loadOptionsFromAPI(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, 'districtS');
//         } else {
//             resetSelectOptions('districtS', 'Chọn Quận/Huyện');
//             resetSelectOptions('wardSubdistrictS', 'Chọn Phường/Xã');
//         }
//     });

//     // Lắng nghe sự kiện thay đổi quận huyện
//     document.getElementById('districtS').addEventListener('change', async function () {
//         const districtCode = this.value;

//         // Nếu quận huyện thay đổi thì reset Phường/Xã
//         if (districtCode) {
//             resetSelectOptions('wardSubdistrictS', 'Chọn Phường/Xã');
//             await loadOptionsFromAPI(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, 'wardSubdistrictS');
//         } else {
//             resetSelectOptions('wardSubdistrictS', 'Chọn Phường/Xã');
//         }
//     });

//     // Hàm tải lại dữ liệu cho dropdown
//     async function loadOptionsFromAPI(apiUrl, selectId, defaultValue = null) {
//         const selectElement = document.getElementById(selectId);
//         if (!selectElement) {
//             console.error(`Không tìm thấy phần tử: ${selectId}`);
//             return;
//         }

//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);

//             const data = await response.json();
//             console.log(`Dữ liệu từ API (${apiUrl}):`, data);

//             selectElement.innerHTML = '<option value="">Chọn</option>';

//             const items = data.districts || data.wards || [];
//             items.forEach(item => {
//                 const option = document.createElement('option');
//                 option.value = item.code;
//                 option.textContent = item.name;
//                 if (item.name === defaultValue) option.selected = true;
//                 selectElement.appendChild(option);
//             });

//         } catch (error) {
//             console.error('Lỗi tải danh sách:', error);
//             selectElement.innerHTML = '<option value="">Không thể tải dữ liệu</option>';
//         }
//     }
// }

  
///////////////////////////////////////////////////////////////////////////////////////////


// tải trang
document.addEventListener('DOMContentLoaded', function () {
    var addressModal = document.getElementById('addressModal');
    
    if (!addressModal) {
        return; // Ngăn script chạy tiếp nếu không tìm thấy modal
    }

    var modalInstance = new bootstrap.Modal(addressModal);

    var modalTrigger = document.querySelector('[data-bs-toggle="modal"]');
    if (modalTrigger) {
        modalTrigger.addEventListener('click', function () {
            modalInstance.show();
        });
    } else {
    }

    addressModal.addEventListener('hidden.bs.modal', function () {
        console.log('Modal đã được đóng');
    });

    addressModal.addEventListener('shown.bs.modal', function () {
        console.log('Modal đã được hiển thị');
    });
});
//////////////////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("petForm").addEventListener("submit", function (event) {
//         event.preventDefault();
//         savePetInfo();
//     });
// });
////////////////////////////////////

function setupSaveAddressEvent(addressId) {
    console.log(`🔄 Gán lại sự kiện "Lưu" cho địa chỉ ID: ${addressId}`);

    const saveButton = document.getElementById('saveAddressBtn');
    if (!saveButton) {
        console.error('❌ Không tìm thấy nút "Lưu"!');
        return;
    }

    saveButton.removeEventListener('click', saveUpdatedAddress);
    saveButton.addEventListener('click', function () {
        saveUpdatedAddress(addressId);
    });
}

function populateUpdateAddressForm(address) {
    console.log('📋 Điền dữ liệu vào form cập nhật...');
   
    // document.getElementById('addressId').value = address.addressId ||'';
    document.getElementById('recipientName').value = address.recipientName || '';
    document.getElementById('phoneNumber').value = address.phoneNumber || '';
    document.getElementById('addressDetail').value = address.addressDetail || '';
    document.getElementById('defaultAddress').checked = address.defaultAddress || false;
    // document.getElementById('saveAddressBtn').setAttribute('data-address-id', address.id);

    console.log('✅ Điền xong dữ liệu, tiếp tục tải danh sách tỉnh/thành phố...');
    loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceS', address.provinceCity);
    loadOptionsFromAPI('https://provinces.open-api.vn/api/d/', 'districtS', address.district);
    loadOptionsFromAPI('https://provinces.open-api.vn/api/w/', 'wardSubdistrictS', address.wardSubdistrict);
}



async function saveUpdatedAddress() {
    console.log('📌 Bắt đầu quá trình cập nhật địa chỉ...');
    const userId = await getUserId();
    if (!userId) {
        console.error('❌ Không thể lấy userId.');
        alert('Không thể lấy thông tin người dùng.');
        return;
    }

    const currentAddressId = document.getElementById('addressId').value;

    const updatedData = {
        recipientName: document.getElementById('recipientName').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        addressDetail: document.getElementById('addressDetail').value.trim(),
        provinceCity: document.getElementById('provinceS').selectedOptions[0]?.text || '',
        district: document.getElementById('districtS').selectedOptions[0]?.text || '',
        wardSubdistrict: document.getElementById('wardSubdistrictS').selectedOptions[0]?.text || '',
        defaultAddress: document.getElementById('defaultAddress').checked
    };

    console.log('📋 Dữ liệu gửi lên API:', updatedData);

    try {
        const response = await fetch(`http://localhost:8080/api/addresses/update/user/${userId}/address/${currentAddressId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('Lỗi khi cập nhật địa chỉ');

        console.log('✅ Cập nhật thành công! Làm mới danh sách địa chỉ...');
        alert('Cập nhật địa chỉ thành công!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('updateAddressModal'));
        modal.hide();
        loadUserAddresses(); // Cập nhật danh sách địa chỉ sau khi sửa thành công
    } catch (error) {
        // console.error('❌ Lỗi khi cập nhật địa chỉ:', error);
        // alert('Không thể cập nhật địa chỉ. Vui lòng thử lại sau.');
    }
}