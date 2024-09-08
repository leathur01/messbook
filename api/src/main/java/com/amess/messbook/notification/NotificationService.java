package com.amess.messbook.notification;

import com.amess.messbook.social.UserService;
import com.amess.messbook.social.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class NotificationService {

    private final DeviceRepository deviceRepository;
    private final UserService userService;

    Device addDevice(UUID userId, String deviceToken) throws NoResourceFoundException {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isEmpty()) {
            // Using null object pattern
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }

        var device = Device.builder()
                .deviceToken(deviceToken)
                .userId(userId)
                .tokenIssuedAt(LocalDateTime.now())
                .build();

        // Manual checking instead of using a composite key of user and device, (Cannot exist two entity with exact same device token and user id)
        // which can be more efficient and the code will be easier to understand
        // But now I'm in a hurry, I need to avoid bug come from spring data jpa
        Optional<Device> optionalDevice = getExistedDevice(userId, deviceToken);
        return optionalDevice.orElseGet(() -> deviceRepository.save(device));

    }

    private Optional<Device> getExistedDevice(UUID userId, String deviceToken) {
        List<Device> devices = deviceRepository.getDeviceForUser(userId);
        Device addedDevice = null;
        for (Device device : devices) {
            if (device.getDeviceToken().equals(deviceToken)) {
                addedDevice = device;
            }
        }
        return Optional.ofNullable(addedDevice);
    }

    void removeDevice(UUID userId, String deviceToken) throws NoResourceFoundException {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isEmpty()) {
            // Using null object pattern
            throw new NoResourceFoundException(HttpMethod.valueOf(""), "");
        }

        Optional<Device> optionalDevice = getExistedDevice(userId, deviceToken);
        optionalDevice.ifPresent(device -> deviceRepository.deleteById(device.getId()));
    }
}
