/**
 * Embedding Service
 * Handles text preprocessing, chunking, and embedding generation
 */

import { Injectable } from '@nestjs/common';
import { LLMClientService } from '../../../shared/llm-client/llm-client.service';
import {
  ChunkingConfig,
  DEFAULT_CHUNKING_CONFIG,
  EMBEDDING_CONFIG,
  MEDICAL_ABBREVIATIONS,
} from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

export interface TextChunk {
  text: string;
  startOffset: number;
  endOffset: number;
  index: number;
}

export interface EmbeddedChunk extends TextChunk {
  embedding: number[];
}

@Injectable()
export class EmbeddingService {
  private readonly chunkingConfig: ChunkingConfig;

  constructor(private llmClient: LLMClientService) {
    this.chunkingConfig = DEFAULT_CHUNKING_CONFIG;
  }

  /**
   * Generate embeddings for a single text
   */
  async embedText(text: string): Promise<number[]> {
    const preprocessed = this.preprocessClinicalText(text);
    return this.llmClient.embedText(preprocessed);
  }

  /**
   * Process a document into chunks and generate embeddings
   */
  async embedDocument(
    content: string,
    config?: Partial<ChunkingConfig>,
  ): Promise<EmbeddedChunk[]> {
    const startTime = Date.now();
    const effectiveConfig = { ...this.chunkingConfig, ...config };

    // Preprocess the content
    const preprocessed = this.preprocessClinicalText(content);

    // Split into chunks
    const chunks = this.chunkText(preprocessed, effectiveConfig);

    if (chunks.length === 0) {
      logger.warn('Document produced no chunks after processing');
      return [];
    }

    // Generate embeddings in batches
    const embeddings = await this.llmClient.embedBatch(chunks.map((c) => c.text));

    // Combine chunks with embeddings
    const result: EmbeddedChunk[] = chunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index],
    }));

    logger.debug(
      {
        originalLength: content.length,
        preprocessedLength: preprocessed.length,
        chunkCount: chunks.length,
        processingTimeMs: Date.now() - startTime,
      },
      'Document embedded',
    );

    return result;
  }

  /**
   * Preprocess clinical text by expanding abbreviations and normalizing
   */
  preprocessClinicalText(text: string): string {
    let processed = text;

    // Normalize whitespace
    processed = processed.replace(/\s+/g, ' ');

    // Expand medical abbreviations (case-insensitive word boundaries)
    for (const [abbr, expansion] of Object.entries(MEDICAL_ABBREVIATIONS)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      processed = processed.replace(regex, expansion);
    }

    // Normalize common patterns
    processed = processed
      // Normalize dates like "01/15/2024" to "January 15, 2024"
      .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, (_, m, d, y) => {
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      })
      // Normalize bullet points
      .replace(/^[-•*]\s*/gm, '- ')
      // Remove excessive punctuation
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    return processed;
  }

  /**
   * Split text into overlapping chunks
   */
  chunkText(text: string, config: ChunkingConfig): TextChunk[] {
    const chunks: TextChunk[] = [];

    // Simple sentence-based chunking
    // Split on sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];

    let currentChunk = '';
    let currentStartOffset = 0;
    let chunkIndex = 0;
    let currentOffset = 0;

    for (const sentence of sentences) {
      // Estimate tokens (rough approximation: ~4 chars per token)
      const estimatedTokens = (currentChunk.length + sentence.length) / 4;

      if (estimatedTokens > config.targetChunkSize && currentChunk.length > 0) {
        // Save current chunk
        if (currentChunk.length >= config.minChunkSize) {
          chunks.push({
            text: currentChunk.trim(),
            startOffset: currentStartOffset,
            endOffset: currentOffset,
            index: chunkIndex++,
          });
        }

        // Start new chunk with overlap
        const overlapChars = Math.floor(config.overlap * 4);
        if (currentChunk.length > overlapChars) {
          currentChunk = currentChunk.slice(-overlapChars);
          currentStartOffset = currentOffset - overlapChars;
        } else {
          currentChunk = '';
          currentStartOffset = currentOffset;
        }
      }

      currentChunk += sentence;
      currentOffset += sentence.length;
    }

    // Add final chunk
    if (currentChunk.length >= config.minChunkSize) {
      chunks.push({
        text: currentChunk.trim(),
        startOffset: currentStartOffset,
        endOffset: currentOffset,
        index: chunkIndex,
      });
    }

    return chunks;
  }

  /**
   * Get embedding model info
   */
  getModelInfo(): { model: string; dimensions: number } {
    return {
      model: EMBEDDING_CONFIG.MODEL,
      dimensions: EMBEDDING_CONFIG.DIMENSIONS,
    };
  }
}
