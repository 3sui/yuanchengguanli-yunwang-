<!--
 * @Author: your name
 * @Date: 2020-05-06 16:21:18
 * @LastEditTime: 2020-05-13 17:32:52
 * @LastEditors: Please set LastEditors
 * @Description: 设备监控
 * @FilePath: \vue-manage-system\src\components\view\EquipmentMonitoring.vue
 -->
<!--  -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 远程监控
                </el-breadcrumb-item>
                <el-breadcrumb-item>设备列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="product-status">
                    <div>
                        <el-input
                            v-model="query.name"
                            placeholder="请输入设备名称/序列号搜索"
                            class="handle-input mr10"
                        ></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </div>
                    <div>
                        <el-button icon="el-icon-delete" plain>批量删除</el-button>
                        <!-- <el-upload
                            style="display: inline-block"
                            action
                            :limit="1"
                            :on-change="handleChange"
                            :on-exceed="handleExceed"
                            :show-file-list="false"
                            accept=".xlsx, .xls"

                        >
                            <el-button plain icon="el-icon-upload2">导入设备</el-button>
                        </el-upload>-->
                        <el-upload
                            ref="abc"
                            class="upload-demo"
                            style="display: inline-block"
                            action
                            :on-change="handleChange"
                            :on-exceed="handleExceed"
                            :limit="limitUpload"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            :auto-upload="false"
                            :show-file-list="false"
                        >
                            <el-button plain icon="el-icon-upload2">导入设备</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div> -->
                        </el-upload>
                        <!-- <el-button plain icon="el-icon-upload2">模板下载</el-button> -->
                        <download-excel
                            plain
                            style="display: inline-block"
                            icon="el-icon-upload2"
                            :data="json_data"
                            :fields="json_fields"
                            name="UserInfo"
                        >
                            <el-button plain icon="el-icon-upload2">模板下载</el-button>
                        </download-excel>
                        <el-button plain type="primary" icon="el-icon-circle-plus-outline">创建设备</el-button>
                    </div>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                @cell-click="showMore"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="序号" width="55" align="center" type="index"></el-table-column> -->

                <el-table-column prop="DeviceID" label="设备ID"></el-table-column>

                <el-table-column prop="DeviceName" label="设备名称"></el-table-column>
                <el-table-column prop="DeviceClass" label="设备序列号"></el-table-column>
                <el-table-column prop="DeviceClass" label="品牌"></el-table-column>

                <el-table-column prop="Model" label="型号"></el-table-column>
                <el-table-column prop="SerialNumber" label="产线"></el-table-column>
                <el-table-column prop="CustomerName" label="创建时间"></el-table-column>

                <!-- <el-table-column prop="ErrorCode" label="故障代码"></el-table-column> -->
                <el-table-column prop="Duration" label="设备状态">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.switch==='开机'?'success':(scope.row.switch==='关机'?'danger':'')"
                        >{{scope.row.switch}}</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="name" label="更新日期"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <router-link
                                :to="{path: '/MeasuringPointDetails', query: {id:scope}}"
                                class="el-icon-delete-solid"
                            ></router-link>
                            <i class="el-icon-s-order"></i>
                            <i class="el-icon-s-tools"></i>
                        </div>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'EquipmentMonitoring',
    data() {
        return {
            json_fields: {
                User_Name: 'name', //常规字段
                City: 'info.city', //支持嵌套属性
                phone: {
                    field: 'phone.landline',
                    callback: value => {
                        //自定义回调函数
                        return `Landline Phone - ${value}`; //拼接返回值
                    }
                },
                remark: {
                    field: 'info.remark',
                    callback: value => {
                        return `Reamrk:  ${value}`;
                    }
                }
            },
            //测试数据
            json_data: [
                {
                    name: '张三',
                    info: {
                        city: 'New York',
                        country: 'EN',
                        remark: '测试1'
                    },
                    phone: {
                        mobile: '1',
                        landline: '11'
                    }
                },
                {
                    name: '李四',
                    info: {
                        city: 'BeiJing',
                        country: 'CN',
                        remark: '测试2'
                    },
                    phone: {
                        mobile: '2',
                        landline: '22'
                    }
                },
                {
                    name: '王二',
                    info: {
                        city: 'Nanjing',
                        country: 'CN',
                        remark: '测试3'
                    },
                    phone: {
                        mobile: '3',
                        landline: '33'
                    }
                }
            ],
            //数据格式
            json_meta: [
                [
                    {
                        ' key ': ' charset ',
                        ' value ': ' utf- 8 '
                    }
                ]
            ],
            visible: false,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            value1: '',
            value2: '',
            query: {
                address: '',
                name: '',
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
            id: -1,
            limitUpload: 1,
            fileTemp: null,
            file: null,
            da: [],
            dalen: 0
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            axios({
                method: 'get',
                url: '/fetchEquipment'
            }).then(res => {
                window.console.log(res);
                if (res.status === 200) {
                    this.tableData = res.data;
                    this.pageTotal = res.data.length;
                    window.console.log(res.data);
                } else {
                    window.console.log('服务器错误');
                }
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
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },

        //跳转到详情页
        showMore(row, column, cell, event) {
            // window.console.log(row, column, cell, event);
            let a;
            let arr = [
                '主机温度(℃)',
                '水箱温度(℃)',
                '进口温度(℃)',
                '出口温度(℃)',
                '压力',
                '压差',
                '电机转速(转/分)',
                '电流(A)',
                '主油箱液位(mm)',
                '主油箱温度(℃)',
                '供油管路温度(℃)',
                '紧急过滤器压差',
                '双筒过滤器压差',
                '高位油箱液位(mm)',
                '控制油压力',
                '润滑油出口压力',
                '电机泵组震动',
                '电机电流',
                '主油箱油品分析',
                '运行时长(h)'
            ];
            a = arr.includes(column.label);
            if (!a) {
                return false;
            }
            this.$router.push({
                path: '/MeasuringPointDetails',
                query: {
                    type: column.property,
                    id: row.DeviceID,
                    label: column.label,
                    row
                }
            });
        },

        //上传文件时处理方法
        handleChange(file, fileList) {
            this.fileTemp = file.raw;
            if (this.fileTemp) {
                if (
                    this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    this.fileTemp.type == 'application/vnd.ms-excel'
                ) {
                    this.importfxx(this.fileTemp);
                    this.$refs['abc'].clearFiles();
                } else {
                    this.$message({
                        type: 'warning',
                        message: '附件格式错误，请删除后重新上传！'
                    });
                }
            } else {
                this.$message({
                    type: 'warning',
                    message: '请上传附件！'
                });
            }
        },
        //超出最大上传文件数量时的处理方法
        handleExceed() {
            this.$message({
                type: 'warning',
                message: '超出最大上传文件数量的限制！'
            });
            return;
        },
        importfxx(obj) {
            let _this = this;
            let inputDOM = this.$refs.inputer;
            // 通过DOM取文件数据

            this.file = event.currentTarget.files[0];

            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;

            var reader = new FileReader();
            //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = '';
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                    console.log('未处理的原始数据如下：');
                    console.log(outdata);
                    //此处可对数据进行处理
                    let arr = [];
                    outdata.map(v => {
                        let obj = {};
                        obj.code = v['Code'];
                        obj.name = v['Name'];
                        obj.pro = v['province'];
                        obj.cit = v['city'];
                        obj.dis = v['district'];
                        arr.push(obj);
                    });
                    _this.da = arr;
                    _this.dalen = arr.length;
                    return arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
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

.handle-input {
    width: 300px;
    display: inline-block;
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
.product-status {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
}
.mt-10 {
    margin-bottom: 10px;
}
th {
    background-color: #eef1f6;
    padding: 5px 15px;
}
td {
    padding: 5px 15px;
}
table {
    margin: 0 auto;
    width: 90%;
    border: 1px solid #cdcdcd;
    text-align: center;
}
</style>

