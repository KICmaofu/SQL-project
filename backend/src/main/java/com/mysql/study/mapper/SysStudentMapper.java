package com.mysql.study.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mysql.study.entity.SysStudent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SysStudentMapper extends BaseMapper<SysStudent> {
}
