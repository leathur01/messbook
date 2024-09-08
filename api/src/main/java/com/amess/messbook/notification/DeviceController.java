package com.amess.messbook.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;

@RequiredArgsConstructor
@RestController
public class DeviceController {
    private final NotificationService notificationService;

    @PostMapping("users/devices")
    public HashMap<String, String> addDevice(@RequestBody DeviceDTO deviceDTO) throws NoResourceFoundException {
        notificationService.addDevice(deviceDTO.getUserId(), deviceDTO.getDeviceToken());
        var response = new HashMap<String, String>();
        response.put("message", "Notification for this user will be send to this device");
        return response;
    }

    @DeleteMapping("users/devices")
    public HashMap<String, String> removeDevice(@RequestBody DeviceDTO deviceDTO) throws NoResourceFoundException {
        notificationService.removeDevice(deviceDTO.getUserId(), deviceDTO.getDeviceToken());
        var response = new HashMap<String, String>();
        response.put("message", "Notification for this user won't be send to this device");
        return response;
    }
}
