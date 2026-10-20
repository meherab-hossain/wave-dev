import { lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Block } from 'payload';

export const NewsArticleBlock: Block = {
  slug: 'image-content-wrapper',
  labels: { singular: 'Image Content Wrapper', plural: 'Image Content Wrapper Blocks' },
  fields: [
    {
      name: 'image',
      label: 'Article Image',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
      admin: {
        description: 'Select an image for this article',   
      },
    },
    {
      name: 'alignment',
      label: 'Image Alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
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
      name: 'description',
      label: 'Article Content',
      type: 'richText',
      editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures] }),
    },
  ],
}
