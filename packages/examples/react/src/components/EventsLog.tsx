interface Event {
    timestamp: string
    message: string
}

interface EventsLogProps {
    events: Event[]
}

export function EventsLog({ events }: EventsLogProps) {
    return (
        <div className="events">
            {events.map((event: Event, index: number) => (
                <div key={index}>
                    {event.timestamp}: {event.message}
                </div>
            ))}
        </div>
    )
} 