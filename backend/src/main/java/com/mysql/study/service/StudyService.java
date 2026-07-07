package com.mysql.study.service;

import com.mysql.study.entity.StudyTask;

import java.util.List;
import java.util.Map;

public interface StudyService {

    List<Map<String, Object>> getChapterTree();

    StudyTask getTaskDetail(Long taskId);

    void markTaskComplete(Long taskId);

    void resetTask(Long taskId);

    Map<String, Object> getProgress();
}
