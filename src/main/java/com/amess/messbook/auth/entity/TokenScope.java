package com.amess.messbook.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TokenScope {

    ACTIVATION("activation"),
    PASSWORD_RESET("password reset")
    ;

    private final String scope;
}
