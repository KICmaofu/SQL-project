DROP TABLE IF EXISTS study_note;
DROP TABLE IF EXISTS sql_history;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sandbox_demo_emp;
DROP TABLE IF EXISTS sandbox_demo_dept;

CREATE TABLE sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32),
    nickname VARCHAR(50),
    role_code VARCHAR(20) DEFAULT 'USER',
    is_deleted TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sql_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sql_text TEXT NOT NULL,
    row_count INT DEFAULT 0,
    cost_time_ms BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    error_msg TEXT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE study_note (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    history_id BIGINT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    tags VARCHAR(500),
    is_deleted TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sandbox_demo_dept (
    dept_no VARCHAR(10) PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sandbox_demo_emp (
    emp_id VARCHAR(10) PRIMARY KEY,
    emp_name VARCHAR(50) NOT NULL,
    dept_no VARCHAR(10),
    salary DECIMAL(10,2),
    hire_date DATE,
    job VARCHAR(50),
    FOREIGN KEY (dept_no) REFERENCES sandbox_demo_dept(dept_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sandbox_demo_dept (dept_no, dept_name, location) VALUES
('D01', '研发部', '北京'),
('D02', '市场部', '上海'),
('D03', '财务部', '深圳'),
('D04', '人事部', '广州'),
('D05', '运营部', '杭州');

INSERT INTO sandbox_demo_emp (emp_id, emp_name, dept_no, salary, hire_date, job) VALUES
('E001', '张三', 'D01', 15000.00, '2020-01-15', '高级工程师'),
('E002', '李四', 'D01', 12000.00, '2021-03-20', '中级工程师'),
('E003', '王五', 'D02', 10000.00, '2020-06-10', '市场经理'),
('E004', '赵六', 'D02', 8000.00, '2022-02-28', '市场专员'),
('E005', '钱七', 'D03', 11000.00, '2019-09-05', '财务主管'),
('E006', '孙八', 'D03', 7000.00, '2021-07-12', '会计'),
('E007', '周九', 'D04', 9000.00, '2020-11-30', 'HR经理'),
('E008', '吴十', 'D01', 18000.00, '2018-05-18', '架构师'),
('E009', '郑十一', 'D05', 8500.00, '2021-08-22', '运营专员'),
('E010', '王十二', 'D05', 13000.00, '2019-04-08', '运营总监');
