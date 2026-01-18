'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageRenderer } from './message-renderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChecklistForm } from './checklist-form';
import type { ChannelMessage } from '@/modules/clinical/types/care-channel';

interface CareChannelTimelineProps {
  channelId: string;
  messages: ChannelMessage[];
  isLoading?: boolean;
  onPostMessage?: (text: string) => Promise<void>;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function CareChannelTimeline({
  channelId,
  messages,
  isLoading,
  onPostMessage,
  onRefresh,
  onLoadMore,
  hasMore,
}: CareChannelTimelineProps) {
  const [messageText, setMessageText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handlePostMessage = async () => {
    if (!messageText.trim() || !onPostMessage) return;

    setIsPosting(true);
    try {
      await onPostMessage(messageText);
      setMessageText('');
    } catch (error) {
      console.error('Failed to post message:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostMessage();
    }
  };

  const handleViewChecklist = (instanceId: string) => {
    setSelectedChecklistId(instanceId);
  };

  const handleCloseChecklist = () => {
    setSelectedChecklistId(null);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h3 className="font-semibold text-lg">Care Team Communication</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadMore}
                disabled={isLoading}
              >
                Load Earlier Messages
              </Button>
            </div>
          )}

          {/* Message List */}
          {messages.length === 0 && !isLoading ? (
            <Alert>
              <AlertDescription>
                No messages yet. Start the conversation by posting a message below.
              </AlertDescription>
            </Alert>
          ) : (
            messages.map((message) => (
              <MessageRenderer
                key={message.id}
                message={message}
                onViewChecklist={handleViewChecklist}
              />
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {onPostMessage && (
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 resize-none"
              disabled={isPosting}
            />
            <Button
              onClick={handlePostMessage}
              disabled={!messageText.trim() || isPosting}
              size="icon"
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      )}

      {/* Checklist Dialog */}
      <Dialog open={!!selectedChecklistId} onOpenChange={() => setSelectedChecklistId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checklist</DialogTitle>
          </DialogHeader>
          {selectedChecklistId && (
            <ChecklistForm
              instanceId={selectedChecklistId}
              onComplete={handleCloseChecklist}
              onVerify={handleCloseChecklist}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
