package com.amess.messbook.notification;

public class CannotSendMessagesException extends RuntimeException {
    public CannotSendMessagesException(Throwable cause) {
        super(cause);
    }
}
