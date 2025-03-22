import request from '../service/request'
// 招聘信息列表接口
export function getPublishList(data: any) {
    const res = request({
        url: '/publish',
        method: 'get',
        params: data
    })
    return res
}
// 招聘信息列表详情接口
export function getPublishDetail(data: any) {
    const res = request({
        url: '/publish',
        method: 'get',
        params: data
    })
    return res
}
// 创建招聘信息
export function createPublish(data:any) {
    return request({
        url: '/publish',
        method: 'post',
        data
    })
}
// 编辑招聘信息
export function editPublish(id:number,data:any) {
    return request({
        url: `/publish/${id}`,
        method: 'put',
        data
    })
}
// 删除招聘信息
export function deletePublish(id:number) {
    return request({
        url: `/publish/${id}`,
        method: 'delete',
    })
}