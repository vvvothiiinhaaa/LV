package com.example.Pet.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Pet.Modal.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
}
