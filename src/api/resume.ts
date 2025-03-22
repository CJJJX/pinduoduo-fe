import request from '../service/request'
// 简历列表接口
export function getResumeList(data: any) {
    const res = request({
        url: '/resume',
        method: 'get',
        params: data
    })
    return res
}
// 简历详情接口
export function getResumeDetail(data: any) {
    console.log(data,'data--')
    const res = request({
        url: '/resume',
        method: 'get',
        params: data
    })
    return res
}
// 创建简历
export function createResume(data:any) {
    return request({
        url: '/resume',
        method: 'post',
        data
    })
}
// 编辑招简历
export function editResume(id:number,data:any) {
    return request({
        url: `/resume/${id}`,
        method: 'put',
        data
    })
}
// 删除简历
export function deleteResume(id:number) {
    return request({
        url: `/resume/${id}`,
        method: 'delete',
    })
}