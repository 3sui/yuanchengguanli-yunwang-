<!--
 * @Author: your name
 * @Date: 2020-05-06 14:19:13
 * @LastEditTime: 2020-05-16 12:06:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-manage-system\src\components\view\AddNewProduct.vue
 -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 产品档案
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加产品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" @click="$router.go(-1)">返回</el-button>

            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="设备ID" prop="DeviceID">
                        <el-input v-model="form.DeviceID"></el-input>
                    </el-form-item>
                    <el-form-item label="设备种类" prop="DeviceClass">
                        <el-select v-model="form.DeviceClass" placeholder="请选择">
                            <el-option label="干燥设备" value="干燥设备"></el-option>
                            <el-option label="液压设备" value="液压设备"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="DeviceName">
                        <el-input v-model="form.DeviceName"></el-input>
                    </el-form-item>
                    <el-form-item label="型号描述" prop="Model">
                        <el-input v-model="form.Model"></el-input>
                    </el-form-item>
                    <el-form-item label="出厂编号" prop="SerialNumber">
                        <el-input v-model="form.SerialNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="所属客户名称" prop="CustomerName">
                        <el-input v-model="form.CustomerName"></el-input>
                    </el-form-item>
                    <el-form-item label="客户行业" prop="CustomerIndustry">
                        <el-input v-model="form.CustomerIndustry"></el-input>
                    </el-form-item>
                    <el-form-item label="安装地址" prop="selectedOptions">
                        <el-cascader
                            size="large"
                            :options="options"
                            v-model="selectedOptions"
                            @change="handleChange"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="Address">
                        <el-input v-model="form.Address"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="resetForm('form')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data';
export default {
    name: 'baseform',
    data() {
        return {
            options: regionData,
            form: {
                DeviceID: '',
                DeviceClass: '',
                DeviceName: '',
                Model: '',
                SerialNumber: '',
                CustomerName: '',
                CustomerIndustry: '',
                Address: '',
                Province: '',
                City: '',
                District: ''
            },
            selectedOptions: ''
        };
    },
    methods: {
        onSubmit() {
            axios({
                method: 'post',
                url: '/addNewProduct',
                data: this.form
            })
                .then(res => {
                    window.console.log(res.data);
                    this.$message.success('提交成功！');
                    this.$refs.form.resetFields();

                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1000);
                })
                .catch(err => {});
        },
        handleChange() {
            this.form.Province = CodeToText[this.selectedOptions[0]];
            this.form.City = CodeToText[this.selectedOptions[1]];
            this.form.District = CodeToText[this.selectedOptions[2]];
            window.console.log(this.selectedOptions);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>
<style scoped>
.form-box {
    margin: 0 auto;
}
</style>