import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useDesigner } from '../../../context/DesignerContext';

// Individual draggable element component
function DraggableElement({ element, isEditing, isSelected, onSelect, onUpdate }) {
    const elementRef = useRef(null);

    // Handle drag to update element position
    const handleDrag = () => {
        if (!elementRef.current) return;

        const canvas = elementRef.current.parentElement;
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();

        // Calculate where the element center is after drag
        const elementRect = elementRef.current.getBoundingClientRect();
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;

        // Convert to percentage of canvas
        const newX = ((elementCenterX - canvasRect.left) / canvasRect.width) * 100;
        const newY = ((elementCenterY - canvasRect.top) / canvasRect.height) * 100;

        // Clamp to bounds
        const clampedX = Math.max(5, Math.min(95, newX));
        const clampedY = Math.max(5, Math.min(95, newY));

        onUpdate(element.id, { x: clampedX, y: clampedY });
    };

    return (
        <motion.div
            ref={elementRef}
            drag={isEditing}
            dragMomentum={false}
            dragElastic={0}
            onDrag={handleDrag}
            onClick={(e) => {
                e.stopPropagation();
                if (isEditing) onSelect(element.id);
            }}
            style={{
                position: 'absolute',
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: `translate(-50%, -50%) rotate(${element.style?.rotation || 0}deg)`,
                cursor: isEditing ? 'move' : 'default',
                outline: isSelected ? '2px solid #f43f5e' : 'none',
                outlineOffset: '2px',
                boxShadow: isSelected ? '0 0 15px rgba(244, 63, 94, 0.3)' : element.style?.boxShadow || 'none',
                opacity: element.style?.opacity !== undefined ? element.style.opacity : 1,
                zIndex: isSelected ? 50 : 1,
                whiteSpace: element.type === 'text' ? 'pre-wrap' : undefined,
                ...element.style
            }}
        >
            {element.type === 'text' ? (
                <div
                    contentEditable={isEditing && isSelected}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate(element.id, { content: e.target.innerText })}
                    style={{
                        outline: 'none',
                        minWidth: '50px',
                        padding: '4px'
                    }}
                >
                    {element.content}
                </div>
            ) : (
                <img
                    src={element.content}
                    alt="Card element"
                    style={{
                        maxWidth: '100%',
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                />
            )}
        </motion.div>
    );
}

// Main canvas component
export default function DesignCanvas({ isEditing }) {
    const { design, selectedId, setSelectedId, updateElement } = useDesigner();

    return (
        <div
            className="relative w-full h-full"
            onClick={() => setSelectedId(null)}
            style={{
                backgroundColor: design.background || '#ffffff',
                backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {design.elements.map(el => (
                <DraggableElement
                    key={el.id}
                    element={el}
                    isEditing={isEditing}
                    isSelected={selectedId === el.id}
                    onSelect={setSelectedId}
                    onUpdate={updateElement}
                />
            ))}
        </div>
    );
}
