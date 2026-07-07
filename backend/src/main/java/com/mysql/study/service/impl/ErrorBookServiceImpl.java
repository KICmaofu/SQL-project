package com.mysql.study.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mysql.study.common.BusinessException;
import com.mysql.study.common.ResultCode;
import com.mysql.study.context.UserContext;
import com.mysql.study.entity.StudentErrorBook;
import com.mysql.study.mapper.StudentErrorBookMapper;
import com.mysql.study.service.ErrorBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ErrorBookServiceImpl implements ErrorBookService {

    @Autowired
    private StudentErrorBookMapper studentErrorBookMapper;

    @Override
    public Page<StudentErrorBook> getErrorList(Integer masterStatus, Integer pageNum, Integer pageSize) {
        Long studentId = UserContext.getStudentId();

        QueryWrapper<StudentErrorBook> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("student_id", studentId);

        if (masterStatus != null) {
            queryWrapper.eq("master_status", masterStatus);
        }

        queryWrapper.orderByDesc("create_time");

        Page<StudentErrorBook> page = new Page<>(pageNum, pageSize);
        return studentErrorBookMapper.selectPage(page, queryWrapper);
    }

    @Override
    public void markMaster(Long id) {
        Long studentId = UserContext.getStudentId();

        StudentErrorBook errorBook = studentErrorBookMapper.selectById(id);
        if (errorBook == null) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "错题记录不存在");
        }

        if (!errorBook.getStudentId().equals(studentId)) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权限操作");
        }

        errorBook.setMasterStatus(1);
        studentErrorBookMapper.updateById(errorBook);
    }
}
