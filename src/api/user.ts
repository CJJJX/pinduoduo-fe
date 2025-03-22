import request from '../service/request'
// 登录接口
export function signIn(data: any) {
    const res = request({
        url: '/users/login',
        method: 'post',
        data
    })
}
// 注册接口
export function signUp(data:any) {
    return request({
        url: '/users/register',
        method: 'post',
        data
    })
}
// 获取当前账号的用户信息
export function getUserInfo() {
    return request({
        url: '/users/getInfo',
        method: 'get',
    })
}
// 登出接口
export function logout() {
    return request({
        url: '/users/logout',
        method: 'post'
    })
}
// 修改密码接口
export function editPassword(data: any) {
    return request({
        url: '/users/editPassword',
        method: 'put',
        data
    })
}
