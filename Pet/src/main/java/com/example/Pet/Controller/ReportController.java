// package com.example.Pet.Controller;

// import java.math.BigDecimal;
// import java.util.HashMap;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.Pet.Service.RevenueService;

// @RestController
// @RequestMapping("/api/reports")
// public class ReportController {

//     @Autowired
//     private RevenueService reportService;

//     @GetMapping("/revenue-by-category")
//     public ResponseEntity<Map<String, BigDecimal>> getRevenueByCategory(
//             @RequestParam String period,
//             @RequestParam String genre) {

//         try {
//             BigDecimal totalRevenue = reportService.calculateRevenueByCategory(period, genre);
//             Map<String, BigDecimal> response = new HashMap<>();
//             response.put("totalRevenue", totalRevenue);
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//         }
//     }
// }
