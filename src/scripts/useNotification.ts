/**
 * @description 创建桌面消息通知
 * @param msg 内容
 * @param title 标题 默认为 Toca
 */
const useNotification = (msg: string, title: string = 'Toca') => {
    return new Promise<'success' | 'refuse' | 'err'>((resolve) => {
        Notification.requestPermission()
            .then(res => {
                if(res === 'granted') {
                    new Notification(title, { body: msg, })
                    resolve('success')
                }
                else resolve('refuse')
            })
            .catch(err => {
                resolve('err')
            })
    })
}

export {
    useNotification
}