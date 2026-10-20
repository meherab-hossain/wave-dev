import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { CustomVideoBlock } from './CustomVideoBlock'
import { ImageBlock } from './ImageBlock'

export const TwoColumnBlock: Block = {
  slug: 'two-column',
  labels: {
    singular: 'Two Column Layout',
    plural: 'Two Column Layouts',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'column1',
          label: 'First Column',
          type: 'richText',
          admin: {
            width: '50%',
          },
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              BlocksFeature({
                blocks: [ImageBlock, CustomVideoBlock],
              }),
            ],
          }),
          required: true,
        },
        {
          name: 'column2',
          label: 'Second Column',
          type: 'richText',
          admin: {
            width: '50%',
          },
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              BlocksFeature({
                blocks: [ImageBlock, CustomVideoBlock],
              }),
            ],
          }),
          required: true,
        },
      ],
    },
  ],
}
