<template>
    <h1 class="title">用户</h1>
    <el-table :data="usersetdata.array" 
        border
        style="width: 100%" class="custom-table">
        <el-table-column prop="uid" label="ID" width="180" />
        <el-table-column prop="account" label="账户" width="180" />
        <el-table-column prop="auth" label="权限" width="180" />
        <el-table-column prop="join_time" label="加入时间" width="200"/>
        <el-table-column label="操作">
            <template #default="scope">
                <div class="action-buttons">
                <el-button size="small" @click="handleCheck(scope.row)">查看</el-button>
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
        <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 40, 60]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalsize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup>
import service from '../../axios'
import {reactive,ref,onMounted} from 'vue'
import { useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const pointmessage = ref('')

let currentPage = ref(1) // 当前页数
let pageSize = ref(20) // 当前页的数量
let totalsize = ref(20)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

// --------------------------------------
// 查看用户
function handleCheck(row){
    router.push({
        name: "UserHome",
        query: { uid: row.uid }
    });
}
// 编辑用户
function handleEdit(row){
    console.log('编辑用户',row.uid)
    router.push({
        name: "UserSetting",
        query: { uid: row.uid }
    });
}
// 删除用户
function handleDelete(row){
    console.log('点击删除',row)
    service.post(`/api/user/delete`,{
        uid: row.uid
    }).then(
        response => {
            let json = response.data
            if(json.status == "success"){
                console.log('请求成功了', json)
                pointmessage.value = "删除成功"
                SuccessMessage()
                GetUserSetInfo()
            }else{
                console.log('请求失败了', response.data)
                WaringMessage(json.message)
            }
        },
        error => {
            console.log('请求失败了',error.data)
        }
    )
}
// -------------------------------------------------------
const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
    pageSize.value = val;
    GetUserSetInfo(currentPage.value,pageSize.value)
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    currentPage.value = val;
    GetUserSetInfo(currentPage.value,pageSize.value)
}
// 用户信息列表
let usersetdata = reactive({'array':[]})

function GetUserSetInfo(m_page, m_pagesize){
    service.post(`/api/user/querylist`,{
        page_no: m_page,
        page_size: m_pagesize
    })
    .then(
        response => {
            let json = response.data
            if(json.status == "success"){
                console.log('请求成功了',json)
                usersetdata.array = json.data.result
                totalsize.value = Number(json.data.total)
            }else{
                WaringMessage(json.message)
            }
        },
        error => {
            console.log('请求失败了',error.data)
        }
    )
    console.log(m_page,m_pagesize)
}

onMounted(()=>{
    GetUserSetInfo(currentPage.value,pageSize.value)
})
// 发送成功消息
const SuccessMessage = () => {
    ElMessage({
        showClose: true,
        message: pointmessage.value,
        type: 'success',
    })
}
// 发送警告消息
const WaringMessage = () => {
    ElMessage({
        showClose: true,
        message: pointmessage.value,
        type: 'warning',
    })
}
// 发送错误消息
const ErrorMessage = () => {
    ElMessage({
        showClose: true,
        message: pointmessage.value,
        type: 'error',
    })
}
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.title {
  margin-left: 20px;
}
.custom-table {
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
}
.action-buttons {
    display: flex;
    justify-content: space-around; /* 或者使用 space-evenly */
    align-items: center;
}
</style>