import { applyDecorators, Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { PluginGuard, PLUGIN_ID_KEY } from '../guards/plugin.guard';

export function PluginController(pluginId: string, path?: string): ClassDecorator {
  const controllerPath = path
    ? `api/v1/plugins/${pluginId}/${path}`
    : `api/v1/plugins/${pluginId}`;

  return applyDecorators(
    Controller(controllerPath),
    SetMetadata(PLUGIN_ID_KEY, pluginId),
    UseGuards(PluginGuard),
  );
}
