<template>
    <el-row>
        <el-col :span="18">
            <el-card class="box-card">
                <el-table :data="problemsetdata.array" @cell-click="problemclick" @cell-mouse-enter="changepiechart">
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            <el-icon v-if="IsPassed(scope.row.pid)">
                            <!-- <el-icon> -->
                                <Check />
                            </el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pid" label="ID" width="50" />
                    <el-table-column prop="title" label="题目" width="300" />
                    <el-table-column prop="ac_num" label="通过次数" width="500" align="right" fixed="right" />
                    <el-table-column prop="submit_num" label="提交次数" width="100" align="right" fixed="right" />
                </el-table>
                <div class="demo-pagination-block">
                    <el-pagination v-model:current-page="page_no" v-model:page-size="page_size"
                        :page-sizes="[15, 20, 30, 40]" :small="small" :disabled="disabled" :background="background"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card class="box-card">
                <PieChart ref="piechart"></PieChart>
            </el-card>
        </el-col>
    </el-row>

</template>

<script setup>
import service from '../axios'
import store from '../store'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PieChart from '../components/Chart.vue'

const router = useRouter()

// 子组件
const piechart = ref()
const problemsearch = ref()

let page_no = ref(1) // 当前页数
let page_size = ref(15) // 当前页的数量
let total = ref(0)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
    page_size.value = val;
    GetProblemSetInfo()
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    page_no.value = val;
    GetProblemSetInfo()
}

function IsPassed(pid) {
    service.post(`/api/record/query`, {
        uid: store.state.uid, 
        pid: pid,
        status: 30
    }).then(
        (response) => {
            return response.data.data.length();
        },
        (_) => {
            return false;
        }
    )
}

// 题目信息列表
let problemsetdata = reactive({ 'array': [] })

function GetProblemSetInfo() {
    service.post('/api/problem/querylist', {
        page_no: page_no.value,
        page_size: page_size.value
    }).then(
        response => {
            let json = response.data
            problemsetdata.array = json.data.result
            total.value = Number(json.data.total)
            problemsetdata.array.forEach(item => {
                service.post(`/api/record/query`, {
                    pid: item.pid
                }).then(
                    (response) => {
                        let json = response.data
                        if (json.status == "success") {
                            item.submit_num = json.data.length
                            item.ac_num= json.data.filter(item => item.status === 30).length
                        } else {
                            ErrorMessage(json.message)
                        }
                    },
                    (_) => {
                        ErrorMessage("网络似乎出现了问题！")
                    }
                )
            });
        },
        error => {
            let json = response.data
            console.log('请求失败了', json.message)
        }
    )
}
// 跳转函数
function problemclick(row, column, cell, event) {
    router.push({
        name: "Problem",
        query: { pid: row.pid }
    });
}
function changepiechart(row, column, cell, event) {
    let info = {
        unsolved: row.submit_num - row.ac_num,
        solved: row.ac_num
    }
    piechart.value.SetDataInfo(info)
}
onMounted(() => {
    GetProblemSetInfo()
})

</script>

<style scoped>
#problemsearch {
    margin-bottom: 10px;
}

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