package com.mysql.study.service.impl;

import com.mysql.study.common.BusinessException;
import com.mysql.study.common.ResultCode;
import com.mysql.study.context.UserContext;
import com.mysql.study.entity.QueryHistory;
import com.mysql.study.entity.StudentErrorBook;
import com.mysql.study.mapper.QueryHistoryMapper;
import com.mysql.study.mapper.StudentErrorBookMapper;
import com.mysql.study.service.SqlExecuteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class SqlExecuteServiceImpl implements SqlExecuteService {

    private static final Pattern DANGER_SQL_PATTERN = Pattern.compile("(?i)\\b(DROP|TRUNCATE|ALTER|CREATE|GRANT|REVOKE)\\b");
    private static final int MAX_ROWS = 1000;

    @Autowired
    @Qualifier("practiceDataSource")
    private DataSource practiceDataSource;

    @Autowired
    private QueryHistoryMapper queryHistoryMapper;

    @Autowired
    private StudentErrorBookMapper studentErrorBookMapper;

    @Override
    public Map<String, Object> executeSql(String sql) {
        if (DANGER_SQL_PATTERN.matcher(sql).find()) {
            throw new BusinessException(ResultCode.SQL_DANGER.getCode(), "禁止执行高危SQL语句");
        }

        Long studentId = UserContext.getStudentId();
        long startTime = System.currentTimeMillis();
        Map<String, Object> result = new HashMap<>();
        Connection conn = null;
        Statement stmt = null;

        try {
            conn = practiceDataSource.getConnection();
            stmt = conn.createStatement();
            stmt.setMaxRows(MAX_ROWS);

            boolean hasResultSet = stmt.execute(sql);

            if (hasResultSet) {
                ResultSet rs = stmt.getResultSet();
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                List<Map<String, Object>> columns = new ArrayList<>();
                for (int i = 1; i <= columnCount; i++) {
                    Map<String, Object> col = new HashMap<>();
                    col.put("name", metaData.getColumnLabel(i));
                    col.put("type", metaData.getColumnTypeName(i));
                    columns.add(col);
                }

                List<Object[]> rows = new ArrayList<>();
                while (rs.next()) {
                    Object[] row = new Object[columnCount];
                    for (int i = 1; i <= columnCount; i++) {
                        row[i - 1] = rs.getObject(i);
                    }
                    rows.add(row);
                }

                result.put("type", "QUERY");
                result.put("columns", columns);
                result.put("rows", rows);
                result.put("total", rows.size());

                rs.close();
            } else {
                int affectedRows = stmt.getUpdateCount();
                result.put("type", "UPDATE");
                result.put("affectedRows", affectedRows);
            }

            long costTime = System.currentTimeMillis() - startTime;
            result.put("costTime", costTime);

            saveQueryHistory(studentId, sql, 1, (int) costTime, null);

            return result;

        } catch (SQLException e) {
            long costTime = System.currentTimeMillis() - startTime;
            String errorMsg = e.getMessage();

            saveQueryHistory(studentId, sql, 0, (int) costTime, errorMsg);
            saveErrorBook(studentId, sql, errorMsg);

            throw new BusinessException(ResultCode.SQL_EXECUTE_ERROR.getCode(), errorMsg);
        } finally {
            closeResources(stmt, conn);
        }
    }

    private void saveQueryHistory(Long studentId, String sql, Integer executeStatus, Integer costTime, String errorMsg) {
        QueryHistory history = new QueryHistory();
        history.setStudentId(studentId);
        history.setSqlContent(sql);
        history.setExecuteStatus(executeStatus);
        history.setCostTime(costTime);
        history.setErrorMsg(errorMsg);
        queryHistoryMapper.insert(history);
    }

    private void saveErrorBook(Long studentId, String sql, String errorMsg) {
        StudentErrorBook errorBook = new StudentErrorBook();
        errorBook.setStudentId(studentId);
        errorBook.setSqlContent(sql);
        errorBook.setErrorMsg(errorMsg);
        errorBook.setMasterStatus(0);
        studentErrorBookMapper.insert(errorBook);
    }

    private void closeResources(Statement stmt, Connection conn) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException ignored) {
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ignored) {
            }
        }
    }
}
