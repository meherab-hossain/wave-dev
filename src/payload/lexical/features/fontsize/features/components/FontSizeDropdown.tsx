import { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import React, { useEffect, useState } from 'react';
import { FontSizeDropdownGroupItem } from '../../types';
import FontSizeSelector from './FontSizeSelector';

type Props = {
	active?: boolean
	anchorElem: HTMLElement
	editor: LexicalEditor
	enabled?: boolean
	item: FontSizeDropdownGroupItem
}

export default function FontSizeDropdown({
	active = false,
	anchorElem,
	editor,
	enabled = true,
	item,
}: Props): React.JSX.Element {
	const [activeFontSize, setActiveFontSize] = useState<string>('16px')

	const onChange = (fontSize: string) => {
		editor.dispatchCommand(item.command, { fontSize });
		setActiveFontSize(fontSize || '16px');
	}

	useEffect(() => {
		editor.read(() => {
			const current = item.current()
			current && setActiveFontSize(current)
		})
	}, [editor])

	return (
		<FontSizeSelector fontSize={activeFontSize} onChange={onChange} />
	)
}