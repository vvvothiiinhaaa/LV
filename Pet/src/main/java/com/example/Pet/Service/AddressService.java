package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Address;
import com.example.Pet.Repository.AddressRepository;

import jakarta.transaction.Transactional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    // public Address createAddress(Address address) {     ///////////// cập nhật lại phía dưới 
    //     return addressRepository.save(address);
    // }
    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    // Lấy chi tiết địa chỉ theo userId và addressId
    public Address getAddressByUserIdAndId(Long userId, Long addressId) {
        return addressRepository.findByUserIdAndId(userId, addressId)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại hoặc không thuộc về người dùng."));
    }

    // public Address updateAddress(Long userId, Long Id, Address addressDetails) {
    //     Address address = addressRepository.findByUserIdAndId(userId, Id)
    //             .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));
    //     address.setRecipientName(addressDetails.getRecipientName());
    //     address.setPhoneNumber(addressDetails.getPhoneNumber());
    //     address.setProvinceCity(addressDetails.getProvinceCity());
    //     address.setDistrict(addressDetails.getDistrict());
    //     address.setWardSubdistrict(addressDetails.getWardSubdistrict());
    //     address.setAddressDetail(addressDetails.getAddressDetail());
    //     return addressRepository.save(address);
    // }
    // public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
    //     Address address = addressRepository.findByUserIdAndId(userId, addressId)
    //             .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //     // Cập nhật thông tin địa chỉ
    //     address.setRecipientName(addressDetails.getRecipientName());
    //     address.setPhoneNumber(addressDetails.getPhoneNumber());
    //     address.setProvinceCity(addressDetails.getProvinceCity());
    //     address.setDistrict(addressDetails.getDistrict());
    //     address.setWardSubdistrict(addressDetails.getWardSubdistrict());
    //     address.setAddressDetail(addressDetails.getAddressDetail());
    //     address.setDefaultAddress(addressDetails.isDefaultAddress());

    //     // Cập nhật trạng thái mặc định nếu cần
    //     if (addressDetails.isDefaultAddress()) {
    //         addressRepository.updateAllAddressesToNonDefault(userId, addressId);
    //     }

    //     return addressRepository.save(address);
    // }
//////////////////////////////////////////////////////////////////////////////
    public void deleteAddressAll(Long id) {
        addressRepository.deleteById(id);
    }

    public void deleteAddress(Long userId, Long Id) {
        Address address = addressRepository.findByUserIdAndId(userId, Id)
                .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));
        addressRepository.delete(address);
    }

    ///////////////////////////////////////////////////////////////////////////
    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        // Tìm kiếm địa chỉ theo userId và addressId
        Address address = addressRepository.findByUserIdAndId(userId, addressId)
                .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));

        // Cập nhật thông tin địa chỉ
        address.setRecipientName(addressDetails.getRecipientName());
        address.setPhoneNumber(addressDetails.getPhoneNumber());
        address.setProvinceCity(addressDetails.getProvinceCity());
        address.setDistrict(addressDetails.getDistrict());
        address.setWardSubdistrict(addressDetails.getWardSubdistrict());
        address.setAddressDetail(addressDetails.getAddressDetail());

        // Kiểm tra và cập nhật trạng thái mặc định
        if (addressDetails.isDefaultAddress()) {
            // Đặt tất cả các địa chỉ khác về không mặc định
            addressRepository.updateAllAddressesToNonDefault(userId, addressId);
            // Đặt địa chỉ hiện tại thành mặc định
            address.setDefaultAddress(true);
        } else {
            // Nếu không, chỉ cập nhật trạng thái hiện tại
            address.setDefaultAddress(false);
        }

        // Lưu lại thông tin địa chỉ
        return addressRepository.save(address);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////    

    // public void deleteSpecificAddresses(Long userId, List<Long> addressIds) {
    //     addressRepository.deleteAddressesForUser(userId, addressIds);
    // }

    public void deleteAddressByUserIdAndId(Long userId, Long addressId) {
        addressRepository.deleteReferences(addressId);
        addressRepository.deleteAddressByUserIdAndId(userId, addressId);
    }

    //////////////////////////////////// kiểm tra xem có giá trị mặc định nào true chưa
    public Address createAddress(Address address) {
        // Kiểm tra nếu có bất kỳ địa chỉ nào đã được đặt là mặc định
        boolean hasDefaultAddress = addressRepository.existsByUserIdAndIsDefaultAddressTrue(address.getUserId());

        // Nếu đã có địa chỉ mặc định, gán isDefaultAddress của địa chỉ mới thành false
        if (hasDefaultAddress) {
            address.setDefaultAddress(false);
        }

        // Lưu địa chỉ mới vào cơ sở dữ liệu
        return addressRepository.save(address);

    }
}
