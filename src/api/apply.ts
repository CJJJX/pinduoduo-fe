import request from '../service/request'
// 求职申请列表接口
export function getAppliesList(data: any) {
    const res = request({
        url: '/apply',
        method: 'get',
        params: data
    })
    return res
}
// 求职申请列表详情接口
export function getApplyDetail(data: any) {
    const res = request({
        url: '/apply',
        method: 'get',
        params: data
    })
    return res
}
// 创建求职申请
export function createApply(data:any) {
    return request({
        url: '/apply',
        method: 'post',
        data
    })
}
// 编辑求职申请
export function editApply(id:number,data:any) {
    return request({
        url: `/apply/${id}`,
        method: 'put',
        data
    })
}
// 删除求职申请
export function deleteApply(id:number) {
    return request({
        url: `/apply/${id}`,
        method: 'delete',
    })
}