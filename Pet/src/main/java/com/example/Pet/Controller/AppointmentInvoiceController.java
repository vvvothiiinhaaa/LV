package com.example.Pet.Controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.DTO.InvoiceResponse;
import com.example.Pet.Modal.Appointment;
import com.example.Pet.Modal.Pet;
import com.example.Pet.Modal.ServicePrice;
import com.example.Pet.Modal.Serviceforpet;
import com.example.Pet.Repository.AppointmentRepository;
import com.example.Pet.Repository.ServicePriceRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentInvoiceController {

    private final AppointmentRepository appointmentRepository;
    private final ServicePriceRepository servicePriceRepository;

    @GetMapping("/{appointmentId}/invoice")
    public ResponseEntity<?> getInvoice(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));

        if (!"Hoàn Thành".equalsIgnoreCase(appointment.getStatus())) {
            return ResponseEntity.badRequest().body("Lịch hẹn chưa ở trạng thái 'Hoàn Thành'");
        }

        InvoiceResponse invoice = new InvoiceResponse();
        invoice.setAppointmentId(appointment.getId().longValue()); // do id là Integer
        invoice.setCustomerName("Khách hàng #" + appointment.getUserId()); // tạm dùng userId nếu không có tên
        invoice.setAppointmentStatus(appointment.getStatus());
        invoice.setAppointmentDate(appointment.getAppDate().atTime(appointment.getStartTime()));

        List<InvoiceResponse.ServiceDetail> serviceDetails = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Pet pet : appointment.getPets()) {
            for (Serviceforpet service : appointment.getServices()) {
                ServicePrice servicePrice = servicePriceRepository
                        .findByPetSizeIdAndServiceforpetId(pet.getSize().getId(), service.getId());

                if (servicePrice == null) {
                    throw new RuntimeException("Không tìm thấy giá cho dịch vụ " + service.getName()
                            + " với thú cưng kích cỡ " + pet.getSize().getSizeName());
                }

                InvoiceResponse.ServiceDetail detail = new InvoiceResponse.ServiceDetail();
                detail.setPetName(pet.getName());
                detail.setPetSize(pet.getSize().getSizeName());
                detail.setServiceName(service.getName());
                detail.setPrice(servicePrice.getPrice());

                total = total.add(servicePrice.getPrice());
                serviceDetails.add(detail);
            }
        }

        invoice.setTotalPrice(total);
        invoice.setServices(serviceDetails);

        return ResponseEntity.ok(invoice);
    }
}
