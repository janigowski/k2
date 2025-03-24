import type { ButtonName, Color } from '../../../../core/controlls'

type Mode = 'click' | 'hover'

interface K2ControllerProps {
    activeColors: Record<ButtonName, Color | 'off'>
    onColorActivation: (buttonId: ButtonName, color: Color | 'off') => void
    mode: Mode
}

export function K2Controller({ activeColors, onColorActivation, mode }: K2ControllerProps) {
    const renderColorButton = (buttonId: ButtonName, color: Color | 'off') => (
        <button
            key={`${buttonId}-${color}`}
            className={`color-button ${color} ${activeColors[buttonId] === color ? 'active' : ''}`}
            onClick={() => mode === 'click' && onColorActivation(buttonId, color)}
            onMouseEnter={() => mode === 'hover' && color !== 'off' && onColorActivation(buttonId, color)}
            onMouseLeave={() => mode === 'hover' && onColorActivation(buttonId, 'off')}
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
        <div className="k2-controller">
            {buttonRows.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                    {row.map(renderButtonGroup)}
                </div>
            ))}
        </div>
    )
} 