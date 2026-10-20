import type { Block } from 'payload'

export const CustomVideoBlock: Block = {
  slug: 'custom-video',
  labels: {
    singular: 'Custom Video',
    plural: 'Custom Videos',
  },
  interfaceName: 'CustomVideoBlock',
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
        description: 'Select the video platform',
      },
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      required: true,
      admin: {
        description:
          'Enter YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID) or Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)',
        placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://vimeo.com/123456789',
      },
      validate: (value: any, { siblingData }: { siblingData: any }) => {
        if (!value || value === '') return 'Video URL is required'

        // Determine platform from the sibling field on this same block
        const platform = siblingData?.videoPlatform || 'youtube'

        if (platform === 'youtube') {
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

          if (!youtubeRegex.test(value.toString())) {
            return 'Please enter a valid YouTube URL'
          }
        } else if (platform === 'vimeo') {
          const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)(\?.*)?$/

          if (!vimeoRegex.test(value.toString())) {
            return 'Please enter a valid Vimeo URL'
          }
        }

        return true
      },
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alignment',
      defaultValue: 'center',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
    },
    {
      name: 'size',
      type: 'select',
      label: 'Video Size',
      defaultValue: 'medium',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Full Width',
          value: 'full',
        },
      ],
      admin: {
        description: 'Controls how wide the video renders on the page.',
      },
    },
  ],
}
