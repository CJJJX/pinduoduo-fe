import moment from 'moment'
export function handleTime (arr: any) {
    if(arr[0] && arr[0].birthday && arr[0].birthday.length > 0)
    return arr.map((item: any) => ({
        ...item,
        birthday: moment(item.birthday).format("YYYY-MM-DD"),
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
    return arr.map((item: any) => ({
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
}