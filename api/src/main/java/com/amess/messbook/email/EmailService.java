package com.amess.messbook.email;

import com.amess.messbook.auth.entity.Token;
import jakarta.mail.MessagingException;
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

    @Async
    public void sendEmail(
            String to,
            String username,
            Token token,
            EmailSubject emailSubject,
            EmailTemplateName emailTemplate
    ) throws MessagingException {

        var mimeMessage = mailSender.createMimeMessage();
        var mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        mimeMessageHelper.setFrom("messbok@amess.com");
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject(emailSubject.getSubject());

        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("code", token.getPlainText());

        var context = new Context();
        context.setVariables(properties);

        String template = templateEngine.process(emailTemplate.getName(), context);
        mimeMessageHelper.setText(template, true);

        mailSender.send(mimeMessage);
    }
}
