'use client';

import { ChecklistMessage } from './checklist-message';
import type { ChannelMessage } from '@/modules/clinical/types/care-channel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  MessageSquare,
  Info,
  Activity,
  FileCheck,
  AlertCircle,
  Paperclip
} from 'lucide-react';

interface MessageRendererProps {
  message: ChannelMessage;
  onViewChecklist?: (instanceId: string) => void;
}

export function MessageRenderer({ message, onViewChecklist }: MessageRendererProps) {
  // Render checklist messages with dedicated component
  if (message.messageType === 'CHECKLIST') {
    return <ChecklistMessage message={message} onViewChecklist={onViewChecklist} />;
  }

  // Render system messages
  if (message.messageType === 'SYSTEM') {
    return <SystemMessage message={message} />;
  }

  // Render clinical event messages
  if (message.messageType === 'CLINICAL_EVENT') {
    return <ClinicalEventMessage message={message} />;
  }

  // Render text messages (chat)
  if (message.messageType === 'TEXT') {
    return <TextMessage message={message} />;
  }

  // Fallback for unknown message types
  return <DefaultMessage message={message} />;
}

function SystemMessage({ message }: { message: ChannelMessage }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  const getIcon = () => {
    switch (message.messageSubtype) {
      case 'admission_created':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'bed_transfer':
        return <Activity className="w-5 h-5 text-yellow-600" />;
      case 'discharge_intimation':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'discharge_confirmed':
        return <FileCheck className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card className="p-4 bg-gray-50 border-l-4 border-l-gray-400">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              System
            </Badge>
            {message.messageSubtype && (
              <span className="text-xs text-gray-500">
                {message.messageSubtype.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          {message.bodyText && (
            <p className="text-sm text-gray-700">{message.bodyText}</p>
          )}
          {message.createdAt && (
            <div className="text-xs text-gray-400 mt-2">
              {formatDate(message.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ClinicalEventMessage({ message }: { message: ChannelMessage }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="p-4 border-l-4 border-l-purple-500">
      <div className="flex items-start gap-3">
        <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
              Clinical Event
            </Badge>
            {message.messageSubtype && (
              <span className="text-xs text-gray-500">
                {message.messageSubtype.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          {message.bodyText && (
            <p className="text-sm text-gray-700">{message.bodyText}</p>
          )}
          {message.author && (
            <div className="text-xs text-gray-500 mt-2">
              by {message.author.displayName || `${message.author.firstName} ${message.author.lastName}`}
            </div>
          )}
          {message.createdAt && (
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(message.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function TextMessage({ message }: { message: ChannelMessage }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex items-start gap-3">
      {message.author && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {message.author.firstName?.[0]}{message.author.lastName?.[0]}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          {message.author && (
            <span className="font-semibold text-sm">
              {message.author.displayName || `${message.author.firstName} ${message.author.lastName}`}
            </span>
          )}
          {message.createdAt && (
            <span className="text-xs text-gray-400">
              {formatDate(message.createdAt)}
            </span>
          )}
        </div>
        {message.bodyText && (
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <p className="text-sm text-gray-900">{message.bodyText}</p>
          </div>
        )}
        {message.priority === 'HIGH' && (
          <Badge variant="destructive" className="mt-2 text-xs">
            High Priority
          </Badge>
        )}
        {message.priority === 'URGENT' && (
          <Badge variant="destructive" className="mt-2 text-xs animate-pulse">
            Urgent
          </Badge>
        )}
      </div>
    </div>
  );
}

function DefaultMessage({ message }: { message: ChannelMessage }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="p-4 bg-gray-50">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {message.messageType}
            </Badge>
          </div>
          {message.bodyText && (
            <p className="text-sm text-gray-700">{message.bodyText}</p>
          )}
          {message.createdAt && (
            <div className="text-xs text-gray-400 mt-2">
              {formatDate(message.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
