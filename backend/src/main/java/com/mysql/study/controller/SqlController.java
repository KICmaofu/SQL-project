package com.mysql.study.controller;

import com.mysql.study.common.Result;
import com.mysql.study.service.SqlExecuteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sql")
public class SqlController {

    @Autowired
    private SqlExecuteService sqlExecuteService;

    @PostMapping("/execute")
    public Result<Map<String, Object>> execute(@RequestBody Map<String, String> body) {
        String sql = body.get("sql");
        Map<String, Object> result = sqlExecuteService.executeSql(sql);
        return Result.success(result);
    }
}
