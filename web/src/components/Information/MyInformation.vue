<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 个人信息
                </el-breadcrumb-item>
                <el-breadcrumb-item>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-row :gutter="20">
                <el-col :span="4">
                    <div class="avatar-container">
                        <el-upload
                            class="avatar-uploader"
                            :data="{id:addNewUserId}"
                            :action="axios.defaults.baseURL + '/dataSettings/addNewUserAvatar'"
                            :headers="getAuthHeaders()"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-change="clickAvatarUpload"
                            accept=".jpg, .png, .jpeg"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-button type="primary" @click="upload">上传</el-button>
                    </div>
                </el-col>
                <el-col :span="20">
                    <el-form
                        label-position="right"
                        label-width="100px"
                        :model="form"
                        class="demo-dynamic"
                    >
                        <el-form-item label="用户账号">
                            <el-input v-model="form.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="用户姓名">
                            <el-input v-model="form.nickname" disabled></el-input>
                            <el-button
                                type="primary"
                                @click="Edit('nickname','用户姓名',form.nickname)"
                            >修改</el-button>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="form.phone" disabled></el-input>
                            <el-button type="primary" @click="Edit('phone','手机号',form.phone)">修改</el-button>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="form.email" disabled></el-input>
                            <el-button type="primary" @click="Edit('email','邮箱',form.email)">修改</el-button>
                        </el-form-item>
                        <el-form-item label="注册日期">
                            <el-input v-model="form.created_time" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <el-dialog
            :title="'修改'+dialoglabel"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <!-- <span>这是一段信息</span> -->
            <el-form label-position="right" label-width="100px" :model="form" class="demo-dynamic">
                <el-form-item :label="dialoglabel">
                    <el-input v-model="dialogvalue"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="Confirm(dialogkey,dialogvalue)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'MyInformation',
    data() {
        return {
            form: {
                username: '',
                nickname: '',
                phone: '',
                email: '',
                created_time: ''
            },
            imageUrl: '',
            dialogVisible: false,
            dialoglabel: '',
            dialogkey: '',
            dialogvalue: ''
        };
    },

    created() {
        this.getData();
    },

    computed: {},

    methods: {
        getData() {
            axios({
                methods: 'get',
                url: '/login/checkUser',
                params: {
                    username: localStorage.username
                }
            }).then(res => {
                if (res.data !== [] || res.data.length !== 0) {
                    this.form = JSON.parse(JSON.stringify(res.data[0]));
                }
            });
        },
        Edit(key, label, value) {
            this.dialogVisible = true;
            this.dialoglabel = label;
            this.dialogkey = key;
            this.dialogvalue = value;
        },
        handleClose(done) {
            this.dialogVisible = false;
        },
        Confirm(dialogkey, dialogvalue) {
            let data = {
                name: dialogkey,
                value: dialogvalue,
                username: this.form.username
            };
            this.$axios.post('/login/ModifyUser', data).then(res => {
                if (res.data) {
                    this.$message.success('修改成功');
                    localStorage[dialogkey]=dialogvalue;
                    this.dialogVisible = false;
                    this.getData();
                } else {
                    this.$message.error('修改失败');
                    this.dialogVisible = false;
                }
                // console.log(res);
            });
        },

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};
</script>
<style scoped>
.el-form {
    width: 80%;
    margin: auto;
    font-size: 14px;
}
.el-input {
    border: none;
    width: 80%;
    margin-right: 5px;
    font-size: 16px;
}
.avatar-container {
    width: 178px;
    height: 178px;
    margin: auto;
    border: 1px dashed #dddddd;
    border-radius: 6px;
    cursor: pointer;
}
.avatar-container:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
