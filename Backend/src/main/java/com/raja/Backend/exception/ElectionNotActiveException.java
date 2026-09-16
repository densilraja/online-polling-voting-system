package com.raja.Backend.exception;

public class ElectionNotActiveException extends RuntimeException {

    public ElectionNotActiveException(String message) {
        super(message);
    }
    
}
