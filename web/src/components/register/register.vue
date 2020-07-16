<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">设备远程运维系统</div>
            <el-form :model="register" :rules="rules" ref="register" class="ms-content" status-icon>
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="register.username" placeholder="username">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" placeholder="password" v-model="register.password">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkpassword" label="密码确认">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="register.checkpassword"
                    >
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input placeholder="nickname" v-model="register.nickname">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('register')">注册</el-button>
                </div> 
              
                <el-row :gutter="20">
                    <el-col :span="8">
                        <span class="login-tips" @click="gologin">前往登录页面</span>
                    </el-col>
                    <!-- <el-col :span="6" :offset="10"><span class="login-tips " @click="findpassword">找回密码</span></el-col> -->
                </el-row>
             </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'register',
    data: function() {
        var checkusername=(rule,value,callback)=>{
             if (value === '') {
                callback(new Error('请输入用户名'));
            }else {
                axios({
                    methods:'get',
                    url:'/login/checkUser',
                    params:{
                        username:value
                    }
                })
                .then(res=>{
                    console.log(res.data);
                    if (res.data===[] || res.data.length===0){
                        console.log(111111);
                        callback()
                    }else{
                        callback(new Error('用户名已存在'));
                        console.log(22222);
                    }
                    // if(res.data)
                })
            }
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.register.checkpassword !== '') {
                    this.$refs.register.validateField('checkpassword');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.register.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            register: {
                username: '',
                password: '',
                checkpassword: '',
                nickname: ''
            },

            rules: {
                username: [{validator:checkusername, required: true, trigger: 'blur' }],
                password: [{ validator: validatePass, required: true, trigger: 'blur' }],
                checkpassword: [{ validator: validatePass2, required: true, trigger: 'blur' }],
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    axios({
                        method: 'post',
                        url: '/login/addUser',
                        data: this.register
                    })
                        .then(res => {
                            console.log(res.data);
                            if(res.data.affectedRows===1){
                                this.$message.success("注册成功")
                                this.gologin()
                            }else{
                                this.$message.error("注册失败")
                                this.$refs['register'].resetFields();
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
        gologin() {
            this.$router.push('/login');
        }
        // findpassword(){

        // }
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
    line-height: 30px;
    height: 30px;
    color: #fff;
}
.login-tips:hover {
    color: orange;
    cursor: pointer;
}
</style>