package com.amess.messbook.notification;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Configuration
public class NotificationConfig {

    @Bean
    FirebaseMessaging firebaseMessaging() {
        FileInputStream serviceAccount;
        try {
            serviceAccount = new FileInputStream("/home/leathur/firebase-key/service-account-key.json");
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        FirebaseOptions options;
        try {
            options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        if(FirebaseApp.getApps().isEmpty()) {
            return FirebaseMessaging.getInstance(FirebaseApp.initializeApp(options));
        }
        return FirebaseMessaging.getInstance();
    }
}
