package com.mysql.study.controller;

import com.mysql.study.common.Result;
import com.mysql.study.service.PracticeResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/practice")
public class PracticeController {

    @Autowired
    private PracticeResetService practiceResetService;

    @PostMapping("/reset")
    public Result<Void> reset() {
        practiceResetService.resetPracticeDb();
        return Result.success();
    }
}
