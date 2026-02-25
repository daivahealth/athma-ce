'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import {
  FileText,
  Clock,
  StickyNote,
  Stethoscope,
  ClipboardList,
  Pill,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import {
  BlockOnlyDoc,
  TextBlock,
  DiagnosisBlock,
  OrdersBlock,
  PrescriptionBlock,
} from './extensions';
import { SLASH_COMMANDS } from './menus/command-items';
import { BLOCK_HEADERS, type SmartChartingBlockType } from './types';
import { EditorToolbar } from './EditorToolbar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useClinicalNotesByEncounter,
  useCreateClinicalNote,
  useUpdateClinicalNoteSections,
} from '@/modules/clinical/hooks/use-charting';
import { NoteType } from '@/modules/clinical/types/charting';
import { useToast } from '@/components/ui/use-toast';
import type { SmartChartingEditorProps, SmartChartingStorageFormat } from './types';

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Clock,
  StickyNote,
  Stethoscope,
  ClipboardList,
  Pill,
};

interface SmartChartingContextValue {
  encounterId: string;
  patientId: string;
  authorStaffId: string;
}

const SmartChartingContext = createContext<SmartChartingContextValue | null>(null);

export function useSmartChartingContext(): SmartChartingContextValue {
  const context = useContext(SmartChartingContext);
  if (!context) {
    throw new Error('useSmartChartingContext must be used within SmartChartingEditor');
  }
  return context;
}

const SECTION_CODE = 'smart_charting';
const STORAGE_VERSION = '1.0.0';

// Helper to get existing block types from editor
// Only counts intentionally-created blocks (those with blockId)
function getExistingBlockTypes(editor: ReturnType<typeof useEditor>): Set<string> {
  if (!editor) return new Set<string>();
  const types = new Set<string>();
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'textBlock') {
      // Only count textBlocks with blockId (intentionally created, not auto-created)
      if (node.attrs.blockId && node.attrs.blockType) {
        types.add(node.attrs.blockType);
      }
    } else if (node.type.name === 'diagnosisBlock') {
      types.add('diagnosis');
    } else if (node.type.name === 'ordersBlock') {
      types.add('orders');
    } else if (node.type.name === 'prescriptionBlock') {
      types.add('prescription');
    }
  });
  return types;
}

export function SmartChartingEditor({
  encounterId,
  patientId,
  authorStaffId,
}: SmartChartingEditorProps) {
  const toast = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [existingBlockTypes, setExistingBlockTypes] = useState<Set<string>>(new Set());

  const { data: encounterNotes = [] } = useClinicalNotesByEncounter(encounterId);
  const { mutateAsync: createClinicalNote, isPending: isCreatingNote } = useCreateClinicalNote();
  const { mutateAsync: updateNoteSections, isPending: isUpdatingNote } = useUpdateClinicalNoteSections();

  const smartChartingNote = useMemo(
    () =>
      encounterNotes.find((note) =>
        (note.sections ?? []).some((section) => section.sectionCode === SECTION_CODE)
      ) ?? encounterNotes[0] ?? null,
    [encounterNotes]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      BlockOnlyDoc,
      StarterKit.configure({
        document: false,
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      TextBlock,
      DiagnosisBlock,
      OrdersBlock,
      PrescriptionBlock,
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[100px] pt-1',
      },
      // Prevent typing when there are no blocks - user must add blocks via button
      handleKeyDown: (view, event) => {
        // Allow navigation and special keys
        if (event.metaKey || event.ctrlKey || event.altKey) return false;
        if (['Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return false;

        // If document is empty, prevent typing (user should add block first)
        if (view.state.doc.childCount === 0) {
          return true; // Consume the event, prevent default
        }

        return false;
      },
    },
    content: '',
    onUpdate: ({ editor }) => {
      // Update existing block types whenever content changes
      setExistingBlockTypes(getExistingBlockTypes(editor));
    },
  });

  // Load saved content
  useEffect(() => {
    if (!editor || isInitialized || !smartChartingNote) return;

    const section = (smartChartingNote.sections ?? []).find(
      (s) => s.sectionCode === SECTION_CODE
    );

    if (section?.content) {
      const stored = section.content as SmartChartingStorageFormat;
      if (stored.editorType === 'smart-charting' && stored.tiptapJson) {
        try {
          editor.commands.setContent(stored.tiptapJson);
          setExistingBlockTypes(getExistingBlockTypes(editor));
          setIsInitialized(true);
        } catch (err) {
          console.error('Failed to restore editor content:', err);
        }
      }
    }
    setIsInitialized(true);
  }, [editor, smartChartingNote, isInitialized]);

  // Update existing block types on mount
  useEffect(() => {
    if (editor) {
      setExistingBlockTypes(getExistingBlockTypes(editor));
    }
  }, [editor]);

  // Keyboard shortcut: Cmd/Ctrl + / to open Add Block menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsAddBlockOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter available commands - only show blocks not yet added
  const availableCommands = useMemo(() => {
    return SLASH_COMMANDS.filter((cmd) => !existingBlockTypes.has(cmd.id));
  }, [existingBlockTypes]);

  const countBlocks = useCallback(() => {
    return existingBlockTypes.size;
  }, [existingBlockTypes]);

  const handleAddBlock = useCallback(
    (blockType: SmartChartingBlockType) => {
      if (!editor) return;

      // Double-check the block doesn't already exist
      if (existingBlockTypes.has(blockType)) {
        toast({
          variant: 'destructive',
          title: 'Block already exists',
          description: `${BLOCK_HEADERS[blockType]} has already been added.`,
        });
        return;
      }

      const header = BLOCK_HEADERS[blockType];
      const blockId = `blk_${Math.random().toString(36).slice(2, 10)}`;

      // Create the node using the schema
      const { schema } = editor.state;
      let node;
      const isTextBlock = blockType === 'chiefHpi' || blockType === 'history' || blockType === 'notes';

      if (isTextBlock) {
        const paragraph = schema.nodes.paragraph.create();
        node = schema.nodes.textBlock.create(
          { blockType, header, blockId },
          paragraph
        );
      } else if (blockType === 'diagnosis') {
        node = schema.nodes.diagnosisBlock.create({ blockId });
      } else if (blockType === 'orders') {
        node = schema.nodes.ordersBlock.create({ blockId });
      } else {
        node = schema.nodes.prescriptionBlock.create({ blockId });
      }

      // Close the dropdown first
      setIsAddBlockOpen(false);

      // Insert at the end of the document using a transaction
      const { tr } = editor.state;
      const endPos = tr.doc.content.size;
      tr.insert(endPos, node);

      // Set selection within the SAME transaction to prevent ProseMirror from
      // creating default content for cursor positioning
      if (isTextBlock) {
        // For text blocks, set cursor inside the paragraph (endPos + 2 accounts for block start + paragraph start)
        tr.setSelection(editor.state.selection.constructor.near(tr.doc.resolve(endPos + 2)));
      } else {
        // For atom blocks, use NodeSelection to select the block itself
        // This prevents ProseMirror from creating a paragraph for cursor
        tr.setSelection(NodeSelection.create(tr.doc, endPos));
      }

      editor.view.dispatch(tr);

      // Update existing block types immediately
      setExistingBlockTypes(getExistingBlockTypes(editor));

      // Focus the editor after dropdown closes and transaction is applied
      // Use a longer delay to ensure the dropdown has fully closed
      setTimeout(() => {
        if (isTextBlock) {
          // For text blocks, focus and set cursor position
          editor.chain().focus().setTextSelection(endPos + 2).run();
        } else {
          // For atom blocks, just focus the editor with node selected
          editor.view.focus();
        }
      }, 50);
    },
    [editor, existingBlockTypes, toast]
  );

  const handleSave = useCallback(async () => {
    if (!editor) return;

    const tiptapJson = editor.getJSON();

    // Extract block summaries for quick reference
    // Only save intentionally-created blocks (those with blockId)
    const blocks: SmartChartingStorageFormat['blocks'] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'textBlock') {
        // Skip auto-created textBlocks (those without blockId)
        if (!node.attrs.blockId) return;
        blocks.push({
          id: node.attrs.blockId,
          type: node.attrs.blockType,
          header: node.attrs.header,
          content: node.textContent,
        });
      } else if (node.type.name === 'diagnosisBlock') {
        blocks.push({
          id: node.attrs.blockId || '',
          type: 'diagnosis',
          header: 'Diagnosis',
        });
      } else if (node.type.name === 'ordersBlock') {
        blocks.push({
          id: node.attrs.blockId || '',
          type: 'orders',
          header: 'Orders',
        });
      } else if (node.type.name === 'prescriptionBlock') {
        blocks.push({
          id: node.attrs.blockId || '',
          type: 'prescription',
          header: 'Prescription',
        });
      }
    });

    const storagePayload: SmartChartingStorageFormat = {
      version: STORAGE_VERSION,
      editorType: 'smart-charting',
      tiptapJson,
      blocks,
    };

    const sectionPayload = {
      sectionCode: SECTION_CODE,
      sectionName: 'Smart Charting',
      sortOrder: 1000,
      content: storagePayload,
    };

    try {
      if (smartChartingNote) {
        const preservedSections = (smartChartingNote.sections ?? []).filter(
          (section) => section.sectionCode !== SECTION_CODE
        );
        await updateNoteSections({
          id: smartChartingNote.id,
          payload: {
            sections: [...preservedSections, sectionPayload],
          },
        });
      } else {
        await createClinicalNote({
          encounterId,
          patientId,
          noteType: NoteType.PROGRESS,
          title: 'Smart Charting',
          authorStaffId,
          sections: [sectionPayload],
        });
      }
      setLastSaved(new Date());
      toast({
        title: 'Saved',
        description: 'Smart charting content saved successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to save',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, [
    editor,
    smartChartingNote,
    updateNoteSections,
    createClinicalNote,
    encounterId,
    patientId,
    authorStaffId,
    toast,
  ]);

  const contextValue = useMemo(
    () => ({ encounterId, patientId, authorStaffId }),
    [encounterId, patientId, authorStaffId]
  );

  if (!editor) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <SmartChartingContext.Provider value={contextValue}>
      <div className="rounded-lg border bg-card p-6">
        <EditorToolbar
          blockCount={countBlocks()}
          isSaving={isCreatingNote || isUpdatingNote}
          lastSaved={lastSaved}
          onSave={handleSave}
        />

        <div className="mt-3">
          <EditorContent editor={editor} className="smart-charting-editor" />
        </div>

        {availableCommands.length > 0 && (
          <div className="mt-4 flex justify-center">
            <DropdownMenu open={isAddBlockOpen} onOpenChange={setIsAddBlockOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Block
                  <span className="ml-2 text-xs text-muted-foreground">⌘/</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-72"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {availableCommands.map((cmd) => {
                  const Icon = ICON_MAP[cmd.icon] || FileText;
                  return (
                    <DropdownMenuItem
                      key={cmd.id}
                      onClick={() => handleAddBlock(cmd.id)}
                      className="gap-3 py-2.5 cursor-pointer"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{cmd.title}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {countBlocks() === 0 && (
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">⌘/</kbd> or click the button to add blocks
          </div>
        )}
      </div>
    </SmartChartingContext.Provider>
  );
}
