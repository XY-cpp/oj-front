<template>
    <el-card class="box-card">
        <h1>{{ NickName }}</h1>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-avatar :size="170" :src="avatar" />
            </el-col>
            <el-col :span="14">
                用户名：{{ account }}
                <el-divider />
                通过数量：{{ ac_num }}
                <el-divider />
                提交次数：{{ submit_num }}
                <el-divider />
                加入时间：{{ join_time }}
                <el-divider />
            </el-col>
            <el-col :span="6">
                <UserPieChart ref="userpiechart"></UserPieChart>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import service from '../axios'
import UserPieChart from '../components/Chart.vue'
import { SuccessMessage, WaringMessage, ErrorMessage } from '../components/Message.vue'
import { ref,  onMounted } from 'vue'
import store from '../store'


const userpiechart = ref()

const join_time = ref('')
const ac_num = ref(0)
const account = ref('')
const submit_num = ref(0)
const avatar = ref('')

function GetInfo() {
    service
        .post(`/api/user/query`, {
            uid: store.state.uid
        })
        .then(
            (response) => {
                let json = response.data
                if (json.status == "success") {
                    const date = new Date(json.data.join_time);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    avatar.value = json.data.avatar
                    account.value = json.data.account
                    join_time.value = `${year}-${month}-${day}`;
                } else {
                    ErrorMessage(json.message)
                }
            },
            (_) => {
                ErrorMessage("网络似乎出现了问题！")
            }
        );
    service.post(`/api/record/query`, {
        uid: store.state.uid
    }).then(
            (response) => {
                let json = response.data
                if (json.status == "success") {
                    submit_num.value = json.data.length
                    ac_num.value = json.data.filter(item => item.status === 30).length
                    userpiechart.value.SetDataInfo({solved: ac_num.value, unsolved: submit_num.value - ac_num.value})
                } else {
                    ErrorMessage(json.message)
                }
            },
            (_) => {
                ErrorMessage("网络似乎出现了问题！")
            }
        )

}
onMounted(() => {
    // 调用函数
    GetInfo()
})
</script>

<style scoped>
.box-card {
    margin: 10px;
}

.h1 {
    font-size: 50px;
    margin-left: 20px;
}
</style>