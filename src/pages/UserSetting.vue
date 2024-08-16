<template>
    <el-card class="box-card">
        <h1>修改个人信息</h1>
        <el-form :model="form" label-width="120px">
            <el-avatar :size="100" :src="info.avatar" style="display: block; margin: 0 auto;" />
            <br />
            <el-form-item label="头像">
                <el-input v-model="form.avatar" :placeholder="info.avatar" />
                <!-- <el-text class="mx-1">Tip：通过网上获取图片地址链接更改头像</el-text> -->
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="form.account" maxlength="20" show-word-limit :placeholder="info.account" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" maxlength="20" show-word-limit placeholder="输入新密码"
                    show-password=true />
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input v-model="form.confirm_password" maxlength="20" show-word-limit placeholder="确认新密码"
                    show-password=true />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { SuccessMessage, WaringMessage, ErrorMessage } from '../components/Message.vue'
import store from '../store'
import service from '../axios'
import { useRouter, useRoure } from 'vue-router'
const router = useRouter()

const form = reactive({
    avatar: null,
    account: null,
    password: null,
    confirm_password: null
})

const info = ref({
    avatar: '',
    account: '',
    password: '',
})

const onSubmit = () => {
    // 检查账户长度
    if (form.account != null && form.account.length < 2) {
        WaringMessage("账号长度太短")
        return
    }
    // 检查密码长度
    if (form.password != null && form.password.length < 6) {
        WaringMessage("密码长度太短")
        return
    }
    if (form.password != form.confirm_password) {
        WaringMessage("密码和确认密码不一致！")
        return
    }
    service.post(`/api/user/update`, {
        uid: store.state.uid,
        avatar: form.avatar,
        account: form.account,
        password: form.password,
    }).then(
        (response) => {
            let json = response.data
            if (json.status == "success") {
                SuccessMessage("修改成功")
                router.go(-1)
            } else {
                ErrorMessage(json.message)
            }
        },
        (_) => {
            ErrorMessage("网络似乎出现了问题！")
        }
    );
}

const onCancel = () => {
    router.go(-1)
}

// 获取用户信息
function GetServerInfo() {
    service.post(`/api/user/query`, { uid: store.state.uid })
        .then(
            (response) => {
                let json = response.data;
                if (json.status == "success") {
                    info.value.avatar = json.data.avatar
                    info.value.account = json.data.account
                    info.value.password = json.data.password
                } else {
                    ErrorMessage(json.message)
                }
            },
            (_) => {
                ErrorMessage("网络似乎出现了问题！")
            }
        );
}
onMounted(() => {
    GetServerInfo()
})
</script>

<style scoped>
.box-card {
    margin: 10px;
}
</style>