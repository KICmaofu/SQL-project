package com.example.sqleditor.config;

import com.example.sqleditor.entity.SqlExecuteResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public SqlExecuteResult handleRuntimeException(RuntimeException e) {
        return SqlExecuteResult.builder()
                .success(false)
                .message("操作失败：" + e.getMessage())
                .build();
    }

    @ExceptionHandler(Exception.class)
    public SqlExecuteResult handleException(Exception e) {
        return SqlExecuteResult.builder()
                .success(false)
                .message("系统异常：" + e.getMessage())
                .build();
    }
}
