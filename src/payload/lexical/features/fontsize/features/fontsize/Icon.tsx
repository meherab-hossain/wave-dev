import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from '@payloadcms/richtext-lexical/lexical';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@payloadcms/richtext-lexical/lexical/selection';
import { Type } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import getSelection from '../getSelection';
import { UPDATE_FONT_SIZE } from './command';

export default function FontSizeIcon(): React.JSX.Element {
	const [fontSize, setFontSize] = useState<string>('16px')
	const [editor] = useLexicalComposerContext()

	const updateCurrentFontSize = () => {
		const selection: any = getSelection()
		
		if (selection) {
			const currentSize = $getSelectionStyleValueForProperty(selection, 'font-size', '16px')
			setFontSize(currentSize)
		}

		return false;
	}

	useEffect(() => {
		return editor.registerCommand(
			UPDATE_FONT_SIZE,
			(payload) => {
				setFontSize(payload.fontSize || '16px');

				editor.update(() => {
					const selection = getSelection()
					
					if (selection) {
						$patchStyleText(selection, { 
							'font-size': payload.fontSize || '' 
						});
					}
				})

				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor])

	useEffect(() => {
		setTimeout(() => {
			return editor.read(updateCurrentFontSize)
		})

		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			updateCurrentFontSize,
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor])

	// Parse font size for display
	const displaySize = fontSize ? parseFloat(fontSize) : 16;

	return (
		<div className="flex items-center gap-1">
			<Type className="icon w-5 h-5" />
			<span className="text-xs font-medium">{displaySize}</span>
		</div>
	)
}