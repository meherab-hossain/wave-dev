import { Minus, Plus, RotateCcw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type FontSizeSelectorProps = {
	fontSize: string;
	onChange: (fontSize: string) => void;
}

const DEFAULT_FONT_SIZE = 16; // Default font size in pixels
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const STEP = 1;

export default function FontSizeSelector({ fontSize, onChange }: Readonly<FontSizeSelectorProps>): React.JSX.Element {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	
	// Parse current font size
	const getCurrentSize = (): number => {
		if (!fontSize) return DEFAULT_FONT_SIZE;
		const parsed = parseFloat(fontSize);
		return isNaN(parsed) ? DEFAULT_FONT_SIZE : parsed;
	};

	const currentSize = getCurrentSize();
	
	// Local state for input value to allow typing
	const [inputValue, setInputValue] = useState<string>(currentSize.toString());

	// Update input value when fontSize prop changes (from external source)
	useEffect(() => {
		setInputValue(currentSize.toString());
	}, [fontSize]);

	const handleIncrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const newSize = Math.min(currentSize + STEP, MAX_FONT_SIZE);
		onChange(`${newSize}px`);
	};

	const handleDecrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const newSize = Math.max(currentSize - STEP, MIN_FONT_SIZE);
		onChange(`${newSize}px`);
	};

	const handleReset = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onChange('');
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value); // Allow typing
		
		const parsed = parseFloat(value);
		
		if (value === '' || isNaN(parsed)) {
			// Don't update onChange yet, let user finish typing
			return;
		}
		
		const clamped = Math.max(MIN_FONT_SIZE, Math.min(parsed, MAX_FONT_SIZE));
		onChange(`${clamped}px`);
	};

	const handleInputBlur = () => {
		// On blur, ensure the value is valid
		const parsed = parseFloat(inputValue);
		if (isNaN(parsed) || parsed < MIN_FONT_SIZE) {
			onChange(`${MIN_FONT_SIZE}px`);
		} else if (parsed > MAX_FONT_SIZE) {
			onChange(`${MAX_FONT_SIZE}px`);
		} else {
			onChange(`${parsed}px`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Prevent arrow keys from closing dropdown
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			e.stopPropagation();
			const newSize = Math.min(currentSize + STEP, MAX_FONT_SIZE);
			onChange(`${newSize}px`);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();
			const newSize = Math.max(currentSize - STEP, MIN_FONT_SIZE);
			onChange(`${newSize}px`);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			inputRef.current?.blur();
		}
	};

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		const handleMouseDown = (e: MouseEvent) => {
			e.stopPropagation();
		};

		const handleClick = (e: MouseEvent) => {
			e.stopPropagation();
		};

		wrapper.addEventListener('mousedown', handleMouseDown, true);
		wrapper.addEventListener('click', handleClick, true);

		return () => {
			wrapper.removeEventListener('mousedown', handleMouseDown, true);
			wrapper.removeEventListener('click', handleClick, true);
		};
	}, []);

	return (
		<div className="color-picker-wrapper" ref={wrapperRef}>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={handleDecrease}
					onMouseDown={(e) => e.preventDefault()}
					disabled={currentSize <= MIN_FONT_SIZE}
					className="flex-none w-10 h-10 flex items-center justify-center border border-[var(--color-border)] rounded-md bg-transparent hover:bg-black dark:hover:bg-white hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed"
					title="Decrease font size"
				>
					<Minus className="w-4 h-4" />
				</button>

				<div className="flex-1 flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-md">
					<input
						ref={inputRef}
						type="number"
						value={inputValue}
						onChange={handleInputChange}
						onBlur={handleInputBlur}
						onKeyDown={handleKeyDown}
						onMouseDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
						min={MIN_FONT_SIZE}
						max={MAX_FONT_SIZE}
						className="w-full bg-transparent outline-none text-center"
						style={{ MozAppearance: 'textfield' }}
					/>
					<span className="text-sm text-gray-500">px</span>
				</div>

				<button
					type="button"
					onClick={handleIncrease}
					onMouseDown={(e) => e.preventDefault()}
					disabled={currentSize >= MAX_FONT_SIZE}
					className="flex-none w-10 h-10 flex items-center justify-center border border-[var(--color-border)] rounded-md bg-transparent hover:bg-black dark:hover:bg-white hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed"
					title="Increase font size"
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>

			<button 
				type="button"
				className="w-full p-2 mt-2 flex items-center justify-center border border-[var(--color-border)] rounded-md bg-transparent hover:bg-black dark:hover:bg-white hover:bg-opacity-10" 
				onClick={handleReset}
				onMouseDown={(e) => e.preventDefault()}
			>
				<RotateCcw strokeWidth={1.5} className="w-5 h-5 mr-2" /> Reset font size
			</button>

			<div className="mt-3 pt-3 border-t border-[var(--color-border)]">
				<p className="text-sm text-gray-500 mb-2">Preview:</p>
				<div 
					className="p-3 border border-[var(--color-border)] rounded-md"
					style={{ fontSize: fontSize || `${DEFAULT_FONT_SIZE}px` }}
				>
					Sample Text
				</div>
			</div>
		</div>
	);
}