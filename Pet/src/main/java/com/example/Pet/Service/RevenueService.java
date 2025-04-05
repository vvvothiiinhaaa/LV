package com.example.Pet.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Appointment;
import com.example.Pet.Modal.AppointmentPrice;
import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.AppointmentPriceRepository;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.OrderRepository;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.ServicePriceRepository;
import com.example.Pet.Repository.ServiceforpetRepository;

@Service
public class RevenueService {

    private final AppointmentRepository appointmentRepository;
    private final OrderRepository orderRepository;
    private final ServicePriceRepository servicePriceRepository;
    private final ProductRepository productRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private AppointmentPriceRepository appointmentPriceRepository;
    @Autowired
    private ServiceforpetRepository serviceforpetRepository;

    public RevenueService(AppointmentRepository appointmentRepository,
            OrderRepository orderRepository,
            ServicePriceRepository servicePriceRepository,
            ProductRepository productRepository) {
        this.appointmentRepository = appointmentRepository;
        this.orderRepository = orderRepository;
        this.servicePriceRepository = servicePriceRepository;
        this.productRepository = productRepository;
    }

    // Phương thức tính tổng doanh thu của cả dịch vụ và sản phẩm trong ngày/tháng/năm
    public BigDecimal getTotalRevenueForPeriod(LocalDate startDate, LocalDate endDate) {
        BigDecimal totalRevenue = BigDecimal.ZERO;

        // Tính doanh thu từ dịch vụ
        List<Appointment> appointments = appointmentRepository.findByServiceAndDateRange(startDate, endDate);
        for (Appointment appointment : appointments) {
            for (Serviceforpet service : appointment.getServices()) {
                // Lấy giá dịch vụ cho mỗi dịch vụ trong cuộc hẹn
                ServicePrice servicePrice = servicePriceRepository.findByServiceforpetAndPetSize(service, appointment.getPets().iterator().next().getSize());
                if (servicePrice != null) {
                    totalRevenue = totalRevenue.add(servicePrice.getPrice());
                }
            }
        }

        // Tính doanh thu từ sản phẩm
        List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(1L, java.sql.Date.valueOf(startDate), java.sql.Date.valueOf(endDate), "Hoàn Thành");

        for (OrderItem orderItem : orderItems) {
            totalRevenue = totalRevenue.add(orderItem.getTotal());  // Cộng dồn doanh thu từ mỗi OrderItem
        }

        return totalRevenue;  // Trả về tổng doanh thu tính được
    }

    /// ngày 21
    /// 
    // Tính doanh thu dịch vụ cho từng ngày
    public Map<String, Map<String, BigDecimal>> getRevenueForServicesByDay(LocalDate startDate, LocalDate endDate) {
        Map<String, Map<String, BigDecimal>> revenueByDay = new HashMap<>();

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            Map<String, BigDecimal> dailyRevenue = calculateServiceRevenueForDay(currentDate, currentDate);
            revenueByDay.put(currentDate.toString(), dailyRevenue);  // Lưu doanh thu từng dịch vụ cho ngày đó
            currentDate = currentDate.plusDays(1);  // Tiến đến ngày tiếp theo
        }

        return revenueByDay;
    }

    // Phương thức tính doanh thu cho mỗi ngày
    private Map<String, BigDecimal> calculateServiceRevenueForDay(LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> serviceRevenue = new HashMap<>();

        List<Serviceforpet> allServices = serviceforpetRepository.findAll(); // Giả sử bạn có một phương thức lấy tất cả các dịch vụ

        List<Appointment> appointments = appointmentRepository.findByServiceAndDateRange(startDate, endDate);

        for (Appointment appointment : appointments) {
            for (Serviceforpet service : appointment.getServices()) {
                ServicePrice servicePrice = servicePriceRepository.findByServiceforpetAndPetSize(service, appointment.getPets().iterator().next().getSize());
                if (servicePrice != null) {
                    serviceRevenue.put(service.getName(), serviceRevenue.getOrDefault(service.getName(), BigDecimal.ZERO).add(servicePrice.getPrice()));
                }
            }
        }

        for (Serviceforpet service : allServices) {
            serviceRevenue.putIfAbsent(service.getName(), BigDecimal.ZERO);
        }

        return serviceRevenue;
    }

    /////////////////////////////////////////////////////////////////////// tính tháng dịch vụ
    public Map<String, Map<String, BigDecimal>> getRevenueForServicesByMonth(String startMonth, String endMonth) {
        // Parse the start and end month to LocalDate
        LocalDate startDate = parseMonthToDate(startMonth, true);
        LocalDate endDate = parseMonthToDate(endMonth, false);

        // Prepare a map to store revenue data by month
        Map<String, Map<String, BigDecimal>> revenueByMonth = new HashMap<>();

        // Loop through each month in the range from startDate to endDate
        LocalDate currentMonth = startDate;
        while (!currentMonth.isAfter(endDate)) {
            LocalDate nextMonth = currentMonth.plusMonths(1);

            // Calculate the revenue for the current month
            Map<String, BigDecimal> monthlyRevenue = calculateServiceRevenueForMonth(currentMonth, nextMonth.minusDays(1));

            // Use the MM-yyyy format for the month key
            String formattedMonth = currentMonth.format(DateTimeFormatter.ofPattern("MM-yyyy"));
            revenueByMonth.put(formattedMonth, monthlyRevenue);

            // Move to the next month
            currentMonth = nextMonth;
        }

        return revenueByMonth;
    }

    private LocalDate parseMonthToDate(String monthYear, boolean isStartOfMonth) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String monthYearWithDay = "01-" + monthYear;
            LocalDate date = LocalDate.parse(monthYearWithDay, formatter);
            if (!isStartOfMonth) {
                date = date.withDayOfMonth(date.lengthOfMonth());
            }
            return date;
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid month-year format: " + monthYear);
        }
    }

    private Map<String, BigDecimal> calculateServiceRevenueForMonth(LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> serviceRevenue = new HashMap<>();

        // Get all the services available
        List<Serviceforpet> allServices = serviceforpetRepository.findAll();

        // Get all the appointments for the given period
        List<Appointment> appointments = appointmentRepository.findByServiceAndDateRange(startDate, endDate);

        // Iterate through each appointment and calculate revenue
        for (Appointment appointment : appointments) {
            for (Serviceforpet service : appointment.getServices()) {
                ServicePrice servicePrice = servicePriceRepository.findByServiceforpetAndPetSize(service, appointment.getPets().iterator().next().getSize());
                if (servicePrice != null) {
                    serviceRevenue.put(service.getName(), serviceRevenue.getOrDefault(service.getName(), BigDecimal.ZERO).add(servicePrice.getPrice()));
                }
            }
        }

        // Ensure all services are included in the result, even if they had no revenue
        for (Serviceforpet service : allServices) {
            serviceRevenue.putIfAbsent(service.getName(), BigDecimal.ZERO);
        }

        return serviceRevenue;
    }

    /////////////////////////////////////////////// ngày 22
    /// 
    /// 
    public Map<String, Map<String, BigDecimal>> getRevenueByGenresDaily(LocalDate startDate, LocalDate endDate) {
        // Map để lưu doanh thu theo ngày và theo danh mục
        Map<String, Map<String, BigDecimal>> revenueByDateAndGenre = new HashMap<>();

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            // Đảm bảo rằng currentDate chỉ là ngày, không có giờ phút giây
            Date currentStartOfDay = java.sql.Date.valueOf(currentDate.atStartOfDay().toLocalDate());
            Date currentEndOfDay = java.sql.Date.valueOf(currentDate.atTime(23, 59, 59).toLocalDate());

            // Lấy danh sách tất cả các danh mục (genre)
            List<String> genres = productRepository.findAllGenres();

            // Map để lưu doanh thu cho từng danh mục trong ngày hiện tại
            Map<String, BigDecimal> dailyRevenue = new HashMap<>();

            // Lặp qua tất cả các danh mục và tính doanh thu cho từng danh mục trong ngày
            for (String genre : genres) {
                BigDecimal totalRevenue = BigDecimal.ZERO;

                // Lấy danh sách các sản phẩm trong từng danh mục
                List<Product> products = productRepository.findByGenre(genre);

                // Lặp qua các sản phẩm và tính doanh thu của chúng trong ngày
                for (Product product : products) {
                    // Lấy danh sách các OrderItem cho sản phẩm này trong ngày và trạng thái "Hoàn Thành"
                    List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                            product.getId(), currentStartOfDay, currentEndOfDay, "Hoàn Thành");

                    for (OrderItem orderItem : orderItems) {
                        totalRevenue = totalRevenue.add(orderItem.getTotal());
                    }
                }

                dailyRevenue.put(genre, totalRevenue);
            }

            // Chuyển đổi currentDate thành chuỗi ngày theo định dạng yyyy-MM-dd
            String formattedDate = currentDate.toString();

            // Thêm doanh thu của ngày vào tổng doanh thu theo ngày và danh mục
            revenueByDateAndGenre.put(formattedDate, dailyRevenue);

            // Tiến đến ngày kế tiếp
            currentDate = currentDate.plusDays(1);
        }

        return revenueByDateAndGenre;
    }

    // Trả về ngày đầu tháng
    private Date getStartOfMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, 1);  // Đặt ngày là ngày 1 của tháng
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

// Trả về ngày cuối tháng
    private Date getEndOfMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));  // Đặt ngày là ngày cuối tháng
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

// Phương thức này trả về ngày kết thúc của một ngày (23:59:59)
    private Date getEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    public Map<String, Map<String, BigDecimal>> getRevenueByGenresMonthly(LocalDate startDate, LocalDate endDate) {
        Map<String, Map<String, BigDecimal>> revenueByMonthAndGenre = new HashMap<>();

        LocalDate currentMonth = startDate;
        while (!currentMonth.isAfter(endDate)) {
            // Format tháng thành "MM-yyyy"
            String month = currentMonth.format(DateTimeFormatter.ofPattern("MM-yyyy"));

            Map<String, BigDecimal> monthlyRevenue = new HashMap<>();
            List<String> genres = productRepository.findAllGenres();  // Lấy tất cả các danh mục

            for (String genre : genres) {
                BigDecimal totalRevenue = BigDecimal.ZERO;
                List<Product> products = productRepository.findByGenre(genre);

                for (Product product : products) {
                    // Lấy ngày bắt đầu và kết thúc của tháng hiện tại
                    LocalDate firstDayOfMonth = currentMonth.withDayOfMonth(1);
                    LocalDate lastDayOfMonth = currentMonth.withDayOfMonth(currentMonth.lengthOfMonth());

                    // Lấy tất cả các đơn hàng trong khoảng thời gian này
                    List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                            product.getId(),
                            java.sql.Date.valueOf(firstDayOfMonth),
                            java.sql.Date.valueOf(lastDayOfMonth),
                            "Hoàn Thành");

                    for (OrderItem orderItem : orderItems) {
                        totalRevenue = totalRevenue.add(orderItem.getTotal());
                    }
                }

                monthlyRevenue.put(genre, totalRevenue);
            }

            // Lưu kết quả doanh thu theo tháng và danh mục sản phẩm
            revenueByMonthAndGenre.put(month, monthlyRevenue);

            // Tiến đến tháng tiếp theo
            currentMonth = currentMonth.plusMonths(1);
        }

        return revenueByMonthAndGenre;
    }

    public Map<String, BigDecimal> getTotalRevenueByDay(LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> totalRevenueByDay = new HashMap<>();

        Map<String, Map<String, BigDecimal>> serviceRevenueByDay = getRevenueForServicesByDay(startDate, endDate);
        Map<String, Map<String, BigDecimal>> genreRevenueByDay = getRevenueByGenresDaily(startDate, endDate);

        // Kết hợp doanh thu dịch vụ và danh mục sản phẩm
        for (String date : serviceRevenueByDay.keySet()) {
            BigDecimal totalRevenue = serviceRevenueByDay.get(date).values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            if (genreRevenueByDay.containsKey(date)) {
                totalRevenue = totalRevenue.add(genreRevenueByDay.get(date).values().stream().reduce(BigDecimal.ZERO, BigDecimal::add));
            }
            totalRevenueByDay.put(date, totalRevenue);
        }

        return totalRevenueByDay;
    }

    public Map<String, BigDecimal> getTotalRevenueByMonth(String startMonth, String endMonth) {
        // Parse the start and end month to LocalDate
        LocalDate startDate = parseMonthToDate(startMonth, true);
        LocalDate endDate = parseMonthToDate(endMonth, false);

        // Prepare a map to store total revenue data by month
        Map<String, BigDecimal> totalRevenueByMonth = new HashMap<>();

        // Get revenue data for services
        Map<String, Map<String, BigDecimal>> serviceRevenueByMonth = getRevenueForServicesByMonth(startMonth, endMonth);

        // Get revenue data for product genres
        Map<String, Map<String, BigDecimal>> genreRevenueByMonth = getRevenueByGenresMonthly(startDate, endDate);

        // Loop through each month in the range from startDate to endDate
        LocalDate currentMonth = startDate;
        while (!currentMonth.isAfter(endDate)) {
            String formattedMonth = currentMonth.format(DateTimeFormatter.ofPattern("MM-yyyy"));

            // Calculate the total revenue for the current month
            BigDecimal totalRevenueForMonth = BigDecimal.ZERO;

            // Add service revenue for the current month
            if (serviceRevenueByMonth.containsKey(formattedMonth)) {
                Map<String, BigDecimal> serviceRevenue = serviceRevenueByMonth.get(formattedMonth);
                totalRevenueForMonth = serviceRevenue.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            // Add product genre revenue for the current month
            if (genreRevenueByMonth.containsKey(formattedMonth)) {
                Map<String, BigDecimal> genreRevenue = genreRevenueByMonth.get(formattedMonth);
                totalRevenueForMonth = totalRevenueForMonth.add(genreRevenue.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add));
            }

            // Store the total revenue for the current month
            totalRevenueByMonth.put(formattedMonth, totalRevenueForMonth);

            // Move to the next month
            currentMonth = currentMonth.plusMonths(1);
        }

        return totalRevenueByMonth;
    }

    ////// ngày 23
   
public BigDecimal getTotalRevenue() {
        BigDecimal totalRevenue = BigDecimal.ZERO;

        // 1. Doanh thu từ dịch vụ (AppointmentPrice)
        List<AppointmentPrice> appointmentPrices = appointmentPriceRepository.findAll();
        for (AppointmentPrice ap : appointmentPrices) {
            if (ap.getTotalPrice() != null) {
                totalRevenue = totalRevenue.add(ap.getTotalPrice());
            }
        }

        // 2. Doanh thu từ sản phẩm (OrderItem của đơn hàng "Hoàn Thành")
        List<Order> completedOrders = orderRepository.findByOrderStatus("Hoàn Thành");
        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getTotal() != null) {
                    totalRevenue = totalRevenue.add(item.getTotal());
                }
            }
        }

        return totalRevenue;
    }

    ///// đếm tất cả đơn hàng

    public int getTotalSoldProducts() {
        int total = 0;

        // Lấy tất cả đơn hàng
        List<Order> allOrders = orderRepository.findAll();

        for (Order order : allOrders) {
            // Chỉ tính đơn hàng hoàn thành
            if ("Hoàn Thành".equalsIgnoreCase(order.getOrderStatus())) {
                for (OrderItem item : order.getOrderItems()) {
                    total += item.getQuantity();
                }
            }
        }

        return total;
    }

}
