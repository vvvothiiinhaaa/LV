package com.example.Pet.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Pet.Modal.Address;
import com.example.Pet.Service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    // API để thêm địa chỉ mới
    @PostMapping("/create")
    public Address createAddress(@RequestBody Address address) {
        return addressService.createAddress(address);
    }

    // API để lấy thông tin chi tiết một địa chỉ
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Long userId) {
        List<Address> addresses = addressService.getAddressesByUserId(userId);
        if (addresses.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(addresses);
    }

    // API lấy chi tiết 1 địa chỉ theo userId và addressId
    @GetMapping("/{userId}/{addressId}")
    public ResponseEntity<Address> getAddressDetails(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        Address address = addressService.getAddressByUserIdAndId(userId, addressId);
        return ResponseEntity.ok(address);
    }

    // // API để cập nhật thông tin địa chỉ
    // @PutMapping("/update/user/{userId}/address/{addressId}")
    // public ResponseEntity<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId, @RequestBody Address addressDetails) {
    //     try {
    //         Address updatedAddress = addressService.updateAddress(userId, addressId, addressDetails);
    //         return ResponseEntity.ok(updatedAddress);
    //     } catch (RuntimeException ex) {
    //         return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy địa chỉ hoặc không thuộc về người dùng
    //     }
    // }
    // @PutMapping("/update/user/{userId}/address/{addressId}")
    // public ResponseEntity<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId, @RequestBody Address addressDetails) {
    //     try {
    //         Address updatedAddress = addressService.updateAddress(userId, addressId, addressDetails);
    //         return ResponseEntity.ok(updatedAddress);
    //     } catch (RuntimeException ex) {
    //         return ResponseEntity.notFound().build();
    //     }
    // }
    @PutMapping("/update/user/{userId}/address/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @RequestBody Address address) {
        return ResponseEntity.ok(addressService.updateAddress(userId, addressId, address));
    }

    /////////////////////////////////////////////////////////////////////////////

    // // API để xóa một địa chỉ
    // @DeleteMapping("/delete/{id}")
    // public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
    //     addressService.deleteAddressAll(id);
    //     return ResponseEntity.ok().build();
    // }
    @DeleteMapping("/user/{userId}/address/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long userId, @PathVariable Long id) {
        try {
            addressService.deleteAddress(userId, id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // xóa 110125
    // @DeleteMapping("/delete/{userId}")
    // public void deleteSpecificAddresses(@PathVariable Long userId, @RequestBody List<Long> addressIds) {
    //     addressService.deleteSpecificAddresses(userId, addressIds);
    // }
    // @DeleteMapping("/delete/{userId}/{id}")
    // public String deleteAddressByUserIdAndId(@PathVariable Long userId, @PathVariable Long id) {
    //     addressService.deleteAddressByUserIdAndId(userId, id);
    //     return "Xóa địa chỉ thành công";
    // }
    @DeleteMapping("/delete/{userId}/{id}")
    public ResponseEntity<String> deleteAddressByUserIdAndId(@PathVariable Long userId, @PathVariable Long id) {
        try {
            addressService.deleteAddressByUserIdAndId(userId, id);
            return ResponseEntity.ok("Xóa địa chỉ thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa địa chỉ: " + e.getMessage());
        }
    }

}
