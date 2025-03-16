import { createK2 } from '../../core/index.ts'

const k2 = createK2(2)
const statusEl = document.getElementById('status')
const eventsEl = document.getElementById('events')
const connectButton = document.getElementById('connect')

function logEvent(message: string) {
    const el = document.createElement('div')
    el.textContent = `${new Date().toLocaleTimeString()}: ${message}`
    eventsEl.prepend(el)
}

k2.on('connect', () => {
    statusEl.textContent = 'Connected'
    statusEl.classList.remove('disconnected')
    statusEl.classList.add('connected')
    logEvent('K2 connected')
})

k2.on('connectionError', (error) => {
    statusEl.textContent = `Connection error: ${error.message}`
    statusEl.classList.remove('connected')
    statusEl.classList.add('disconnected')
    logEvent(`Connection error: ${error.message}`)
})

k2.on('exit-setup.press', (button) => {
    logEvent(`Button pressed: ${button.name}`)
})

k2.on('exit-setup.release', (button) => {
    logEvent(`Button released: ${button.name}`)
})

k2.on('button.press', (button) => {
    logEvent(`Button pressed: ${button.name}`)
})

connectButton.addEventListener('click', () => {
    k2.connect()
})