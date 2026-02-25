import { Node } from '@tiptap/core';

/**
 * Custom Document node that only allows our block types.
 * Users add blocks via the "Add Block" button.
 */
export const BlockOnlyDoc = Node.create({
  name: 'doc',
  topNode: true,
  content: '(textBlock | diagnosisBlock | ordersBlock | prescriptionBlock)*',
});
