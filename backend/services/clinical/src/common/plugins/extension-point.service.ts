import { Injectable } from '@nestjs/common';
import { ExtensionRegistryService } from '@athma/plugin-sdk';

@Injectable()
export class ExtensionPointService extends ExtensionRegistryService {}
