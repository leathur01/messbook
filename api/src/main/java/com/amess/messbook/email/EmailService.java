package com.amess.messbook.email;

import com.amess.messbook.auth.entity.Token;
import com.amess.messbook.email.entity.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    // Use this helper method to make creating email clearer
    public Email createEmail(String to, String username, Token token, EmailSubject emailSubject, EmailTemplateName emailTemplateName) {
        return Email.builder()
                .to(to)
                .username(username)
                .token(token)
                .emailSubject(emailSubject)
                .emailTemplateName(emailTemplateName)
                .build();
    }

    @Async
    public void sendEmail(Email email) throws MessagingException {
        MimeMessage mimeMessage = createMimeMessage(email);
        mailSender.send(mimeMessage);
    }

    private MimeMessage createMimeMessage(Email email) throws MessagingException {
        var mimeMessage = mailSender.createMimeMessage();
        var mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setFrom("messbok@amess.com");
        mimeMessageHelper.setTo(email.getTo());
        mimeMessageHelper.setSubject(email.getEmailSubject().getSubject());
        String template = setUpContextForEmailTemplate(email.getUsername(), email.getToken(), email.getEmailTemplateName());
        mimeMessageHelper.setText(template, true);

        return mimeMessage;
    }

    private String setUpContextForEmailTemplate(String username, Token token, EmailTemplateName emailTemplate) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("code", token.getPlainText());
        var context = new Context();
        context.setVariables(properties);

        String template;
        template = templateEngine.process(emailTemplate.getName(), context);

        return template;
    }
}
