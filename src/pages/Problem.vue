<template>
    <el-card class="box-card">
        <center>
            <h1>{{ data.pid }}.{{ data.title }}</h1>
        </center>
        <el-row>
            <el-col :span="20">
                <div class="content">
                    <v-md-preview :text="data.description"></v-md-preview>
                </div>
                <div :style="{boxShadow: `var(--el-box-shadow)`}">
                    <MonacoEditor ref="monacoeditor" :pid=$route.query.pid></MonacoEditor>
                </div>
                <br>
                <el-button type="primary" @click="SubmitCode()" :disabled="submitbutton" :loading="submitloading">提交</el-button>
                <div id="resultdiv">
                    <h4>代码运行状态： {{ ResultMsg() }}</h4>
                    <h4>错误提示： {{ reason }}</h4>
                    <h3>Tip：可以通过查看测评记录查看每个测试点详细信息</h3>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="demo-collapse">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="作者" name="1">
                            <div>
                                {{ data.uid }}
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="时间限制" name="2">
                            <div>
                                {{ data.time_limit }} MS
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="空间限制" name="3">
                            <div>
                                {{ data.memory_limit }} MB
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <br>
                <el-button type="primary" @click="ClickStatusRecord">提交记录</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import MonacoEditor from '../components/Problem/MonacoEditor.vue'
import service from '../axios'
import { ref,onMounted,reactive } from "vue"
import store from '../store'
import { useRoute,useRouter} from 'vue-router'

let submitbutton = ref(false)
let submitloading = ref(false)

const monacoeditor = ref()
const route = useRoute()
const router = useRouter()
// 创建题目描述，是否显示，获取题目数据
const data = reactive({
    pid:'',
    title:'',
    description:'',
    time_limit:0,
    memory_limit:0,
    judge_num:0,
    uid:0,
})

let result = ref(-1);
let reason = ref("");
// 请求当前题目详情
function GetProblem() {
    service
    .post('/api/problem/query', {
        pid: Number(data.pid),
    })
    .then(
        (response) => {
            let json = response.data
            console.log(json)
            if(json.status == "success"){
                data.title = json.data.title
                data.description = json.data.description
                data.time_limit = json.data.time_limit
                data.memory_limit = json.data.memory_limit
                data.judge_num = json.data.judge_num
                data.uid = json.data.uid
            }else{
                console.log('出错啦！')
            }
            
        },
        (_) => {
            console.log(response.data.data.message);
        }
    );
}
// 提交代码
function SubmitCode() {
    submitloading.value = true
    result.value = 0

    service
    .post(`/api/record/insert`, { 
        pid: Number(data.pid),
        uid: Number(store.state.uid),
        code: monacoeditor.value.GetCode(),
        language:monacoeditor.value.GetLanguage(),
    })
    .then(
        (response) => {
            submitloading.value = false
            if(response.data.Result == "Success"){
                console.log("提交成功了！！！", response.data);
                result.value = Number(response.data.Status);
                reason.value = response.data.ComplierInfo;
                // 如果第一次AC
                if(response.data.IsFirstAC){
                    store.state.Solves.push(data.problemid)
                    console.log('solves:',store.state.Solves)
                }
            }else{
                console.log('提交失败',response.data)
            }
        },
        (error) => {
            console.log("提交失败了！！！");
            console.log(error.data);
            submitloading.value = false
        }
    );
}
function ResultMsg()
{
    if(result.value == -1)return ""
    else if(result.value == 0)return "Pending"
    else if(result.value == 1)return "Compile Error"
    else if(result.value == 2)return "Accepted"
    else if(result.value == 3)return "Wrong Answer"
    else if(result.value == 4)return "Runtime Error"
    else if(result.value == 5)return "Time Limit Exceeded"
    else if(result.value == 6)return "Memory Limit Exceeded"
    else if(result.value == 7)return "System Error"
}
function ClickStatusRecord()
{
    router.push({
        name:"StatusRecord",
        query:{
            ProblemId:route.query.ProblemId
        }
    })
}

onMounted(()=>{
    data.pid = route.query.pid
    GetProblem();
    if(store.state.uid == '0')submitbutton.value = true
})
</script>

<style scoped>
.content{
    width: 1200px
}
.box-card{
    margin: 10px;
}
</style>