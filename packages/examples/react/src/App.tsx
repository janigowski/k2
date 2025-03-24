import { useEffect, useState } from 'react'
import { K2 } from '../../../core/K2'
import { BrowserMIDIProvider } from '../../../core/BrowserMIDIProvider/BrowserMIDIProvider'
import type { ButtonName, Color, Knob } from '../../../core/controlls'
import type { EncoderEvent, FaderEvent, KnobEvent } from '../../../core/K2'

type Mode = 'click' | 'hover'

interface Event {
    timestamp: string
    message: string
}

const initialActiveColors: Record<ButtonName, Color | 'off'> = {
    A: 'off',
    B: 'off',
    C: 'off',
    D: 'off',
    E: 'off',
    F: 'off',
    G: 'off',
    H: 'off',
    I: 'off',
    J: 'off',
    K: 'off',
    L: 'off',
    M: 'off',
    N: 'off',
    O: 'off',
    P: 'off',
    'layer': 'off',
    'exit-setup': 'off',
    'encoder-1': 'off',
    'encoder-2': 'off',
    'encoder-3': 'off',
    'encoder-4': 'off',
    'encoder-5': 'off',
    'encoder-6': 'off'
}

export default function App() {
    const [k2, setK2] = useState<K2 | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const [mode, setMode] = useState<Mode>('click')
    const [activeColors, setActiveColors] = useState<Record<ButtonName, Color | 'off'>>(initialActiveColors)

    useEffect(() => {
        const initK2 = async () => {
            const channel = 2
            const browserMIDIProvider = new BrowserMIDIProvider()
            await browserMIDIProvider.connect()
            const k2Instance = new K2(channel, browserMIDIProvider)

            k2Instance.on('connect', () => {
                setIsConnected(true)
                logEvent('K2 connected')
            })

            k2Instance.on('connectionError', (event: unknown) => {
                const error = event as { message: string }
                setIsConnected(false)
                logEvent(`Connection error: ${error.message}`)
            })

            k2Instance.on('button.press', (button: { name: ButtonName }) => {
                logEvent(`Button pressed: ${button.name}`)
            })

            k2Instance.on('button.release', (button: { name: ButtonName }) => {
                logEvent(`Button released: ${button.name}`)
            })

            k2Instance.on('knob.change', (knob: KnobEvent) => {
                logEvent(`Knob changed: ${knob.name} ${knob.value}`)
            })

            k2Instance.on('fader.change', (fader: FaderEvent) => {
                logEvent(`Fader changed: ${fader.name} ${fader.value}`)
            })

            k2Instance.on('encoder.turn', (encoder: EncoderEvent) => {
                logEvent(`Encoder turned: ${encoder.name} ${encoder.value}`)
            })

            setK2(k2Instance)
            await k2Instance.connect()
        }

        initK2()
    }, [])

    const logEvent = (message: string) => {
        setEvents((prev: Event[]) => [{
            timestamp: new Date().toLocaleTimeString(),
            message
        }, ...prev])
    }

    const handleColorActivation = (buttonId: ButtonName, color: Color | 'off') => {
        if (!k2) return

        if (color === 'off') {
            k2.unhighlightButton(buttonId)
            setActiveColors((prev: Record<ButtonName, Color | 'off'>) => ({ ...prev, [buttonId]: 'off' }))
            logEvent(`Button ${buttonId} unhighlighted`)
        } else {
            k2.highlightButton(buttonId, color)
            setActiveColors((prev: Record<ButtonName, Color | 'off'>) => ({ ...prev, [buttonId]: color }))
            logEvent(`Button ${buttonId} highlighted with ${color}`)
        }
    }

    const handleConnect = () => {
        k2?.connect()
    }

    const handleModeToggle = () => {
        setMode((prev: Mode) => prev === 'click' ? 'hover' : 'click')
        logEvent(`Switched to ${mode === 'click' ? 'hover' : 'click'} mode`)
    }

    const renderColorButton = (buttonId: ButtonName, color: Color | 'off') => (
        <button
            key={`${buttonId}-${color}`}
            className={`color-button ${color} ${activeColors[buttonId] === color ? 'active' : ''}`}
            onClick={() => mode === 'click' && handleColorActivation(buttonId, color)}
            onMouseEnter={() => mode === 'hover' && color !== 'off' && handleColorActivation(buttonId, color)}
            onMouseLeave={() => mode === 'hover' && handleColorActivation(buttonId, 'off')}
        />
    )

    const renderButtonGroup = (buttonId: ButtonName) => (
        <div key={buttonId} className="button-group">
            <span className="button-label">{buttonId}</span>
            <div className="color-controls">
                {renderColorButton(buttonId, 'red')}
                {renderColorButton(buttonId, 'amber')}
                {renderColorButton(buttonId, 'green')}
                {renderColorButton(buttonId, 'off')}
            </div>
        </div>
    )

    const buttonRows: ButtonName[][] = [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L']
    ]

    return (
        <>
            <h1>K2 React Example</h1>
            <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="controls">
                <button onClick={handleConnect}>Connect K2</button>
                <button className="mode-toggle" data-mode={mode} onClick={handleModeToggle}>
                    Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
            </div>

            <div className="k2-controller">
                {buttonRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                        {row.map(renderButtonGroup)}
                    </div>
                ))}
            </div>

            <div className="events">
                {events.map((event: Event, index: number) => (
                    <div key={index}>
                        {event.timestamp}: {event.message}
                    </div>
                ))}
            </div>
        </>
    )
} 