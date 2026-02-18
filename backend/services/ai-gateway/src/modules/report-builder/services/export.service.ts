/**
 * Export Service
 * Generates Excel, PDF, and CSV exports from query results
 */

import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as PDFKit from 'pdfkit';
import { QueryResult } from '../types/query-plan.types';
import { logger } from '../../../common/logger/logger.config';

export interface ExportOptions {
  title?: string;
  includeTimestamp?: boolean;
  locale?: 'en' | 'ar';
}

@Injectable()
export class ExportService {
  /**
   * Export to Excel format
   */
  async exportToExcel(
    result: QueryResult,
    options: ExportOptions = {},
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Zeal Healthcare Platform';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(options.title || 'Report');

    // Add header row
    const headers = result.columns.map((col) =>
      options.locale === 'ar' && col.displayNameAr
        ? col.displayNameAr
        : col.displayName,
    );
    const headerRow = sheet.addRow(headers);

    // Style header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    });

    // Add data rows
    for (const row of result.rows) {
      const rowValues = result.columns.map((col) => {
        const value = row[col.name];
        return this.formatExcelValue(value, col.format);
      });
      sheet.addRow(rowValues);
    }

    // Auto-fit columns
    sheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, cellLength);
      });
      column.width = Math.min(Math.max(maxLength + 2, 10), 50);
    });

    // Apply number formats
    result.columns.forEach((col, index) => {
      const colNum = index + 1;
      if (col.format === 'currency') {
        sheet.getColumn(colNum).numFmt = '#,##0.00 "AED"';
      } else if (col.format === 'percentage') {
        sheet.getColumn(colNum).numFmt = '0.00%';
      } else if (col.format === 'number') {
        sheet.getColumn(colNum).numFmt = '#,##0';
      }
    });

    // Add metadata
    if (options.includeTimestamp) {
      sheet.addRow([]);
      sheet.addRow([`Generated: ${new Date().toISOString()}`]);
      sheet.addRow([`Total rows: ${result.totalCount}`]);
    }

    const buffer = await workbook.xlsx.writeBuffer();

    logger.info(
      {
        rowCount: result.rows.length,
        columnCount: result.columns.length,
        bufferSize: buffer.byteLength,
      },
      'Excel export generated',
    );

    return Buffer.from(buffer);
  }

  /**
   * Export to CSV format
   */
  async exportToCsv(
    result: QueryResult,
    options: ExportOptions = {},
  ): Promise<Buffer> {
    const lines: string[] = [];

    // Add header row
    const headers = result.columns.map((col) =>
      this.escapeCsvValue(
        options.locale === 'ar' && col.displayNameAr
          ? col.displayNameAr
          : col.displayName,
      ),
    );
    lines.push(headers.join(','));

    // Add data rows
    for (const row of result.rows) {
      const values = result.columns.map((col) => {
        const value = row[col.name];
        return this.escapeCsvValue(this.formatCsvValue(value));
      });
      lines.push(values.join(','));
    }

    const csv = lines.join('\n');

    logger.info(
      {
        rowCount: result.rows.length,
        columnCount: result.columns.length,
      },
      'CSV export generated',
    );

    return Buffer.from(csv, 'utf-8');
  }

  /**
   * Export to PDF format
   */
  async exportToPdf(
    result: QueryResult,
    options: ExportOptions = {},
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const doc = new PDFKit({
        size: 'A4',
        layout: 'landscape',
        margin: 30,
      });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        logger.info(
          {
            rowCount: Math.min(result.rows.length, 50),
            bufferSize: buffer.byteLength,
          },
          'PDF export generated',
        );
        resolve(buffer);
      });
      doc.on('error', reject);

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text(options.title || 'Report', {
        align: 'center',
      });
      doc.moveDown();

      // Timestamp
      if (options.includeTimestamp) {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`Generated: ${new Date().toISOString()}`, { align: 'right' });
        doc.moveDown();
      }

      // Table
      const tableTop = doc.y;
      const pageWidth = doc.page.width - 60;
      const columnWidth = pageWidth / result.columns.length;

      // Header row
      doc.fontSize(9).font('Helvetica-Bold');
      result.columns.forEach((col, i) => {
        const displayName =
          options.locale === 'ar' && col.displayNameAr
            ? col.displayNameAr
            : col.displayName;
        doc.text(displayName, 30 + i * columnWidth, tableTop, {
          width: columnWidth - 5,
          ellipsis: true,
        });
      });

      // Draw header line
      doc
        .moveTo(30, tableTop + 15)
        .lineTo(pageWidth + 30, tableTop + 15)
        .stroke();

      // Data rows (limit to 50 for PDF)
      const maxPdfRows = 50;
      const rowsToShow = result.rows.slice(0, maxPdfRows);

      doc.font('Helvetica').fontSize(8);
      rowsToShow.forEach((row, rowIndex) => {
        const rowTop = tableTop + 20 + rowIndex * 15;

        // Check if we need a new page
        if (rowTop > doc.page.height - 50) {
          doc.addPage();
          return;
        }

        result.columns.forEach((col, colIndex) => {
          const value = this.formatPdfValue(row[col.name], col.format);
          doc.text(value, 30 + colIndex * columnWidth, rowTop, {
            width: columnWidth - 5,
            ellipsis: true,
          });
        });
      });

      // Footer note if truncated
      if (result.rows.length > maxPdfRows) {
        doc.moveDown(2);
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .text(
            `Showing ${maxPdfRows} of ${result.rows.length} rows. Download Excel for complete data.`,
            { align: 'center' },
          );
      }

      // Total count
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(`Total: ${result.totalCount} rows`, {
        align: 'right',
      });

      doc.end();
    });
  }

  /**
   * Format value for Excel
   */
  private formatExcelValue(value: any, format?: string): any {
    if (value === null || value === undefined) {
      return '';
    }
    return value;
  }

  /**
   * Format value for CSV
   */
  private formatCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }

  /**
   * Escape CSV value
   */
  private escapeCsvValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Format value for PDF
   */
  private formatPdfValue(value: any, format?: string): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (format === 'currency' && typeof value === 'number') {
      return `${value.toLocaleString('en-AE', { minimumFractionDigits: 2 })} AED`;
    }

    if (format === 'percentage' && typeof value === 'number') {
      return `${(value * 100).toFixed(2)}%`;
    }

    if (format === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  }
}
