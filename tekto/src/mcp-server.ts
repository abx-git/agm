#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTektoTools } from './mcp/tools.js';

const server = new McpServer({
  name: 'tekto',
  version: '1.0.0',
});

registerTektoTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);