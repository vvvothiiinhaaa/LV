package com.example.Pet.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.Pet.Service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/api/payment")
public class PaymentController {

    // @PostMapping("/create-payment")
    // @ResponseBody
    // public ResponseEntity<String> createPayment(@RequestBody Map<String, Object> paymentRequest,
    //         HttpServletRequest request) throws UnsupportedEncodingException {
    //     int amount = (int) paymentRequest.get("amount");
    //     String orderInfo = (String) paymentRequest.get("orderInfo");
    //     // Base URL
    //     String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    //     // VNPay Parameters
    //     String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
    //     String vnp_IpAddr = VNPayConfig.getIpAddress(request);
    //     String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
    //     Map<String, String> vnp_Params = new HashMap<>();
    //     vnp_Params.put("vnp_Version", "2.1.0");
    //     vnp_Params.put("vnp_Command", "pay");
    //     vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
    //     vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
    //     vnp_Params.put("vnp_CurrCode", "VND");
    //     vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    //     vnp_Params.put("vnp_OrderInfo", orderInfo);
    //     vnp_Params.put("vnp_OrderType", "billpayment");
    //     vnp_Params.put("vnp_Locale", "vn");
    //     vnp_Params.put("vnp_ReturnUrl", baseUrl + VNPayConfig.vnp_Returnurl);
    //     vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
    //     Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
    //     SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
    //     String vnp_CreateDate = formatter.format(cld.getTime());
    //     vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
    //     cld.add(Calendar.MINUTE, 15);
    //     String vnp_ExpireDate = formatter.format(cld.getTime());
    //     vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
    //     List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
    //     Collections.sort(fieldNames);
    //     StringBuilder hashData = new StringBuilder();
    //     StringBuilder query = new StringBuilder();
    //     for (String fieldName : fieldNames) {
    //         String fieldValue = vnp_Params.get(fieldName);
    //         if (fieldValue != null && fieldValue.length() > 0) {
    //             hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
    //             query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
    //             query.append('&');
    //             hashData.append('&');
    //         }
    //     }
    //     // Remove trailing '&' character
    //     query.setLength(query.length() - 1);
    //     hashData.setLength(hashData.length() - 1);
    //     String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
    //     query.append("&vnp_SecureHash=").append(vnp_SecureHash);
    //     String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + query;
    //     return ResponseEntity.ok(paymentUrl);
    // }
    // @GetMapping("/return")
    // public String returnPayment(HttpServletRequest request) {
    //     try {
    //         // Kiểm tra tham số từ VNPay
    //         String redirectUrl = "http://localhost:8080/cartt.html";
    //         // Lấy các tham số từ VNPay
    //         String vnp_SecureHash = request.getParameter("vnp_SecureHash");
    //         Map<String, String> fields = new HashMap<>();
    //         for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
    //             String fieldName = params.nextElement();
    //             String fieldValue = request.getParameter(fieldName);
    //             if (!"vnp_SecureHash".equals(fieldName) && !"vnp_SecureHashType".equals(fieldName)) {
    //                 fields.put(fieldName, fieldValue);
    //             }
    //         }
    //         String signValue = VNPayConfig.hashAllFields(fields);
    //         // Kiểm tra chữ ký
    //         if (signValue.equals(vnp_SecureHash)) {
    //             String transactionStatus = request.getParameter("vnp_TransactionStatus");
    //             if ("00".equals(transactionStatus)) {
    //                 redirectUrl += "?status=success&message=Thanh toán thành công!";
    //             } else {
    //                 redirectUrl += "?status=failed&message=Giao dịch không thành công!";
    //             }
    //         } else {
    //             redirectUrl += "?status=failed&message=Dữ liệu không hợp lệ!";
    //         }
    //         System.out.println("Redirect URL: " + redirectUrl); // Log kiểm tra
    //         return "redirect:" + redirectUrl;
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         return "redirect:http://localhost:8080/cartt.html?status=failed&message=Lỗi hệ thống!";
    //     }
    // }
    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/create-payment")
    public ResponseEntity<String> submitOrder(@RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        System.out.print(vnpayUrl);
        // Trả về URL dưới dạng JSON hoặc plain text
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/return")
    public String handleVNPayReturn(HttpServletRequest request, Model model) {
        // Kiểm tra trạng thái thanh toán từ VNPay
        int paymentStatus = vnPayService.orderReturn(request);

        // Lấy thông tin từ VNPay callback
        String orderInfo = request.getParameter("vnp_OrderInfo"); // Thông tin đơn hàng
        String transactionId = request.getParameter("vnp_TransactionNo"); // Mã giao dịch VNPay
        String paymentTime = request.getParameter("vnp_PayDate"); // Thời gian thanh toán
        String totalPrice = request.getParameter("vnp_Amount"); // Tổng tiền thanh toán

        // Chuyển trạng thái thanh toán về giao diện (không lưu vào database)
        model.addAttribute("orderInfo", orderInfo);
        model.addAttribute("transactionId", transactionId);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("totalPrice", totalPrice);

        // Thêm thông báo kết quả thanh toán
        if (paymentStatus == 1) {
            // Thanh toán thành công
            model.addAttribute("message", "Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.");
            return "redirect:/fontend/cartt.html?st=1&message=success";
        } else {
            // Thanh toán thất bại
            model.addAttribute("message", "Thanh toán thất bại! Vui lòng thử lại.");
            return "redirect:/fontend/cartt.html?st=0&message=failure";
        }
    }

}
