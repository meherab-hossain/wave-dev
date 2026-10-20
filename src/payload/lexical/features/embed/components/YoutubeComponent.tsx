import React from 'react';
import { EmbedComponentProps } from '../types';

export default function({
	id,
	className
}: EmbedComponentProps): React.JSX.Element {
	return (
		<div>
			<iframe
				width="100%"
				src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`}
				allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				className={className}
				title = "Play video"
				style = {{ aspectRatio: '16/9' }}
			/>
		</div>
	);
}
