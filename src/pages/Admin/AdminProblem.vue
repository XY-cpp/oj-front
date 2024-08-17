<template>
    <h1 class="title">题目列表</h1>
    <el-button class="add-problem-btn" type="primary" @click="AddProblem">添加题目</el-button>
    
    <!-- 搜索栏 -->
    <el-input
        v-model="searchPid"
        placeholder="请输入题目ID进行搜索"
        class="search-input"
        clearable
        @clear="handleClear"
        @keyup.enter.native="searchProblem"
    >
        <template #append>
            <el-button @click="searchProblem">搜索</el-button>
        </template>
    </el-input>
    
    <el-table :data="problemsetdata.array" style="width: 100%" border class="custom-table">
        <el-table-column prop="pid" label="ID" width="60" />
        <el-table-column prop="title" label="Title" width="180" />
        <el-table-column prop="description" label="内容" />
        <el-table-column prop="time_limit" label="时间限制 (MS)"  width="150"/>
        <el-table-column prop="memory_limit" label="内存限制 (KB)"  width="150"/>
        <el-table-column label="操作">
            <template #default="scope">
                <div class="action-buttons">
                    <el-button size="small" @click="handleCheck(scope.row)">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
import {reactive, ref, onMounted } from 'vue'
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
const searchPid = ref()

// --------------------------------------
// 添加题目
function AddProblem()
{
    router.push({
        name: "ProblemEditor",
        query: { pid: "0" ,edittype:"Insert"}
    });
}
// 查看题目
function handleCheck(row){
    router.push({
        name: "Problem",
        query: { pid: row.pid }
    });
}
// 编辑题目
function handleEdit(row){
    console.log('点击编辑',row)
    router.push({
        name: "ProblemEditor",
        query: { pid: row.pid ,edittype:"Update"}
    });
}
// 删除题目
function handleDelete(row){
    console.log('点击删除',row)
    service.post('/api/problem/delete',{
        pid:row.pid
    }).then(
        response => {
            let json = response.data
            if(json.status == "success"){
                console.log('请求成功了', json)
                pointmessage.value = "删除成功"
                SuccessMessage()
                GetProblemSetInfo() // 重新加载问题列表
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

// 处理搜索
function searchProblem(){
    if (searchPid.value !== '') {
        currentPage.value = 1; // 搜索时回到第一页
        service
        .post(`/api/problem/query`,{
            pid: Number(searchPid.value)
        }).then(
            response => {
                let json = response.data
                if(json.status == "success"){
                    console.log('请求成功了',json)
                    let problemArray = [json.data]
                    problemsetdata.array = problemArray
                    totalsize.value = 1
                }else{
                    WaringMessage(json.message)
                }
            },
            error => {
                console.log('请求失败了',error.data)
            }
        )
    }
}

// 清空搜索
function handleClear(){
    searchPid.value = '';
    GetProblemSetInfo(); // 搜索条件清空后重新加载全部数据
}

// 处理分页
const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
    pageSize.value = val;
    GetProblemSetInfo()
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    currentPage.value = val;
    GetProblemSetInfo()
}

// 题目信息列表
let problemsetdata = reactive({'array':[]})

function GetProblemSetInfo(){
    service.post(`/api/problem/querylist`,{
        page_no : currentPage.value,
        page_size : pageSize.value,
    })
    .then(
        response => {
            let json = response.data
            if(json.status == "success"){
                console.log('请求成功了',json)
                problemsetdata.array = json.data.result
                totalsize.value = Number(json.data.total)
            }else{
                WaringMessage(json.message)
            }
        },
        error => {
            console.log('请求失败了',error.data)
        }
    )
}

onMounted(()=>{
    GetProblemSetInfo()
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
const WaringMessage = (message) => {
    ElMessage({
        showClose: true,
        message: message,
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
.add-problem-btn {
  float: right;
  margin-right: 10px;
  margin-bottom: 10px;
}
.action-buttons {
    display: flex;
    justify-content: space-around; /* 或者使用 space-evenly */
    align-items: center;
}
.custom-table {
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
}
.search-input {
    width: 400px;
    margin-bottom: 10px;
    margin-left: 10px;
}
</style>
