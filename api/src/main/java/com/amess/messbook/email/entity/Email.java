package com.amess.messbook.email.entity;

import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.email.EmailSubject;
import com.amess.messbook.email.EmailTemplateName;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Email {
    private String to;
    private String username;
    private Token token;
    private EmailSubject emailSubject;
    private EmailTemplateName emailTemplateName;
}
