package com.mysql.study.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mysql.study.context.UserContext;
import com.mysql.study.entity.StudentTaskProgress;
import com.mysql.study.entity.StudyChapter;
import com.mysql.study.entity.StudyTask;
import com.mysql.study.mapper.StudentTaskProgressMapper;
import com.mysql.study.mapper.StudyChapterMapper;
import com.mysql.study.mapper.StudyTaskMapper;
import com.mysql.study.service.StudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StudyServiceImpl implements StudyService {

    @Autowired
    private StudyChapterMapper studyChapterMapper;

    @Autowired
    private StudyTaskMapper studyTaskMapper;

    @Autowired
    private StudentTaskProgressMapper studentTaskProgressMapper;

    @Override
    public List<Map<String, Object>> getChapterTree() {
        Long studentId = UserContext.getStudentId();

        LambdaQueryWrapper<StudyChapter> chapterWrapper = new LambdaQueryWrapper<>();
        chapterWrapper.orderByAsc(StudyChapter::getSortOrder);
        List<StudyChapter> chapters = studyChapterMapper.selectList(chapterWrapper);

        List<StudyTask> tasks = studyTaskMapper.selectList(null);
        Map<Long, List<StudyTask>> taskMap = tasks.stream()
                .collect(Collectors.groupingBy(StudyTask::getChapterId));

        LambdaQueryWrapper<StudentTaskProgress> progressWrapper = new LambdaQueryWrapper<>();
        progressWrapper.eq(StudentTaskProgress::getStudentId, studentId);
        List<StudentTaskProgress> progressList = studentTaskProgressMapper.selectList(progressWrapper);
        Map<Long, Integer> progressMap = progressList.stream()
                .collect(Collectors.toMap(StudentTaskProgress::getTaskId, StudentTaskProgress::getStudyStatus));

        Map<Long, Boolean> chapterCompletedMap = new HashMap<>();
        for (StudyChapter chapter : chapters) {
            List<StudyTask> chapterTasks = taskMap.getOrDefault(chapter.getId(), new ArrayList<>());
            boolean allCompleted = !chapterTasks.isEmpty() && chapterTasks.stream()
                    .allMatch(task -> progressMap.getOrDefault(task.getId(), 0) == 1);
            chapterCompletedMap.put(chapter.getId(), allCompleted);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (StudyChapter chapter : chapters) {
            Map<String, Object> chapterMap = new HashMap<>();
            chapterMap.put("id", chapter.getId());
            chapterMap.put("chapterName", chapter.getChapterName());
            chapterMap.put("description", chapter.getDescription());

            boolean unlocked;
            if (chapter.getPreChapterId() == null || chapter.getPreChapterId() == 0) {
                unlocked = true;
            } else {
                unlocked = Boolean.TRUE.equals(chapterCompletedMap.getOrDefault(chapter.getPreChapterId(), false));
            }
            chapterMap.put("unlocked", unlocked);

            List<StudyTask> chapterTasks = taskMap.getOrDefault(chapter.getId(), new ArrayList<>());
            int totalTask = chapterTasks.size();
            int completedTask = (int) chapterTasks.stream()
                    .filter(task -> progressMap.getOrDefault(task.getId(), 0) == 1)
                    .count();
            chapterMap.put("totalTask", totalTask);
            chapterMap.put("completedTask", completedTask);

            List<Map<String, Object>> taskList = new ArrayList<>();
            for (StudyTask task : chapterTasks) {
                Map<String, Object> taskMapItem = new HashMap<>();
                taskMapItem.put("id", task.getId());
                taskMapItem.put("taskName", task.getTaskName());
                taskMapItem.put("studyStatus", progressMap.getOrDefault(task.getId(), 0));
                taskList.add(taskMapItem);
            }
            chapterMap.put("tasks", taskList);

            result.add(chapterMap);
        }

        return result;
    }

    @Override
    public StudyTask getTaskDetail(Long taskId) {
        return studyTaskMapper.selectById(taskId);
    }

    @Override
    public void markTaskComplete(Long taskId) {
        Long studentId = UserContext.getStudentId();

        LambdaQueryWrapper<StudentTaskProgress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StudentTaskProgress::getStudentId, studentId)
                .eq(StudentTaskProgress::getTaskId, taskId);
        StudentTaskProgress progress = studentTaskProgressMapper.selectOne(wrapper);

        if (progress == null) {
            progress = new StudentTaskProgress();
            progress.setStudentId(studentId);
            progress.setTaskId(taskId);
            progress.setStudyStatus(1);
            progress.setStudyTime(LocalDateTime.now());
            studentTaskProgressMapper.insert(progress);
        } else {
            progress.setStudyStatus(1);
            progress.setStudyTime(LocalDateTime.now());
            studentTaskProgressMapper.updateById(progress);
        }
    }

    @Override
    public void resetTask(Long taskId) {
        Long studentId = UserContext.getStudentId();

        LambdaQueryWrapper<StudentTaskProgress> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StudentTaskProgress::getStudentId, studentId)
                .eq(StudentTaskProgress::getTaskId, taskId);
        StudentTaskProgress progress = studentTaskProgressMapper.selectOne(wrapper);

        if (progress != null) {
            progress.setStudyStatus(0);
            progress.setStudyTime(null);
            studentTaskProgressMapper.updateById(progress);
        }
    }

    @Override
    public Map<String, Object> getProgress() {
        Long studentId = UserContext.getStudentId();

        Long totalTask = studyTaskMapper.selectCount(null);

        LambdaQueryWrapper<StudentTaskProgress> progressWrapper = new LambdaQueryWrapper<>();
        progressWrapper.eq(StudentTaskProgress::getStudentId, studentId)
                .eq(StudentTaskProgress::getStudyStatus, 1);
        Long completedTask = studentTaskProgressMapper.selectCount(progressWrapper);

        LambdaQueryWrapper<StudyChapter> chapterWrapper = new LambdaQueryWrapper<>();
        chapterWrapper.orderByAsc(StudyChapter::getSortOrder);
        List<StudyChapter> chapters = studyChapterMapper.selectList(chapterWrapper);

        List<StudyTask> allTasks = studyTaskMapper.selectList(null);
        Map<Long, List<StudyTask>> taskMap = allTasks.stream()
                .collect(Collectors.groupingBy(StudyTask::getChapterId));

        List<StudentTaskProgress> allProgress = studentTaskProgressMapper.selectList(
                new LambdaQueryWrapper<StudentTaskProgress>()
                        .eq(StudentTaskProgress::getStudentId, studentId)
        );
        Map<Long, Integer> progressMap = allProgress.stream()
                .collect(Collectors.toMap(StudentTaskProgress::getTaskId, StudentTaskProgress::getStudyStatus));

        int completedChapter = 0;
        for (StudyChapter chapter : chapters) {
            List<StudyTask> chapterTasks = taskMap.getOrDefault(chapter.getId(), new ArrayList<>());
            if (!chapterTasks.isEmpty() && chapterTasks.stream()
                    .allMatch(task -> progressMap.getOrDefault(task.getId(), 0) == 1)) {
                completedChapter++;
            }
        }

        int progressRate = totalTask == 0 ? 0 : (int) (completedTask * 100 / totalTask);

        Map<String, Object> result = new HashMap<>();
        result.put("totalTask", totalTask);
        result.put("completedTask", completedTask);
        result.put("completedChapter", completedChapter);
        result.put("progressRate", progressRate);

        return result;
    }
}
