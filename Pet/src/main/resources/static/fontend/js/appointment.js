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
                window.location.href="./profile.html";
            } else {
                // Nếu có dữ liệu, hiển thị danh sách thú cưng
                data.forEach(pet => {
                    const option = document.createElement('option');
                    option.value = pet.id;
                    option.textContent = pet.name;
                    petSelect.appendChild(option);
                });
            }

            petSelect.classList.add('custom-select');

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
                placeholder: "Chọn Dịch Vụ",
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
//// kiểm tra lịch còn trống

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("appDate");
    const timeSelect = document.getElementById("time");

    // Lấy ngày hiện tại và định dạng thành 'YYYY-MM-DD' theo múi giờ của người dùng
    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-CA'); // Đảm bảo định dạng là 'YYYY-MM-DD'

    // Cập nhật thuộc tính min của input ngày để ngăn chọn ngày trong quá khứ
    dateInput.setAttribute("min", formattedToday);

    // Khi người dùng chọn ngày
    dateInput.addEventListener("change", function () {
        const selectedDate = dateInput.value;

        if (!selectedDate) return; // Không làm gì nếu chưa chọn ngày

        // Gọi API kiểm tra khung giờ trống
        fetch(`http://localhost:8080/api/appointments/available-slots?date=${selectedDate}`)
            .then(response => response.json())
            .then(availableSlots => {
                updateAvailableTimes(availableSlots);
            })
            .catch(error => console.error("Lỗi khi tải khung giờ:", error));
    });

    // Cập nhật danh sách khung giờ
    function updateAvailableTimes(availableSlots) {
        const allTimeSlots = [
            "09:00-10:30", "11:00-12:00", "12:30-14:00",
            "14:00-15:30", "16:00-17:30", "18:00-19:30", "20:00-21:20"
        ];

        const formattedAvailableSlots = availableSlots.map(slot => slot.substring(0, 5)); // ["09:00", "11:00", ...]

        // Lấy ngày được chọn
        const selectedDate = document.getElementById("appDate").value;
        const today = new Date();
        const isToday = selectedDate === today.toISOString().split('T')[0];

        // Lấy giờ hiện tại (nếu là hôm nay)
        const nowHours = today.getHours();
        const nowMinutes = today.getMinutes();
        const currentMinutes = nowHours * 60 + nowMinutes;

        // Reset trạng thái tất cả option
        timeSelect.querySelectorAll("option").forEach(option => {
            option.disabled = false;
        });

        allTimeSlots.forEach(slot => {
            const slotStartTime = slot.split("-")[0]; // ví dụ "14:00"

            // Nếu không có trong danh sách giờ trống từ API
            if (!formattedAvailableSlots.includes(slotStartTime)) {
                const option = timeSelect.querySelector(`option[value="${slot}"]`);
                if (option) option.disabled = true;
                option.style.color = "red";
                return;
            }

            // Nếu là hôm nay, kiểm tra giờ hiện tại
            if (isToday) {
                const [h, m] = slotStartTime.split(":").map(Number);
                const slotMinutes = h * 60 + m;

                // Nếu khung giờ bắt đầu trước thời điểm hiện tại => disable
                if (slotMinutes <= currentMinutes) {
                    const option = timeSelect.querySelector(`option[value="${slot}"]`);
                    if (option) option.disabled = true;
                    option.style.color = "red";
                }
            }
        });
    }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            document.getElementById('appointmentForm').reset();

            // Reset toàn bộ form
            const form = document.getElementById('appointmentForm');
            form.reset();

            // Reset select bằng cách đặt selectedIndex về -1 (không chọn mục nào)
            document.getElementById('appointmentForm').reset();
            document.getElementById('pet').selectedIndex = 0;
            document.getElementById('service').selectedIndex = -1;            
            document.getElementById('time').selectedIndex = 0; // Chọn lại giá trị đầu tiên
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
