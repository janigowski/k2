import { createK2 } from '../../core/index.ts'
import type { ButtonName, Color } from '../../core/controlls'
import { K2 } from '../../core/K2.ts'
import { BrowserMIDIProvider } from '../../core/BrowserMIDIProvider/BrowserMIDIProvider.ts'

const channel = 2
const browserMIDIProvider = new BrowserMIDIProvider()
const k2 = new K2(channel, browserMIDIProvider)
const statusEl = document.getElementById('status')
const eventsEl = document.getElementById('events')
const connectButton = document.getElementById('connect')
const modeToggleButton = document.getElementById('modeToggle')

if (!statusEl || !eventsEl || !connectButton || !modeToggleButton) {
    throw new Error('Required DOM elements not found')
}

type Mode = 'click' | 'hover'
let currentMode: Mode = 'click'

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

function handleColorActivation(buttonId: ButtonName, color: Color | 'off') {
    if (color === 'off') {
        k2.unhighlightButton(buttonId)
        updateButtonState(buttonId, 'off')
        logEvent(`Button ${buttonId} unhighlighted`)
    } else {
        k2.highlightButton(buttonId, color)
        updateButtonState(buttonId, color)
        logEvent(`Button ${buttonId} highlighted with ${color}`)
    }
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

// Mode toggle handler
modeToggleButton.addEventListener('click', () => {
    currentMode = currentMode === 'click' ? 'hover' : 'click'
    modeToggleButton.textContent = `Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`
    modeToggleButton.setAttribute('data-mode', currentMode)
    logEvent(`Switched to ${currentMode} mode`)
})

document.addEventListener('DOMContentLoaded', () => {
    k2.connect()
    const colorButtons = document.querySelectorAll<HTMLButtonElement>('.color-button')

    colorButtons.forEach(button => {
        const buttonId = button.getAttribute('data-button') as ButtonName
        const color = button.getAttribute('data-color') as Color | 'off'
        if (!buttonId || !color) return

        // Click handler
        button.addEventListener('click', () => {
            if (currentMode !== 'click') return
            handleColorActivation(buttonId, color)
        })

        // Hover handlers
        button.addEventListener('mouseenter', () => {
            if (currentMode !== 'hover') return
            if (color !== 'off') {
                handleColorActivation(buttonId, color)
            }
        })

        button.addEventListener('mouseleave', () => {
            if (currentMode !== 'hover') return
            handleColorActivation(buttonId, 'off')
        })
    })
})