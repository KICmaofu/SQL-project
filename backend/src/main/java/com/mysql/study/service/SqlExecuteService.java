package com.mysql.study.service;

import java.util.Map;

public interface SqlExecuteService {

    Map<String, Object> executeSql(String sql);
}
