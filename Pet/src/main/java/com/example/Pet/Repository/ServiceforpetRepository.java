package com.example.Pet.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Pet.Modal.Serviceforpet;

@Repository
public interface ServiceforpetRepository extends JpaRepository<Serviceforpet, Integer> {

    @Query("SELECT s FROM Serviceforpet s LEFT JOIN FETCH s.steps LEFT JOIN FETCH s.prices")
    List<Serviceforpet> findAllWithDetails();

    ////////////////// sử dụng cho chat gpt truy vấn 
    // List<Serviceforpet> findByNameContainingIgnoreCase(String name);

    @EntityGraph(attributePaths = {"steps", "prices"})
    @Query("SELECT s FROM Serviceforpet s WHERE LOWER(s.name) LIKE %:keyword%")
    List<Serviceforpet> searchByNameIgnoreCase(@Param("keyword") String keyword);

    // @Query("SELECT s FROM Serviceforpet s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    // List<Serviceforpet> searchByName(@Param("name") String name);
    // @EntityGraph(attributePaths = {"steps", "prices"})
    // @Query("SELECT s FROM Serviceforpet s")
    // List<Serviceforpet> findAllWithDetails2();
//     @Query("SELECT s FROM Serviceforpet s WHERE "
//             + "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
//             + "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//     List<Serviceforpet> searchByKeyword(@Param("keyword") String keyword);
    @Query("SELECT s FROM Serviceforpet s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :message, '%')) "
            + "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :message, '%'))")
    List<Serviceforpet> searchWithDetails(String message);

    // Tìm tất cả các dịch vụ với chi tiết
    @Query("SELECT s FROM Serviceforpet s LEFT JOIN FETCH s.steps LEFT JOIN FETCH s.prices")
    List<Serviceforpet> findAllWithDetails2();  // Dùng cho các câu hỏi về danh sách dịch vụ
}
