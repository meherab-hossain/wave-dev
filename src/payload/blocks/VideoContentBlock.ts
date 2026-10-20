import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const VideoContentBlock: Block = {
  slug: 'video-content-wrapper',
  labels: { 
    singular: 'Video Content Wrapper', 
    plural: 'Video Content Wrapper Blocks' 
  },
  fields: [
    {
      name: 'videoPlatform',
      label: 'Video Platform',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
      ],
      admin: {
        description: 'Select the video platform'
      }
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID) or Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)',
        placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://vimeo.com/123456789'
      },
      validate: (value: any, { data, siblingData }: { data: any, siblingData: any }) => {
        
        if (!value || value === '') return 'Video URL is required';
        
        // Try to get platform from siblingData first (for block fields), then data
        const platform = siblingData?.videoPlatform || 'youtube';
        
        if (platform === 'youtube') {
          // Validate YouTube URL format
          const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          
          if (!youtubeRegex.test(value.toString())) {
            return 'Please enter a valid YouTube URL';
          }
        } else if (platform === 'vimeo') {
          // Validate Vimeo URL format - allows query parameters
          const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)(\?.*)?$/;
          
          if (!vimeoRegex.test(value.toString())) {
            return 'Please enter a valid Vimeo URL';
          }
        }
        
        return true;
      }
    },
    {
      name: 'alignment',
      label: 'Video Alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Choose where the video should appear relative to the content'
      }
    },
    {
      name: 'size',
      label: 'Video Size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
      admin: {
        description: 'Controls how wide the video renders alongside the description.'
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({ 
        features: ({ defaultFeatures }) => [...defaultFeatures] 
      }),
      admin: {
        description: 'Add content that will appear next to the video'
      }
    },
  ],
}