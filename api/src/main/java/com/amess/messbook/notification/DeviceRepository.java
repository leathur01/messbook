package com.amess.messbook.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

    @Query(value = """
            SELECT DEVICE.*
            FROM DEVICE
            JOIN "user" AS U ON DEVICE.USER_ID = U.ID;
            """, nativeQuery = true)
    List<Device> getDeviceForUser(UUID userId);

    List<Device> findByUserId(UUID userId);
}
