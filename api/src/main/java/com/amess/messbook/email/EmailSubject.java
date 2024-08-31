package com.amess.messbook.email;

import lombok.Getter;

@Getter
public enum EmailSubject {

    WELCOME("Welcome to Messbook"),
    PASSWORD_RESET("Password Reset for Messbook")
    ;

    private final String subject;
    EmailSubject(String subject) {
        this.subject = subject;
    }
}
