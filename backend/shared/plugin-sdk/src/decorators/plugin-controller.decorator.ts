import { applyDecorators, Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { PluginGuard, PLUGIN_ID_KEY } from '../guards/plugin.guard';

export function PluginController(pluginId: string, path?: string): ClassDecorator {
  // NestJS setGlobalPrefix('api/v1') in main.ts prepends the prefix automatically.
  // Do NOT include 'api/v1' here or the route registers at /api/v1/api/v1/plugins/...
  const controllerPath = path
    ? `plugins/${pluginId}/${path}`
    : `plugins/${pluginId}`;

  return applyDecorators(
    Controller(controllerPath),
    SetMetadata(PLUGIN_ID_KEY, pluginId),
    UseGuards(PluginGuard),
  );
}
