


// Lấy thông tin người dùng và điền vào form
async function loadUserInfo() {
    // Lấy userId từ API check-login
    const userId = await getUserId();
    if (userId) {
        // Sau khi có userId, gọi API để lấy thông tin người dùng
        getUserInfo(userId);
    } else {
        console.error("Không có userId, không thể lấy thông tin người dùng.");
    }
}

// Hàm lấy userId từ API check-login
async function getUserId() {
    try {
        const response = await fetch('/api/auth/check-login');
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin đăng nhập');
        }
        const data = await response.json();
        return data.userId;  // Giả sử API trả về userId trong response
    } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
        return null;
    }
}

// Lấy thông tin người dùng từ API
async function getUserInfo(userId) {
    try {
        const response = await fetch(`/api/auth/info/${userId}`);
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin người dùng');
        }
        const userData = await response.json();
        populateForm(userData);  // Hiển thị thông tin lên form
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
    }
}

// Điền thông tin người dùng vào form
function populateForm(userData) {
    const usernameField = document.querySelector("input[type='text'][readonly]");
    const emailField = document.querySelector("input[type='email']");
    const phoneNumberField = document.querySelector("input[type='tel']");
    const genderRadios = document.getElementsByName("gender");
    const birthdayField = document.querySelector("input[type='date']");

    const avatarImages = document.querySelectorAll(".avatar"); // Chọn thẻ img có id="avatar"


    if (userData.username) {
        usernameField.value = userData.username;
    }

    if (userData.email) {
        emailField.value = userData.email;
    }

    if (userData.phonenumber) {
        phoneNumberField.value = userData.phonenumber;
    }

    if (userData.gender) {
        for (let radio of genderRadios) {
            if (radio.value === userData.gender) {
                radio.checked = true;
                break;
            }
        }
    }

    if (userData.birthday) {
        birthdayField.value = userData.birthday;
    }
    // if(userData.url){
    //     avatarImage.src=userData.url;
    // }else{
    //     avatarImage.src="./img/default-avata.png"
    // }
     // Kiểm tra nếu có URL ảnh, nếu không thì sử dụng ảnh mặc định
     const imageUrl = userData.url || './img/default-avata.png';  // Nếu không có URL ảnh thì sử dụng ảnh mặc định

     // Cập nhật tất cả các thẻ ảnh với class "avatar"
     avatarImages.forEach(avatarImage => {
         avatarImage.src = imageUrl;
     });
}
/////////////////////////////////////////// đoạn nayyf không sai nhưng thiếu cập nhật ảnh
// Hàm để gửi thông tin cập nhật đến server
// Hàm để gửi thông tin cập nhật đến server mà không cần tham số
// Hàm để gửi thông tin cập nhật đến server
// async function updateUserInfo() {
//     try {
//         const userId = await getUserId();  // Lấy userId từ API
//         if (!userId) {
//             alert('Không có thông tin người dùng. Vui lòng đăng nhập.');
//             return;
//         }

//         // Lấy thông tin mới từ các trường trong form
//         const userDetails = {
//             email: document.querySelector('input[type="email"]').value,
//             phonenumber: document.querySelector('input[type="tel"]').value,
//             gender: document.querySelector('input[name="gender"]:checked').value,
//             birthday: document.querySelector('input[type="date"]').value,
//         };

//         // Đảm bảo API URL là chính xác
//         const response = await fetch(`/api/auth/${userId}`, {  // Đảm bảo URL chính xác, thêm "info" nếu cần
//             method: 'PUT',  // Cập nhật phương thức PUT
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userDetails),
//         });

//         if (response.ok) {
//             const updatedUser = await response.json();
//             alert('Cập nhật thành công!');
//             loadUserInfo();  // Cập nhật lại thông tin sau khi lưu
//         } else {
//             alert('Có lỗi xảy ra khi cập nhật thông tin.');
//         }
//     } catch (error) {
//         console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
//         alert('Có lỗi xảy ra. Vui lòng thử lại.');
//     }
// }

// // Cập nhật thông tin người dùng khi thay đổi form
// document.querySelector('form').addEventListener('submit', async function (e) {
//     e.preventDefault();  // Ngừng hành động mặc định của form

//     // Kiểm tra nếu có thay đổi trong form (optional, giúp tránh gửi yêu cầu không cần thiết)
//     const emailField = document.querySelector('input[type="email"]').value;
//     const phonenumberField = document.querySelector('input[type="tel"]').value;
//     const genderField = document.querySelector('input[name="gender"]:checked').value;
//     const birthdayField = document.querySelector('input[type="date"]').value;

//     const userData = await getUserInfo(userId); // Lấy thông tin người dùng từ API

//     // Kiểm tra nếu các trường thông tin đã thay đổi
//     if (
//         userData.email === emailField &&
//         userData.phonenumber === phonenumberField &&
//         userData.gender === genderField &&
//         userData.birthday === birthdayField
//     ) {
//         alert("Không có thay đổi nào để cập nhật.");
//         return; // Nếu không có thay đổi, dừng việc gửi yêu cầu
//     }

//     // Gọi hàm cập nhật thông tin nếu có thay đổi
//     updateUserInfo(); 
// });
//////////////////////////////////////////////////////////////////////////////////////
async function updateUserInfo() {
    try {
        const userId = await getUserId();  // Lấy userId từ API
        if (!userId) {
            alert('Không có thông tin người dùng. Vui lòng đăng nhập.');
            return;
        }

        // Tạo FormData để gửi kèm với ảnh và thông tin người dùng
        const formData = new FormData();
        formData.append('email', document.querySelector('input[type="email"]').value);
        formData.append('phonenumber', document.querySelector('input[type="tel"]').value);
        formData.append('gender', document.querySelector('input[name="gender"]:checked').value);
        formData.append('birthday', document.querySelector('input[type="date"]').value);

        // Lấy tệp ảnh (nếu có) và thêm vào formData
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0]; // Lấy tệp ảnh đầu tiên
        if (file) {
            formData.append('file', file);  // Thêm ảnh vào formData
        }

        // Gửi yêu cầu PUT với dữ liệu multipart
        const response = await fetch(`/api/auth/${userId}`, {
            method: 'PUT',
            body: formData, // Gửi formData thay vì JSON
        });

        if (response.ok) {
            const updatedUser = await response.json();
            alert('Cập nhật thành công!');
            loadUserInfo();  // Cập nhật lại thông tin sau khi lưu
        } else {
            const error = await response.text();  // Lấy lỗi từ server
            alert(`Có lỗi xảy ra khi cập nhật thông tin: ${error}`);
        }
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
    updateAvatarImage();
}


function updateAvatarImage() {
    fetch('/api/auth/check-login', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                const userId = data.userId;

                // Gọi API để lấy thông tin người dùng
                fetch(`/api/auth/info/${userId}`, { credentials: 'include' })
                    .then(response => response.json())
                    .then(userInfo => {
                        const avatarImage = document.getElementById("avata");

                        // Kiểm tra nếu có URL ảnh người dùng
                        if (userInfo.url) {
                            avatarImage.src = userInfo.url;  // Cập nhật ảnh đại diện
                        } else {
                            avatarImage.src = './img/default-avata.png';  // Nếu không có ảnh, dùng ảnh mặc định
                        }
                    })
                    .catch(error => console.error('Lỗi khi lấy thông tin người dùng:', error));
            }
        })
        .catch(error => console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error));
}

////////////////////////////////////

// Tải thông tin người dùng khi trang được tải
loadUserInfo();

// Lắng nghe sự kiện thay đổi của input file
document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileInput = event.target;
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "Chưa chọn ảnh";
    document.getElementById('fileName').textContent = "file đã được chọn: " + fileName;
});
