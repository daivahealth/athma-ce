import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { EmbeddingService } from './services/embedding.service';
import { EmbeddingSyncService } from './services/embedding-sync.service';
import { ReindexService } from './services/reindex.service';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    EmbeddingService,
    EmbeddingSyncService,
    ReindexService,
  ],
  exports: [EmbeddingService, EmbeddingSyncService],
})
export class SemanticSearchModule {}
