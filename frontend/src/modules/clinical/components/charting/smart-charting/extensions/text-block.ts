import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TextBlockView } from '../views/TextBlockView';

export interface TextBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textBlock: {
      insertTextBlock: (attrs: { blockType: string; header: string; content?: string }) => ReturnType;
    };
  }
}

export const TextBlock = Node.create<TextBlockOptions>({
  name: 'textBlock',

  group: 'block',

  content: 'paragraph+',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      blockType: {
        default: null, // No default - auto-created blocks will have null
        parseHTML: (element) => element.getAttribute('data-block-type'),
        renderHTML: (attributes) => ({
          'data-block-type': attributes.blockType,
        }),
      },
      header: {
        default: null, // No default - auto-created blocks will have null
        parseHTML: (element) => element.getAttribute('data-header'),
        renderHTML: (attributes) => ({
          'data-header': attributes.header,
        }),
      },
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
        tag: 'div[data-type="text-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'text-block' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TextBlockView);
  },

  addCommands() {
    return {
      insertTextBlock:
        (attrs) =>
        ({ commands }) => {
          const blockId = `blk_${Math.random().toString(36).slice(2, 10)}`;
          return commands.insertContent({
            type: this.name,
            attrs: { ...attrs, blockId },
            content: [
              {
                type: 'paragraph',
                content: attrs.content ? [{ type: 'text', text: attrs.content }] : [],
              },
            ],
          });
        },
    };
  },
});
