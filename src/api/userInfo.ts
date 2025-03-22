import request from '../service/request'
// 查找用户个人信息
export function getUserCenterInfo(data: any) {
    return request({
        url: '/userInfo',
        method: 'get',
        params: data
    })
}
// 创建用户个人信息
export function createUserCenterInfo(data: any) {
    return request({
        url: '/userInfo',
        methods: 'post',
        data
    })
}
// 编辑用户个人信息
export function editUserCenterInfo(data: any) {
    return request({
        url: '/userInfo',
        method: 'put',
        data
    })
}
