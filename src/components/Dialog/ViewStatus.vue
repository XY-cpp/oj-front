<template>
    <el-dialog id="dialog" v-model="dialogVisible" title="测评详情" :before-close="closedialog">
        <el-alert :title="alerttitle" :type="alerttype" :description="alertdescription" :closable="false" show-icon
            :show-close="false">
        </el-alert>
        <MonacoView ref="monacoview"></MonacoView>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import MonacoView from '../Problem/MonacoView.vue'
import service from '../../axios'
// 是否打开
const dialogVisible = ref(false)

const monacoview = ref()

const alerttype = ref('success')
const alerttitle = ref('')
const alertdescription = ref('')

function opendialog(rid) {
    dialogVisible.value = true;
    service.post(`/api/record/query`, {
            rid : Number(rid)
        }).then(
            (response) => {
                let json = response.data
                SetDataInfo(json.data[0])
            },
            (error) => {
                console.log(error.data.message);
            }
        );
}

function ChangeStatusToType(status) {
    if (status <= 20) return "info"
    else if (status <= 30) return "success"
    else if (status <= 40) return "error"
    else return "warning"
}

function SetDataInfo(data) {
    console.log(data)
    console.log(data.code,data.language)
    monacoview.value.SetData(data.code, data.language)
    alerttype.value = ChangeStatusToType(data.status)
    alerttitle.value = ChangeStatusToTitle(data.status)
}

function closedialog() {
    alerttitle.value = ''
    alertdescription.value = ''
    dialogVisible.value = false
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

defineExpose({
    opendialog
})
</script>
<style scoped>
#dialog {
    width: 800px;
}

.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.el-collapse-error {
    background-color: #FEF0F0;
}

.el-collapse-success {
    background-color: #F0F9EB;
}

.el-collapse-warning {
    background-color: #FDF6EC;
}
</style>