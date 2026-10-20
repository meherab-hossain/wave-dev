import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'custom-image',
  labels: {
    singular: 'Custom Image',
    plural: 'Custom Images',
  },
  interfaceName: 'ImageBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Hyperlink URL',
      admin: {
        description: 'Optional. If set, clicking the image opens this URL in a new tab.',
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
  ],
}
