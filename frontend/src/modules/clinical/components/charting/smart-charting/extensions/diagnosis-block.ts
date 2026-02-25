import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DiagnosisBlockView } from '../views/DiagnosisBlockView';

export interface DiagnosisBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    diagnosisBlock: {
      insertDiagnosisBlock: () => ReturnType;
    };
  }
}

export const DiagnosisBlock = Node.create<DiagnosisBlockOptions>({
  name: 'diagnosisBlock',

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
        tag: 'div[data-type="diagnosis-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'diagnosis-block' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiagnosisBlockView);
  },

  addCommands() {
    return {
      insertDiagnosisBlock:
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
