package com.example.Pet.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Pet.Modal.Address;
import com.example.Pet.Modal.Order;
import com.example.Pet.Modal.OrderAddress;
import com.example.Pet.Modal.OrderItem;
import com.example.Pet.Modal.Product;
import com.example.Pet.Modal.StockEntry;
import com.example.Pet.Modal.User;
import com.example.Pet.Repository.AddressRepository;
import com.example.Pet.Repository.OrderAddressRepository;
import com.example.Pet.Repository.OrderItemRepository;
import com.example.Pet.Repository.OrderRepository;
import com.example.Pet.Repository.ProductRepository;
import com.example.Pet.Repository.StockEntryRepository;
import com.example.Pet.Repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private OrderAddressRepository orderAddressRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockEntryRepository stockEntryRepository;

    @Transactional
    // public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod,
    //         List<OrderItem> orderItems, Integer addressId) {
    //     // Khởi tạo và lưu thông tin đơn hàng
    //     Order order = new Order();
    //     order.setUserId(userId);
    //     order.setOrderDate(new Date());
    //     order.setDiscount(discount);
    //     order.setOrderStatus("Chờ Xác Nhận"); // Trạng thái mặc định là PENDING
    //     order.setTotalPayment(totalPayment);
    //     order.setPaymentMethod(paymentMethod);
    //     // Thiết lập quan hệ giữa Order và OrderItem
    //     for (OrderItem item : orderItems) {
    //         item.setOrder(order); // Gắn đơn hàng cho từng OrderItem
    //         // Tìm sản phẩm trong database
    //         Product product = productRepository.findById(item.getProductId())
    //                 .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + item.getProductId()));
    //         // Kiểm tra tồn kho
    //         if (product.getQuantity() < item.getQuantity()) {
    //             throw new RuntimeException("Số lượng tồn kho không đủ cho sản phẩm: " + product.getName());
    //         }
    //         // Cập nhật số lượng đã bán và tồn kho
    //         product.setSold(product.getSold() + item.getQuantity());
    //         product.setQuantity(product.getQuantity() - item.getQuantity());
    //         // Lưu lại thay đổi của sản phẩm
    //         productRepository.save(product);
    //     }
    //     order.setOrderItems(orderItems);
    //     // Lưu Order trước khi lưu OrderItem (Cascade.ALL sẽ tự động lưu OrderItem)
    //     Order savedOrder = orderRepository.save(order);
    //     // Lưu thông tin địa chỉ liên kết với đơn hàng
    //     OrderAddress orderAddress = new OrderAddress();
    //     orderAddress.setUserId(userId);
    //     orderAddress.setOrderId(savedOrder.getId());
    //     orderAddress.setAddressId(addressId);
    //     orderAddressRepository.save(orderAddress);
    //     // Trả về thông tin đơn hàng đã được lưu
    //     return savedOrder;
    // }

    // public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod, String note,
    //         List<OrderItem> orderItems, Integer addressId) {
    //     //  Tạo mới đơn hàng
    //     Order order = new Order();
    //     order.setUserId(userId);
    //     order.setOrderDate(new Date());
    //     order.setDiscount(discount);
    //     order.setTotalPayment(totalPayment);
    //     order.setOrderStatus("Chờ Xác Nhận");
    //     order.setNote(note);
    //     order.setPaymentMethod(paymentMethod);
    //     //  Kiểm tra tồn kho và cập nhật số lượng bán
    //     for (OrderItem item : orderItems) {
    //         item.setOrder(order);
    //         // Tìm sản phẩm trong database
    //         Product product = productRepository.findById(item.getProductId())
    //                 .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + item.getProductId()));
    //         // Kiểm tra tồn kho
    //         if (product.getQuantity() < item.getQuantity()) {
    //             throw new RuntimeException("Số lượng tồn kho không đủ cho sản phẩm: " + product.getName());
    //         }
    //         // Cập nhật số lượng đã bán và tồn kho
    //         product.setSold(product.getSold() + item.getQuantity());
    //         product.setQuantity(product.getQuantity() - item.getQuantity());
    //         // Lưu thay đổi sản phẩm
    //         productRepository.save(product);
    //     }
    //     order.setOrderItems(orderItems);
    //     //  Lưu Order trước khi lưu OrderItem (Cascade.ALL sẽ tự động lưu OrderItem)
    //     Order savedOrder = orderRepository.save(order);
    //     //  Lấy thông tin chi tiết địa chỉ từ bảng `address`
    //     Address address = addressRepository.findById(Long.valueOf(addressId))
    //             .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại với ID: " + addressId));
    //     //  Lưu toàn bộ thông tin địa chỉ vào `order_address`
    //     OrderAddress orderAddress = new OrderAddress();
    //     orderAddress.setUserId(userId);
    //     orderAddress.setOrderId(savedOrder.getId());
    //     orderAddress.setRecipientName(address.getRecipientName());
    //     orderAddress.setPhoneNumber(address.getPhoneNumber());
    //     orderAddress.setProvinceCity(address.getProvinceCity());
    //     orderAddress.setDistrict(address.getDistrict());
    //     orderAddress.setWardSubdistrict(address.getWardSubdistrict());
    //     orderAddress.setAddressDetail(address.getAddressDetail());
    //     //  Lưu địa chỉ liên kết với đơn hàng
    //     orderAddressRepository.save(orderAddress);
    //     //  Trả về thông tin đơn hàng đã lưu
    //     return savedOrder;
    // }
    
    //////////////////////////////////////////////////////////////////////////// 
    public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod,
            String note, List<OrderItem> orderItems, Integer addressId) {

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(new Date());
        order.setDiscount(discount);
        order.setTotalPayment(totalPayment);
        order.setOrderStatus("Chờ Xác Nhận");
        order.setNote(note);
        order.setPaymentMethod(paymentMethod);

        for (OrderItem item : orderItems) {
            item.setOrder(order);

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: ID " + item.getProductId()));

            int quantityToSell = item.getQuantity();

            if (product.getQuantity() < quantityToSell) {
                throw new RuntimeException("Không đủ hàng trong kho cho sản phẩm: " + product.getName());
            }

// 1. Tính anonymous stock (tồn ban đầu khi chưa nhập lô)
            int stockInEntries = stockEntryRepository.sumQuantityByProduct(product);
            int anonymousStock = product.getQuantity() - stockInEntries;
            int usedAnonymous = 0;

// 2. Trừ từ hàng anonymous trước
            if (anonymousStock > 0) {
                usedAnonymous = Math.min(anonymousStock, quantityToSell);
                quantityToSell -= usedAnonymous;
                System.out.println("→ Bán " + usedAnonymous + " từ hàng tạo ban đầu, giá: " + product.getPrice());
            }

// 3. Trừ tiếp từ StockEntry (FIFO)
            List<StockEntry> stockEntries = stockEntryRepository.findByProductOrderByEntryDateAsc(product);
            for (StockEntry entry : stockEntries) {
                if (entry.getQuantity() == 0) {
                    continue;
                }

                int sellQty = Math.min(entry.getQuantity(), quantityToSell);
                entry.setQuantity(entry.getQuantity() - sellQty);
                stockEntryRepository.save(entry);

                quantityToSell -= sellQty;

                double price = entry.getPurchasePrice() * 1.2;
                System.out.println("→ Bán " + sellQty + " từ lô " + entry.getEntryDate() + ", giá: " + price);

                if (quantityToSell == 0) {
                    break;
                }
            }

            if (quantityToSell > 0) {
                throw new RuntimeException("Không đủ hàng để hoàn tất đơn hàng cho sản phẩm: " + product.getName());
            }

// 4. Cập nhật tồn kho tổng
            product.setQuantity(product.getQuantity() - item.getQuantity());
            product.setSold(product.getSold() + item.getQuantity());
            productRepository.save(product);

// 5. Nếu anonymous stock đã hết → cập nhật giá bán mới
            int anonymousLeft = product.getQuantity() - stockEntryRepository.sumQuantityByProduct(product);
            if (anonymousLeft <= 0) {
                updateProductPriceFromNextBatch(product);
            }
        }

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

// 6. Ghi thông tin địa chỉ đơn hàng
        Address address = addressRepository.findById(Long.valueOf(addressId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ với ID: " + addressId));

        OrderAddress orderAddress = new OrderAddress();
        orderAddress.setUserId(userId);
        orderAddress.setOrderId(savedOrder.getId());
        orderAddress.setRecipientName(address.getRecipientName());
        orderAddress.setPhoneNumber(address.getPhoneNumber());
        orderAddress.setProvinceCity(address.getProvinceCity());
        orderAddress.setDistrict(address.getDistrict());
        orderAddress.setWardSubdistrict(address.getWardSubdistrict());
        orderAddress.setAddressDetail(address.getAddressDetail());

        orderAddressRepository.save(orderAddress);

        return savedOrder;
    }

    /**
     * Cập nhật giá bán theo lô còn hàng tiếp theo (nếu anonymous stock đã hết)
     */
    public void updateProductPriceFromNextBatch(Product product) {
        List<StockEntry> stockEntries = stockEntryRepository.findByProductOrderByEntryDateAsc(product);

        for (StockEntry entry : stockEntries) {
            if (entry.getQuantity() > 0) {
                double newPrice = entry.getPurchasePrice() * 1.2;
                if (!Objects.equals(product.getPrice(), newPrice)) {
                    product.setPrice(newPrice);
                    productRepository.save(product);
                    System.out.println(" Giá cập nhật: " + newPrice + " từ lô ngày " + entry.getEntryDate());
                }
                return;
            }
        }

// Nếu không còn hàng trong bất kỳ lô nào → hết hàng
        product.setPrice(0.0);
        productRepository.save(product);
        System.out.println(" Sản phẩm đã hết hàng, giá bán đặt về 0.");
    }

    /**
     * Nhập kho – thêm lô mới & cộng số lượng vào tồn kho
     */
    public void addStock(Long productId, Integer quantity, Double purchasePrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + productId));

        StockEntry stockEntry = new StockEntry();
        stockEntry.setProduct(product);
        stockEntry.setQuantity(quantity);
        stockEntry.setPurchasePrice(purchasePrice);
        stockEntry.setEntryDate(LocalDateTime.now());

        stockEntryRepository.save(stockEntry);

        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);

        System.out.println(" Nhập kho: " + quantity + " sản phẩm, giá nhập: " + purchasePrice);
    }

    ///////////////// lấy chi tiết đơn hàng
    //  public Map<String, Object> getOrderDetails(Integer orderId) {
    //     // Tìm thông tin đơn hàng
    //     Order order = orderRepository.findById(orderId)
    //             .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
    //     // Tìm danh sách OrderItem liên quan
    //     List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
    //     // Lấy thông tin chi tiết sản phẩm cho từng OrderItem
    //     List<Map<String, Object>> itemDetails = orderItems.stream().map(orderItem -> {
    //         Product product = productRepository.findById(orderItem.getProductId())
    //                 .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItem.getProductId()));
    //         Map<String, Object> itemMap = new HashMap<>();
    //         itemMap.put("id", orderItem.getId());
    //         itemMap.put("productName", product.getName());
    //         itemMap.put("price", product.getPrice());
    //         itemMap.put("quantity", orderItem.getQuantity());
    //         itemMap.put("url", product.getUrl());
    //         itemMap.put("total", orderItem.getTotal());
    //         return itemMap;
    //     }).collect(Collectors.toList());
    //     // Tìm địa chỉ liên quan đến đơn hàng
    //     OrderAddress orderAddress = orderAddressRepository.findByOrderId(orderId)
    //             .orElseThrow(() -> new RuntimeException("Order address not found for Order ID: " + orderId));
    //     // Tạo map chứa thông tin địa chỉ
    //     Map<String, Object> addressMap = new HashMap<>();
    //     addressMap.put("userId", orderAddress.getUserId());
    //     addressMap.put("addressId", orderAddress.getAddressId());
    //     // Tạo map trả về
    //     Map<String, Object> orderDetails = new HashMap<>();
    //     orderDetails.put("orderId", order.getId());
    //     orderDetails.put("userId", order.getUserId());
    //     orderDetails.put("orderDate", order.getOrderDate());
    //     orderDetails.put("discount", order.getDiscount());
    //     orderDetails.put("totalPayment", order.getTotalPayment());
    //     orderDetails.put("paymentMethod", order.getPaymentMethod());
    //     orderDetails.put("orderStatus", order.getOrderStatus());
    //     orderDetails.put("address", addressMap);
    //     orderDetails.put("items", itemDetails);
    //     return orderDetails;
    // }

    public Map<String, Object> getOrderDetails(Integer orderId) {
        Map<String, Object> orderDetails = new HashMap<>();

        try {
            //  Tìm thông tin đơn hàng
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException(" Không tìm thấy đơn hàng với ID: " + orderId));

            //  Lấy danh sách sản phẩm trong đơn hàng
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
            List<Map<String, Object>> itemDetails = orderItems.stream().map(orderItem -> {
                Map<String, Object> itemMap = new HashMap<>();
                try {
                    //  Tìm thông tin sản phẩm
                    Product product = productRepository.findById(orderItem.getProductId())
                            .orElseThrow(() -> new RuntimeException(" Không tìm thấy sản phẩm với ID: " + orderItem.getProductId()));

                    //  Thêm thông tin sản phẩm vào danh sách
                    itemMap.put("id", orderItem.getId());
                    itemMap.put("productId", product.getId());
                    itemMap.put("productName", product.getName());
                    itemMap.put("price", product.getPrice());
                    itemMap.put("quantity", orderItem.getQuantity());
                    itemMap.put("url", product.getUrl());
                    itemMap.put("total", orderItem.getTotal());
                } catch (Exception e) {
                    System.err.println("⚠ Lỗi khi lấy thông tin sản phẩm: " + e.getMessage());
                }
                return itemMap;
            }).collect(Collectors.toList());

            //  Lấy thông tin địa chỉ giao hàng
            OrderAddress orderAddress = orderAddressRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException(" Không tìm thấy địa chỉ cho đơn hàng ID: " + orderId));

            //  Tạo map chứa thông tin địa chỉ
            Map<String, Object> addressMap = new HashMap<>();
            addressMap.put("recipientName", orderAddress.getRecipientName());
            addressMap.put("phoneNumber", orderAddress.getPhoneNumber());
            addressMap.put("provinceCity", orderAddress.getProvinceCity());
            addressMap.put("district", orderAddress.getDistrict());
            addressMap.put("wardSubdistrict", orderAddress.getWardSubdistrict());
            addressMap.put("addressDetail", orderAddress.getAddressDetail());

            //  Kiểm tra phương thức thanh toán để hiển thị trạng thái phù hợp
            //  Thêm dữ liệu vào `orderDetails`
            orderDetails.put("orderId", order.getId());
            orderDetails.put("userId", order.getUserId());
            orderDetails.put("orderDate", order.getOrderDate());
            orderDetails.put("discount", order.getDiscount());
            orderDetails.put("totalPayment", order.getTotalPayment());
            orderDetails.put("paymentMethod", order.getPaymentMethod());
            orderDetails.put("note", order.getNote());
            orderDetails.put("orderStatus", order.getOrderStatus());
            orderDetails.put("address", addressMap);
            orderDetails.put("items", itemDetails);

        } catch (Exception e) {
            System.err.println(" Lỗi khi lấy chi tiết đơn hàng: " + e.getMessage());
            orderDetails.put("error", "Không thể lấy thông tin đơn hàng.");
        }

        return orderDetails;
    }

    /// lấy đơn hàng theo trạng thái 
    public List<Order> getOrdersByUserAndStatus(Integer userId, String status) {
        return orderRepository.findByUserIdAndOrderStatus(userId, status);
    }

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(String status) {
        // Giả sử Order có thuộc tính 'orderStatus' là trạng thái của đơn hàng
        return orderRepository.findByOrderStatus(status);
    }

    /// lấy tất cả đơn hàng
    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    ////////////////////////////////// hủy đơn hàng
    // public void cancelOrder(int orderId) {
    //     Optional<Order> orderOptional = orderRepository.findById(orderId);
    //     if (orderOptional.isPresent()) {
    //         Order order = orderOptional.get();
    //         order.setOrderStatus("Đã Hủy");
    //         orderRepository.save(order);
    //     } else {
    //         throw new RuntimeException("Order not found");
    //     }
    // }
    public void cancelOrder(int orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            if ("Chờ Xác Nhận".equals(order.getOrderStatus())) {
                order.setOrderStatus("Đã Hủy");
                // Khôi phục số lượng sản phẩm đã bán và tồn kho
                // Kiểm tra danh sách sản phẩm trong đơn hàng
                if (order.getOrderItems().isEmpty()) {
                    System.out.println("Không có sản phẩm nào trong đơn hàng!");
                    throw new RuntimeException("Không có sản phẩm nào trong đơn hàng để cập nhật số lượng.");
                }
                // Cập nhật số lượng sản phẩm đã bán và tồn kho
                for (OrderItem item : order.getOrderItems()) {
                    System.out.println("Cập nhật sản phẩm: " + item.getProductId() + " - Số lượng: " + item.getQuantity());
                    productRepository.restoreProductStock(item.getProductId(), item.getQuantity());
                }
                orderRepository.save(order);
                // Kiểm tra số lần hủy đơn của người dùng
                long cancelledOrders = orderRepository.countByUserIdAndOrderStatus(order.getUserId(), "Đã Hủy");

                if (cancelledOrders > 5) {
                    disableUserAccount(order.getUserId());
                }
            } else {
                throw new RuntimeException("Hủy đơn hàng được thực hiện khi ở trạng thái chờ xác nhận!");
            }
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    ////////////////////////////////////// cập nhật trạng thái đơn hàng
    public void updateOrderStatus(int orderId, String newStatus) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setOrderStatus(newStatus);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    ////////////////////////////////////////////////////////////
    /// 
    /// 
  public List<Order> getOrdersByDate(LocalDate orderDate) {
        return orderRepository.findOrdersByOrderDate(orderDate); // Truy vấn từ repository
    }

    // Phương thức lấy đơn hàng theo trạng thái và ngày (hoặc thiếu một trong hai)
    public List<Order> getOrders(String status, String orderDate) {
        return orderRepository.findOrdersByStatusAndDate(status, orderDate);
    }

    /////
    /// 
     // Phương thức thống kê doanh thu theo danh mục và thời gian
     public BigDecimal getRevenueByGenreAndTime(String genre, Date startDate, Date endDate) {
        // Đảm bảo rằng startDate và endDate bao gồm cả toàn bộ ngày
        startDate = getStartOfDay(startDate);  // Đặt startDate là bắt đầu ngày (00:00:00)
        endDate = getEndOfDay(endDate);        // Đặt endDate là kết thúc ngày (23:59:59)

        // Lấy danh sách các sản phẩm theo genre
        List<Product> products = productRepository.findByGenre(genre);

        BigDecimal totalRevenue = BigDecimal.ZERO;

        // Lặp qua các sản phẩm để tính doanh thu trong khoảng thời gian
        for (Product product : products) {
            // Lấy danh sách các OrderItem cho sản phẩm này trong khoảng thời gian và trạng thái "Hoàn Thành"
            List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                    product.getId(), startDate, endDate, "Hoàn Thành");

            for (OrderItem orderItem : orderItems) {
                totalRevenue = totalRevenue.add(orderItem.getTotal());
            }
        }

        return totalRevenue;
    }

    public Map<String, BigDecimal> getRevenueByAllGenres(Date startDate, Date endDate) {
        // Đảm bảo rằng startDate và endDate bao gồm cả toàn bộ ngày
        startDate = getStartOfDay(startDate);  // Đặt startDate là bắt đầu ngày (00:00:00)
        endDate = getEndOfDay(endDate);        // Đặt endDate là kết thúc ngày (23:59:59)

        // Lấy danh sách tất cả các danh mục (genre)
        List<String> genres = productRepository.findAllGenres();

        // Map để lưu doanh thu của từng danh mục
        Map<String, BigDecimal> revenueByGenre = new HashMap<>();

        // Lặp qua tất cả các danh mục và tính doanh thu
        for (String genre : genres) {
            BigDecimal totalRevenue = BigDecimal.ZERO;

            // Lấy danh sách các sản phẩm trong từng danh mục
            List<Product> products = productRepository.findByGenre(genre);

            // Lặp qua các sản phẩm và tính doanh thu của chúng trong khoảng thời gian
            for (Product product : products) {
                // Lấy danh sách các OrderItem cho sản phẩm này trong khoảng thời gian và trạng thái "Hoàn Thành"
                List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                        product.getId(), startDate, endDate, "Hoàn Thành");

                for (OrderItem orderItem : orderItems) {
                    totalRevenue = totalRevenue.add(orderItem.getTotal());
                }
            }

            revenueByGenre.put(genre, totalRevenue);
        }

        return revenueByGenre;
    }
    // Phương thức này trả về ngày bắt đầu của một ngày (00:00:00)

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

    public Map<String, Map<String, BigDecimal>> getRevenueByGenresDaily(Date startDate, Date endDate) {
        // Map để lưu doanh thu theo ngày và theo danh mục
        Map<String, Map<String, BigDecimal>> revenueByDateAndGenre = new HashMap<>();

        // Lặp qua tất cả các ngày trong khoảng thời gian
        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(startDate);
        Calendar endCalendar = Calendar.getInstance();
        endCalendar.setTime(endDate);

        while (!startCalendar.after(endCalendar)) {
            // Đảm bảo rằng currentDate chỉ là ngày, không có giờ phút giây
            startCalendar.set(Calendar.HOUR_OF_DAY, 0);
            startCalendar.set(Calendar.MINUTE, 0);
            startCalendar.set(Calendar.SECOND, 0);
            startCalendar.set(Calendar.MILLISECOND, 0);

            Date currentDate = startCalendar.getTime();  // Lấy ngày hiện tại

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
                    // Sử dụng getStartOfDay và getEndOfDay để lấy ngày mà không có thời gian
                    Date startOfDay = getStartOfDay(currentDate);
                    Date endOfDay = getEndOfDay(currentDate);

                    // Lấy danh sách các OrderItem cho sản phẩm này trong ngày và trạng thái "Hoàn Thành"
                    List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                            product.getId(), startOfDay, endOfDay, "Hoàn Thành");

                    for (OrderItem orderItem : orderItems) {
                        totalRevenue = totalRevenue.add(orderItem.getTotal());
                    }
                }

                dailyRevenue.put(genre, totalRevenue);
            }

            // Chuyển đổi currentDate thành chuỗi ngày theo định dạng yyyy-MM-dd
            String formattedDate = new SimpleDateFormat("yyyy-MM-dd").format(currentDate);

            // Thêm doanh thu của ngày vào tổng doanh thu theo ngày và danh mục
            revenueByDateAndGenre.put(formattedDate, dailyRevenue);

            // Tiến đến ngày kế tiếp
            startCalendar.add(Calendar.DATE, 1);
        }

        return revenueByDateAndGenre;
    }

    // Tính doanh thu theo tháng
    public Map<String, Map<String, BigDecimal>> getRevenueByGenresMonthly(Date startDate, Date endDate) {
        Map<String, Map<String, BigDecimal>> revenueByMonthAndGenre = new HashMap<>();

        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(startDate);
        Calendar endCalendar = Calendar.getInstance();
        endCalendar.setTime(endDate);

        while (!startCalendar.after(endCalendar)) {
            String month = (startCalendar.get(Calendar.MONTH) + 1) + "-" + startCalendar.get(Calendar.YEAR);

            Map<String, BigDecimal> monthlyRevenue = new HashMap<>();

            List<String> genres = productRepository.findAllGenres();

            for (String genre : genres) {
                BigDecimal totalRevenue = BigDecimal.ZERO;

                List<Product> products = productRepository.findByGenre(genre);

                for (Product product : products) {
                    List<OrderItem> orderItems = orderRepository.findOrderItemsByProductIdAndDateRangeAndStatus(
                            product.getId(), getStartOfMonth(startCalendar.getTime()), getEndOfMonth(startCalendar.getTime()), "Hoàn Thành");

                    for (OrderItem orderItem : orderItems) {
                        totalRevenue = totalRevenue.add(orderItem.getTotal());
                    }
                }

                monthlyRevenue.put(genre, totalRevenue);
            }

            revenueByMonthAndGenre.put(month, monthlyRevenue);

            startCalendar.add(Calendar.MONTH, 1);
        }

        return revenueByMonthAndGenre;
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

    public long countPendingOrders() {
        return orderRepository.countByOrderStatus("Chờ Xác Nhận"); // Trạng thái cần đếm
    }

    /// đếm số sản phẩm đã bán
    public int countSoldProducts() {
        List<Order> completedOrders = orderRepository.findByOrderStatus("Hoàn Thành");

        int totalSold = 0;
        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                totalSold += item.getQuantity();
            }
        }

        return totalSold;
    }

    ///// vô hiệu hóa tài khoản
    /// 
    private void disableUserAccount(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setStatus(false);
            userRepository.save(user);
        }
    }

    public void cancelUserAccount(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Đánh dấu đơn bị hủy
        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);

        // Đếm số đơn đã bị hủy của người dùng
        long cancelledOrders = orderRepository.countByUserIdAndOrderStatus(order.getUserId(), "CANCELLED");

        if (cancelledOrders >= 3) {
            // Vô hiệu hóa tài khoản
            User user = userRepository.findById(order.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setStatus(false);
            userRepository.save(user);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.stream.Collectors;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.Pet.Modal.Order;
// import com.example.Pet.Modal.OrderAddress;
// import com.example.Pet.Modal.OrderItem;
// import com.example.Pet.Modal.Product;
// import com.example.Pet.Repository.OrderAddressRepository;
// import com.example.Pet.Repository.OrderItemRepository;
// import com.example.Pet.Repository.OrderRepository;
// import com.example.Pet.Repository.ProductRepository;

// @Service
// public class OrderService {

//     @Autowired
//     private OrderRepository orderRepository;

//     @Autowired
//     private OrderItemRepository orderItemRepository;

//     @Autowired
//     private OrderAddressRepository orderAddressRepository;

//     @Autowired
//     private ProductRepository productRepository;

//     // ✅ Cập nhật orderDate thành LocalDateTime khi tạo đơn hàng
//     @Transactional
//     public Order createOrder(Integer userId, BigDecimal discount, BigDecimal totalPayment, String paymentMethod,
//             List<OrderItem> orderItems, Integer addressId) {

//         Order order = new Order();
//         order.setUserId(userId);
//         order.setOrderDate(LocalDateTime.now());  // ✅ Dùng LocalDateTime thay cho Date
//         order.setDiscount(discount);
//         order.setOrderStatus("Chờ Xác Nhận");
//         order.setTotalPayment(totalPayment);
//         order.setPaymentMethod(paymentMethod);

//         // Liên kết order với orderItems
//         for (OrderItem item : orderItems) {
//             item.setOrder(order);
//             Product product = productRepository.findById(item.getProductId())
//                     .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + item.getProductId()));

//             if (product.getQuantity() < item.getQuantity()) {
//                 throw new RuntimeException("Số lượng tồn kho không đủ cho sản phẩm: " + product.getName());
//             }

//             product.setSold(product.getSold() + item.getQuantity());
//             product.setQuantity(product.getQuantity() - item.getQuantity());
//             productRepository.save(product);
//         }
//         order.setOrderItems(orderItems);
//         Order savedOrder = orderRepository.save(order);

//         OrderAddress orderAddress = new OrderAddress();
//         orderAddress.setUserId(userId);
//         orderAddress.setOrderId(savedOrder.getId());
//         orderAddress.setAddressId(addressId);
//         orderAddressRepository.save(orderAddress);

//         return savedOrder;
//     }

//     ///////////////// lấy chi tiết đơn hàng
//      public Map<String, Object> getOrderDetails(Integer orderId) {
//         // Tìm thông tin đơn hàng
//         Order order = orderRepository.findById(orderId)
//                 .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
//         // Tìm danh sách OrderItem liên quan
//         List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
//         // Lấy thông tin chi tiết sản phẩm cho từng OrderItem
//         List<Map<String, Object>> itemDetails = orderItems.stream().map(orderItem -> {
//             Product product = productRepository.findById(orderItem.getProductId())
//                     .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItem.getProductId()));
//             Map<String, Object> itemMap = new HashMap<>();
//             itemMap.put("id", orderItem.getId());
//             itemMap.put("productName", product.getName());
//             itemMap.put("price", product.getPrice());
//             itemMap.put("quantity", orderItem.getQuantity());
//             itemMap.put("url", product.getUrl());
//             itemMap.put("total", orderItem.getTotal());
//             return itemMap;
//         }).collect(Collectors.toList());
//         // Tìm địa chỉ liên quan đến đơn hàng
//         OrderAddress orderAddress = orderAddressRepository.findByOrderId(orderId)
//                 .orElseThrow(() -> new RuntimeException("Order address not found for Order ID: " + orderId));
//         // Tạo map chứa thông tin địa chỉ
//         Map<String, Object> addressMap = new HashMap<>();
//         addressMap.put("userId", orderAddress.getUserId());
//         addressMap.put("addressId", orderAddress.getAddressId());
//         // Tạo map trả về
//         Map<String, Object> orderDetails = new HashMap<>();
//         orderDetails.put("orderId", order.getId());
//         orderDetails.put("userId", order.getUserId());
//         orderDetails.put("orderDate", order.getOrderDate());
//         orderDetails.put("discount", order.getDiscount());
//         orderDetails.put("totalPayment", order.getTotalPayment());
//         orderDetails.put("paymentMethod", order.getPaymentMethod());
//         orderDetails.put("orderStatus", order.getOrderStatus());
//         orderDetails.put("address", addressMap);
//         orderDetails.put("items", itemDetails);
//         return orderDetails;
//     }

//     /// lấy đơn hàng theo trạng thái 
//     public List<Order> getOrdersByUserAndStatus(Integer userId, String status) {
//         return orderRepository.findByUserIdAndOrderStatus(userId, status);
//     }

//     public List<Order> getOrdersByStatus(String status) {
//         // Giả sử Order có thuộc tính 'orderStatus' là trạng thái của đơn hàng
//         return orderRepository.findByOrderStatus(status);
//     }

//     // ✅ Lấy đơn hàng theo ngày (chỉ lấy phần ngày, bỏ giờ phút giây)
//     public List<Order> getOrdersByDate(LocalDate orderDate) {
//         return orderRepository.findOrdersByOrderDate(orderDate);
//     }

//     // ✅ Lấy đơn hàng theo trạng thái và ngày
//     public List<Order> getOrders(String status, LocalDate orderDate) {
//         return orderRepository.findOrdersByStatusAndDate(status, orderDate);
//     }

//     // ✅ Lấy tất cả đơn hàng
//     public List<Order> getAllOrders() {
//         return orderRepository.findAll();
//     }

//     // ✅ Lấy đơn hàng theo userId
//     public List<Order> getOrdersByUserId(Integer userId) {
//         return orderRepository.findByUserId(userId);
//     }

//     // ✅ Hủy đơn hàng
//     @Transactional
//     public void cancelOrder(int orderId) {
//         Optional<Order> orderOptional = orderRepository.findById(orderId);
//         if (orderOptional.isPresent()) {
//             Order order = orderOptional.get();
//             if ("Chờ Xác Nhận".equals(order.getOrderStatus())) {
//                 order.setOrderStatus("Đã Hủy");
//                 for (OrderItem item : order.getOrderItems()) {
//                     productRepository.restoreProductStock(item.getProductId(), item.getQuantity());
//                 }
//                 orderRepository.save(order);
//             } else {
//                 throw new RuntimeException("Hủy đơn hàng chỉ áp dụng khi đang chờ xác nhận!");
//             }
//         } else {
//             throw new RuntimeException("Order not found");
//         }
//     }

//     ////////////////////////////////////// cập nhật trạng thái đơn hàng
//     public void updateOrderStatus(int orderId, String newStatus) {
//         Optional<Order> orderOptional = orderRepository.findById(orderId);
//         if (orderOptional.isPresent()) {
//             Order order = orderOptional.get();
//             order.setOrderStatus(newStatus);
//             orderRepository.save(order);
//         } else {
//             throw new RuntimeException("Order not found");
//         }
//     }
// }
