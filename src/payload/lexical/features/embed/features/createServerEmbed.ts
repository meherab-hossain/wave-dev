import { createServerFeature } from '@payloadcms/richtext-lexical';

export const createEmbedServerFeature = ({ 
	key, 
	ClientFeature, 
	node,
	fieldLabel = 'Embed ID',
	fieldDescription
}: { 
	key: string, 
	ClientFeature: string, 
	node: any,
	fieldLabel?: string,
	fieldDescription?: string
}) => createServerFeature({
	feature() {
		return {
			ClientFeature,
			generateSchemaMap: (context?: any) => {
				const map: Map<string, any> = new Map()

				const fieldConfig = {
					fields: [{
						name: 'id',
						type: 'text',
						label: fieldLabel,
						required: true,
						...(fieldDescription && {
							admin: {
								description: fieldDescription
							}
						})
					}]
				};

				// Register with the simple key (for backward compatibility)
				map.set(key, fieldConfig);

				// Also try to register with full path if context is available
				if (context?.collectionSlug && context?.fieldPath) {
					const fullPath = `${context.collectionSlug}.${context.fieldPath}.lexical_internal_feature.${key}.${key}`;
					map.set(fullPath, fieldConfig);
				}

				return map
			},
			nodes: [ node ]
		}
	},
	key,
})
