package com.mysql.study.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mysql.study.entity.StudyTask;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudyTaskMapper extends BaseMapper<StudyTask> {
}
