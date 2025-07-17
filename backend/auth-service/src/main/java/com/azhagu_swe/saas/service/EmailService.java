package com.azhagu_swe.saas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async; // For asynchronous email sending
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend.resetPasswordUrl}") // e.g., https://yourfrontend.com/reset-password?token=
    private String resetPasswordBaseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async // Make email sending asynchronous (ensure @EnableAsync is on a @Configuration class)
    public void sendPasswordResetEmail(String toEmail, String username, String token) throws MailException {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Password Reset Request");

            // Construct the full reset link
            String resetLink = resetPasswordBaseUrl + token;

            // More professional email body
            String emailText = String.format(
                "Hello %s,\n\n" +
                "We received a request to reset the password for your account associated with this email address.\n" +
                "If you made this request, please click on the link below to reset your password:\n" +
                "%s\n\n" +
                "This link is valid for a limited time (as specified by the token's lifespan, e.g., 24 hours or 30 minutes).\n" +
                "If you did not request a password reset, please ignore this email or contact support if you have concerns.\n\n" +
                "Thank you,\nThe [Your SaaS App Name] Team",
                username, // Personalize with username
                resetLink
            );
            message.setText(emailText);

            mailSender.send(message);
            logger.info("Password reset email sent successfully to {}", toEmail);
        } catch (MailException e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw e; // Re-throw to be caught by the AuthService or a global handler if necessary for specific alerts
        }
    }

}