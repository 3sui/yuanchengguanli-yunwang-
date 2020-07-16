<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">设备远程运维系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm('login')"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('login')">登录</el-button>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span class="login-tips" @click="register">新用户注册</span>
                    </el-col>
                    <el-col :span="6" :offset="10">
                        <span class="login-tips" @click="findpassword">找回密码</span>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    axios({
                        method: 'post',
                        url: '/login',
                        data: this.param
                    })
                        .then(res => {
                            console.log(res.data);
                            if (res.data.success) {
                                this.$message.success('登录成功');
                                
                                localStorage.username = res.data.username
                                localStorage.nickname = res.data.nickname
                                localStorage.role = res.data.role
                                localStorage.phone = res.data.phone
                                localStorage.email = res.data.email
                                localStorage.created_time = res.data.created_time
                                localStorage.token = res.data.token;
                            
                                this.$router.push('/');
                                console.log(res.data);
                            }
                        })
                        .catch(err => {
                            this.$message.success(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        register() {
            this.$router.push('/register');
        },
        findpassword() {}
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/beijing1.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    color: #fff;
}
.login-tips:hover {
    color: orange;
    cursor: pointer;
}
</style>