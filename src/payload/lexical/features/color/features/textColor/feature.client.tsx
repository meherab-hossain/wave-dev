'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import { $getSelectionStyleValueForProperty } from '@payloadcms/richtext-lexical/lexical/selection';
import '../../components/ColorPicker.css';
import Dropdown from '../../components/Dropdown';
import { ColorDropdownGroup } from '../../types';
import getSelection from '../getSelection';
import Icon from './Icon';
import { UPDATE_TEXT_COLOR } from './command';

export default createClientFeature(({ props }: any) => {
	const groups: ColorDropdownGroup[] = [ {
		type: 'dropdown',
		ChildComponent: Icon,
		isEnabled({ selection }) {
			return !!getSelection(selection);
		},
		items: [{
			...props,
			Component: Dropdown,
			key: 'textColor',
			command: UPDATE_TEXT_COLOR,
			current() {
				const selection:any = getSelection()

				return selection ? $getSelectionStyleValueForProperty(selection, 'color', '') : null
			},
		}],
		key: 'textColorDropdown',
		order: 60,
	} ]

	return {
		// @ts-ignore
		enableFormats: ['textColor'] as TextFormatType[],
		toolbarFixed: {
			groups,
		},
		toolbarInline: {
			groups,
		},
	}
})
