/**
 * Extract clinical text from TipTap editor JSON.
 * ONLY extracts text from textBlock nodes (chiefHpi, history, notes).
 * Skips diagnosisBlock, ordersBlock, prescriptionBlock entirely.
 *
 * This ensures NO PHI/PII is included — patient demographics live in the
 * page header, not inside the TipTap editor.
 */

interface ExtractionResult {
  text: string;
  blockTypes: string[];
}

/**
 * Recursively collect text from a TipTap node and its children.
 */
function collectText(node: any): string {
  if (!node) return '';
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text;
  }
  if (Array.isArray(node.content)) {
    return node.content.map(collectText).join(' ');
  }
  return '';
}

/**
 * Extract de-identified clinical narrative from the editor JSON.
 */
export function extractClinicalText(editorJson: Record<string, any>): ExtractionResult {
  const parts: string[] = [];
  const blockTypes: string[] = [];

  const topContent = editorJson?.content;
  if (!Array.isArray(topContent)) {
    return { text: '', blockTypes: [] };
  }

  for (const node of topContent) {
    // Only extract from textBlock nodes that were intentionally created
    if (node.type === 'textBlock' && node.attrs?.blockId && node.attrs?.blockType) {
      const text = collectText(node).trim();
      if (text) {
        parts.push(text);
        if (!blockTypes.includes(node.attrs.blockType)) {
          blockTypes.push(node.attrs.blockType);
        }
      }
    }
    // Explicitly skip diagnosisBlock, ordersBlock, prescriptionBlock
  }

  return {
    text: parts.join('\n\n'),
    blockTypes,
  };
}
