package com.mysql.study.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mysql.study.common.Result;
import com.mysql.study.entity.StudentErrorBook;
import com.mysql.study.service.ErrorBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/error")
public class ErrorBookController {

    @Autowired
    private ErrorBookService errorBookService;

    @GetMapping("/list")
    public Result<Page<StudentErrorBook>> list(
            @RequestParam(required = false) Integer masterStatus,
            @RequestParam Integer pageNum,
            @RequestParam Integer pageSize) {
        Page<StudentErrorBook> page = errorBookService.getErrorList(masterStatus, pageNum, pageSize);
        return Result.success(page);
    }

    @PostMapping("/{id}/master")
    public Result<Void> markMaster(@PathVariable Long id) {
        errorBookService.markMaster(id);
        return Result.success();
    }
}
