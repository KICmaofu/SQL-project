CREATE DATABASE IF NOT EXISTS sql_editor DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sql_editor;

CREATE TABLE IF NOT EXISTS `datasource_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(64) NOT NULL COMMENT '连接名称，用于前端展示',
  `db_type` varchar(32) NOT NULL DEFAULT 'mysql' COMMENT '数据库类型：mysql/postgresql',
  `driver_class` varchar(128) NOT NULL COMMENT 'JDBC驱动类全限定名',
  `url` varchar(512) NOT NULL COMMENT 'JDBC连接地址',
  `username` varchar(64) NOT NULL COMMENT '数据库用户名',
  `password` varchar(128) NOT NULL COMMENT '数据库密码',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`) COMMENT '连接名称唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据源配置表';
