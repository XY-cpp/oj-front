<template>
    <div class="wrapper">
        <div id="codeEdit"></div>
    </div>
</template>

<script setup>
import { ref,onMounted,toRaw } from 'vue'
import * as monaco from 'monaco-editor'
const editor = ref(null)
// 初始化代码编辑器
function initEditor(){    
    editor.value = monaco.editor.create(document.getElementById('codeEdit'), {
        value: '',                  // 代码
        language: 'cpp',   // 语言
        theme: 'vs',   // 主题
        selectOnLineNumbers: true,  //显示行号
        foldingStrategy: 'indentation', // 代码可分小段折叠
        tabSize: 4,                 // tab 缩进长度
        roundedSelection: false,
        readOnly: true,            // 只读
        cursorStyle: 'line',        //光标样式
        automaticLayout: true,      //自动布局
        glyphMargin: true,          //字形边缘
        useTabStops: false,
        fontSize: 15,   //字体大小
        autoIndent: true,           //自动布局
    });
}
function SetData(code, language_code)
{
    let language = ""
    if(language_code == 10){
        language = "c"
    } else if(language_code == 20){
        language = "cpp"
    } else if(language_code == 30){
        language = "python"
    } else if(language_code == 40){
        language = "rust"
    }
    const curmodel = toRaw(editor.value).getModel()
    console.log(code,language)
    const model = monaco.editor.createModel(code,language)
    toRaw(editor.value).setModel(model)
    curmodel.dispose()
}
onMounted(()=>{
    initEditor()
})
defineExpose({
    SetData
})
</script>
<style scoped>
#codeEdit{
    width:700px;
    height: 300px;
}
.wrapper{
    width: 700px;
    height: 300px;
}
</style>