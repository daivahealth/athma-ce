'use client';

import { format } from 'date-fns';
import { CheckCircle2, Clock, FileCheck, AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ChannelMessage } from '@/modules/clinical/types/care-channel';
import type { ChecklistInstanceStatus } from '@/modules/clinical/types/checklist';

interface ChecklistMessageProps {
  message: ChannelMessage;
  onViewChecklist?: (instanceId: string) => void;
}

interface ChecklistPayload {
  checklistName?: string;
  checklistCategory?: string;
  checklistInstanceId?: string;
  status?: ChecklistInstanceStatus;
  completionPercent?: number;
  dueAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  completedBy?: string;
  verifiedBy?: string;
}

export function ChecklistMessage({ message, onViewChecklist }: ChecklistMessageProps) {
  const payload = (message.payloadJson as ChecklistPayload) || {};
  const instanceId = message.linkedEntityId || payload.checklistInstanceId;

  const getStatusBadge = (subtype?: string | null, status?: ChecklistInstanceStatus) => {
    switch (subtype) {
      case 'checklist_created':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Created
          </Badge>
        );
      case 'checklist_completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'checklist_verified':
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <FileCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        if (status === 'IN_PROGRESS') {
          return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              In Progress
            </Badge>
          );
        }
        return null;
    }
  };

  const getStatusIcon = (subtype?: string | null) => {
    switch (subtype) {
      case 'checklist_created':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'checklist_completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'checklist_verified':
        return <FileCheck className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      DISCHARGE: 'bg-primary/10 text-primary',
      SURGERY: 'bg-red-100 text-red-800',
      ADMISSION: 'bg-blue-100 text-blue-800',
      TRANSFER: 'bg-yellow-100 text-yellow-800',
      PROCEDURE: 'bg-green-100 text-green-800',
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-800';
  };

  const handleViewClick = () => {
    if (instanceId && onViewChecklist) {
      onViewChecklist(instanceId);
    }
  };

  return (
    <Card className="p-4 border-l-4 border-l-primary">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5">{getStatusIcon(message.messageSubtype)}</div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">
                  {payload.checklistName || 'Checklist'}
                </h4>
                {getStatusBadge(message.messageSubtype, payload.status)}
              </div>
              {payload.checklistCategory && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${getCategoryColor(payload.checklistCategory)}`}
                >
                  {payload.checklistCategory.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            {instanceId && onViewChecklist && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewClick}
                className="shrink-0"
              >
                View
              </Button>
            )}
          </div>

          {/* Body Text */}
          {message.bodyText && (
            <p className="text-sm text-gray-700">{message.bodyText}</p>
          )}

          {/* Progress Bar (for in-progress checklists) */}
          {message.messageSubtype === 'checklist_created' &&
            payload.completionPercent !== undefined &&
            payload.completionPercent > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Progress</span>
                  <span className="font-medium">{payload.completionPercent}%</span>
                </div>
                <Progress value={payload.completionPercent} className="h-2" />
              </div>
            )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {payload.dueAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due: {formatDate(payload.dueAt)}</span>
              </div>
            )}
            {payload.completedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed: {formatDate(payload.completedAt)}</span>
              </div>
            )}
            {payload.verifiedAt && (
              <div className="flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                <span>Verified: {formatDate(payload.verifiedAt)}</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          {message.createdAt && (
            <div className="text-xs text-gray-400 pt-1">
              {formatDate(message.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
