package com.mysql.study.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mysql.study.common.BusinessException;
import com.mysql.study.common.JwtUtil;
import com.mysql.study.entity.SysStudent;
import com.mysql.study.mapper.SysStudentMapper;
import com.mysql.study.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private SysStudentMapper sysStudentMapper;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Long register(String username, String password, String realName) {
        LambdaQueryWrapper<SysStudent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysStudent::getUsername, username);
        SysStudent existStudent = sysStudentMapper.selectOne(wrapper);
        if (existStudent != null) {
            throw new BusinessException("用户名已存在");
        }

        SysStudent student = new SysStudent();
        student.setUsername(username);
        student.setPassword(passwordEncoder.encode(password));
        student.setRealName(realName);
        student.setStatus(1);
        sysStudentMapper.insert(student);

        return student.getId();
    }

    @Override
    public Map<String, Object> login(String username, String password) {
        LambdaQueryWrapper<SysStudent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysStudent::getUsername, username);
        SysStudent student = sysStudentMapper.selectOne(wrapper);

        if (student == null || !passwordEncoder.matches(password, student.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        if (student.getStatus() == 0) {
            throw new BusinessException("账号已被禁用");
        }

        String token = jwtUtil.generateToken(student.getId(), student.getUsername());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);

        Map<String, Object> studentInfo = new HashMap<>();
        studentInfo.put("id", student.getId());
        studentInfo.put("username", student.getUsername());
        studentInfo.put("realName", student.getRealName());
        result.put("studentInfo", studentInfo);

        return result;
    }
}
