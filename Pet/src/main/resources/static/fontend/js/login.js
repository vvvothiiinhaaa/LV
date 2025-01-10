const registerLink = document.querySelector("#register-link"); // ID của link đăng ký
const loginLink = document.querySelector("#login-link"); // ID của link đăng nhập

//Sự kiện kích hoạt lật thẻ
registerLink.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".login-form").style.transform = "rotateY(180deg)";
  document.querySelector(".register-form").style.transform = "rotateY(0deg)";
  //Điều chỉnh wrapper
  let wrapperElement = document.querySelector(".wrapper");
  if (wrapperElement) {
    wrapperElement.style.height = "650px";
  } else {
    console.log('Phần tử với class "wrapper" không tồn tại trong tài liệu.');
  }
  //Điều chỉnh title
  document.title = "Đăng ký";
});
loginLink.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".login-form").style.transform = "rotateY(0deg)";
  document.querySelector(".register-form").style.transform = "rotateY(180deg)";
  //Điều chỉnh wrapper
  let wrapperElement = document.querySelector(".wrapper");
  if (wrapperElement) {
    wrapperElement.style.height = "650px";
  } else {
    console.log('Phần tử với class "wrapper" không tồn tại trong tài liệu.');
  }
  //Điều chỉnh title
  document.title = "Đăng nhập";
});
// End sự kiện kích hoạt lật thẻ

// //tạo sự kiện cho show/hide password
// showHidePasswordLogin.addEventListener("click", function () {
//   // thay đổi thẻ và ẩn/hiện text
//   if (showHidePasswordLogin.classList.contains("fa-lock")) {
//     //Hiện text
//     passwordFieldLogin.type = "text";
//     showHidePasswordLogin.classList.remove("fa-lock");
//     showHidePasswordLogin.classList.add("fa-unlock");
//   } else {
//     //ẩn text
//     passwordFieldLogin.type = "password";
//     showHidePasswordLogin.classList.remove("fa-unlock");
//     showHidePasswordLogin.classList.add("fa-lock");
//   }
// });
// showHidePasswordRegister.addEventListener("click", function () {
//   // thay đổi thẻ và ẩn/hiện text
//   if (showHidePasswordRegister.classList.contains("fa-lock")) {
//     // hiện text
//     passwordFieldRegister.type = "text";
//     showHidePasswordRegister.classList.remove("fa-lock");
//     showHidePasswordRegister.classList.add("fa-unlock");
//   } else {
//     // ẩn text
//     passwordFieldRegister.type = "password";
//     showHidePasswordRegister.classList.remove("fa-unlock");
//     showHidePasswordRegister.classList.add("fa-lock");
//   }
// });
// showHidePasswordRegisterAgain.addEventListener("click", function () {
//   // thay đổi thẻ và ẩn/ hiện text
//   if (showHidePasswordRegisterAgain.classList.contains("fa-lock")) {
//     //hiện text
//     passwordFieldAgainRegister.type = "text";
//     showHidePasswordRegisterAgain.classList.remove("fa-lock");
//     showHidePasswordRegisterAgain.classList.add("fa-unlock");
//   } else {
//     //Ẩn text
//     passwordFieldAgainRegister.type = "password";
//     showHidePasswordRegisterAgain.classList.remove("fa-unlock");
//     showHidePasswordRegisterAgain.classList.add("fa-lock");
//   }
// });
//End tạo sự kiện cho show/hide password

// chức năng đăng kí
// Đăng ký 
function register() {
  const username = document.getElementById("username").value.trim();
  const passwords = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  console.log("Hàm register được gọi với:", { username, password, confirmPassword });

  // Gửi yêu cầu đăng ký tới backend
  fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        passwords: passwords,
        confirmPassword: confirmPassword
    })
  })
  .then((response) => {
      // Đọc phản hồi dưới dạng văn bản và kiểm tra mã trạng thái
      return response.text().then((data) => {
          if (!response.ok) {
              // Nếu phản hồi không phải là 2xx, ném lỗi
              throw new Error(data || "Đã xảy ra lỗi");
          }
          // Nếu dữ liệu không phải JSON, xử lý dưới dạng văn bản
          try {
              return JSON.parse(data);  // Nếu có thể, thử phân tích JSON
          } catch (e) {
              return data;  // Nếu không phải JSON, trả về dữ liệu dưới dạng văn bản
          }
      });
  })
  .then((data) => {
      console.log("Dữ liệu trả về từ API:", data);

      // Nếu dữ liệu là văn bản, hiển thị thông báo thành công
      if (typeof data === 'string') {
          alert(data);  // Hiển thị thông báo như "Đăng ký thành công"
      } else {
          // Xử lý dữ liệu JSON nếu có (ví dụ: lỗi hoặc thông tin khác)
          alert("Đăng ký thành công!");
          window.location.href = ""; // Thay đổi đường dẫn nếu cần
      }
  })
  .catch((error) => {
      console.error("Lỗi khi đăng ký:", error);     
      document.getElementById("error-message").innerText = error.message;  // Hiển thị lỗi trong giao diện
  });
}
