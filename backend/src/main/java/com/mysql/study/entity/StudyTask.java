package com.mysql.study.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

@TableName("study_task")
public class StudyTask {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long chapterId;

    private String taskName;

    private Integer sortOrder;

    private String knowledgeContent;

    private String exampleSql;

    private String practiceQuestion;

    @TableField(fill = com.baomidou.mybatisplus.annotation.FieldFill.INSERT)
    private LocalDateTime createTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getKnowledgeContent() {
        return knowledgeContent;
    }

    public void setKnowledgeContent(String knowledgeContent) {
        this.knowledgeContent = knowledgeContent;
    }

    public String getExampleSql() {
        return exampleSql;
    }

    public void setExampleSql(String exampleSql) {
        this.exampleSql = exampleSql;
    }

    public String getPracticeQuestion() {
        return practiceQuestion;
    }

    public void setPracticeQuestion(String practiceQuestion) {
        this.practiceQuestion = practiceQuestion;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }
}
