package com.example.sqleditor.controller;

import com.example.sqleditor.entity.DatasourceAddRequest;
import com.example.sqleditor.entity.DatasourceConfig;
import com.example.sqleditor.entity.SqlExecuteRequest;
import com.example.sqleditor.entity.SqlExecuteResult;
import com.example.sqleditor.service.DatasourceService;
import com.example.sqleditor.service.SqlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SqlEditorController {

    @Autowired
    private DatasourceService datasourceService;

    @Autowired
    private SqlService sqlService;

    @GetMapping("/datasource/list")
    public List<DatasourceConfig> getDatasourceList() {
        return datasourceService.list();
    }

    @PostMapping("/datasource/test")
    public Boolean testConnection(@RequestBody DatasourceAddRequest request) {
        return datasourceService.testConnection(request);
    }

    @PostMapping("/datasource/add")
    public void addDatasource(@RequestBody DatasourceAddRequest request) {
        datasourceService.add(request);
    }

    @DeleteMapping("/datasource/{id}")
    public void deleteDatasource(@PathVariable Long id) {
        datasourceService.delete(id);
    }

    @PostMapping("/sql/execute")
    public SqlExecuteResult executeSql(@RequestBody SqlExecuteRequest request) {
        return sqlService.execute(request.getSql(), request.getDatasourceId());
    }
}
