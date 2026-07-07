package com.mysql.study.service;

import java.util.Map;

public interface AuthService {

    Long register(String username, String password, String realName);

    Map<String, Object> login(String username, String password);
}
