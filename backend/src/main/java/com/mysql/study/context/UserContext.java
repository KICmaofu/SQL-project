package com.mysql.study.context;

public class UserContext {

    private static final ThreadLocal<Long> STUDENT_ID_HOLDER = new ThreadLocal<>();

    public static void setStudentId(Long studentId) {
        STUDENT_ID_HOLDER.set(studentId);
    }

    public static Long getStudentId() {
        return STUDENT_ID_HOLDER.get();
    }

    public static void clear() {
        STUDENT_ID_HOLDER.remove();
    }
}
