package com.example.sqleditor.entity;

import java.util.List;
import java.util.Map;

public class SqlExecuteResult {
    private Boolean success;
    private String message;
    private Long duration;
    private List<String> columns;
    private List<Map<String, Object>> rows;
    private Integer affectedRows;

    public SqlExecuteResult() {
    }

    private SqlExecuteResult(Builder builder) {
        this.success = builder.success;
        this.message = builder.message;
        this.duration = builder.duration;
        this.columns = builder.columns;
        this.rows = builder.rows;
        this.affectedRows = builder.affectedRows;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }

    public void setRows(List<Map<String, Object>> rows) {
        this.rows = rows;
    }

    public Integer getAffectedRows() {
        return affectedRows;
    }

    public void setAffectedRows(Integer affectedRows) {
        this.affectedRows = affectedRows;
    }

    public static class Builder {
        private Boolean success;
        private String message;
        private Long duration;
        private List<String> columns;
        private List<Map<String, Object>> rows;
        private Integer affectedRows;

        private Builder() {
        }

        public Builder success(Boolean success) {
            this.success = success;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder duration(Long duration) {
            this.duration = duration;
            return this;
        }

        public Builder columns(List<String> columns) {
            this.columns = columns;
            return this;
        }

        public Builder rows(List<Map<String, Object>> rows) {
            this.rows = rows;
            return this;
        }

        public Builder affectedRows(Integer affectedRows) {
            this.affectedRows = affectedRows;
            return this;
        }

        public SqlExecuteResult build() {
            return new SqlExecuteResult(this);
        }
    }
}
