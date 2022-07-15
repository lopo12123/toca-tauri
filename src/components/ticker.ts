export type TickRequest = {
    cmd: 'start'
    duration: number
} | { cmd: 'stop' }
export type TickResponse = {
    status: 'pending' | 'fail'
}

let timerId: (NodeJS.Timer) | null = null
;(() => {
    self.onmessage = (ev) => {
        const data: TickRequest = ev.data
        if(data.cmd === 'start') {
            if(!!timerId) self.postMessage({ status: 'fail' } as TickResponse)
            else {
                timerId = setInterval(() => {
                    self.postMessage({ status: 'pending' } as TickResponse)
                }, data.duration)
            }
        }
        else if(data.cmd === 'stop') {
            if(!!timerId) clearInterval(timerId)
            timerId = null
        }
    }
})()