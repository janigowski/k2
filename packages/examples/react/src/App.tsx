import { useState, useMemo } from 'react'
import { useK2 } from './hooks/useK2'
import { K2Controller } from './components/K2Controller'
import { EventsLog } from './components/EventsLog'
import { BrowserMIDIProvider } from '@k2/core'

type Mode = 'click' | 'hover'

export default function App() {
    const midiProvider = useMemo(() => new BrowserMIDIProvider(), [])
    const { isConnected, events, activeColors, handleColorActivation, connect } = useK2({
        channel: 2,
        midiProvider
    })
    const [mode, setMode] = useState<Mode>('click')

    const handleModeToggle = () => {
        setMode((prev: Mode) => prev === 'click' ? 'hover' : 'click')
    }

    return (
        <>
            <h1>K2 React Example</h1>
            <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="controls">
                <button onClick={connect}>Connect K2</button>
                <button className="mode-toggle" data-mode={mode} onClick={handleModeToggle}>
                    Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
            </div>

            <K2Controller
                activeColors={activeColors}
                onColorActivation={handleColorActivation}
                mode={mode}
            />

            <EventsLog events={events} />
        </>
    )
} 