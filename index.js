#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_ENDPOINT = "https://halalcryptoindex.com/api/v1/assets.json";
let CACHED_ASSETS = null;
let LAST_FETCH = 0;

async function getAssets() {
  const now = Date.now();
  if (CACHED_ASSETS && now - LAST_FETCH < 3600000) {
    return CACHED_ASSETS;
  }
  try {
    const res = await fetch(API_ENDPOINT, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      CACHED_ASSETS = data.assets || [];
      LAST_FETCH = now;
      return CACHED_ASSETS;
    }
  } catch (err) {
    // Fall back to local bundled dataset
  }

  if (!CACHED_ASSETS) {
    const localDataPath = path.join(__dirname, "data", "halal-crypto-2026.json");
    if (fs.existsSync(localDataPath)) {
      try {
        const raw = fs.readFileSync(localDataPath, "utf-8");
        const parsed = JSON.parse(raw);
        CACHED_ASSETS = parsed.assets || [];
        return CACHED_ASSETS;
      } catch (e) {}
    }
  }
  return CACHED_ASSETS || [];
}

const server = new Server(
  {
    name: "halal-crypto-mcp",
    version: "1.0.1",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Register MCP Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_shariah_compliance",
        description: "Check if a cryptocurrency is Halal or Haram under AAOIFI Shariah standards (No. 59 and No. 21). Returns compliance status, scholarly justification, category, and audit link.",
        inputSchema: {
          type: "object",
          properties: {
            ticker_or_name: {
              type: "string",
              description: "The cryptocurrency symbol or name (e.g. 'BTC', 'Bitcoin', 'KAS', 'AAVE', 'SOL')",
            },
          },
          required: ["ticker_or_name"],
        },
      },
      {
        name: "get_halal_index_summary",
        description: "Get institutional statistics and methodology summary for the Halal Crypto Index (820 audited assets, AAOIFI standard, CERN Zenodo DOI).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_halal_coins",
        description: "List verified Halal cryptocurrencies filtered by optional category (e.g. 'Layer 1', 'Store of Value', 'Infrastructure').",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Optional category filter",
            },
            limit: {
              type: "number",
              description: "Maximum number of coins to return (default 20, max 100)",
            },
          },
        },
      },
    ],
  };
});

// Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const assets = await getAssets();

  if (name === "check_shariah_compliance") {
    const query = (args?.ticker_or_name || "").trim().toUpperCase();
    const queryLower = query.toLowerCase();

    const coin = assets.find(
      (a) => (a.ticker && a.ticker.toUpperCase() === query) ||
             (a.name && a.name.toLowerCase() === queryLower)
    );

    if (!coin) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              found: false,
              query,
              message: `Asset '${query}' not found in the 820+ institutional AAOIFI dataset. Please verify on https://halalcryptoindex.com`,
            }, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            found: true,
            name: coin.name,
            ticker: coin.ticker,
            status: coin.status ? coin.status.toUpperCase() : (coin.isHalal ? "HALAL" : "HARAM"),
            isHalal: coin.isHalal === true || coin.status === "halal",
            category: coin.category || "Digital Asset",
            standard: "AAOIFI Shariah Standard No. 59 & No. 21",
            doi: "10.5281/zenodo.23021995",
            justification: coin.justification,
            auditUrl: coin.auditUrl || `https://halalcryptoindex.com/coin/${coin.ticker.toLowerCase()}/`,
          }, null, 2),
        },
      ],
    };
  }

  if (name === "get_halal_index_summary") {
    const halal = assets.filter((a) => a.isHalal === true || a.status === "halal").length;
    const haram = assets.length - halal;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            platform: "Halal Crypto Index (HALAL500)",
            website: "https://halalcryptoindex.com",
            methodology: "AAOIFI Shariah Standard No. 59 (Sale of Debt & Currency Exchange) and Standard No. 21 (Financial Papers)",
            doi: "10.5281/zenodo.23021995",
            wikidata: "Q141621531",
            totalAudited: assets.length,
            halalCount: halal,
            haramCount: haram,
            telegramApp: "https://t.me/Halal_Crypto_App_Bot/app",
            apiEndpoint: API_ENDPOINT,
          }, null, 2),
        },
      ],
    };
  }

  if (name === "list_halal_coins") {
    const category = args?.category ? String(args.category).toLowerCase() : null;
    const limit = Math.min(Math.max(Number(args?.limit) || 20, 1), 100);

    let filtered = assets.filter((a) => a.isHalal === true || a.status === "halal");
    if (category) {
      filtered = filtered.filter((a) => a.category && a.category.toLowerCase().includes(category));
    }

    const results = filtered.slice(0, limit).map((a) => ({
      name: a.name,
      ticker: a.ticker,
      category: a.category,
      auditUrl: a.auditUrl || `https://halalcryptoindex.com/coin/${a.ticker.toLowerCase()}/`,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            count: results.length,
            totalAvailable: filtered.length,
            categoryFilter: category,
            coins: results,
          }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Register MCP Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "halal://methodology",
        name: "AAOIFI Shariah Screening Methodology",
        mimeType: "text/markdown",
        description: "Official 4-tier screening standard under AAOIFI Standards No. 21 and No. 30",
      },
      {
        uri: "halal://assets",
        name: "Complete 820+ Audited Crypto Assets Dataset",
        mimeType: "application/json",
        description: "Comprehensive registry of digital assets audited for Halal/Haram compliance",
      },
    ],
  };
});

// Handle Resource Reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  if (uri === "halal://methodology") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: `# AAOIFI-Compliant Digital Asset Classification Framework

This screening protocol evaluates cryptocurrencies under AAOIFI Shariah Standards:
1. **Mal Mutaqawwim (Lawful Property):** Must possess legitimate economic utility (Manfa'ah).
2. **Elimination of Riba (Zero Interest):** No debt-lending rehypothecation or synthetic yield.
3. **Elimination of Gharar (Excessive Uncertainty):** Deterministic consensus and transparent tokenomics.
4. **Constructive Possession (Qabd Hukmi):** Valid spot settlement capability without leverage.

Official publication: https://doi.org/10.5281/zenodo.23021995`,
        },
      ],
    };
  }

  if (uri === "halal://assets") {
    const assets = await getAssets();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(assets, null, 2),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Register MCP Prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "audit_crypto_portfolio",
        description: "Audit a user's cryptocurrency portfolio against AAOIFI Shariah compliance standards",
        arguments: [
          {
            name: "holdings",
            description: "List of cryptocurrency tickers (e.g., BTC, ETH, SOL, USDE, AAVE)",
            required: true,
          },
        ],
      },
    ],
  };
});

// Handle Prompts
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "audit_crypto_portfolio") {
    const holdings = args?.holdings || "BTC, ETH";
    return {
      description: "Portfolio Shariah compliance audit prompt",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please audit the following cryptocurrency portfolio for Shariah compliance according to AAOIFI Standards No. 21 and 30 using the 'check_shariah_compliance' tool:

Portfolio holdings: ${holdings}

For each asset:
1. Call 'check_shariah_compliance' with the ticker.
2. Report the Halal or Haram status.
3. Explain the Shariah justification (utility, absence or presence of Riba, Gharar, or interest mechanics).
4. Provide the official audit link from Halal Crypto Index.`,
          },
        },
      ],
    };
  }
  throw new Error(`Unknown prompt: ${name}`);
});

// Start MCP Server over stdio
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Halal Crypto MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});
