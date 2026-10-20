import { CustomVideoBlock } from '@/payload/blocks/CustomVideoBlock'
import { ImageBlock } from '@/payload/blocks/ImageBlock'
import { NewsArticleBlock } from '@/payload/blocks/NewsArticleBlock'
import { TwoColumnBlock } from '@/payload/blocks/TwoColumn'
import { VideoContentBlock } from '@/payload/blocks/VideoContentBlock'
import { TextColorFeature } from '@/payload/lexical/features/color/features/textColor/feature.server'
import { YoutubeFeature } from '@/payload/lexical/features/embed/features/youtube/feature.server'
import { FontSizeFeature } from '@/payload/lexical/features/fontsize/features/fontsize/feature.server'
import {
  AlignFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature, // Add this import
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  EXPERIMENTAL_TableFeature as TableFeature,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

// import '../payload/lexical/features/color/components/ColorPicker.css';
const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'is_published',
      'is_featured',
      'categories',
      'permissions',
      'createdAt',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            TableFeature(),
            AlignFeature(),
            LinkFeature(),
            TextColorFeature(),
            YoutubeFeature(),
            FontSizeFeature(),
            BlocksFeature({
              blocks: [
                TwoColumnBlock,
                ImageBlock,
                NewsArticleBlock,
                CustomVideoBlock,
                VideoContentBlock,
              ],
            }),
          ]
        },
      }),
      label: 'Description',
    },

    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        disabled: true,
      },
    },

    {
      name: 'meta',
      type: 'group',
      label: 'SEO Meta Data',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'description',
          type: 'text',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Meta Keywords',
        },
      ],
    },

    {
      name: 'is_published',
      type: 'checkbox',
      label: 'Is Published',
      defaultValue: false,
    },
    {
      name: 'published_at',
      type: 'date',
      label: 'Published At',
      required: false,
      admin: {
        disabled: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'published_start_date',
      type: 'date',
      label: 'Published Start Date',
      required: false,
      validate: (value, { siblingData }) => {
        const data = siblingData as Record<string, unknown>
        const endDate = data?.published_end_date as string | null | undefined
        if (!value || !endDate) return true
        if (new Date(value) > new Date(endDate)) {
          return 'Published Start Date cannot be after Published End Date'
        }
        return true
      },
    },
    {
      name: 'published_end_date',
      type: 'date',
      label: 'Published End Date',
      required: false,
      validate: (value, { siblingData }) => {
        const data = siblingData as Record<string, unknown>
        const startDate = data?.published_start_date as string | null | undefined
        if (!value || !startDate) return true
        if (new Date(value) < new Date(startDate)) {
          return 'Published End Date cannot be before Published Start Date'
        }
        return true
      },
    },

    {
      name: 'extra_fields',
      type: 'json',
      label: 'Extra Fields (JSON)',
      required: false,
      admin: {
        disabled: true,
        description: 'Key-value pairs stored as JSON',
      },
    },
  ],
}

export default BlogPosts
