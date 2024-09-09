package com.amess.messbook.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

    @Query(value = """
            SELECT DEVICE.*
            FROM DEVICE
            INNER JOIN "user" AS U ON DEVICE.USER_ID = U.ID
            WHERE DEVICE.USER_ID = :userId
            """, nativeQuery = true)
    List<Device> getDevicesForUser(UUID userId);

    List<Device> findByUserId(UUID userId);

    @Transactional
    @Modifying
    void deleteByDeviceToken(String deviceToken);
}
