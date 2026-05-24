'use client';

import type { LabSpecimenLabelPayload } from '../types/lab-operations';

type PrintTransport = 'wifi' | 'bluetooth';

type PrintRequest = {
  printerId?: string;
  transport?: PrintTransport;
  prn: string;
  fileName: string;
};

type PrintResult = {
  success: boolean;
  message?: string;
};

declare global {
  interface Window {
    labLabelPrinter?: {
      printRawLabel: (request: PrintRequest) => Promise<PrintResult>;
    };
  }
}

class LabLabelPrintService {
  async printLabel(payload: LabSpecimenLabelPayload): Promise<PrintResult> {
    if (typeof window !== 'undefined' && window.labLabelPrinter?.printRawLabel) {
      return window.labLabelPrinter.printRawLabel({
        prn: payload.prn,
        fileName: payload.fileName,
      });
    }

    const blob = new Blob([payload.prn], { type: payload.mimeType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = payload.fileName;
    anchor.click();
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'No printer bridge detected. Downloaded the PRN file instead.',
    };
  }
}

export const labLabelPrintService = new LabLabelPrintService();
