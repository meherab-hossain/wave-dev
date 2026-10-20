'use client'

import type { ToolbarGroup, ToolbarGroupItem } from '@payloadcms/richtext-lexical';
import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import { $getSelectionStyleValueForProperty } from '@payloadcms/richtext-lexical/lexical/selection';
import React from 'react';
import { FontSizeDropdownGroupItem } from '../../types';
import FontSizeToolbar from '../components/FontSizeToolbar';
import getSelection from '../getSelection';
import { UPDATE_FONT_SIZE } from './command';

// Wrapper component to match the expected Component signature
const FontSizeToolbarWrapper: React.FC<{
	active?: boolean;
	anchorElem: HTMLElement;
	editor: LexicalEditor;
	enabled?: boolean;
	item: ToolbarGroupItem;
}> = ({ active, anchorElem, editor, enabled, item }) => {
	return React.createElement(FontSizeToolbar, {
		active,
		anchorElem,
		editor,
		enabled,
		item: item as any
	});
};

export const FontSizeFeatureClient = createClientFeature(() => {
	const groups: ToolbarGroup[] = [{
		type: 'buttons',
		items: [{
			Component: FontSizeToolbarWrapper,
			key: 'fontSize',
			command: UPDATE_FONT_SIZE,
			current() {
				const selection: any = getSelection()
				return selection ? $getSelectionStyleValueForProperty(selection, 'font-size', '16px') : null
			},
		} as FontSizeDropdownGroupItem],
		key: 'fontSizeDropdown',
		order: 65,
	}]

	return {
		toolbarFixed: {
			groups,
		},
		toolbarInline: {
			groups,
		},
	}
})