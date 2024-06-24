package com.amess.messbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MessbookApplication {

	public static void main(String[] args) {
		SpringApplication.run(MessbookApplication.class, args);
	}

}


