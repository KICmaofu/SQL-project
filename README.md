# SQL 编辑器项目

基于 Web 的在线 SQL 编辑器，采用前后端分离架构。

## 项目结构

```
SQL-PROJECT/
├── sql-editor-backend/       # 后端项目（Spring Boot 3.2.x）
│   ├── src/main/java/...
│   ├── src/main/resources/
│   └── pom.xml
├── sql-editor-frontend/      # 前端项目（React 18 + Vite 5）
│   ├── src/
│   ├── dist/                 # 构建产物
│   └── package.json
└── 开发文档.md               # 项目详细开发文档
```

## 功能特性

### 数据源管理
- 可视化新增数据库连接
- 连接连通性测试
- 连接列表查询与删除
- 多连接一键切换

### SQL 编辑能力
- MySQL 语法高亮
- 代码自动缩进、括号匹配
- 行号显示、多光标编辑
- SQL 一键格式化

### SQL 执行能力
- 全量执行、选中片段执行
- 执行耗时统计
- 多语句支持
- Ctrl+Enter 快捷键执行

### 结果展示
- 查询结果表格化渲染
- 列宽自适应、长文本省略
- 滚动浏览
- 影响行数展示

### 安全防护
- 高危语句拦截（DROP、TRUNCATE）
- 只读模式管控
- 无 WHERE 写操作拦截
- 查询行数默认限制
- 连接权限隔离

## 后端启动

### 环境要求
- JDK 17+
- Maven 3.8+
- MySQL 5.7+

### 数据库初始化
执行 `sql-editor-backend/src/main/resources/schema.sql` 创建数据库和表。

### 修改配置
编辑 `sql-editor-backend/src/main/resources/application.yml`，配置数据库连接信息。

### 启动项目
```bash
cd sql-editor-backend
mvn spring-boot:run
```
后端服务启动在 `http://localhost:8080`

## 前端启动

### 环境要求
- Node.js 16+
- npm 8+

### 安装依赖
```bash
cd sql-editor-frontend
npm install
```

### 开发模式
```bash
npm run dev
```
前端开发服务启动在 `http://localhost:5173`

### 生产构建
```bash
npm run build
```
构建产物输出到 `dist` 目录

## 技术栈

### 后端
- Java 17 + Spring Boot 3.2.x
- Spring JDBC + HikariCP
- MySQL Connector / PostgreSQL
- Lombok

### 前端
- React 18 + Vite 5
- Ant Design 5.x
- Monaco Editor
- sql-formatter
- Axios
