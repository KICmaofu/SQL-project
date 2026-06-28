package com.example.sqleditor.service;

import com.example.sqleditor.datasource.DynamicDataSource;
import com.example.sqleditor.entity.DatasourceAddRequest;
import com.example.sqleditor.entity.DatasourceConfig;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DatasourceService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DynamicDataSource dynamicDataSource;

    @PostConstruct
    public void initAllDataSource() {
        String sql = "SELECT id, db_type, url, username, password FROM datasource_config";
        List<Map<String, Object>> configList = jdbcTemplate.queryForList(sql);

        for (Map<String, Object> config : configList) {
            DatasourceAddRequest request = new DatasourceAddRequest();
            request.setDbType((String) config.get("db_type"));
            request.setUrl((String) config.get("url"));
            request.setUsername((String) config.get("username"));
            request.setPassword((String) config.get("password"));
            loadDataSourceToContext(config.get("id").toString(), request);
        }
    }

    public List<DatasourceConfig> list() {
        String sql = "SELECT id, name, db_type, driver_class, url, username, create_time FROM datasource_config ORDER BY create_time DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(DatasourceConfig.class));
    }

    public boolean testConnection(DatasourceAddRequest request) {
        HikariDataSource tempDataSource = null;
        try {
            tempDataSource = buildHikariDataSource(request);
            try (Connection connection = tempDataSource.getConnection()) {
                return connection.isValid(2);
            }
        } catch (Exception e) {
            return false;
        } finally {
            if (tempDataSource != null) {
                tempDataSource.close();
            }
        }
    }

    public void add(DatasourceAddRequest request) {
        if (!testConnection(request)) {
            throw new RuntimeException("数据库连接失败，请检查配置");
        }

        String driverClass = "mysql".equals(request.getDbType())
                ? "com.mysql.cj.jdbc.Driver"
                : "org.postgresql.Driver";

        String sql = "INSERT INTO datasource_config (name, db_type, driver_class, url, username, password) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                request.getName(),
                request.getDbType(),
                driverClass,
                request.getUrl(),
                request.getUsername(),
                request.getPassword()
        );

        String idSql = "SELECT LAST_INSERT_ID()";
        Long id = jdbcTemplate.queryForObject(idSql, Long.class);
        loadDataSourceToContext(id.toString(), request);
    }

    public void delete(Long id) {
        jdbcTemplate.update("DELETE FROM datasource_config WHERE id = ?", id);

        String key = id.toString();
        Map<Object, Object> targetDataSources = new HashMap<>(
                dynamicDataSource.getResolvedDataSources()
        );

        if (targetDataSources.containsKey(key)) {
            DataSource dataSource = (DataSource) targetDataSources.get(key);
            if (dataSource instanceof HikariDataSource hikariDs) {
                hikariDs.close();
            }
            targetDataSources.remove(key);

            dynamicDataSource.setTargetDataSources(targetDataSources);
            dynamicDataSource.afterPropertiesSet();
        }
    }

    private void loadDataSourceToContext(String key, DatasourceAddRequest request) {
        HikariDataSource dataSource = buildHikariDataSource(request);

        Map<Object, Object> targetDataSources = new HashMap<>(
                dynamicDataSource.getResolvedDataSources()
        );
        targetDataSources.put(key, dataSource);

        dynamicDataSource.setTargetDataSources(targetDataSources);
        dynamicDataSource.afterPropertiesSet();
    }

    private HikariDataSource buildHikariDataSource(DatasourceAddRequest request) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(request.getUrl());
        config.setUsername(request.getUsername());
        config.setPassword(request.getPassword());

        String driverClass = "mysql".equals(request.getDbType())
                ? "com.mysql.cj.jdbc.Driver"
                : "org.postgresql.Driver";
        config.setDriverClassName(driverClass);

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(3000);
        config.setIdleTimeout(60000);
        config.setMaxLifetime(1800000);
        config.setConnectionTestQuery("SELECT 1");

        return new HikariDataSource(config);
    }
}
