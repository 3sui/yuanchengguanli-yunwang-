/*
 * @Author: your name
 * @Date: 2020-06-02 14:22:53
 * @LastEditTime: 2020-07-03 15:36:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \server\route\login\index.js
 */
module.exports = app => {
    const connection = require('../../mysql/mysql')()
    const express = require('express')
    const router = express.Router()
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const authMiddle = require('../../middleware/auth')()

    router.post('/', async (req, res) => {
        const {
            password,
            username
        } = req.body
        console.log(password)
        let sql = "select * from user_info where username = ? and is_deleted = 0"
        let row = await connection(sql, username)
        assert(row.length, 422, '用户不存在')
        assert(row[0].password === password, 422, '密码不正确')
        let result = {}
        result.token = jwt.sign({
            id: row[0].id
        }, app.get('secret'))
        result.username = row[0].username
        result.nickname = row[0].nickname
        result.phone = row[0].phone
        result.email = row[0].email
        result.created_time = row[0].created_time
        result.role = row[0].role
        result.enterprise_id = row[0].enterprise_id
    
       
        result.success = true
        console.log(result);
      
        res.send(result)
    })

    router.post('/changePass', authMiddle, async (req, res) => {
        console.log(req.body)
        console.log(req.user);

        let {
            oldPass,
            newPass,
            checkPass
        } = req.body
        let sql

        let results = {}
        if (oldPass == req.user.password) {
            if (newPass == req.user.password) {
                results.success = false
                results.message = '没有更新密码'
            } else {
                results.success = true
                sql = `update user_info set password = '${newPass}' where id = ${req.user.id}`
                await connection(sql)
                results.message = '密码修改成功'
            }

        } else {
            results.success = false
            results.message = '原始密码输入错误,请重试'
        }
        res.send(results)
    })

//注册用户
    router.post('/addUser',  async (req, res) => {
        console.log(req.data);
        let data = {}
        data.username = req.body.username
        data.password = req.body.password
        data.nickname = req.body.nickname
        let sql = `insert into user_info set ? `
        let results = await connection(sql, data)
        console.log(results);
        res.send(results)
    })

    //验证用户名是否已存在

    router.get('/checkUser', async (req, res) => {
        console.log(req.query);
    
        let username = req.query.username
        console.log(username);
       
        let sql = `select * from user_info where username='${username}' and is_deleted='0' `
        console.log(sql);
        let results = await connection(sql)
        console.log(results);
        res.send(results)
    })

    //修改用户信息：名称、电话、邮箱
    router.post('/ModifyUser', authMiddle,async (req, res) => {
 
        let name = req.body.name
        let value = req.body.value
        let username=req.body.username
     
        let sql = `update user_info set ${name}='${value}' where username='${username}' `
        console.log(sql);
        let results = await connection(sql)
        console.log(results);
        res.send(results)
    })


    app.use('/api/login', router)

}