import { $isTableSelection } from '@lexical/table'
import {
  $getSelection,
  $isRangeSelection,
  type BaseSelection,
  type RangeSelection,
} from '@payloadcms/richtext-lexical/lexical'

type SupportedSelection = RangeSelection | BaseSelection

export default function getSelection(
  selection: BaseSelection | null = null,
): SupportedSelection | null {
  selection ||= $getSelection()

  if ($isRangeSelection(selection)) {
    return selection
  }

  // Cast avoids excessive stack depth when comparing TableSelection across lexical packages.
  if (selection != null && $isTableSelection(selection as never)) {
    return selection
  }

  return null
}
