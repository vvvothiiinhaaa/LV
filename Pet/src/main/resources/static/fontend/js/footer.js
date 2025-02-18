// Sử dụng fetch để gọi tệp footer.html
fetch('footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // Chèn nội dung của footer.html vào div có id="footer"
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => {
        console.error('Có lỗi xảy ra khi tải footer:', error);
    });
