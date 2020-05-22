<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 供应商管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="AddSupplier"
                    icon="el-icon-plus"
                >新增</el-button>
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="ImportSuppliers"
                    icon="el-icon-upload2"
                >导入供应商</el-button>
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="importParts"
                    icon="el-icon-upload2"
                >导入零部件</el-button>
            </div>
            <div class="handle-box">
                <el-row>
                    <el-col :span="3">
                        <el-select v-model="value" placeholder="请选择省">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="value" placeholder="请选择市">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="value" placeholder="请选择区县">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="query.name" placeholder="名称"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <div class="demonstration">创建日期</div>
                    </el-col>
                    <el-col :span="8">
                        <el-date-picker
                            v-model="value1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </el-col>
                </el-row>
            </div>

            <!-- 表格列 -->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- 复选框 -->
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 序号 -->
                <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
                <!-- 供应商编号 -->
                <el-table-column prop="supplierID" label="供应商编号" align="center"></el-table-column>
                <!-- 供应商名称 -->
                <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                <!-- 主要联系人姓名 -->
                <el-table-column prop="contactName" label="主要联系人姓名" align="center"></el-table-column>
                <!-- 手机号码 -->
                <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
                <!-- 邮箱 -->
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <!-- 所属行业大类 -->
                <el-table-column prop="industry" label="所属行业大类" align="center"></el-table-column>
                <!-- 省 -->
                <el-table-column prop="province" label="省" align="center"></el-table-column>
                <!-- 市 -->
                <el-table-column prop="city" label="市" align="center"></el-table-column>
                <!-- 区县 -->
                <el-table-column prop="district" label="区县" align="center"></el-table-column>
                <!-- 创建日期 -->
                <el-table-column prop="createtime" label="创建日期" align="center"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleEdit(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增/编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="*供应商名称">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="*所属行业大类">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="*主要联系人姓名">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="*手机号">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="*邮箱">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="所在地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="*具体地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <el-divider content-position="left">添加零部件</el-divider>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="*零部件名称">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="继续添加">
                    <i data-v-41aaf3b9 class="el-icon-lx-add"></i>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'SupplierManagement',
    data() {
        return {
            query: {
                id: 0,
                supplierID: '001',
                supplierName: '航天云网',
                contactName: '张三',
                phone: '1562839294',
                email: 'sssss@qq.com',
                industry: '制造业',
                province: '江苏省',
                city: '常州市',
                district: '新北区',
                createtime: '2020-05-09 09:25:26',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.supplier;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        AddSupplier(){
 this.editVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.demonstration {
    text-align: center;
    padding: 3px 0;
}
</style>
