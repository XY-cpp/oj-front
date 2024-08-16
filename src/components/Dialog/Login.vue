<template>
    <el-dialog v-model="dialogFormVisible" title="登录">
        <el-form :model="form">
            <el-form-item label="账号" :label-width="formLabelWidth">
                <el-input v-model="form.account" 
                maxlength="20"
                autocomplete="off"/>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="form.password"
                maxlength="20" show-password = true
                autocomplete="off"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="SubmitInfo">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {SuccessMessage, WaringMessage, ErrorMessage} from '../Message.vue'
import service from '../../axios'
import store from '../../store'
import { useRouter } from 'vue-router'
const router = useRouter()
// 对话框是否关闭
const dialogFormVisible = ref(false)
// 输入框的长度
const formLabelWidth = '200px'
// 信息
const form = reactive({
    account:'',
    password:'',
})
// 打开对话框
function open(){
    dialogFormVisible.value = true;
}

// 提交表单
function SubmitInfo(){
    //判断必填字段是否为空
    if (
        !form.account  ||
        !form.password 
    ) {
        WaringMessage( "必填字段不能为空")
        return
    }
    // 检查账户长度
    if(form.account.length < 2){
        WaringMessage("账号长度太短")
        return
    }
    // 检查密码长度
    if(form.password.length < 6){
        WaringMessage("密码长度太短")
        return
    }
    /*
        功能：登录用户
        传入：Json(Account,PassWord)
        传出：Json(Result,Reason,Info(_id,NickName,Avatar,CommentLikes,Solves,Authority))
    */
    service
        .post(`/api/user/login`, {
            account:form.account,
            password:form.password,
        })
        .then(
        (response) => {
            let json = response.data
            if(json.status == "success"){
                SuccessMessage("登录成功")
                dialogFormVisible.value = false
                store.commit('Login',json.data)
                router.push({name:'HomePage'})
                return
            }else{
                WaringMessage(json.message)
                return
            }
        },
        (error) => {
            console.log(error.data);
            ErrorMessage("提交失败,可能网络出现问题！")
            return
        }
    );
}
defineExpose({
    open
})
</script>
<style scoped>
    .el-button--text {
        margin-right: 15px;
    }
    .el-select {
        width: 300px;
    }
    .el-input {
        width: 300px;
    }
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
</style>