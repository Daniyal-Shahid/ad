import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const DesignerContext = createContext({});

const INITIAL_DESIGN = {
    background: '#fff1f2',
    backgroundImage: null,
    elements: []
};

export const DesignerProvider = ({ children }) => {
    const [design, setDesign] = useState(INITIAL_DESIGN);
    const [currentDesignId, setCurrentDesignId] = useState(null);
    const [history, setHistory] = useState([INITIAL_DESIGN]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Add to history (truncate future if we're not at end)
    const addToHistory = useCallback((newDesign) => {
        setHistory(prev => [...prev.slice(0, historyIndex + 1), newDesign]);
        setHistoryIndex(prev => prev + 1);
        setIsDirty(true);
    }, [historyIndex]);

    // Undo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setDesign(history[newIndex]);
            setIsDirty(true);
        }
    }, [historyIndex, history]);

    // Redo
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setDesign(history[newIndex]);
            setIsDirty(true);
        }
    }, [historyIndex, history]);

    // Update element
    const updateElement = useCallback((id, updates) => {
        setDesign(prev => {
            const newDesign = {
                ...prev,
                elements: prev.elements.map(el =>
                    el.id === id ? { ...el, ...updates } : el
                )
            };
            addToHistory(newDesign);
            return newDesign;
        });
    }, [addToHistory]);

    // Add element
    const addElement = useCallback((type, content = null) => {
        setDesign(prev => {
            let newDesign;

            // Handle background updates
            if (type === 'background') {
                newDesign = { ...prev, background: content, backgroundImage: null };
                addToHistory(newDesign);
                return newDesign;
            }
            if (type === 'backgroundImage') {
                newDesign = { ...prev, backgroundImage: content, background: null };
                addToHistory(newDesign);
                return newDesign;
            }

            // Create new element
            const newElement = {
                id: `el-${Date.now()}`,
                type,
                content: content || (type === 'text' ? 'New Text' : ''),
                x: 50,
                y: 50,
                style: type === 'text' ? {
                    fontSize: '1.25rem',
                    color: '#374151',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    opacity: 1,
                    rotation: 0
                } : {
                    width: '150px',
                    height: 'auto',
                    borderRadius: '8px',
                    opacity: 1,
                    rotation: 0
                }
            };

            newDesign = { ...prev, elements: [...prev.elements, newElement] };
            addToHistory(newDesign);
            setSelectedId(newElement.id);
            return newDesign;
        });
    }, [addToHistory]);

    // Delete element
    const deleteElement = useCallback((id) => {
        setDesign(prev => {
            const newDesign = {
                ...prev,
                elements: prev.elements.filter(el => el.id !== id)
            };
            addToHistory(newDesign);
            return newDesign;
        });
        setSelectedId(prev => prev === id ? null : prev);
    }, [addToHistory]);

    // Duplicate element
    const duplicateElement = useCallback((id) => {
        setDesign(prev => {
            const element = prev.elements.find(el => el.id === id);
            if (!element) return prev;

            const newElement = {
                ...element,
                id: `el-${Date.now()}`,
                x: element.x + 5,  // Offset slightly
                y: element.y + 5
            };

            const newDesign = { ...prev, elements: [...prev.elements, newElement] };
            addToHistory(newDesign);
            setSelectedId(newElement.id);
            return newDesign;
        });
    }, [addToHistory]);

    // Move layer
    const moveLayer = useCallback((id, direction) => {
        setDesign(prev => {
            const index = prev.elements.findIndex(el => el.id === id);
            if (index === -1) return prev;

            const newElements = [...prev.elements];

            if (direction === 'up' && index < newElements.length - 1) {
                [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
            } else if (direction === 'down' && index > 0) {
                [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
            } else if (direction === 'top') {
                const element = newElements.splice(index, 1)[0];
                newElements.push(element);
            } else if (direction === 'bottom') {
                const element = newElements.splice(index, 1)[0];
                newElements.unshift(element);
            }

            const newDesign = { ...prev, elements: newElements };
            addToHistory(newDesign);
            return newDesign;
        });
    }, [addToHistory]);

    // Load design from API
    const loadDesign = useCallback(async (id) => {
        try {
            const response = await api.get(`/designs/${id}`);
            const loadedDesign = response.data.design_data;
            setDesign(loadedDesign);
            setCurrentDesignId(response.data.id);
            setHistory([loadedDesign]);
            setHistoryIndex(0);
            setIsDirty(false);
        } catch (error) {
            console.error('Failed to load design:', error);
            throw error;
        }
    }, []);

    // Save design to API
    const saveDesign = useCallback(async (title = 'Untitled Card') => {
        setIsSaving(true);
        try {
            if (currentDesignId) {
                // Update existing design
                const response = await api.put(`/designs/${currentDesignId}`, {
                    design_data: design,
                    title
                });
                setIsDirty(false);
                return response.data;
            } else {
                // Create new design
                const response = await api.post('/designs', {
                    design_data: design,
                    title
                });
                setCurrentDesignId(response.data.id);
                setIsDirty(false);
                return response.data;
            }
        } catch (error) {
            console.error('Failed to save design:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [design, currentDesignId]);

    // Create new design
    const createNewDesign = useCallback(() => {
        setDesign(INITIAL_DESIGN);
        setCurrentDesignId(null);
        setHistory([INITIAL_DESIGN]);
        setHistoryIndex(0);
        setSelectedId(null);
        setIsDirty(false);
    }, []);

    const value = {
        design,
        selectedId,
        setSelectedId,
        isDirty,
        isSaving,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        currentDesignId,
        // Actions
        updateElement,
        addElement,
        deleteElement,
        duplicateElement,
        moveLayer,
        undo,
        redo,
        loadDesign,
        saveDesign,
        createNewDesign
    };

    return (
        <DesignerContext.Provider value={value}>
            {children}
        </DesignerContext.Provider>
    );
};

export const useDesigner = () => {
    const context = useContext(DesignerContext);
    if (!context) {
        throw new Error('useDesigner must be used within DesignerProvider');
    }
    return context;
};
