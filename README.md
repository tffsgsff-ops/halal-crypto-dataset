# Halal Crypto Screener — Model Context Protocol (MCP) Server

[![MCP Server](https://img.shields.io/badge/MCP-Model_Context_Protocol-6366f1.svg)](https://modelcontextprotocol.io)
[![Smithery](https://img.shields.io/badge/Smithery-Certified-emerald.svg)](https://smithery.ai/servers/tffsgsff/halal-crypto)
[![Glama](https://img.shields.io/badge/Glama-Compatible-blue.svg)](https://glama.ai)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23021995.svg)](https://doi.org/10.5281/zenodo.23021995)
[![Standard: AAOIFI No. 21 & 30](https://img.shields.io/badge/Standards-AAOIFI_No._21_%26_30-gold.svg)](https://aaoifi.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Official **Model Context Protocol (MCP)** server for [Halal Crypto Index](https://halalcryptoindex.com). Built with the official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk), this server enables AI assistants (**Claude Desktop, Cursor, Windsurf, ChatGPT, Perplexity**) to perform real-time, forensic Islamic finance compliance checks across **820+ cryptocurrencies** under **AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)** Standards.

---

## ⚡ Quickstart

### 1. Claude Desktop Integration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "halal-crypto": {
      "command": "npx",
      "args": [
        "-y",
        "halal-crypto-mcp"
      ]
    }
  }
}
```

Config file locations:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

### 2. Cursor / Windsurf IDE Integration

In your Cursor or Windsurf MCP Settings (`Settings -> Features -> MCP`):
- **Name:** `halal-crypto`
- **Type:** `command`
- **Command:** `npx -y halal-crypto-mcp`

### 3. Smithery CLI

Install directly using Smithery:
```bash
npx -y @smithery/cli install halal-crypto-mcp --client claude
```

### 4. Remote HTTP / SSE Cloudflare Worker Endpoint

For cloud-based AI agents, a hosted HTTP JSON-RPC 2.0 / SSE endpoint is live at:
```
POST https://halalcryptoindex.com/mcp
Content-Type: application/json
```

---

## 🛠 Available MCP Tools

### `check_shariah_compliance`
Evaluates any cryptocurrency by ticker ($BTC, $SOL, $KAS, $AAVE, $USDE) or name for Halal/Haram classification under AAOIFI standards.

**Input Schema:**
```json
{
  "ticker_or_name": "KAS"
}
```

**Example Response:**
```json
{
  "found": true,
  "name": "Kaspa",
  "ticker": "KAS",
  "status": "HALAL",
  "isHalal": true,
  "category": "Layer-1 BlockDAG PoW",
  "standard": "AAOIFI Shariah Standard No. 59 & No. 21",
  "doi": "10.5281/zenodo.23021995",
  "justification": "Pure Proof-of-Work blockDAG currency serving purely as a decentralized medium of exchange and computational store of value with zero pre-mine, no lending yield, and zero Riba mechanics.",
  "auditUrl": "https://halalcryptoindex.com/coin/kas/"
}
```

### `get_halal_index_summary`
Returns institutional statistics of the HALAL500 index, including total audited assets, compliant vs non-compliant distribution, and AAOIFI methodology specifications.

### `list_halal_coins`
Returns compliant Halal assets filtered by optional category (e.g. `Layer 1`, `Store of Value`, `Infrastructure`) with pagination limits.

---

## 📚 Available MCP Resources

- `halal://methodology` — Official text of the AAOIFI-compliant digital asset classification framework (*Mal Mutaqawwim*, Riba elimination, Gharar elimination, Qabd Hukmi).
- `halal://assets` — Complete machine-readable JSON dataset containing all 820+ audited digital assets with their full Shariah justifications.

---

## 💬 Available MCP Prompts

- `audit_crypto_portfolio` — Guided portfolio auditing prompt. The AI model systematically queries `check_shariah_compliance` for every asset in a user's holdings and outputs a structured Shariah compliance report.

---

## 🏛 AAOIFI Shariah Governance

Every asset in the Halal Crypto Index is evaluated against a 4-tier institutional framework:
1. **Mal Mutaqawwim (Lawful Property):** The asset must possess legitimate economic utility (*Manfa'ah*) recognized by custom (*Urf*). Pure gambling, scam, or utility-less tokens are disqualified.
2. **Elimination of Riba (Zero Interest):** Synthetic debt, algorithmic lending pools, and fractional-reserve tokens are strictly classified as **Haram**.
3. **Elimination of Gharar (Zero Excessive Ambiguity):** Transparent, deterministic tokenomics without predatory developer minting or exit traps.
4. **Constructive Possession (Qabd Hukmi):** Validated spot ownership. High-leverage futures, CFDs, and options are excluded.

---

## 📖 Citation & Academic Research

```bibtex
@dataset{halal_crypto_mcp_2026,
  author       = {{Halal Crypto Index Research Group}},
  title        = {Halal Crypto Screener MCP Server & Institutional AAOIFI Dataset},
  year         = 2026,
  publisher    = {Zenodo / GitHub / Model Context Protocol},
  doi          = {10.5281/zenodo.23021995},
  url          = {https://halalcryptoindex.com}
}
```

---

## ⚖️ License

Distributed under the **MIT License**. Maintained by the research board at [halalcryptoindex.com](https://halalcryptoindex.com).
