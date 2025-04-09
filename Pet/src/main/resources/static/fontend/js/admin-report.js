       
       document.addEventListener("DOMContentLoaded", function () {
        fetch("http://localhost:8080/api/revenue/total")
            .then(res => res.json())
            .then(data => {
                const total = data.totalRevenue || 0;
    
                // Format tiền theo VND
                const formatted = Number(total).toLocaleString('vi-VN') + "  VNĐ";
    
                // Gán vào thẻ HTML
                document.getElementById("totalRevenue").innerText = formatted;
            })
            .catch(err => {
                console.error("Lỗi khi lấy tổng doanh thu:", err);
                document.getElementById("totalRevenue").innerText = "Không thể tải dữ liệu";
            });
    });


    document.addEventListener("DOMContentLoaded", function () {
        fetch("/api/orders/total-sold-products")
            .then(res => res.json())
            .then(data => {
                const total = data.totalProducts || 0;
                // Gán vào thẻ HTML
                document.getElementById("totalProducts").innerText = total;
            })
            .catch(err => {
                console.error("Lỗi khi lấy tổng doanh thu:", err);
                document.getElementById("totalRevenue").innerText = "Không thể tải dữ liệu";
            });
    });
       

    
    document.addEventListener("DOMContentLoaded", function () {
        fetch("/api/appointments/total")
            .then(res => res.json())
            .then(data => {
                const total = data.totalAppointments || 0;
                // Gán vào thẻ HTML
                document.getElementById("totalUsers").innerText = total;
            })
            .catch(err => {
                console.error("Lỗi khi lấy tổng lịch hẹn:", err);
                document.getElementById("totalUsers").innerText = "Không thể tải dữ liệu";
            });
    });
       
       
       
       
       // Hàm cập nhật các thẻ input dựa trên lựa chọn định dạng thống kê
         function updateInputs() {
            const format = document.getElementById('statisticFormat').value;
            const inputFields = document.getElementById('inputFields');
            inputFields.innerHTML = ''; // Xóa các input cũ

            if (format === 'day') {
                inputFields.innerHTML = `
                    <label for="startDate">Từ</label>
                    <input type="date" class="form-control d-inline w-auto" id="startDate">
                    <label for="endDate">Đến</label>
                    <input type="date" class="form-control d-inline w-auto" id="endDate">
                `;
            } else if (format === 'month') {
                inputFields.innerHTML = `
                    <label for="startMonth">Từ</label>
                    <input type="month" class="form-control d-inline w-auto" id="startMonth">
                    <label for="endMonth">Đến</label>
                    <input type="month" class="form-control d-inline w-auto" id="endMonth">
                `;
            } else if (format === 'year') {
                inputFields.innerHTML = `
                    <label for="startYear">Từ</label>
                    <input type="number" class="form-control d-inline w-auto" id="startYear" min="1900" max="2099">
                    <label for="endYear">Đến</label>
                    <input type="number" class="form-control d-inline w-auto" id="endYear" min="1900" max="2099">
                `;
            }
        }

        // Gọi hàm cập nhật ngay khi trang được tải
        window.onload = updateInputs;
         function toggleButtonActive(button) {
            // Loại bỏ lớp "btn-active" khỏi tất cả các nút
            const buttons = document.querySelectorAll('.select .btn');
            buttons.forEach(function(btn) {
                btn.classList.remove('btn-active');
            });
            
            // Thêm lớp "btn-active" vào nút được click
            button.classList.add('btn-active');
        }

       
 
        let selectedType = ''; 
        let selectedFormat = 'day'; // Mặc định là ngày
        let lineChart, pieChart; 

function toggleButtonActive(button, type) {
console.log('Button clicked:', type); 
// Xóa lớp active khỏi các button khác
document.getElementById('serviceBtn').classList.remove('active');
document.getElementById('productBtn').classList.remove('active');
// Thêm lớp active cho button được nhấn
button.classList.add('active');

selectedType = type; 
console.log('Selected Type:', selectedType); 

if (selectedType === 'product') {
    document.querySelector('.chart-container h5').innerText = 'Thống kê theo danh mục sản phẩm';
} else if (selectedType === 'service') {
    document.querySelector('.chart-container h5').innerText = 'Thống kê doanh thu theo dịch vụ';
}

// Hủy bỏ các biểu đồ cũ nếu có
destroyCharts();

// Gọi hàm thống kê mới
fetchStatistics();
fetchStatistics2();

}

function destroyCharts() {
// Hủy bỏ biểu đồ Line nếu đã tạo
// if(lineChart){
//     lineChart.destroy();
// }
if(pieChart){
    pieChart.destroy();
}
if(barChart){
    barChart.destroy();
}
if(areaChart){
    areaChart.destroy();
}
// if(combinedChart){
//     combinedChart.destroy();
// }

}

function fetchStatistics() {

const selectedFormat = document.getElementById('statisticFormat').value; 

let startDate = document.getElementById("startDate") ? document.getElementById("startDate").value : '';
let endDate = document.getElementById("endDate") ? document.getElementById("endDate").value : '';
let startMonth = document.getElementById("startMonth") ? document.getElementById("startMonth").value : '';
let endMonth = document.getElementById("endMonth") ? document.getElementById("endMonth").value : '';
let startYear = document.getElementById("startYear") ? document.getElementById("startYear").value : '';
let endYear = document.getElementById("endYear") ? document.getElementById("endYear").value : '';

// Kiểm tra dữ liệu nhập
if (selectedFormat === 'day' && (!startDate || !endDate)) {
console.error('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
alert('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
return;
}
if (selectedFormat === 'month' && (!startMonth || !endMonth)) {
console.error('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
alert('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
return;
}
if (selectedFormat === 'year' && (!startYear || !endYear)) {
console.error('Vui lòng chọn cả năm bắt đầu và kết thúc!');
alert('Vui lòng chọn cả năm bắt đầu và kết thúc!');
return;
}

let url = '';
if (selectedFormat === 'day') {
if (selectedType === 'product') {
    url = `http://localhost:8080/api/revenue/byGenres/daily?startDate=${startDate}&endDate=${endDate}`;
} else if (selectedType === 'service') {
    url = `http://localhost:8080/api/appointments/services/day?startDate=${startDate}&endDate=${endDate}`;
}
} 
// else 
if (selectedFormat === 'month') {
 const startMonthFormatted = startMonth ? startMonth.split('-').reverse().join('-') : '';
 const endMonthFormatted = endMonth ? endMonth.split('-').reverse().join('-') : '';

 if (selectedType === 'product') {
     url = `http://localhost:8080/api/revenue/byGenres/monthly?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
 } else if (selectedType === 'service') {
     url = `http://localhost:8080/api/appointments/services/month?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
 }
}


else if (selectedFormat === 'year') {
if (selectedType === 'product') {
    url = `http://localhost:8080/api/revenue/byGenres/yearly?startYear=${startYear}&endYear=${endYear}`;
} else if (selectedType === 'service') {
    url = `http://localhost:8080/api/appointments/revenueByAllServices/yearly?startYear=${startYear}&endYear=${endYear}`;
}
}

console.log('URL API:', url);

fetch(url)
.then(response => response.json())
.then(data => {
    console.log('Dữ liệu nhận được:', data);
    renderCharts(data);
})
.catch(error => console.error('Error fetching data:', error));
}
const colors = [
    'rgba(255, 99, 132, 1)',  // Màu đỏ nổi bật
    'rgba(54, 162, 235, 1)',  // Màu xanh dương tươi sáng
    'rgba(255, 206, 86, 1)',  // Màu vàng sáng
    'rgba(75, 192, 192, 1)',  // Màu xanh lục nhạt
    'rgba(153, 102, 255, 1)', // Màu tím
    'rgba(255, 159, 64, 1)',  // Màu cam
    'rgba(0, 255, 0, 1)',     // Màu xanh lá cây tươi sáng
    'rgba(255, 0, 255, 1)',   // Màu hồng đậm
    'rgba(255, 69, 0, 1)',    // Màu đỏ cam
    'rgba(0, 0, 255, 1)',     // Màu xanh da trời
    'rgba(128, 0, 128, 1)'    // Màu tím đậm
  ];
  
let barChart; 

function renderCharts(data) {
const selectedFormat = document.getElementById('statisticFormat').value; 
let labels = Object.keys(data);
let categories = Object.keys(data[labels[0]]);  

if (selectedFormat === 'day') {
    labels.sort((a, b) => new Date(a) - new Date(b)); 
} else if (selectedFormat === 'month') {
    labels.sort((a, b) => {
        const [yearA, monthA] = a.split('-');
        const [yearB, monthB] = b.split('-');
        return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
}

let revenue = categories.map(category => {
    return labels.map(label => {
        return data[label][category] || 0; 
    });
});

// // Tạo biểu đồ Line
// const lineChartCtx = document.getElementById("lineChart").getContext('2d');
// lineChart = new Chart(lineChartCtx, {
//     type: 'line',
//     data: {
//         labels: labels,  // Các mốc thời gian (tháng)
//         datasets: categories.map((category, index) => ({
//             label: category,
//             data: revenue[index], 
//             borderColor: colors[index % colors.length],
//             fill: false,
//             tension: 0.1
//         }))
//     },
//     options: {
//         responsive: true,
//         scales: {
//             x: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Tháng'
//                 }
//             },
//             y: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Doanh thu (VND)'
//                 }
//             }
//         }
//     }
// });

// Tạo biểu đồ Pie
const pieChartCtx = document.getElementById("pieChart").getContext('2d');
pieChart = new Chart(pieChartCtx, {
    type: 'pie',
    data: {
        labels: categories,  // Các danh mục sản phẩm
        datasets: [{
            label: 'Doanh thu theo danh mục',
            data: categories.map(category => {
                return labels.reduce((sum, label) => sum + (data[label][category] || 0), 0);  // Tổng doanh thu của từng danh mục
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',  // Đỏ
                'rgba(54, 162, 235, 0.8)',  // Xanh dương
                'rgba(255, 206, 86, 0.8)',  // Vàng
                'rgba(75, 192, 192, 0.8)',  // Xanh lá cây
                'rgba(153, 102, 255, 0.8)', // Tím
                'rgba(255, 159, 64, 0.8)',  // Cam
                'rgba(0, 255, 0, 0.8)',     // Xanh lá cây sáng
                'rgba(255, 0, 255, 0.8)',   // Hồng
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',  // Đỏ
                'rgba(54, 162, 235, 1)',  // Xanh dương
                'rgba(255, 206, 86, 1)',  // Vàng
                'rgba(75, 192, 192, 1)',  // Xanh lá cây
                'rgba(153, 102, 255, 1)', // Tím
                'rgba(255, 159, 64, 1)',  // Cam
                'rgba(0, 255, 0, 1)',     // Xanh lá cây sáng
                'rgba(255, 0, 255, 1)',   // Hồng
            ],
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        // return tooltipItem.label + ': ' + tooltipItem.raw + ' VND';
                        const total = tooltipItem.dataset.data.reduce((acc, value) => acc + value, 0); // Tổng doanh thu
                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2); // Tính phần trăm
                        return `${tooltipItem.label}: ${tooltipItem.raw} VND (${percentage}%)`; // Hiển thị doanh thu và phần trăm
                    }
                }
            }
        }
    }
});

// Tạo biểu đồ Bar
const barChartCtx = document.getElementById("barChart").getContext('2d');
barChart = new Chart(barChartCtx, {
    type: 'bar',
    data: {
        labels: labels,  // Các mốc thời gian (tháng)
        datasets: categories.map((category, index) => ({
            label: category,
            data: revenue[index],  // Doanh thu cho từng danh mục theo các tháng
            backgroundColor: colors[index % colors.length],
            borderColor: colors[index % colors.length],
            borderWidth: 1
        }))
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                },
                // Điều chỉnh khoảng cách giữa các cột
                grid: {
                    offset: true  // Giảm khoảng cách giữa các cột
                },
                // Điều chỉnh tỷ lệ và khoảng cách giữa các cột
                categoryPercentage: 0.5, // Điều chỉnh tỷ lệ giữa các cột
                barPercentage: 2.0  // Cột chiếm tỷ lệ đầy đủ trong không gian có sẵn
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh thu (VND)'
                },
                ticks: {
                    stepSize: 1000000,
                    callback: function(value) {
                        return value.toLocaleString('vi-VN');  // Hiển thị đẹp: 2.000.000
                    }
                }
            }
        }
    }
});
}

function fetchStatistics2() {
const selectedFormat = document.getElementById('statisticFormat').value;

let startDate = document.getElementById("startDate") ? document.getElementById("startDate").value : '';
let endDate = document.getElementById("endDate") ? document.getElementById("endDate").value : '';
let startMonth = document.getElementById("startMonth") ? document.getElementById("startMonth").value : '';
let endMonth = document.getElementById("endMonth") ? document.getElementById("endMonth").value : '';
let startYear = document.getElementById("startYear") ? document.getElementById("startYear").value : '';
let endYear = document.getElementById("endYear") ? document.getElementById("endYear").value : '';

// Kiểm tra dữ liệu nhập
if (selectedFormat === 'day' && (!startDate || !endDate)) {
    console.error('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
    alert('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
    return;
}
if (selectedFormat === 'month' && (!startMonth || !endMonth)) {
    console.error('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
    alert('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
    return;
}
if (selectedFormat === 'year' && (!startYear || !endYear)) {
    console.error('Vui lòng chọn cả năm bắt đầu và kết thúc!');
    alert('Vui lòng chọn cả năm bắt đầu và kết thúc!');
    return;
}

let url = '';
if (selectedFormat === 'day') {
    // Gọi API cho doanh thu tổng cho cả product và service theo ngày
    url = `http://localhost:8080/api/revenue/total/daily?startDate=${startDate}&endDate=${endDate}`;
} 
else if (selectedFormat === 'month') {
    // Định dạng lại tháng cho đúng định dạng API (MM-yyyy)
    const startMonthFormatted = startMonth ? startMonth.split('-').reverse().join('-') : '';
    const endMonthFormatted = endMonth ? endMonth.split('-').reverse().join('-') : '';

    // Gọi API cho doanh thu tổng cho cả product và service theo tháng
    url = `http://localhost:8080/api/revenue/total/monthly?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
}

console.log('URL API:', url);

// Gọi API và vẽ lại biểu đồ
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log('Dữ liệu nhận được:', data);
        renderAreaChart(data);  // Chỉ hiển thị tại areaChart
    })
    .catch(error => console.error('Error fetching data:', error));
}

let areaChart;  // Khai báo biến toàn cục cho areaChart

function renderAreaChart(data) {
const selectedFormat = document.getElementById('statisticFormat').value;
const ctx = document.getElementById('areaChart').getContext('2d');

// Lấy labels là các key trong data
let labels = Object.keys(data);

// Sắp xếp theo ngày/tháng/năm
if (selectedFormat === 'day') {
    labels.sort((a, b) => new Date(a) - new Date(b));
} else if (selectedFormat === 'month') {
    labels.sort((a, b) => {
        const [monthA, yearA] = a.split('-');
        const [monthB, yearB] = b.split('-');
        return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
}

// Lấy giá trị doanh thu ứng với mỗi label
const values = labels.map(label => data[label] || 0);

console.log("Labels:", labels);
console.log("Values:", values);

// Xoá biểu đồ cũ nếu có
if (areaChart) areaChart.destroy();

// Tạo biểu đồ Area
areaChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Doanh thu',
            data: values,
            fill: true,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Thời gian' }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Doanh thu (VND)' },
                ticks: {
                    callback: value => value.toLocaleString('vi-VN')
                }
            }
        }
    }
});
}
// function fetchStatistics2() {
//     const selectedFormat = document.getElementById('statisticFormat').value;

//     let startDate = document.getElementById("startDate") ? document.getElementById("startDate").value : '';
//     let endDate = document.getElementById("endDate") ? document.getElementById("endDate").value : '';
//     let startMonth = document.getElementById("startMonth") ? document.getElementById("startMonth").value : '';
//     let endMonth = document.getElementById("endMonth") ? document.getElementById("endMonth").value : '';
//     let startYear = document.getElementById("startYear") ? document.getElementById("startYear").value : '';
//     let endYear = document.getElementById("endYear") ? document.getElementById("endYear").value : '';

//     // Kiểm tra dữ liệu nhập
//     if (selectedFormat === 'day' && (!startDate || !endDate)) {
//         console.error('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
//         alert('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
//         return;
//     }
//     if (selectedFormat === 'month' && (!startMonth || !endMonth)) {
//         console.error('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
//         alert('Vui lòng chọn cả tháng bắt đầu và kết thúc!');
//         return;
//     }
//     if (selectedFormat === 'year' && (!startYear || !endYear)) {
//         console.error('Vui lòng chọn cả năm bắt đầu và kết thúc!');
//         alert('Vui lòng chọn cả năm bắt đầu và kết thúc!');
//         return;
//     }

//     let urlTotal = '';
//     let urlProduct = '';
//     let urlService = '';

//     // URL API cho tổng doanh thu, doanh thu sản phẩm và doanh thu dịch vụ
//     if (selectedFormat === 'day') {
//         urlTotal = `http://localhost:8080/api/revenue/total/daily?startDate=${startDate}&endDate=${endDate}`;
//         urlProduct = `http://localhost:8080/api/revenue/byGenres/daily?startDate=${startDate}&endDate=${endDate}`;
//         urlService = `http://localhost:8080/api/appointments/services/day?startDate=${startDate}&endDate=${endDate}`;
//     } else if (selectedFormat === 'month') {
//         const startMonthFormatted = startMonth ? startMonth.split('-').reverse().join('-') : '';
//         const endMonthFormatted = endMonth ? endMonth.split('-').reverse().join('-') : '';

//         urlTotal = `http://localhost:8080/api/revenue/total/monthly?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
//         urlProduct = `http://localhost:8080/api/revenue/byGenres/monthly?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
//         urlService = `http://localhost:8080/api/appointments/services/month?startMonth=${startMonthFormatted}&endMonth=${endMonthFormatted}`;
//     }

//     // Gọi các API và hiển thị biểu đồ
//     Promise.all([fetch(urlTotal), fetch(urlProduct), fetch(urlService)])
//         .then(responses => Promise.all(responses.map(res => res.json())))
//         .then(([totalData, productData, serviceData]) => {
//             renderCombinedChart(totalData, productData, serviceData);
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }

// let combinedChart;
// function renderCombinedChart(totalData, productData, serviceData) {
//     const ctx = document.getElementById('combinedChart').getContext('2d');

//     // Lấy các labels (thời gian hoặc tháng) từ dữ liệu
//     let labels = Object.keys(totalData);

//     // Lấy giá trị doanh thu cho từng loại
//     const totalRevenue = labels.map(label => totalData[label] || 0);
//     const productRevenue = labels.map(label => productData[label] || 0);
//     const serviceRevenue = labels.map(label => serviceData[label] || 0);

//     // Tạo biểu đồ với 3 datasets: tổng doanh thu, doanh thu sản phẩm, doanh thu dịch vụ
//     new Chart(ctx, {
//         type: 'line', // Có thể đổi thành 'line' nếu bạn muốn biểu đồ đường
//         data: {
//             labels: labels,  // Các mốc thời gian (ngày/tháng/năm)
//             datasets: [
//                 {
//                     label: 'Tổng Doanh Thu',
//                     data: totalRevenue, 
//                     backgroundColor: 'rgba(75, 192, 192, 0.6)', 
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                 },
//                 {
//                     label: 'Doanh Thu Sản Phẩm',
//                     data: productRevenue,
//                     backgroundColor: 'rgba(255, 99, 132, 0.6)', 
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     borderWidth: 1
//                 },
//                 {
//                     label: 'Doanh Thu Dịch Vụ',
//                     data: serviceRevenue,
//                     backgroundColor: 'rgba(54, 162, 235, 0.6)', 
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: {
//                     title: { display: true, text: 'Thời gian' }
//                 },
//                 y: {
//                     beginAtZero: true,
//                     title: { display: true, text: 'Doanh thu (VND)' },
//                     ticks: {
//                         callback: function(value) {
//                             return value.toLocaleString('vi-VN');
//                         }
//                     }
//                 }
//             },
//             plugins: {
//                 tooltip: {
//                     callbacks: {
//                         label: function(tooltipItem) {
//                             const value = tooltipItem.raw;
//                             return tooltipItem.dataset.label + ': ' + value.toLocaleString('vi-VN') + ' VND';
//                         }
//                     }
//                 }
//             }
//         }
//     });
// }
