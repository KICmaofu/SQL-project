package com.mysql.study.service.impl;

import com.mysql.study.common.BusinessException;
import com.mysql.study.common.ResultCode;
import com.mysql.study.service.PracticeResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import javax.sql.DataSource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@Service
public class PracticeResetServiceImpl implements PracticeResetService {

    private static final Map<Long, Long> LAST_RESET_TIME = new HashMap<>();
    private static final long MIN_INTERVAL_MS = 10 * 60 * 1000;

    @Autowired
    @Qualifier("practiceDataSource")
    private DataSource practiceDataSource;

    @Value("${practice.reset.sql-path}")
    private String resetSqlPath;

    @Override
    public void resetPracticeDb() {
        Long studentId = com.mysql.study.context.UserContext.getStudentId();

        Long lastResetTime = LAST_RESET_TIME.get(studentId);
        if (lastResetTime != null) {
            long interval = System.currentTimeMillis() - lastResetTime;
            if (interval < MIN_INTERVAL_MS) {
                long remainMinutes = (MIN_INTERVAL_MS - interval) / 1000 / 60;
                throw new BusinessException(ResultCode.PARAM_ERROR.getCode(),
                        "重置操作过于频繁，请" + remainMinutes + "分钟后再试");
            }
        }

        Connection conn = null;
        Statement stmt = null;
        try {
            String sqlContent = readSqlFile();
            String[] sqlStatements = sqlContent.split(";");

            conn = practiceDataSource.getConnection();
            stmt = conn.createStatement();

            for (String sql : sqlStatements) {
                String trimmedSql = sql.trim();
                if (!trimmedSql.isEmpty()) {
                    stmt.execute(trimmedSql);
                }
            }

            LAST_RESET_TIME.put(studentId, System.currentTimeMillis());

        } catch (Exception e) {
            throw new BusinessException(ResultCode.ERROR.getCode(), "重置练习库失败：" + e.getMessage());
        } finally {
            closeResources(stmt, conn);
        }
    }

    private String readSqlFile() throws Exception {
        String path = resetSqlPath;
        if (path.startsWith("classpath:")) {
            path = path.substring("classpath:".length());
        }
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream is = resource.getInputStream()) {
            return StreamUtils.copyToString(is, StandardCharsets.UTF_8);
        }
    }

    private void closeResources(Statement stmt, Connection conn) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (Exception ignored) {
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (Exception ignored) {
            }
        }
    }
}
