<template>
    <el-card class="box-card">
        <h1>修改个人信息</h1>
        <el-form :model="form" label-width="120px">
            <el-avatar :size="100" :src="form.avatar" style="display: block; margin: 0 auto;"/>
            <br/>
            <el-form-item label="头像">
                <el-input v-model="form.avatar" />
                <!-- <el-text class="mx-1">Tip：通过网上获取图片地址链接更改头像</el-text> -->
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="form.account" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.Major" maxlength="20" show-word-limit />
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
import store from '../store'
import service from '../axios'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()

const pointmessage = ref('')
const userid = ref('')

const form = reactive({
    avatar: '',
    account: '',
    password: ''
})

const onSubmit = () => {
    service
        .post(`/api/user/update`, {
            uid: store.state.uid,
            avatar: form.avatar,
            account: form.account,
            password: form.password,
        })
        .then(
            (response) => {
                if (response.data.Result == "Success") {
                    // 如果是本人修改则修改头像
                    if (store.state.UserId == userid.value)
                        store.state.Avatar = form.Avatar

                    pointmessage.value = "修改成功";
                    SuccessMessage()
                    router.go(-1)
                } else {
                    pointmessage.value = response.data.Reason
                    ErrorMessage()
                }
            },
            (error) => {
                console.log("请求失败了！！！");
                pointmessage.value = "网络似乎出现了问题！";
                ErrorMessage()
            }
        );
    console.log('submit!')
}

const onCancel = () => {
    router.go(-1)
}
// 获取用户信息
function GetServerInfo() {
    service
        .get(`/api/user/updateinfo`, {
            params: {
                UserId: userid.value
            }
        })
        .then(
            (response) => {
                if (response.data.Result == "Success") {
                    pointmessage.value = "请求信息成功！";
                    SuccessMessage()
                    setdatainfo(response.data)
                } else {
                    pointmessage.value = response.data.Reason
                    ErrorMessage()
                }
            },
            (error) => {
                pointmessage.value = "网络似乎出现了问题！";
                ErrorMessage()
            }
        );
}
// 设置信息
function setdatainfo(info: any) {
    form.Avatar = info.Avatar
    form.Major = info.Major
    form.PersonalProfile = info.PersonalProfile
    form.School = info.School
}
onMounted(() => {
    userid.value = String(route.query.UserId)
    GetServerInfo()
})
// 发送错误消息
const ErrorMessage = () => {
    ElMessage({
        showClose: true,
        message: pointmessage.value,
        type: 'error',
    })
}
// 发送成功消息
const SuccessMessage = () => {
    ElMessage({
        showClose: true,
        message: pointmessage.value,
        type: 'success',
    })
}
</script>

<style scoped>
.box-card {
    margin: 10px;
}
</style>