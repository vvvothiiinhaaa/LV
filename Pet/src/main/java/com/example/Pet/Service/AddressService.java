package com.example.Pet.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Pet.Modal.Address;
import com.example.Pet.Repository.AddressRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }

    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address updateAddress(Long userId, Long Id, Address addressDetails) {
        Address address = addressRepository.findByUserIdAndId(userId, Id)
                .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));
        address.setRecipientName(addressDetails.getRecipientName());
        address.setPhoneNumber(addressDetails.getPhoneNumber());
        address.setProvinceCity(addressDetails.getProvinceCity());
        address.setDistrict(addressDetails.getDistrict());
        address.setWardSubdistrict(addressDetails.getWardSubdistrict());
        return addressRepository.save(address);
    }

    public void deleteAddressAll(Long id) {
        addressRepository.deleteById(id);
    }

    public void deleteAddress(Long userId, Long Id) {
        Address address = addressRepository.findByUserIdAndId(userId, Id)
                .orElseThrow(() -> new RuntimeException("Address not found or does not belong to the user"));
        addressRepository.delete(address);
    }
}
