<template>
    <div class="homepage-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span id="homepagetitle">欢迎来到XYOJ</span>
          </div>
        </template>
      </el-card>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .homepage-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh; /* 使首页占据整个视口高度 */
  }
  
  #homepagetitle {
    font-family: Arial;
    font-size: 36px;
    font-weight: 600;
    background: linear-gradient(to right, #2acdd3, #204ba7); /* 渐变字体颜色 */
    background-clip: text;
    color: transparent; /* 将文本颜色设置为透明以显示背景渐变 */
    animation: textGradient 5s ease-in-out infinite alternate;
  }
  
  @keyframes textGradient {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .box-card {
    margin: 10px;
    width: 80%; /* 调整卡片宽度 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
    transition: transform 0.3s ease; /* 添加过渡效果 */
  }
  
  .box-card:hover {
    transform: translateY(-10px); /* 鼠标悬停时，卡片上浮效果 */
  }
  </style>
  