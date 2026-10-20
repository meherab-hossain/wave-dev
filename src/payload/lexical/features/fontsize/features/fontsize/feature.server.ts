import { createServerFeature } from '@payloadcms/richtext-lexical';

export const FontSizeFeature = createServerFeature({
	feature() {
		return {
			ClientFeature: '@/payload/lexical/features/fontsize/features/fontsize/feature.client#FontSizeFeatureClient',
			clientFeatureProps: {},
		}
	},
	key: 'fontSize',
})