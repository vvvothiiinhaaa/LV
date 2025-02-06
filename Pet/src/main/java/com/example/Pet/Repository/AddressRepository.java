package com.example.Pet.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Pet.Modal.Address;

import jakarta.transaction.Transactional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    // câpj nhật địa chỉ
    Optional<Address> findByUserIdAndId(Long userId, Long Id);

    // @Modifying
    // @Query("UPDATE Address a SET a.defaultAddress = false WHERE a.userId = :userId AND a.id <> :id")
    // void updateAllAddressesToNonDefault(@Param("userId") Long userId, @Param("id") Long id);
    @Modifying
    @Query("UPDATE Address a SET a.defaultAddress = false WHERE a.userId = :userId AND a.id != :addressId")
    void updateAllAddressesToNonDefault(@Param("userId") Long userId, @Param("addressId") Long addressId);

    /// xóa tham chiếu 
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM order_address WHERE address_id = :addressId", nativeQuery = true)
    void deleteReferences(@Param("addressId") Long addressId);

    // @Modifying
    // @Transactional
    // @Query("DELETE FROM Address a WHERE a.userId = :userId AND a.id IN :ids")
    // void deleteAddressesForUser(Long userId, List<Long> ids);
    @Modifying
    @Transactional
    @Query("DELETE FROM Address a WHERE a.userId = :userId AND a.id = :id")
    void deleteAddressByUserIdAndId(Long userId, Long id);

    ////////////////////////////// kiểm tra mặc định để tạo địa chỉ mới
    @Query("SELECT COUNT(a) > 0 FROM Address a WHERE a.userId = :userId AND a.defaultAddress = true")
    boolean existsByUserIdAndIsDefaultAddressTrue(@Param("userId") Long userId);


///////////////////////////////////
   

}
