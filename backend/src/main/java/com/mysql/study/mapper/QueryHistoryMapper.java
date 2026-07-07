package com.mysql.study.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mysql.study.entity.QueryHistory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QueryHistoryMapper extends BaseMapper<QueryHistory> {
}
