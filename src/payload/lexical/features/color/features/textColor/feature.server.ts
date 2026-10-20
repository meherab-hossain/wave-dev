import { createServerFeature } from '@payloadcms/richtext-lexical';
import { ColorFeatureProps } from '../../types';

export const TextColorFeature = createServerFeature<ColorFeatureProps, ColorFeatureProps, ColorFeatureProps>({
	feature({ props }) {
		return {
			ClientFeature: '@/payload/lexical/features/client#TextColorFeatureClient',
			clientFeatureProps: {
				colors: props?.colors
			},
		}
	},
	key: 'textColor',
})
