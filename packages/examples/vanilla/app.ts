import { createK2 } from '../../core/index.ts'
import type { ButtonName, Color, Knob } from '../../core/controlls'
import { K2, type EncoderEvent, type FaderEvent, type KnobEvent } from '../../core/K2.ts'
import { BrowserMIDIProvider } from '../../core/BrowserMIDIProvider/BrowserMIDIProvider.ts'

const channel = 2
const browserMIDIProvider = new BrowserMIDIProvider()
await browserMIDIProvider.connect()

const k2 = new K2(channel, browserMIDIProvider)
let statusEl: HTMLElement | null = null
let eventsEl: HTMLElement | null = null
let connectButton: HTMLElement | null = null
let modeToggleButton: HTMLElement | null = null

type Mode = 'click' | 'hover'
let currentMode: Mode = 'click'

function logEvent(message: string) {
    if (!eventsEl) return
    const el = document.createElement('div')
    el.textContent = `${new Date().toLocaleTimeString()}: ${message}`
    eventsEl.prepend(el)
}

interface K2Error {
    message: string
}

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

async function initApp() {
    console.log('Initializing app')

    // Get DOM elements after DOM is loaded
    statusEl = document.getElementById('status')
    eventsEl = document.getElementById('events')
    connectButton = document.getElementById('connect')
    modeToggleButton = document.getElementById('modeToggle')

    if (!statusEl || !eventsEl || !connectButton || !modeToggleButton) {
        throw new Error('Required DOM elements not found')
    }

    // Set up event listeners
    k2.on('connect', () => {
        statusEl!.textContent = 'Connected'
        statusEl!.classList.remove('disconnected')
        statusEl!.classList.add('connected')
        logEvent('K2 connected')
    })

    k2.on('connectionError', (event: unknown) => {
        const error = event as K2Error
        statusEl!.textContent = `Connection error: ${error.message}`
        statusEl!.classList.remove('connected')
        statusEl!.classList.add('disconnected')
        logEvent(`Connection error: ${error.message}`)
    })

    k2.on('button.press', (button: K2Button) => {
        logEvent(`Button pressed: ${button.name}`)
    })

    k2.on('button.release', (button: K2Button) => {
        logEvent(`Button released: ${button.name}`)
    })

    k2.on('knob.change', (knob: KnobEvent) => {
        logEvent(`Knob changed: ${knob.name} ${knob.value}`)
    })

    k2.on('fader.change', (fader: FaderEvent) => {
        logEvent(`Fader changed: ${fader.name} ${fader.value}`)
    })

    k2.on('encoder.turn', (encoder: EncoderEvent) => {
        logEvent(`Encoder turned: ${encoder.name} ${encoder.value}`)
    })

    connectButton.addEventListener('click', () => {
        k2.connect()
    })

    // Mode toggle handler
    modeToggleButton.addEventListener('click', () => {
        currentMode = currentMode === 'click' ? 'hover' : 'click'
        modeToggleButton!.textContent = `Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`
        modeToggleButton!.setAttribute('data-mode', currentMode)
        logEvent(`Switched to ${currentMode} mode`)
    })

    // Connect only after DOM is fully loaded
    await k2.connect()

    const colorButtons = document.querySelectorAll<HTMLButtonElement>('.color-button')

    colorButtons.forEach(button => {
        const buttonId = button.getAttribute('data-button') as ButtonName
        const color = button.getAttribute('data-color') as Color | 'off'

        console.log({ buttonId, color })
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
}

// Handle initialization either when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp()
    })
} else {
    initApp()
}