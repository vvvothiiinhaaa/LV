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
