// // Fetch provinces data and populate the select box
// function fetchProvinces() {
//     fetch('https://provinces.open-api.vn/api/p/') // API for provinces in Vietnam
//         .then(response => response.json())
//         .then(data => {
//             const provinceSelect = document.getElementById('provinceCity');
//             provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>';
//             data.forEach(province => {
//                 const option = document.createElement('option');
//                 option.value = province.code;
//                 option.textContent = province.name;
//                 provinceSelect.appendChild(option);
//             });
//         })
//         .catch(error => console.error('Error fetching provinces:', error));
// }

// // Fetch districts data based on selected province
// function fetchDistricts() {
//     const provinceCode = document.getElementById('provinceCity').value;
//     if (!provinceCode) return;

//     fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`) // API for districts in a province
//         .then(response => response.json())
//         .then(data => {
//             const districtSelect = document.getElementById('district');
//             districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
//             data.districts.forEach(district => {
//                 const option = document.createElement('option');
//                 option.value = district.code;
//                 option.textContent = district.name;
//                 districtSelect.appendChild(option);
//             });
//         })
//         .catch(error => console.error('Error fetching districts:', error));
// }

// // Initialize the provinces dropdown when the modal is opened
// $('#updateAddressModal').on('shown.bs.modal', fetchProvinces);