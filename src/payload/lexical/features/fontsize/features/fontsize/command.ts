import { createCommand, type LexicalCommand } from '@payloadcms/richtext-lexical/lexical';

export const UPDATE_FONT_SIZE: LexicalCommand<{ fontSize: string }> = createCommand('UPDATE_FONT_SIZE');