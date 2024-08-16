<template>
    <el-dialog v-model="dialogFormVisible" title="注册">
        <el-form :model="form">
            <el-form-item label="账号" :label-width="formLabelWidth">
                <el-input v-model="form.account" maxlength="20" show-word-limit autocomplete="off"
                    placeholder="不少于2个字符的账号" />
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="form.password" maxlength="20" show-word-limit show-password=true autocomplete="off"
                    placeholder="不少于6个字符的密码" />
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth">
                <el-input v-model="form.confirmpassword" maxlength="20" show-word-limit show-password=true
                    autocomplete="off" placeholder="确认密码" />
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
import service from '../../axios'
import {SuccessMessage, WaringMessage, ErrorMessage} from '../Message.vue'
// 对话框是否关闭
const dialogFormVisible = ref(false)
// 输入框的长度
const formLabelWidth = '200px'

const form = reactive({
    account: '',
    password: '',
    confirmpassword: '',
})
// 打开对话框
function open() {
    dialogFormVisible.value = true;
}

// 提交表单
function SubmitInfo() {
    //判断必填字段是否为空
    if (
        !form.account ||
        !form.password ||
        !form.confirmpassword
    ) {
        WaringMessage("必填字段不能为空！")
        return
    }
    if (form.account.length < 2) {
        WaringMessage("账户长度太短！")
        return
    }
    // 检查密码长度
    if (form.password.length < 6) {
        WaringMessage("密码长度太短！")
        return
    }
    // 检查确认密码长度
    if (form.confirmpassword.length < 6) {
        WaringMessage("确认密码长度太短！")
        return
    }
    // 判断两次密码是否一致
    if (form.password != form.confirmpassword) {
        WaringMessage("密码和确认密码不一致！")
        return
    }
    /*
        功能：注册用户
        传入：Json(NickName,Account,PassWord,PersonalProfile,School,Major)
        传出：Json(Result,Reason)
    */
    service
        .post(`/api/user/register`, {
            account: form.account,
            password: form.password,
        })
        .then(
            (response) => {
                let json = response.data
                if (json.status == "success") {
                    SuccessMessage("注册成功")
                    dialogFormVisible.value = false
                    return
                } else {
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