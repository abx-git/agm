#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAgmTools } from './mcp/tools.js';

const server = new McpServer({
  name: 'agm',
  version: '0.1.0',
});

registerAgmTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
