document.addEventListener('DOMContentLoaded', function () {
    // Quản lý Modal
    const addressModal = document.getElementById('addressModal');
    const modalInstance = new bootstrap.Modal(addressModal);

    const modalTrigger = document.querySelector('[data-bs-toggle="modal"]');
    if (modalTrigger) {
        modalTrigger.addEventListener('click', () => {
            // Tải lại các tỉnh/thành phố khi mở modal
            loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceSelect');
            modalInstance.show();
        });
    }

    // Hàm tải tỉnh/thành phố vào dropdown
    async function loadOptionsFromAPI(apiUrl, selectId, defaultValue = null) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) return;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            selectElement.innerHTML = '<option value="">Chọn</option>';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.code;
                option.textContent = item.name;
                if (item.name === defaultValue) option.selected = true;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading options:', error);
            selectElement.innerHTML = '<option value="">Không thể tải dữ liệu</option>';
        }
    }

    // Khi chọn tỉnh, tải quận
    document.getElementById('provinceSelect').addEventListener('change', async function () {
        const provinceCode = this.value;
        if (provinceCode) {
            await loadOptionsFromAPI(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, 'districtSelect');
        } else {
            document.getElementById('districtSelect').innerHTML = '<option value="">Chọn quận/huyện</option>';
            document.getElementById('wardSelect').innerHTML = '<option value="">Chọn phường/xã</option>';
        }
    });

    // Khi chọn quận, tải phường/xã
    document.getElementById('districtSelect').addEventListener('change', async function () {
        const districtCode = this.value;
        if (districtCode) {
            await loadOptionsFromAPI(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, 'wardSelect');
        } else {
            document.getElementById('wardSelect').innerHTML = '<option value="">Chọn phường/xã</option>';
        }
    });

    // 3. Kiểm tra đăng nhập và lấy userId
    async function getUserId() {
        try {
            const response = await fetch('http://localhost:8080/api/auth/check-login');
            if (!response.ok) throw new Error('Không thể lấy userId');
            const data = await response.json();
            return data.userId;
        } catch (error) {
            console.error('Error fetching user ID:', error);
            return null;
        }
    }

    // 4. Thêm địa chỉ mới
    document.getElementById('addressForm')?.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userId = await getUserId();
        if (!userId) {
            alert('Please log in to submit an address.');
            return;
        }

        const formData = {
            userId,
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
                alert('Address added successfully.');
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

    // 5. Hiển thị danh sách địa chỉ của người dùng
    async function loadUserAddresses() {
        const userId = await getUserId();
        if (!userId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/addresses/user/${userId}`);
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

    // 5.1 Render từng địa chỉ trong card
    function renderAddressCard(address) {
        return `
            <div class="card custom-card">
                <div class="card-body">
                    <h5 class="card-title">${address.recipientName}</h5>
                    <button class="btn btn-outline-lg btn-sm" onclick="loadAddressIntoModal(${address.id})">Edit</button>
                    <button class="btn btn-outline-lg btn-sm" onclick="deleteAddress(${address.id})">Delete</button>
                    <p>${address.phoneNumber}</p>
                    <p>${address.addressDetail}, ${address.wardSubdistrict}, ${address.district}, ${address.provinceCity}</p>
                    ${address.defaultAddress ? '<small class="text-muted">Default</small>' : ''}
                </div>
            </div>
        `;
    }

    // 6. Xóa địa chỉ
    async function deleteAddress(addressId) {
        const userId = await getUserId();
        if (!userId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/addresses/delete/${userId}/${addressId}`, {
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

    // 7. Cập nhật địa chỉ
    async function loadAddressIntoModal(addressId) {
        try {
            const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`);
            if (!response.ok) throw new Error('Failed to fetch address');
            const address = await response.json();

            document.getElementById('addressId').value = address.id;
            document.getElementById('recipientName').value = address.recipientName;
            document.getElementById('phoneNumber').value = address.phoneNumber;
            document.getElementById('addressDetail').value = address.addressDetail;
            document.getElementById('defaultAddress').checked = address.defaultAddress;

            loadOptionsFromAPI('https://provinces.open-api.vn/api/p/', 'provinceSelect', address.provinceCity);
            loadOptionsFromAPI('https://provinces.open-api.vn/api/d/', 'districtSelect', address.district);
            loadOptionsFromAPI('https://provinces.open-api.vn/api/w/', 'wardSelect', address.wardSubdistrict);

            const updateModal = new bootstrap.Modal(document.getElementById('updateAddressModal'));
            updateModal.show();
        } catch (error) {
            console.error('Error loading address into modal:', error);
        }
    }

    // Gọi hàm để tải danh sách địa chỉ khi trang tải
    loadUserAddresses();
});
