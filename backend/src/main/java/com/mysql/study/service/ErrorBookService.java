package com.mysql.study.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mysql.study.entity.StudentErrorBook;

public interface ErrorBookService {

    Page<StudentErrorBook> getErrorList(Integer masterStatus, Integer pageNum, Integer pageSize);

    void markMaster(Long id);
}
