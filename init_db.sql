-- ============================================
-- MySQL高校实训平台 - 完整数据库初始化脚本
-- ============================================

-- 1. 创建系统库
CREATE DATABASE IF NOT EXISTS mysql_study_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mysql_study_system;

-- 1.1 学生用户表
CREATE TABLE IF NOT EXISTS sys_student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '学生主键ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号/学号',
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt加密密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    college VARCHAR(100) COMMENT '所属院系',
    major VARCHAR(100) COMMENT '所属专业',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生用户表';

-- 1.2 学习章节表
CREATE TABLE IF NOT EXISTS study_chapter (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '章节ID',
    chapter_name VARCHAR(100) NOT NULL COMMENT '章节名称',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序号',
    description VARCHAR(255) COMMENT '章节简介',
    pre_chapter_id BIGINT DEFAULT 0 COMMENT '前置解锁章节ID，0表示无前置',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习章节表';

-- 1.3 学习任务表
CREATE TABLE IF NOT EXISTS study_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '任务ID',
    chapter_id BIGINT NOT NULL COMMENT '所属章节ID',
    task_name VARCHAR(100) NOT NULL COMMENT '任务名称',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '章节内排序号',
    knowledge_content TEXT COMMENT '知识点讲解',
    example_sql TEXT COMMENT '课堂例题SQL',
    practice_question TEXT COMMENT '课后练习题要求',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_chapter_id(chapter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习任务表';

-- 1.4 学生学习进度表
CREATE TABLE IF NOT EXISTS student_task_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    student_id BIGINT NOT NULL COMMENT '学生ID',
    task_id BIGINT NOT NULL COMMENT '任务ID',
    study_status TINYINT NOT NULL DEFAULT 0 COMMENT '0未学习 1已学习',
    study_time DATETIME COMMENT '完成学习时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_stu_task(student_id, task_id),
    INDEX idx_student_id(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生学习进度表';

-- 1.5 学生错题本表
CREATE TABLE IF NOT EXISTS student_error_book (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    student_id BIGINT NOT NULL COMMENT '学生ID',
    sql_content TEXT NOT NULL COMMENT '错误SQL内容',
    error_msg TEXT NOT NULL COMMENT '错误信息',
    master_status TINYINT DEFAULT 0 COMMENT '0未掌握 1已掌握',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_student_id(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生错题本表';

-- 1.6 查询历史表
CREATE TABLE IF NOT EXISTS query_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    student_id BIGINT NOT NULL COMMENT '学生ID',
    sql_content TEXT NOT NULL COMMENT 'SQL内容',
    execute_status TINYINT NOT NULL COMMENT '1成功 0失败',
    cost_time INT COMMENT '执行耗时(ms)',
    error_msg TEXT COMMENT '错误信息',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '执行时间',
    INDEX idx_stu_time(student_id, create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='查询历史表';

-- ============================================
-- 2. 创建练习库
-- ============================================
CREATE DATABASE IF NOT EXISTS mysql_study_practice DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE mysql_study_practice;

-- 2.1 院系表
CREATE TABLE IF NOT EXISTS department (
    dept_id INT PRIMARY KEY COMMENT '院系编号',
    dept_name VARCHAR(50) NOT NULL COMMENT '院系名称',
    dept_head VARCHAR(50) COMMENT '系主任',
    location VARCHAR(50) COMMENT '所在校区'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院系表';

-- 2.2 学生表
CREATE TABLE IF NOT EXISTS student (
    stu_id INT PRIMARY KEY COMMENT '学号',
    stu_name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender CHAR(2) COMMENT '性别',
    birthday DATE COMMENT '出生日期',
    dept_id INT COMMENT '所属院系编号',
    admission_date DATE COMMENT '入学日期',
    INDEX idx_dept(dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';

-- 2.3 课程表
CREATE TABLE IF NOT EXISTS course (
    course_id INT PRIMARY KEY COMMENT '课程编号',
    course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
    credit DECIMAL(3,1) COMMENT '学分',
    teacher VARCHAR(50) COMMENT '授课教师',
    dept_id INT COMMENT '开课院系'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 2.4 成绩表
CREATE TABLE IF NOT EXISTS score (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stu_id INT NOT NULL COMMENT '学号',
    course_id INT NOT NULL COMMENT '课程编号',
    score DECIMAL(5,1) COMMENT '考试成绩',
    exam_date DATE COMMENT '考试日期',
    UNIQUE KEY uk_stu_course(stu_id, course_id),
    INDEX idx_stu(stu_id),
    INDEX idx_course(course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成绩表';

-- ============================================
-- 3. 练习库初始化数据
-- ============================================
USE mysql_study_practice;

-- 清空旧数据（确保幂等）
DELETE FROM score;
DELETE FROM student;
DELETE FROM course;
DELETE FROM department;

-- 初始化院系数据
INSERT INTO department VALUES
(101, '计算机学院', '张教授', '东校区'),
(102, '经济管理学院', '李教授', '西校区'),
(103, '外国语学院', '王教授', '东校区'),
(104, '机械工程学院', '刘教授', '南校区');

-- 初始化学生数据
INSERT INTO student VALUES
(2024001, '张明', '男', '2005-03-15', 101, '2024-09-01'),
(2024002, '李华', '女', '2005-07-22', 101, '2024-09-01'),
(2024003, '王芳', '女', '2004-12-08', 102, '2023-09-01'),
(2024004, '刘强', '男', '2005-01-30', 101, '2024-09-01'),
(2024005, '陈雨', '女', '2005-05-10', 103, '2024-09-01'),
(2024006, '赵伟', '男', '2004-11-25', 104, '2023-09-01'),
(2024007, '孙悦', '女', '2005-09-12', 102, '2024-09-01'),
(2024008, '周浩', '男', '2004-06-18', 104, '2023-09-01');

-- 初始化课程数据
INSERT INTO course VALUES
(1001, '数据库系统概论', 4.0, '张老师', 101),
(1002, 'C语言程序设计', 3.5, '李老师', 101),
(1003, '高等数学', 5.0, '王老师', 102),
(1004, '大学英语', 3.0, '刘老师', 103),
(1005, '机械设计基础', 4.0, '赵老师', 104),
(1006, '数据结构', 4.5, '孙老师', 101);

-- 初始化成绩数据
INSERT INTO score (stu_id, course_id, score, exam_date) VALUES
(2024001, 1001, 89.5, '2025-01-15'),
(2024001, 1002, 92.0, '2025-01-16'),
(2024001, 1003, 78.0, '2025-01-17'),
(2024002, 1001, 95.0, '2025-01-15'),
(2024002, 1003, 88.5, '2025-01-17'),
(2024002, 1004, 91.0, '2025-01-18'),
(2024003, 1003, 85.0, '2025-01-17'),
(2024003, 1004, 87.5, '2025-01-18'),
(2024004, 1001, 72.0, '2025-01-15'),
(2024004, 1002, 68.5, '2025-01-16'),
(2024005, 1004, 94.0, '2025-01-18'),
(2024006, 1005, 82.0, '2025-01-19'),
(2024007, 1003, 90.5, '2025-01-17'),
(2024008, 1005, 76.5, '2025-01-19');

-- ============================================
-- 4. 系统库 - 初始化学习大纲数据
-- ============================================
USE mysql_study_system;

-- 清空旧数据
DELETE FROM study_task;
DELETE FROM study_chapter;

-- 插入章节数据
INSERT INTO study_chapter (id, chapter_name, sort_order, description, pre_chapter_id) VALUES
(1, 'MySQL基础入门', 1, '认识数据库，掌握基础查询', 0),
(2, '条件查询与排序', 2, '学习WHERE条件和ORDER BY排序', 1),
(3, '聚合函数与分组', 3, '学习聚合函数和GROUP BY分组', 2),
(4, '多表连接查询', 4, '学习JOIN多表连接查询', 3),
(5, '子查询与嵌套查询', 5, '学习子查询的使用方法', 4);

-- 插入第1章任务
INSERT INTO study_task (chapter_id, task_name, sort_order, knowledge_content, example_sql, practice_question) VALUES
(1, '数据库与MySQL简介', 1, '# 什么是数据库\n\n数据库（Database）是按照数据结构来组织、存储和管理数据的仓库。\n\n## MySQL简介\nMySQL是一种开放源代码的关系型数据库管理系统（RDBMS），使用最常用的数据库管理语言--结构化查询语言（SQL）进行数据库管理。\n\n## 为什么学习MySQL\n- 开源免费\n- 性能优异\n- 应用广泛\n- 社区活跃', '-- 查看MySQL版本\nSELECT VERSION();\n\n-- 查看当前数据库\nSELECT DATABASE();', '尝试查询当前MySQL的版本号和当前使用的数据库'),
(1, '查看库表与表结构', 2, '# 查看数据库和表\n\n## 查看所有数据库\n```sql\nSHOW DATABASES;\n```\n\n## 查看当前数据库中的所有表\n```sql\nSHOW TABLES;\n```\n\n## 查看表结构\n```sql\nDESC 表名;\n-- 或者\nDESCRIBE 表名;\n```\n\n## 查看建表语句\n```sql\nSHOW CREATE TABLE 表名;\n```', '-- 查看所有数据库\nSHOW DATABASES;\n\n-- 查看当前库的所有表\nSHOW TABLES;\n\n-- 查看学生表结构\nDESC student;', '练习：查看所有数据库，查看当前数据库中有哪些表，然后查看department表的结构'),
(1, 'SELECT基础查询', 3, '# SELECT基础查询\n\nSELECT语句用于从数据库表中查询数据。\n\n## 基本语法\n```sql\nSELECT 列名1, 列名2, ... FROM 表名;\n```\n\n## 查询所有列\n```sql\nSELECT * FROM 表名;\n```\n\n## 给列起别名\n```sql\nSELECT 列名 AS 别名 FROM 表名;\n```', '-- 查询所有学生的姓名和性别\nSELECT stu_name, gender FROM student;\n\n-- 查询所有列\nSELECT * FROM department;', '练习：查询student表中所有学生的学号、姓名和出生日期'),
(1, '去重与限制返回', 4, '# DISTINCT去重与LIMIT限制\n\n## DISTINCT去重\n查询结果中去除重复的记录：\n```sql\nSELECT DISTINCT 列名 FROM 表名;\n```\n\n## LIMIT限制返回行数\n```sql\n-- 返回前N条记录\nSELECT * FROM 表名 LIMIT N;\n\n-- 从第M条开始返回N条（M从0开始）\nSELECT * FROM 表名 LIMIT M, N;\n```', '-- 查询所有不重复的院系编号\nSELECT DISTINCT dept_id FROM student;\n\n-- 查询前5个学生\nSELECT * FROM student LIMIT 5;', '练习：查询student表中不重复的gender值，并查询前3条学生记录');

-- 插入第2章任务
INSERT INTO study_task (chapter_id, task_name, sort_order, knowledge_content, example_sql, practice_question) VALUES
(2, 'WHERE条件查询', 1, '# WHERE条件查询\n\nWHERE子句用于筛选满足条件的记录。\n\n## 比较运算符\n- `=` 等于\n- `!=` 或 `<>` 不等于\n- `>` 大于\n- `<` 小于\n- `>=` 大于等于\n- `<=` 小于等于\n\n## 逻辑运算符\n- `AND` 与（多个条件同时满足）\n- `OR` 或（满足其中一个条件即可）\n- `NOT` 非（取反）', '-- 查询计算机学院的学生\nSELECT * FROM student WHERE dept_id = 101;\n\n-- 查询成绩大于90分的记录\nSELECT * FROM score WHERE score > 90;', '练习：查询所有女生的信息，以及查询学分大于4的课程'),
(2, '模糊查询LIKE', 2, '# LIKE模糊查询\n\nLIKE操作符用于在WHERE子句中搜索列中的指定模式。\n\n## 通配符\n- `%` 替代0个或多个字符\n- `_` 替代一个字符\n\n## 示例\n```sql\n-- 以张开头的名字\nWHERE stu_name LIKE \'张%\'\n\n-- 包含"语言"的课程名\nWHERE course_name LIKE \'%语言%\'\n\n-- 第二个字是"明"的名字\nWHERE stu_name LIKE \'_明%\'\n```', '-- 查询姓张的学生\nSELECT * FROM student WHERE stu_name LIKE \'张%\';\n\n-- 查询名字中有"学"字的课程\nSELECT * FROM course WHERE course_name LIKE \'%学%\';', '练习：查询所有姓"李"的学生，以及课程名称包含"设计"的课程'),
(2, '范围与空值查询', 3, '# 范围查询与空值判断\n\n## BETWEEN...AND 范围查询\n```sql\nWHERE 列名 BETWEEN 值1 AND 值2\n```\n\n## IN 集合查询\n```sql\nWHERE 列名 IN (值1, 值2, ...)\n```\n\n## IS NULL / IS NOT NULL\n```sql\nWHERE 列名 IS NULL\nWHERE 列名 IS NOT NULL\n```', '-- 查询成绩在80到90之间的记录\nSELECT * FROM score WHERE score BETWEEN 80 AND 90;\n\n-- 查询计算机学院和外国语学院的学生\nSELECT * FROM student WHERE dept_id IN (101, 103);', '练习：查询成绩在75分到85分之间的学生成绩记录，以及查询出生日期不为空的学生'),
(2, 'ORDER BY排序', 4, '# ORDER BY排序\n\nORDER BY用于对结果集进行排序。\n\n## 语法\n```sql\nSELECT * FROM 表名 ORDER BY 列名 ASC|DESC;\n```\n- ASC：升序（默认）\n- DESC：降序\n\n## 多字段排序\n```sql\nORDER BY 列1 DESC, 列2 ASC\n```', '-- 按成绩从高到低排序\nSELECT * FROM score ORDER BY score DESC;\n\n-- 按院系编号升序，同院系按学号降序\nSELECT * FROM student ORDER BY dept_id ASC, stu_id DESC;', '练习：查询学生表，按出生日期从大到小排序（最新出生的在前），并查询成绩表按课程号升序、成绩降序排列');

-- 插入第3章任务
INSERT INTO study_task (chapter_id, task_name, sort_order, knowledge_content, example_sql, practice_question) VALUES
(3, '聚合函数', 1, '# 聚合函数\n\n聚合函数对一组值进行计算并返回单个值。\n\n## 常用聚合函数\n- `COUNT(*)` 统计行数\n- `SUM(列名)` 求和\n- `AVG(列名)` 平均值\n- `MAX(列名)` 最大值\n- `MIN(列名)` 最小值', '-- 统计学生总数\nSELECT COUNT(*) AS total FROM student;\n\n-- 计算平均分、最高分、最低分\nSELECT AVG(score) AS avg_score,\n       MAX(score) AS max_score,\n       MIN(score) AS min_score\nFROM score;', '练习：统计课程总数，计算1001号课程的平均分和总分'),
(3, 'GROUP BY分组', 2, '# GROUP BY分组查询\n\nGROUP BY语句用于结合聚合函数，根据一个或多个列对结果集进行分组。\n\n## 语法\n```sql\nSELECT 列名, 聚合函数(列名)\nFROM 表名\nWHERE 条件\nGROUP BY 列名;\n```', '-- 统计每个院系的学生人数\nSELECT dept_id, COUNT(*) AS stu_count\nFROM student\nGROUP BY dept_id;\n\n-- 统计每个学生的平均分\nSELECT stu_id, AVG(score) AS avg_score\nFROM score\nGROUP BY stu_id;', '练习：查询每个院系的学生人数，以及每门课程的平均分'),
(3, 'HAVING过滤分组', 3, '# HAVING过滤分组\n\nHAVING子句用于在分组后过滤结果。\n\n## WHERE vs HAVING\n- WHERE：在分组前过滤行\n- HAVING：在分组后过滤分组\n\n## 语法\n```sql\nSELECT 列名, 聚合函数(列名)\nFROM 表名\nGROUP BY 列名\nHAVING 聚合函数条件;\n```', '-- 查询平均分大于85的学生\nSELECT stu_id, AVG(score) AS avg_score\nFROM score\nGROUP BY stu_id\nHAVING AVG(score) > 85;', '练习：查询学生人数大于2的院系编号及其人数');

-- 插入第4章任务
INSERT INTO study_task (chapter_id, task_name, sort_order, knowledge_content, example_sql, practice_question) VALUES
(4, 'INNER JOIN内连接', 1, '# INNER JOIN内连接\n\n内连接只返回两个表中匹配的行。\n\n## 语法\n```sql\nSELECT 列名\nFROM 表1\nINNER JOIN 表2 ON 表1.列 = 表2.列;\n```', '-- 查询学生及其所在院系名称\nSELECT s.stu_id, s.stu_name, d.dept_name\nFROM student s\nINNER JOIN department d ON s.dept_id = d.dept_id;\n\n-- 查询学生成绩及课程名\nSELECT sc.stu_id, c.course_name, sc.score\nFROM score sc\nINNER JOIN course c ON sc.course_id = c.course_id;', '练习：查询所有学生的姓名和所在院系名称'),
(4, 'LEFT JOIN左连接', 2, '# LEFT JOIN左连接\n\n左连接返回左表的所有行，即使右表中没有匹配的数据。\n\n## 语法\n```sql\nSELECT 列名\nFROM 表1\nLEFT JOIN 表2 ON 表1.列 = 表2.列;\n```', '-- 查询所有学生及其成绩（没成绩的学生也显示）\nSELECT s.stu_name, sc.course_id, sc.score\nFROM student s\nLEFT JOIN score sc ON s.stu_id = sc.stu_id;', '练习：使用左连接查询所有院系及其学生（没有学生的院系也显示出来）'),
(4, '多表连接', 3, '# 多表连接查询\n\n可以同时连接多个表进行查询。\n\n## 示例\n```sql\nSELECT *\nFROM 表1\nJOIN 表2 ON 表1.列 = 表2.列\nJOIN 表3 ON 表2.列 = 表3.列;\n```', '-- 查询学生姓名、课程名、成绩\nSELECT s.stu_name, c.course_name, sc.score\nFROM score sc\nJOIN student s ON sc.stu_id = s.stu_id\nJOIN course c ON sc.course_id = c.course_id\nORDER BY sc.score DESC;', '练习：查询学生姓名、课程名、成绩和所在院系名称，只显示成绩大于80分的记录');

-- 插入第5章任务
INSERT INTO study_task (chapter_id, task_name, sort_order, knowledge_content, example_sql, practice_question) VALUES
(5, 'WHERE子查询', 1, '# WHERE子查询\n\n子查询是嵌套在另一个查询中的查询。\n\n## 示例\n```sql\nSELECT * FROM 表1\nWHERE 列名 IN (SELECT 列名 FROM 表2 WHERE 条件);\n```', '-- 查询计算机学院的所有学生成绩\nSELECT * FROM score\nWHERE stu_id IN (\n  SELECT stu_id FROM student WHERE dept_id = 101\n);\n\n-- 查询成绩高于平均分的记录\nSELECT * FROM score\nWHERE score > (SELECT AVG(score) FROM score);', '练习：查询"数据库系统概论"这门课的所有学生成绩记录'),
(5, 'FROM子查询', 2, '# FROM子查询（派生表）\n\n子查询也可以放在FROM子句中，作为临时表使用。\n\n## 语法\n```sql\nSELECT *\nFROM (SELECT ... FROM ...) AS 别名\nWHERE 条件;\n```', '-- 查询每个学生的平均分，然后找出平均分大于85的\nSELECT *\nFROM (\n  SELECT stu_id, AVG(score) AS avg_score\n  FROM score\n  GROUP BY stu_id\n) AS t\nWHERE t.avg_score > 85;', '练习：先统计每个院系的学生人数，然后从结果中查询人数大于3的院系');
