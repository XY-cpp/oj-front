<template>
    <div id ="main" style="height:300px;width:300px"></div>
</template>

<script setup>
import { onMounted,reactive } from 'vue'
import * as echarts from 'echarts'
let myChart
const options = reactive({
    tooltip: {
    },
    legend: {
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
      data: [ 'Submit', 'AC' ],
    },
    series: [
        {
            type: 'pie',
            stillShowZeroSum: false,
            data: [
                {
                    value: 0,
                    name: 'unsolved'
                },
                {
                    value: 0,
                    name: 'solved'
                }
            ],
            radius: '45%'
        }
    ]
})

function SetDataInfo(info)
{  
    options.series[0].data[0].value = info.unsolved
    options.series[0].data[1].value = info.solved
    myChart.setOption(options)
}


function EchartsInit()
{
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption(options)
}
defineExpose({
    SetDataInfo
})
onMounted(()=>{
    EchartsInit()
})
</script>