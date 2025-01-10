
  //
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");
  
  
  menuCloseButton.addEventListener("click" , () => menuOpenButton.click());
  
  // list danh mục sản phẩm
  const swiper = new Swiper('.slider-wrapper', {
  
      loop: true,
      spaceBetween:25,
    
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable:true,
        dynamicBullets:true,
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
          0: {
              slidesPerView :1
          },
          768: {
              slidesPerView :2
          },
          1024: {
              slidesPerView :3
          },
      }
    });
  
  
    // cuộn đến các section tương ứng
    document.addEventListener('DOMContentLoaded', () => {
      // Lắng nghe sự kiện click của tất cả các liên kết nav
      document.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', function(event) {
              event.preventDefault(); // Ngừng hành vi mặc định của liên kết (không reload trang)
  
              // Lấy id của section từ href của link
              const targetSectionId = this.getAttribute('href').substring(1); // Loại bỏ dấu '#' ở đầu
              const targetSection = document.getElementById(targetSectionId);
  
              // Kiểm tra xem phần tử có tồn tại không
              if (targetSection) {
                  targetSection.scrollIntoView({
                      behavior: 'smooth', // Cuộn mượt
                      block: 'start' // Cuộn đến vị trí bắt đầu của phần tử
                  });
              }
          });
      });
  });


  // hiển thị sản phẩm và tạo các div sản phẩm
/**
 * Tạo phần tử HTML hiển thị sản phẩm theo giao diện yêu cầu.
 * @param {Object} product - Đối tượng sản phẩm.
 * @returns {HTMLElement} - Thẻ HTML chứa sản phẩm.
 */
function createProductItem(product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-card");
  
    // Kiểm tra trạng thái còn hàng
    const stockStatus = product.quantity === 0 
      ? '<span style="color:blue; font-weight:bold;">(HẾT HÀNG)</span>' 
      : "";
      const imageUrl = product.url.replace(/.*\/html\//, "/img/");

    // Nội dung HTML của sản phẩm
    productDiv.innerHTML = `
    <a href="product-detailt.html?id=${product.id}"> 
    <div class="product-image-container">
        <img src="${imageUrl || 'default-image.png'}" class="product-image">
      </div>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-price">
        ${formatPrice(product.price)} VND ${stockStatus}
      </div>
    
        </a>
    `;
 
     
    // <button class="btn btn-info" onclick="location.href='product-detailt.html?id=${product.id}'">Mua Ngay</button>

    return productDiv;
  }
  
  /**
   * Hàm tải và hiển thị danh sách sản phẩm từ API.
   * @param {string} apiUrl - Đường dẫn API.
   * @param {string} containerId - ID của thẻ chứa sản phẩm.
   */
  function loadProducts(apiUrl, containerId) {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const productContainer = document.getElementById(containerId);
        productContainer.innerHTML = ""; // Xóa nội dung cũ
  
        data.forEach((product) => {
          const productDiv = createProductItem(product);
          productContainer.appendChild(productDiv);
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      });
  }
  
  /**
   * Định dạng giá tiền với dấu phân cách hàng nghìn.
   * @param {number} price - Giá tiền.
   * @returns {string} - Chuỗi giá đã được định dạng.
   */
  function formatPrice(price) {
    return price.toLocaleString("vi-VN");
  }
   // Gọi hàm khi trang được tải
   document.addEventListener("DOMContentLoaded", function () {
    loadProducts("http://localhost:8080/api/products", "best-sellers");
  });


  // // Lấy tham số 'id' từ URL
  // const urlParams = new URLSearchParams(window.location.search);
  // const productId = urlParams.get("id");

  // if (productId) {
  //     // Lấy dữ liệu sản phẩm từ API bằng productId
  //     fetch(`/api/products/${productId}`)  // API lấy thông tin sản phẩm và ảnh chính
  //         .then(response => response.json())
  //         .then(product => {
  //             // Cập nhật thông tin sản phẩm trên giao diện
  //             document.getElementById('productName').innerText = product.name;
  //             document.getElementById('productPrice').innerText = product.price;
  //             document.getElementById('productDescription').innerText = product.description;
  //             document.getElementById('productColor').innerText = product.color;

  //             // Cập nhật ảnh chính
  //             document.getElementById('mainImage').src = product.imageUrl;

  //             // Cập nhật các màu sắc (nếu có)
  //             let productColors = document.getElementById('productColors');
  //             product.colors.forEach(color => {
  //                 let span = document.createElement('span');
  //                 span.style.backgroundColor = color;
  //                 productColors.appendChild(span);
  //             });
  //         })
  //         .catch(error => console.error('Error fetching product details:', error));

  //     // Lấy các ảnh lựa chọn từ API
  //     fetch(`/api/products/img/${productId}`)  // API lấy các ảnh lựa chọn
  //         .then(response => response.json())
  //         .then(images => {
  //             let imageOptions = document.getElementById('imageOptions');
  //             images.forEach(url => {
  //                 let img = document.createElement('img');
  //                 img.src = url;
  //                 img.onclick = () => { 
  //                     document.getElementById('mainImage').src = url; 
  //                 };
  //                 imageOptions.appendChild(img);
  //             });
  //         })
  //         .catch(error => console.error('Error fetching product images:', error));
  // } else {
  //     console.error('Product ID not found in URL');
  // }




