import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { OrdersBlockView } from '../views/OrdersBlockView';

export interface OrdersBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ordersBlock: {
      insertOrdersBlock: () => ReturnType;
    };
  }
}

export const OrdersBlock = Node.create<OrdersBlockOptions>({
  name: 'ordersBlock',

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
        tag: 'div[data-type="orders-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'orders-block' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(OrdersBlockView);
  },

  addCommands() {
    return {
      insertOrdersBlock:
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
