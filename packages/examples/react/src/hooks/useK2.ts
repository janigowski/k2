import { useEffect, useState } from 'react'
import { K2 } from '@k2/core'
import type { ButtonName, Color } from '@k2/core'
import type { EncoderEvent, FaderEvent, KnobEvent } from '@k2/core'
import type { MIDIProvider } from '@k2/core'

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

interface UseK2Options {
    channel: number
    midiProvider: MIDIProvider
}

export function useK2({ channel, midiProvider }: UseK2Options) {
    const [k2, setK2] = useState<K2 | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const [activeColors, setActiveColors] = useState<Record<ButtonName, Color | 'off'>>(initialActiveColors)

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

    const connect = () => {
        k2?.connect()
    }

    useEffect(() => {
        const initK2 = async () => {
            await midiProvider.connect()
            const k2Instance = new K2(channel, midiProvider)

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

        return () => {
            midiProvider.disconnect()
        }
    }, [channel, midiProvider])

    return {
        isConnected,
        events,
        activeColors,
        handleColorActivation,
        connect
    }
} 