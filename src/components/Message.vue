<script>
import { ElMessage } from 'element-plus'
// 发送成功消息
export const SuccessMessage = (value) => {
    ElMessage({
        showClose: true,
        message: value,
        type: 'success',
    })
}
// 发送警告消息
export const WaringMessage = (value) => {
    ElMessage({
        showClose: true,
        message: value,
        type: 'warning',
    })
}
// 发送错误消息
export const ErrorMessage = (value) => {
    ElMessage({
        showClose: true,
        message: value,
        type: 'error',
    })
}
</script>
