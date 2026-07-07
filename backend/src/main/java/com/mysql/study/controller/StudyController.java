package com.mysql.study.controller;

import com.mysql.study.common.Result;
import com.mysql.study.entity.StudyTask;
import com.mysql.study.service.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/study")
public class StudyController {

    @Autowired
    private StudyService studyService;

    @GetMapping("/tree")
    public Result<List<Map<String, Object>>> getChapterTree() {
        List<Map<String, Object>> tree = studyService.getChapterTree();
        return Result.success(tree);
    }

    @GetMapping("/task/{taskId}")
    public Result<StudyTask> getTaskDetail(@PathVariable Long taskId) {
        StudyTask task = studyService.getTaskDetail(taskId);
        return Result.success(task);
    }

    @PostMapping("/task/{taskId}/complete")
    public Result<Void> markTaskComplete(@PathVariable Long taskId) {
        studyService.markTaskComplete(taskId);
        return Result.success();
    }

    @PostMapping("/task/{taskId}/reset")
    public Result<Void> resetTask(@PathVariable Long taskId) {
        studyService.resetTask(taskId);
        return Result.success();
    }

    @GetMapping("/progress")
    public Result<Map<String, Object>> getProgress() {
        Map<String, Object> progress = studyService.getProgress();
        return Result.success(progress);
    }
}
