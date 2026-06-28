package com.example.sqleditor.service;

import com.example.sqleditor.datasource.DynamicDataSourceContextHolder;
import com.example.sqleditor.entity.SqlExecuteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SqlService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public SqlExecuteResult execute(String sql, String datasourceId) {
        long startTime = System.currentTimeMillis();
        SqlExecuteResult.Builder builder = SqlExecuteResult.builder();

        try {
            if (datasourceId != null && !datasourceId.isEmpty()) {
                DynamicDataSourceContextHolder.setDataSourceKey(datasourceId);
            } else {
                DynamicDataSourceContextHolder.setDataSourceKey("default");
            }

            if (sql == null || sql.trim().isEmpty()) {
                return builder.success(false)
                        .message("SQL 语句不能为空")
                        .duration(System.currentTimeMillis() - startTime)
                        .build();
            }

            sql = sql.trim();
            if (sql.endsWith(";")) {
                sql = sql.substring(0, sql.length() - 1).trim();
            }

            String sqlUpper = sql.toUpperCase().trim();
            if (sqlUpper.startsWith("SELECT") || sqlUpper.startsWith("SHOW")
                    || sqlUpper.startsWith("DESC") || sqlUpper.startsWith("EXPLAIN")) {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
                List<String> columns = rows.isEmpty() ? List.of() : new ArrayList<>(rows.get(0).keySet());

                builder.success(true)
                        .columns(columns)
                        .rows(rows)
                        .message("查询成功，共 " + rows.size() + " 条");
            } else {
                int affectedRows = jdbcTemplate.update(sql);
                builder.success(true)
                        .affectedRows(affectedRows)
                        .message("执行成功，影响 " + affectedRows + " 行");
            }

        } catch (Exception e) {
            builder.success(false)
                    .message("执行失败：" + e.getMessage());
        } finally {
            DynamicDataSourceContextHolder.clearDataSourceKey();
        }

        builder.duration(System.currentTimeMillis() - startTime);
        return builder.build();
    }
}
