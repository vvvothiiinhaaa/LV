// Hàm để lấy userId từ API check-login
async function getUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        const data = await response.json();
        if (data && data.userId) {
            return data.userId; // Trả về giá trị userId thực tế
        } else {
            throw new Error('Không tìm thấy userId');
        }
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        throw error; // Ném lỗi để dễ dàng xử lý ở bên ngoài
    }
}

// Hàm để lấy danh sách thú cưng của userId và hiển thị lên form
// function getPets(userId) {
//     fetch(`/pets/user/${userId}`)
//         .then(response => response.json())
//         .then(data => {
//             const petSelect = document.getElementById('pet');
//             petSelect.innerHTML = '';  // Xóa tất cả các option hiện có

//             // Kiểm tra nếu dữ liệu trả về là null hoặc rỗng
//             if (!data || data.length === 0) {
//                 // Thêm option mặc định cho phép người dùng nhập tên thú cưng
//                 const option = document.createElement('option');
//                 option.value = '';  // Đặt giá trị là rỗng
//                 option.textContent = 'Chưa có thú cưng, vui lòng thêm thú cưng trong hồ sơ của tôi';
//                 petSelect.appendChild(option);

//                 // Hiển thị thông báo yêu cầu người dùng thêm thông tin thú cưng
//                 alert('Lịch sử đặt lịch sẽ không được lưu trữ. Người dùng vui lòng thêm thông tin thú cưng tại hồ sơ của tôi.');
//             } else {
//                 // Nếu có dữ liệu, hiển thị danh sách thú cưng
//                 data.forEach(pet => {
//                     const option = document.createElement('option');
//                     option.value = pet.id;
//                     option.textContent = pet.name;
//                     petSelect.appendChild(option);
//                 });
//             }
//         })
//         .catch(error => {
//             console.error('Lỗi khi gọi API lấy thú cưng:', error);
//         });
// }

function getPets(userId) {
    fetch(`/pets/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            const petSelect = document.getElementById('pet');
            petSelect.innerHTML = '';  // Xóa tất cả các option hiện có

            // Kiểm tra nếu dữ liệu trả về là null hoặc rỗng
            if (!data || data.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Chưa có thú cưng, vui lòng thêm thú cưng trong hồ sơ của tôi';
                petSelect.appendChild(option);
                alert('Lịch sử đặt lịch sẽ không được lưu trữ. Người dùng vui lòng thêm thông tin thú cưng tại hồ sơ của tôi.');
            } else {
                // Nếu có dữ liệu, hiển thị danh sách thú cưng
                data.forEach(pet => {
                    const option = document.createElement('option');
                    option.value = pet.id;
                    option.textContent = pet.name;
                    petSelect.appendChild(option);
                });
            }

            // Khởi tạo Select2 để cho phép chọn nhiều mục
            $('#pet').select2({
                placeholder: "Chọn thú cưng",
                allowClear: true
            });
        })
        .catch(error => {
            console.error('Lỗi khi gọi API lấy thú cưng:', error);
        });
}



// Hàm để lấy danh sách dịch vụ từ API
function getServices() {
    fetch('/services/all') 
        .then(response => response.json()) 
        .then(data => {
            const serviceSelect = document.getElementById('service');  
            serviceSelect.innerHTML = '';  

            // Duyệt qua dữ liệu trả về (danh sách dịch vụ) và thêm các option vào select
            data.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;  
                option.textContent = service.name; 
                serviceSelect.appendChild(option);  
            });
               // Khởi tạo Select2 để cho phép chọn nhiều mục
               $('#service').select2({
                placeholder: "Chọn thú cưng",
                allowClear: true
            });
        })
        .catch(error => {
            console.error('Lỗi khi gọi API lấy dịch vụ:', error);
        });
}


// Gọi hàm getUserId để lấy userId và sau đó gọi getPets với userId
window.onload = function() {
    getUserId().then(userId => {
        if (userId) {
            getPets(userId); 
            getServices();  
        }
    });
};



// Gọi hàm getUserId và sau đó gọi getPets và getServices
window.onload = function() {
    getUserId().then(userId => {
        if (userId) {
            getPets(userId); 
            getServices();
        }
    });
};
// Hàm xử lý khi người dùng submit form
// Hàm xử lý khi người dùng submit form
async function handleSubmit(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form

    // Lấy thông tin từ form
    const userId = await getUserId(); // Đảm bảo bạn đang chờ giá trị userId
    const petIds = Array.from(document.getElementById('pet').selectedOptions).map(option => parseInt(option.value));
    const serviceIds = Array.from(document.getElementById('service').selectedOptions).map(option => parseInt(option.value));
    const timeSlot = document.getElementById('time').value;
    const appDate = document.getElementById('appDate').value;

    // In dữ liệu ra console để kiểm tra
    console.log({
        userId, petIds, serviceIds, timeSlot, appDate
    });

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!petIds.length || !serviceIds.length || !timeSlot || !appDate) {
        alert("Vui lòng chọn đầy đủ thông tin!");
        return;
    }

    // Gửi dữ liệu đặt lịch đến backend
    fetch('http://localhost:8080/api/appointments/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            petIds: petIds,
            serviceIds: serviceIds,
            slot: timeSlot,
            appDate: appDate,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.status === 'Đã đặt lịch') {
            alert("Đặt lịch thành công!");
        } else {
            alert("Đặt lịch thất bại. Vui lòng thử lại." + data.message);
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu đặt lịch:", error);
        alert("Đặt lịch thất bại. Vui lòng thử lại.");
    });
}


// Gắn sự kiện submit cho form
const form = document.getElementById('appointmentForm');
form.addEventListener('submit', handleSubmit);
