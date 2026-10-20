'use client'

import { createClientFeature, toolbarAddDropdownGroupWithItems } from '@payloadcms/richtext-lexical/client';
import { $isNodeSelection } from '@payloadcms/richtext-lexical/lexical';
import { $createYouTubeNode, $isYouTubeNode, YouTubeNode } from '../../nodes/YoutubeNode';
import { createPlugin } from '../createPlugin';
import { INSERT_YOUTUBE_EMBED } from './command';
import Icon from './Icon';

// Function to extract YouTube video ID from various URL formats
function extractYouTubeId(urlOrId: string): string | null {
	if (!urlOrId) return null;

	// If it's already just an ID (11 characters, alphanumeric)
	if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId.trim())) {
		return urlOrId.trim();
	}

	const url = urlOrId.trim();
	
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
		/youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

// Wrapper function that extracts ID from URL before creating node
const createYouTubeNodeWithUrlParsing = (urlOrId: string) => {
	const videoId = extractYouTubeId(urlOrId);
	if (!videoId) {
		throw new Error('Invalid YouTube URL or ID. Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)');
	}
	return $createYouTubeNode(videoId);
};

const groups = toolbarAddDropdownGroupWithItems([
	{
		ChildComponent: Icon,
		isActive: ({ selection }) => {
			if (!$isNodeSelection(selection) || !selection.getNodes().length) {
				return false
			}

			const firstNode = selection.getNodes()[ 0 ]

			return $isYouTubeNode(firstNode);
		},
		key: 'youtube',
		label: 'Youtube',
		onSelect: ({ editor }) => {
			editor.dispatchCommand(INSERT_YOUTUBE_EMBED, { replace: false })
		},
	},
])

export default createClientFeature(() => {
	return {
		plugins: [{
			Component: createPlugin({
				featureKey: 'youtube',
				command: INSERT_YOUTUBE_EMBED,
				createNode: createYouTubeNodeWithUrlParsing,
				fieldLabel: 'YouTube URL or ID',
				fieldDescription: 'Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID) or just the video ID'
			}),
			position: 'normal',
		}],
		nodes: [ YouTubeNode ],
		toolbarFixed: {
			groups: [ groups ],
		},
		toolbarInline: {
			groups: [ groups ],
		},
	}
})