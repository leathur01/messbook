package com.amess.messbook.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {

    ACCOUNT_ACTIVATION("account_activation"),
    PASSWORD_RESET("password_reset")
    ;

    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }
}