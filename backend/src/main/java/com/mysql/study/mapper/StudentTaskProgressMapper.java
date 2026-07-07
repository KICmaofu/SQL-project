package com.mysql.study.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mysql.study.entity.StudentTaskProgress;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentTaskProgressMapper extends BaseMapper<StudentTaskProgress> {
}
