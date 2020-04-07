
/**
 * 字符串填充
 * @param {*} value 
 * @param {*} n 
 * @param {*} padValue 
 */
export function padStart(value = '', n, padValue = 0) {
    return value.toString().padStart(n, padValue)
}
export function padEnd(value = '', n, padValue = 0) {
    return value.toString().padEnd(n, padValue)
}

/**
 * 时间格式化
 * @param {*} seconds 
 */
export function timeFormat(seconds, callback) {

    let day = padStart(parseInt(seconds / (24 * 60 * 60)), 2, '0')
    seconds = parseInt(seconds % (24 * 60 * 60))
    let hours = padStart(parseInt(seconds / (60 * 60)), 2, '0')
    seconds = parseInt(seconds % (60 * 60))
    let minutes = padStart(parseInt(seconds / 60), 2, '0')
    seconds = padStart(parseInt(seconds % 60), 2, '0')

    callback({day, hours, minutes, seconds})
}

