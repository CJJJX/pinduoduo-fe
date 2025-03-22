import request from '../service/request'
// 投递列表接口
export function getSentList(data: any) {
    const res = request({
        url: '/send',
        method: 'get',
        params: data
    })
    return res
}
// 投递列表详情接口
export function getSentDetail(data: any) {
    console.log(data,'data--')
    const res = request({
        url: '/send',
        method: 'get',
        params: data
    })
    return res
}
// 新增投递记录
export function createSend(data:any) {
    return request({
        url: '/send',
        method: 'post',
        data
    })
}
// 编辑投递记录
export function editSent(id:number,data:any) {
    return request({
        url: `/send/${id}`,
        method: 'put',
        data
    })
}
// 删除投递记录
export function deleteSend(id:number) {
    return request({
        url: `/send/${id}`,
        method: 'delete',
    })
}