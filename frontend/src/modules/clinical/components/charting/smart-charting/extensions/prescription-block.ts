import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PrescriptionBlockView } from '../views/PrescriptionBlockView';

export interface PrescriptionBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    prescriptionBlock: {
      insertPrescriptionBlock: () => ReturnType;
    };
  }
}

export const PrescriptionBlock = Node.create<PrescriptionBlockOptions>({
  name: 'prescriptionBlock',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-block-id'),
        renderHTML: (attributes) => ({
          'data-block-id': attributes.blockId,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="prescription-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'prescription-block' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PrescriptionBlockView);
  },

  addCommands() {
    return {
      insertPrescriptionBlock:
        () =>
        ({ commands }) => {
          const blockId = `blk_${Math.random().toString(36).slice(2, 10)}`;
          return commands.insertContent({
            type: this.name,
            attrs: { blockId },
          });
        },
    };
  },
});
