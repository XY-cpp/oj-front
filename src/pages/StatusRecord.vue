<template>
    <el-card class="box-card">
        <el-table :data="statusrecorddata.array" style="width: 100%"
            @cell-click="(row, column, cell, event) => statusrecordclick(row, column, cell, event)">
            <el-table-column prop="rid" label="评测号" width="150" />
            <el-table-column prop="account" label="用户" width="150" />
            <el-table-column prop="title" label="题目" width="300" />
            <el-table-column prop="status" label="状态" width="200">
                <template #default="scope">
                    <el-tag size="medium" :type="ChangeStatusToType(scope.row.status)" disable-transitions hit>
                        {{ ChangeStatusToTitle(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="language" label="语言" width="100">
                <template #default="scope">
                    {{ ShowLanguageTitle(scope.row.language) }}
                </template>
            </el-table-column>
            <el-table-column prop="run_time" label="运行时间" width="120" />
            <el-table-column prop="submit_time" label="提交时间" />
        </el-table>
        <ViewStatus ref="viewstatusdialog"></ViewStatus>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="page_no" v-model:page-size="page_size" :page-sizes="[15, 20, 30, 40]"
                :small="small" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </el-card>

</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import ViewStatus from '../components/Dialog/ViewStatus.vue'
import service from '../axios'

const viewstatusdialog = ref()

let page_no = ref(1) // 当前页数
let page_size = ref(15) // 当前页的数量
let total = ref(0)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
    page_size.value = val;
    GetStatusRecordInfo()
}
const handleCurrentChange = (val) => {
    page_no.value = val;
    GetStatusRecordInfo()
}

// 题目信息列表
let statusrecorddata = reactive({ 'array': [] })

function GetStatusRecordInfo() {

    service.post(`/api/record/querylist`, {
        page_no: page_no.value,
        page_size: page_size.value
    }).then(
        response => {
            let json = response.data
            statusrecorddata.array = json.data.result
            total.value = Number(json.data.total)
            statusrecorddata.array.forEach(item => {
                service.post(`/api/problem/query`, { pid: item.pid }).then((response) => { item.title = response.data.data.title })
                service.post(`/api/user/query`, { uid: item.uid }).then((response) => { item.account = response.data.data.account })

                const date = new Date(item.submit_time);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                item.submit_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            });
        },
        error => {
            console.log('请求失败了', error.data)
        }
    )
}

function ChangeStatusToType(status) {
    if (status <= 20) return "info"
    else if (status <= 30) return "success"
    else if (status <= 40) return "error"
    else return "warning"
}

function ChangeStatusToTitle(status) {
    if (status == 10)
        return "Waiting"
    else if (status == 20)
        return "Pending"
    else if (status == 30)
        return "Accepted"
    else if (status == 40)
        return "Wrong Answer"
    else if (status == 50)
        return "Runtime Error"
    else if (status == 60)
        return "Memory Limit Exceeded"
    else if (status == 70)
        return "Time Limit Exceeded"
    else if (status == 80)
        return "Compile Error"
    else if (status == 90)
        return "Unknown Error"
}

function ShowLanguageTitle(language){
    if(language == 10) return "C"
    else if(language == 20) return "C++"
    else if(language == 30) return "Python3"
    else if(language == 40) return "Rust"
}

// 点击单元格
function statusrecordclick(row, column, cell, event) {
    viewstatusdialog.value.opendialog(row.rid)
}

// 检测组件是否更新
onBeforeRouteUpdate(to => {
    GetStatusRecordInfo()
})
// 组件初始化
onMounted(() => {
    GetStatusRecordInfo()
})

</script>


<style scoped>
.demo-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center
}

.box-card {
    margin: 10px;
}
</style>