import { useDesigner } from '../../../context/DesignerContext';
import { Italic, Underline, AlignLeft, AlignCenter, AlignRight, Copy, Trash2 } from 'lucide-react';

export default function StylePanel() {
    const { design, selectedId, updateElement, deleteElement, duplicateElement, moveLayer } = useDesigner();

    const selectedElement = design.elements.find(el => el.id === selectedId);
    if (!selectedElement) return null;

    const isText = selectedElement.type === 'text';
    const style = selectedElement.style || {};

    const updateStyle = (key, value) => {
        updateElement(selectedId, {
            style: { ...style, [key]: value }
        });
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                        {isText ? 'Text Properties' : 'Image Properties'}
                    </h3>
                </div>

                {/* Text Styling */}
                {isText && (
                    <>
                        {/* Font Family */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Font Family</label>
                            <select
                                value={style.fontFamily || 'sans-serif'}
                                onChange={(e) => updateStyle('fontFamily', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="sans-serif">Sans Serif</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="cursive">Cursive</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="Georgia">Georgia</option>
                                <option value="'Times New Roman'">Times New Roman</option>
                                <option value="Arial">Arial</option>
                                <option value="Verdana">Verdana</option>
                                <option value="'Courier New'">Courier New</option>
                            </select>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                Font Size: {style.fontSize || '1rem'}
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={parseFloat(style.fontSize) || 1}
                                onChange={(e) => updateStyle('fontSize', `${e.target.value}rem`)}
                                className="w-full"
                            />
                        </div>

                        {/* Font Weight */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Font Weight</label>
                            <select
                                value={style.fontWeight || 'normal'}
                                onChange={(e) => updateStyle('fontWeight', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="100">Thin</option>
                                <option value="200">Extra Light</option>
                                <option value="300">Light</option>
                                <option value="normal">Normal</option>
                                <option value="500">Medium</option>
                                <option value="600">Semi Bold</option>
                                <option value="bold">Bold</option>
                                <option value="800">Extra Bold</option>
                                <option value="900">Black</option>
                            </select>
                        </div>

                        {/* Text Style Buttons */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-2 block">Style</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStyle('fontStyle', style.fontStyle === 'italic' ? 'normal' : 'italic')}
                                    className={`p-2 rounded border ${style.fontStyle === 'italic' ? 'bg-rose-100 border-rose-400' : 'bg-gray-100 border-gray-300'}`}
                                    title="Italic"
                                >
                                    <Italic size={16} />
                                </button>
                                <button
                                    onClick={() => updateStyle('textDecoration', style.textDecoration?.includes('underline') ? 'none' : 'underline')}
                                    className={`p-2 rounded border ${style.textDecoration?.includes('underline') ? 'bg-rose-100 border-rose-400' : 'bg-gray-100 border-gray-300'}`}
                                    title="Underline"
                                >
                                    <Underline size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Text Alignment */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-2 block">Alignment</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStyle('textAlign', 'left')}
                                    className={`p-2 rounded border flex-1 ${style.textAlign === 'left' ? 'bg-rose-100 border-rose-400' : 'bg-gray-100 border-gray-300'}`}
                                >
                                    <AlignLeft size={16} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => updateStyle('textAlign', 'center')}
                                    className={`p-2 rounded border flex-1 ${style.textAlign === 'center' ? 'bg-rose-100 border-rose-400' : 'bg-gray-100 border-gray-300'}`}
                                >
                                    <AlignCenter size={16} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => updateStyle('textAlign', 'right')}
                                    className={`p-2 rounded border flex-1 ${style.textAlign === 'right' ? 'bg-rose-100 border-rose-400' : 'bg-gray-100 border-gray-300'}`}
                                >
                                    <AlignRight size={16} className="mx-auto" />
                                </button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Text Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={style.color || '#000000'}
                                    onChange={(e) => updateStyle('color', e.target.value)}
                                    className="w-16 h-10 rounded border border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={style.color || '#000000'}
                                    onChange={(e) => updateStyle('color', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Image Sizing */}
                {!isText && (
                    <>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                Width: {style.width || 'auto'}
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="500"
                                step="10"
                                value={parseInt(style.width) || 150}
                                onChange={(e) => updateStyle('width', `${e.target.value}px`)}
                                className="w-full"
                            />
                        </div>

                        {/* Border Radius */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                                Border Radius: {style.borderRadius || '0px'}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={parseInt(style.borderRadius) || 0}
                                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                                className="w-full"
                            />
                        </div>

                        {/* Border */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-2 block">Border</label>
                            <select
                                value={style.border || 'none'}
                                onChange={(e) => updateStyle('border', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="none">None</option>
                                <option value="1px solid #e5e7eb">Thin Gray</option>
                                <option value="2px solid #e5e7eb">Medium Gray</option>
                                <option value="3px solid #e5e7eb">Thick Gray</option>
                                <option value="2px solid #f43f5e">Rose</option>
                                <option value="2px solid #000000">Black</option>
                                <option value="2px solid #ffffff">White</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Common Properties */}
                {/* Opacity */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Opacity: {Math.round((style.opacity !== undefined ? style.opacity : 1) * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={style.opacity !== undefined ? style.opacity : 1}
                        onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Rotation */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Rotation: {style.rotation || 0}°
                    </label>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={style.rotation || 0}
                        onChange={(e) => updateStyle('rotation', parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Shadow */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 mb-2 block">Drop Shadow</label>
                    <select
                        value={style.boxShadow || 'none'}
                        onChange={(e) => updateStyle('boxShadow', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="none">None</option>
                        <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
                        <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                        <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                        <option value="0 20px 25px rgba(0,0,0,0.15)">Extra Large</option>
                    </select>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200"></div>

                {/* Layer Controls */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 mb-2 block">Layer Order</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => moveLayer(selectedId, 'top')}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
                        >
                            Bring to Front
                        </button>
                        <button
                            onClick={() => moveLayer(selectedId, 'bottom')}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
                        >
                            Send to Back
                        </button>
                        <button
                            onClick={() => moveLayer(selectedId, 'up')}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
                        >
                            Move Up
                        </button>
                        <button
                            onClick={() => moveLayer(selectedId, 'down')}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
                        >
                            Move Down
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={() => duplicateElement(selectedId)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
                    >
                        <Copy size={16} /> Duplicate
                    </button>
                    <button
                        onClick={() => deleteElement(selectedId)}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
