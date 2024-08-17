<template>
    <el-card class="box-card">
        <el-row>
            <el-col :span="24">
                <h5>标题：</h5>
                <el-input v-model="title" placeholder="标题" />
                <h5>题目描述（可全屏编辑）</h5>
                <MarkDownEditor ref="markdowneditor"></MarkDownEditor>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <h5>时间复杂度：单位MS</h5>
                <el-input v-model="timelimit" placeholder="时间复杂度" />

                <h5>空间复杂度：单位MB</h5>
                <el-input v-model="memorylimit" placeholder="空间复杂度" />

                <el-button type="primary" @click="Submit()">提交</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script lang="ts" setup>
import {  reactive, ref ,onMounted} from 'vue'
import MarkDownEditor from '../../components/MarkDownEditor.vue'
import store from '../../store'
import { ElMessage } from 'element-plus'
import service from '../../axios'
import { useRouter,useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const markdowneditor = ref()

// 提示信息
const pointmessage = ref('')

// 传递的信息
const problemid = ref()
const edittype = ref('')
const title = ref('')
const timelimit = ref(2000)
const memorylimit = ref(128)
const uid = ref(0)
const judgenum = ref(0)

interface TestInfo{
    in : string
    out : string
}
interface ProblemData {
    pid: number;
    title: string;
    description: string;
    judge_num: number;
    time_limit: number;
    memory_limit: number;
    uid: number;
}


function Submit()
{
    if(title.value.length < 2){
        pointmessage.value = "题目标题太短！"
        WaringMessage()
        return
    }

    const data=<ProblemData>{}
    data.pid = Number(problemid.value)
    data.title = title.value
    data.description = markdowneditor.value.GetContent()
    data.judge_num = judgenum.value
    data.time_limit = timelimit.value
    data.memory_limit = memorylimit.value
    data.uid = uid.value

    if(edittype.value == "Update"){
        console.log("修改！！！")
        service
        .post(`/api/problem/update`, {
            pid: data.pid,
            title: data.title,
            description: data.description,
            judge_num: data.judge_num,
            time_limit: data.time_limit,
            memory_limit: data.memory_limit,
            uid: data.uid
        })
        .then(
        (response) => {
            let json = response.data
            console.log("response:", json);
            if(json.status == "success"){
                console.log("提交成功了！！！", json);
                pointmessage.value = "题目插入成功！"
                SuccessMessage()
                router.go(-1)
            }else{
                pointmessage.value = json.message
                WaringMessage()
                return
            }
        },
        (error) => {
            console.log(error.data);
            pointmessage.value = "提交失败,可能网络出现问题！"
            ErrorMessage()
            return
        }
    )
    }else if(edittype.value == "Insert"){
        console.log("提交！！！")
        service
        .post(`/api/problem/insert`  , {
            title: data.title,
            description: data.description,
            judge_num: data.judge_num,
            time_limit: data.time_limit,
            memory_limit: data.memory_limit,
            uid: data.uid
        })
        .then(
        (response) => {
            let json = response.data
            if(json.status == "success"){
                console.log("提交成功了！！！", json);
                pointmessage.value = "题目插入成功！"
                SuccessMessage()
                router.go(-1)
            }else{
                pointmessage.value = json.message
                WaringMessage()
                return
            }
        },
        (error) => {
            console.log(error.data);
            pointmessage.value = "提交失败,可能网络出现问题！"
            ErrorMessage()
            return
        }
    )
    }

}
function GetServerInfo()
{   
    service
        .post(`/api/problem/query`, {
            pid: Number(problemid.value)
        })
        .then(
        (response) => {
            let json = response.data
            if(json.status == "success"){
                console.log('题目获取成功！', json)
                pointmessage.value = "题目获取成功！"
                SuccessMessage()
                handledata(json.data)
            }else{
                pointmessage.value = json.message
                WaringMessage()
                return
            }
        },
        (error) => {
            console.log(error.data);
            pointmessage.value = "提交失败,可能网络出现问题！"
            ErrorMessage()
            return
        }
    )
}
//Json(Result,Reason,pid,title,description,time_limit,memory_limit,uid)
function handledata(Info:any)
{
    title.value = Info.title
    markdowneditor.value.SetContent(Info.description)
    timelimit.value = Number(Info.time_limit)
    memorylimit.value = Number(Info.memory_limit)
    uid.value = Number(Info.uid)
}
onMounted(()=>{
    problemid.value = route.query.pid
    edittype.value = String(route.query.edittype)
    if(edittype.value == "Update"){ // 如果是更新，需要向服务器获取数据,并更新数据
        GetServerInfo()
    }else if(edittype.value == "Insert"){ // 否则是添加
        uid.value = store.state.uid
    }
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

<style lang="scss">
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.box-card{
    margin: 10px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>