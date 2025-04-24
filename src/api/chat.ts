import request from '../service/request'
// 用户与deepseek对话列表接口
export function getChatList(data: any) {
    const res = request({
        url: '/chat',
        method: 'get',
        params: data
    })
    return res
}

// 将新对话插入对话列表
export function createChat(data:any) {
    return request({
        url: '/chat',
        method: 'post',
        data
    })
}
