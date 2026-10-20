'use client'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import type { PluginComponent } from '@payloadcms/richtext-lexical';
import {
	$getPreviousSelection,
	$getSelection,
	$isRangeSelection,
	$setSelection,
	BaseSelection,
	COMMAND_PRIORITY_EDITOR,
	LexicalCommand
} from '@payloadcms/richtext-lexical/lexical';
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils';
import React, { useEffect, useState } from 'react';

type PluginProps<TPayload> = {
	command: LexicalCommand<TPayload>
	featureKey: string
	createNode: Function
	fieldLabel?: string
	fieldDescription?: string
}

export const createPlugin = <TPayload,>({ featureKey, command, createNode, fieldLabel = 'Embed ID', fieldDescription }: PluginProps<TPayload>): PluginComponent => {
	return (): React.JSX.Element => {
		const [ editor ] = useLexicalComposerContext()
		const [ selectionState, setSelectionState ] = useState<BaseSelection | null>(null)
		const [ isOpen, setIsOpen ] = useState(false)
		const [ inputValue, setInputValue ] = useState('')
		const [ error, setError ] = useState('')

		useEffect(() => {
			const unregister = editor.registerCommand(
				command,
				() => {
					
					editor.read(() => {
						const selection = $getSelection() ?? $getPreviousSelection()
						setSelectionState(selection)
					})

					// Use setTimeout to ensure state updates happen in the correct order
					setTimeout(() => {
						setInputValue('')
						setError('')
						setIsOpen(true)
					}, 0)

					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			)
			
			return unregister
		}, [ editor, command ])

		const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			
			if (!inputValue.trim()) {
				setError('This field is required')
				return
			}

			// First validate the input without creating the node
			// This assumes your createNode function throws an error for invalid input
			// We'll do a simple pre-validation here
			const trimmedValue = inputValue.trim()
			
			try {
				editor.update(() => {
					if (selectionState) {
						$setSelection(selectionState.clone())
					}

					if ($isRangeSelection(selectionState)) {
						const focusNode = selectionState.focus.getNode()

						if (focusNode !== null) {
							try {
								const node = createNode(trimmedValue);
								$insertNodeToNearestRoot(node);
								
								// Success! Close the modal in the next tick
								setTimeout(() => {
									setIsOpen(false)
									setInputValue('')
									setError('')
								}, 0)
							} catch (err) {
								// Node creation failed, show error but don't close modal
								setTimeout(() => {
									setError(err instanceof Error ? err.message : 'Invalid input')
								}, 0)
							}
						}
					}
				})
			} catch (err) {
				// Catch any other unexpected errors
				console.error('Error in editor update:', err)
				setError(err instanceof Error ? err.message : 'An error occurred')
			}
		}

		const handleClose = () => {
			setIsOpen(false)
			setInputValue('')
			setError('')
			setSelectionState(null)
		}

		if (!isOpen) return null as any;

		return (
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 9999,
				}}
				onClick={handleClose}
			>
				<div
					style={{
						backgroundColor: 'var(--theme-elevation-0, white)',
						borderRadius: '4px',
						padding: '24px',
						maxWidth: '500px',
						width: '90%',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600', color: 'var(--theme-text, #333)' }}>
						Insert {featureKey.charAt(0).toUpperCase() + featureKey.slice(1)}
					</h2>
					
					<div>
						<div style={{ marginBottom: '16px' }}>
							<label
								htmlFor={`${featureKey}-input`}
								style={{
									display: 'block',
									marginBottom: '8px',
									fontSize: '14px',
									fontWeight: '500',
									color: 'var(--theme-text, #333)'
								}}
							>
								{fieldLabel}
							</label>
							
							{fieldDescription && (
								<p style={{ 
									margin: '0 0 8px 0', 
									fontSize: '12px', 
									color: 'var(--theme-elevation-400, #666)' 
								}}>
									{fieldDescription}
								</p>
							)}
							
							<input
								id={`${featureKey}-input`}
								type="text"
								value={inputValue}
								onChange={(e) => {
									setInputValue(e.target.value)
									setError('')
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleSubmit(e as any)
									}
								}}
								placeholder={`Enter ${fieldLabel.toLowerCase()}`}
								autoFocus
								style={{
									width: '100%',
									padding: '8px 12px',
									fontSize: '14px',
									border: `1px solid ${error ? '#dc2626' : 'var(--theme-elevation-150, #ddd)'}`,
									borderRadius: '4px',
									outline: 'none',
									backgroundColor: 'var(--theme-elevation-0, white)',
									color: 'var(--theme-text, #333)',
								}}
							/>
							
							{error && (
								<p style={{ 
									margin: '8px 0 0 0', 
									fontSize: '12px', 
									color: '#dc2626' 
								}}>
									{error}
								</p>
							)}
						</div>
						
						<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
							<button
								type="button"
								onClick={handleClose}
								style={{
									padding: '8px 16px',
									fontSize: '14px',
									border: '1px solid var(--theme-elevation-150, #ddd)',
									borderRadius: '4px',
									backgroundColor: 'transparent',
									color: 'var(--theme-text, #333)',
									cursor: 'pointer',
								}}
							>
								Cancel
							</button>
							
							<button
								type="button"
								onClick={handleSubmit}
								style={{
									padding: '8px 16px',
									fontSize: '14px',
									border: 'none',
									borderRadius: '4px',
									backgroundColor: 'var(--theme-elevation-500, #0070f3)',
									color: 'white',
									cursor: 'pointer',
								}}
							>
								Insert
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}