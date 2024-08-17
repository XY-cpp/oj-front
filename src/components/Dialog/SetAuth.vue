<template>
    <el-dialog v-model="dialogFormVisible" title="设置权限">
        <el-form :model="form">
            <el-form-item label="权限等级" :label-width="formLabelWidth">
                <el-select v-model="form.authLevel" placeholder="请选择权限等级">
                    <el-option label="普通用户" :value="10"></el-option>
                    <el-option label="评测机" :value="20"></el-option>
                    <el-option label="管理员" :value="30"></el-option>
                </el-select>
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
import { SuccessMessage, WaringMessage, ErrorMessage } from '../Message.vue'
import service from '../../axios'

const dialogFormVisible = ref(false)
const formLabelWidth = '200px'
const form = reactive({
    authLevel: null,
    uid: null,  // 添加 uid 属性
})

function open(uid: number) {
    form.uid = uid;  // 打开对话框时设置 uid
    dialogFormVisible.value = true
}

function SubmitInfo() {
    if (form.authLevel === null) {
        WaringMessage("请选择权限等级")
        return
    }

    service
        .post(`/api/user/update`, {
            uid: form.uid,  // 传递 uid 到后端
            auth: form.authLevel,
        })
        .then(
            (response) => {
                let json = response.data
                if (json.status == "success") {
                    SuccessMessage("权限设置成功")
                    dialogFormVisible.value = false
                    return
                } else {
                    WaringMessage(json.message)
                    return
                }
            },
            (error) => {
                console.log(error.data)
                ErrorMessage("提交失败,可能网络出现问题！")
                return
            }
        )
}

defineExpose({
    open,
})
</script>

<style scoped>
    .el-select {
        width: 300px;
    }
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
</style>
