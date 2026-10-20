import { LexicalEditor, SELECTION_CHANGE_COMMAND } from '@payloadcms/richtext-lexical/lexical';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@payloadcms/richtext-lexical/lexical/selection';
import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { FontSizeDropdownGroupItem } from '../../types';
import { UPDATE_FONT_SIZE } from '../fontsize/command';
import getSelection from '../getSelection';

type Props = {
	active?: boolean
	anchorElem?: HTMLElement
	editor?: LexicalEditor
	enabled?: boolean
	item?: FontSizeDropdownGroupItem
}

const DEFAULT_FONT_SIZE = 16;
const STEP = 1;

export default function FontSizeToolbar({ 
	active = false,
	anchorElem,
	editor: editorProp, 
	enabled = true,
	item: itemProp 
}: Props): React.JSX.Element {
	const [editorFromContext] = useLexicalComposerContext();
	const editor = editorProp || editorFromContext;
	
	const [fontSize, setFontSize] = useState<string>('16px');
	const inputRef = useRef<HTMLInputElement>(null);
	const inputWrapperRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState<string>('16');
	const [currentHeadingTag, setCurrentHeadingTag] = useState<string | null>(null);
	const [isHeadingActive, setIsHeadingActive] = useState(false);
	const savedSelectionRef = useRef<any>(null);
	const isTypingRef = useRef<boolean>(false);

	// Parse current font size
	const getCurrentSize = (): number => {
		if (!fontSize) return DEFAULT_FONT_SIZE;
		const parsed = parseFloat(fontSize);
		return isNaN(parsed) ? DEFAULT_FONT_SIZE : parsed;
	};

	const currentSize = getCurrentSize();

	// Detect heading tag changes and console.log them
	useEffect(() => {
    if (!editor) return;
    
    let previousHeadingTag: string | null = null;
    
    const detectHeadingChange = () => {
        editor.read(() => {
            const selection: any = getSelection();
            if (selection) {
                let foundHeadingTag: string | null = null;
                
                // Check nodes from selection
                if (selection.getNodes) {
                    const nodes = selection.getNodes();
                    for (const node of nodes) {
                        const nodeType = node.getType?.();
                        if (nodeType === 'heading') {
                            const tag = (node as any).getTag?.();
                            if (tag) {
                                foundHeadingTag = tag;
                                break;
                            }
                        }
                    }
                }
                
                // Also check by traversing up from anchor node
                if (!foundHeadingTag) {
                    const anchorNode = selection.anchor?.getNode();
                    if (anchorNode) {
                        let currentNode: any = anchorNode;
                        let depth = 0;
                        const maxDepth = 10;
                        
                        while (currentNode && depth < maxDepth) {
                            const nodeType = currentNode.getType?.();
                            if (nodeType === 'heading') {
                                const tag = currentNode.getTag?.();
                                if (tag) {
                                    foundHeadingTag = tag;
                                    break;
                                }
                            }
                            
                            const parent = currentNode.getParent?.();
                            if (!parent) break;
                            currentNode = parent;
                            depth++;
                        }
                    }
                }
                
                // Update state if heading status changed
                if (foundHeadingTag !== previousHeadingTag) {
                    previousHeadingTag = foundHeadingTag;
                    setCurrentHeadingTag(foundHeadingTag);
                    setIsHeadingActive(!!foundHeadingTag);
                    
                    // **CRITICAL: Clear font-size when heading is applied**
                    if (foundHeadingTag) {
                        // Clear the inline font-size style
                        editor.update(() => {
                            const currentSelection = getSelection();
                            if (currentSelection) {
                                $patchStyleText(currentSelection, { 
                                    'font-size': '' 
                                });
                            }
                        });
                        
                        // Reset UI state
                        setFontSize('');
                        setInputValue('');
                    }
                }
            }
        });
    };

    // Listen for editor updates (fires when heading is applied from dropdown)
    const unregisterUpdate = editor.registerUpdateListener(() => {
        detectHeadingChange();
    });
    
    // Also listen for selection changes
    const unregisterSelection = editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
            detectHeadingChange();
            return false;
        },
        1
    );

    return () => {
        unregisterUpdate();
        unregisterSelection();
    };
}, [editor]);
	// useEffect(() => {
	// 	if (!editor) return;
		
	// 	let previousHeadingTag: string | null = null;
		
	// 	const detectHeadingChange = () => {
	// 		editor.read(() => {
	// 			const selection: any = getSelection();
	// 			if (selection) {
	// 				// Check nodes from selection
	// 				if (selection.getNodes) {
	// 					const nodes = selection.getNodes();
	// 					for (const node of nodes) {
	// 						const nodeType = node.getType?.();
	// 						if (nodeType === 'heading') {
	// 							const tag = (node as any).getTag?.();
	// 							if (tag && tag !== previousHeadingTag) {
	// 								console.log('Heading tag changed to selection:', tag);
	// 								previousHeadingTag = tag;
	// 								return;
	// 							}
	// 						}
	// 					}
	// 				}
					
	// 				// Also check by traversing up from anchor node
	// 				const anchorNode = selection.anchor?.getNode();
	// 				if (anchorNode) {
	// 					let currentNode: any = anchorNode;
	// 					let depth = 0;
	// 					const maxDepth = 10;
						
	// 					while (currentNode && depth < maxDepth) {
	// 						const nodeType = currentNode.getType?.();
	// 						if (nodeType === 'heading') {
	// 							const tag = currentNode.getTag?.();
	// 							if (tag && tag !== previousHeadingTag) {
	// 								console.log('Heading tag changed to anchor node:', tag);
	// 								previousHeadingTag = tag;
	// 								return;
	// 							}
	// 						}
							
	// 						const parent = currentNode.getParent?.();
	// 						if (!parent) break;
	// 						currentNode = parent;
	// 						depth++;
	// 					}
	// 				}
					
	// 				// If no heading found, reset previous tag
	// 				if (previousHeadingTag !== null) {
	// 					console.log('Heading tag changed to: null (not a heading)');
	// 					previousHeadingTag = null;
	// 				}
	// 			}
	// 		});
	// 	};

	// 	// Listen for editor updates (fires when heading is applied from dropdown)
	// 	const unregisterUpdate = editor.registerUpdateListener(() => {
	// 		detectHeadingChange();
	// 	});
		
	// 	// Also listen for selection changes
	// 	const unregisterSelection = editor.registerCommand(
	// 		SELECTION_CHANGE_COMMAND,
	// 		() => {
	// 			detectHeadingChange();
	// 			return false;
	// 		},
	// 		1
	// 	);

	// 	return () => {
	// 		unregisterUpdate();
	// 		unregisterSelection();
	// 	};
	// }, [editor]);

	// Update from editor selection and save selection proactively
	useEffect(() => {
		if (!editor) return;
		
		const updateFontSize = () => {
			editor.read(() => {
					const selection: any = getSelection();
					if (selection) {
							savedSelectionRef.current = selection;
							
							// **Check if we're in a heading first**
							let isInHeading = false;
							if (selection.getNodes) {
									const nodes = selection.getNodes();
									for (const node of nodes) {
											if (node.getType?.() === 'heading') {
													isInHeading = true;
													break;
											}
									}
							}
							
							// If in heading, clear font-size display
							if (isInHeading) {
									setFontSize('');
									setInputValue('');
									return;
							}
							
							// Otherwise, get the current font-size
							const currentSize = $getSelectionStyleValueForProperty(selection, 'font-size', '16px');
							setFontSize(currentSize);
							const size = parseFloat(currentSize) || DEFAULT_FONT_SIZE;
							setInputValue(size.toString());
					}
			});
	};

		updateFontSize();
		
		// Listen for selection changes
		const unregister = editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				updateFontSize();
				return false;
			},
			1
		);

		return () => {
			unregister();
		};
	}, [editor]);

	useEffect(() => {
		// Don't update input value if user is typing
		if (!isTypingRef.current) {
			setInputValue(currentSize.toString());
		}
	}, [fontSize]);

	// Use capture phase event listeners like ColorPicker does to prevent selection loss
	useEffect(() => {
		const inputWrapper = inputWrapperRef.current;
		if (!inputWrapper || !editor) return;

		const handleMouseDown = (e: MouseEvent) => {
			// Save selection as backup before editor potentially loses it
			editor.read(() => {
				const selection = getSelection();
				if (selection) {
					savedSelectionRef.current = selection;
				}
			});
			// Only stop propagation - don't prevent default (allows input to focus naturally)
			// This matches ColorPicker's approach exactly
			e.stopPropagation();
		};

		const handleClick = (e: MouseEvent) => {
			e.stopPropagation();
		};

		// Use capture phase (true) to catch events before they reach the editor
		inputWrapper.addEventListener('mousedown', handleMouseDown, true);
		inputWrapper.addEventListener('click', handleClick, true);

		return () => {
			inputWrapper.removeEventListener('mousedown', handleMouseDown, true);
			inputWrapper.removeEventListener('click', handleClick, true);
		};
	}, [editor]);

	const onChange = (newFontSize: string) => {
    if (!editor) return;
    
    // **PREVENT font-size changes if heading is active**
    if (isHeadingActive) {
        console.warn('Cannot apply font-size to heading elements');
        return;
    }
    
    // Apply the style directly
    editor.update(() => {
        const selection = savedSelectionRef.current || getSelection();
        if (selection) {
            $patchStyleText(selection, { 
                'font-size': newFontSize || '' 
            });
        }
    });

    if (itemProp?.command) {
        editor.dispatchCommand(itemProp.command, { fontSize: newFontSize });
    } else {
        editor.dispatchCommand(UPDATE_FONT_SIZE, { fontSize: newFontSize });
    }
    
    setFontSize(newFontSize || '16px');
};

	const handleIncrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const newSize = currentSize + STEP;
		onChange(`${newSize}px`);
	};

	const handleDecrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const newSize = currentSize - STEP;
		onChange(`${newSize}px`);
	};

	const handleInputFocus = () => {
		if (!editor) return;
		// Mark that user is typing
		isTypingRef.current = true;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only update the local input value, don't apply to editor yet
		setInputValue(value);
		// Keep typing flag true
		isTypingRef.current = true;
	};

	const handleInputBlur = () => {
		// Mark that user is done typing
		isTypingRef.current = false;
		
		// Clear saved selection on blur
		savedSelectionRef.current = null;
		
		const parsed = parseFloat(inputValue);
		if (isNaN(parsed) || parsed <= 0) {
			// Only prevent negative or zero values, use default if invalid
			onChange(`${DEFAULT_FONT_SIZE}px`);
		} else {
			// Apply the final value when user is done typing
			onChange(`${parsed}px`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			isTypingRef.current = false;
			const newSize = currentSize + STEP;
			onChange(`${newSize}px`);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			isTypingRef.current = false;
			const newSize = currentSize - STEP;
			onChange(`${newSize}px`);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			isTypingRef.current = false;
			// Apply the value on Enter
			const parsed = parseFloat(inputValue);
			if (!isNaN(parsed) && parsed > 0) {
				onChange(`${parsed}px`);
			}
			inputRef.current?.blur();
		}
	};

	if (!editor) {
		return null as any;
	}

	return (
    <div 
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            opacity: isHeadingActive ? 0.5 : 1,  // Visual feedback
            pointerEvents: isHeadingActive ? 'none' : 'auto'  // Disable interaction
        }}
        title={isHeadingActive ? `Font size not available for ${currentHeadingTag?.toUpperCase()} headings` : undefined}
        onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }} 
        onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}
    >
        {/* Rest of your component remains the same */}
        <div
				style={{
					cursor: isHeadingActive ? 'not-allowed' : 'pointer'
				}}
            role="button"
            tabIndex={isHeadingActive ? -1 : 0}  // Remove from tab order when disabled
            onClick={handleDecrease}
            // ... rest of props
        >
            <Minus style={{ width: '0.875rem', height: '0.875rem' }} />
        </div>

        <div ref={inputWrapperRef}>
            <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isHeadingActive}  // Disable input
                placeholder={isHeadingActive ? '—' : inputValue}
								style={{
									width: '3rem',
									height: '1.75rem',
									paddingLeft: '0.25rem',
									paddingRight: '0.25rem',
									textAlign: 'center',
									fontSize: '0.875rem',
									border: '1px solid rgb(209, 213, 219)',
									borderRadius: '0.25rem',
									backgroundColor: 'white',
									outline: 'none',
									MozAppearance: 'textfield'
								}}
                // ... rest of props
            />
        </div>

        <div
				style={{
					cursor: isHeadingActive ? 'not-allowed' : 'pointer'
				}}
            role="button"
            tabIndex={isHeadingActive ? -1 : 0}
            onClick={handleIncrease}
            // ... rest of props
        >
            <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
        </div>
    </div>
);
}
