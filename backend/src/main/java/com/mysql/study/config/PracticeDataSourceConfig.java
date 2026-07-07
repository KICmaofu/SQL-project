package com.mysql.study.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class PracticeDataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "practice.datasource")
    public DataSourceProperties practiceDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource practiceDataSource() {
        return practiceDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean
    public PlatformTransactionManager practiceTransactionManager(DataSource practiceDataSource) {
        return new DataSourceTransactionManager(practiceDataSource);
    }
}
