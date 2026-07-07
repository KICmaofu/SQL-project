package com.mysql.study.common;

public enum ResultCode {

    SUCCESS(200, "操作成功"),
    ERROR(500, "系统异常"),
    PARAM_ERROR(400, "参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "无权限访问"),
    SQL_DANGER(1001, "禁止执行高危SQL语句"),
    SQL_EXECUTE_ERROR(1002, "SQL执行失败");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
