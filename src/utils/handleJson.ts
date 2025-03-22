export function jsonToArr(str: string) {
    const jsonStr = str.replace(/'/g,'"')
    const arr = JSON.parse(jsonStr)
    return arr
}