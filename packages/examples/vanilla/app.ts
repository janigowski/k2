import { createK2 } from '../../core/index.ts'
import type { ButtonName, Color } from '../../core/controlls'

const k2 = createK2(2)
const statusEl = document.getElementById('status')
const eventsEl = document.getElementById('events')
const connectButton = document.getElementById('connect')

if (!statusEl || !eventsEl || !connectButton) {
    throw new Error('Required DOM elements not found')
}

function logEvent(message: string) {
    if (!eventsEl) return
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

interface K2Error {
    message: string
}

k2.on('connectionError', (event: unknown) => {
    const error = event as K2Error
    statusEl.textContent = `Connection error: ${error.message}`
    statusEl.classList.remove('connected')
    statusEl.classList.add('disconnected')
    logEvent(`Connection error: ${error.message}`)
})

interface K2Button {
    name: ButtonName
}

function updateButtonState(buttonId: ButtonName, color: Color | 'off') {
    const colorButtons = document.querySelectorAll<HTMLButtonElement>(`[data-button="${buttonId}"]`)
    colorButtons.forEach(button => {
        const buttonColor = button.getAttribute('data-color')
        if (buttonColor === color) {
            button.classList.add('active')
        } else {
            button.classList.remove('active')
        }
    })
}

k2.on('button.press', (button: K2Button) => {
    logEvent(`Button pressed: ${button.name}`)
})

k2.on('button.release', (button: K2Button) => {
    logEvent(`Button released: ${button.name}`)
})

connectButton.addEventListener('click', () => {
    k2.connect()
})

document.addEventListener('DOMContentLoaded', () => {
    const colorButtons = document.querySelectorAll<HTMLButtonElement>('.color-button')

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.getAttribute('data-button')
            const color = button.getAttribute('data-color')

            if (buttonId && color) {
                if (color === 'off') {
                    k2.unhighlightButton(buttonId as ButtonName)
                    updateButtonState(buttonId as ButtonName, 'off')
                } else {
                    k2.highlightButton(buttonId as ButtonName, color as Color)
                    updateButtonState(buttonId as ButtonName, color as Color)
                }
                logEvent(`Button ${buttonId} ${color === 'off' ? 'unhighlighted' : `highlighted with ${color}`}`)
            }
        })
    })
})