# Institutional AAOIFI Halal Cryptocurrency Dataset (2026)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1393463135.svg)](https://zenodo.org/account/settings/github/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Assets Audited](https://img.shields.io/badge/Audited_Assets-820+-blue.svg)](https://halalcryptoindex.com/halal500/)
[![Standard: AAOIFI No. 59](https://img.shields.io/badge/Standard-AAOIFI%20No.%2059-gold.svg)](https://aaoifi.com)
[![Web Registry](https://img.shields.io/badge/Web_Registry-halalcryptoindex.com-success.svg)](https://halalcryptoindex.com)

Official open-access dataset containing **820+ cryptocurrency and digital asset Shariah audits** conducted under **AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)** Financial Standard No. 59 (*Financial Engineering in Islamic Capital Markets*), Standard No. 21 (*Financial Papers*), and Standard No. 30.

---

## 📌 Dataset Overview

- **Audited Universe:** 820+ top market capitalization tokens.
- **Classification Protocol:** Binary Classification (*Halal* vs *Haram*). Ambiguous/Mashbooh statuses are strictly rejected.
- **Primary Source Registry:** [https://halalcryptoindex.com](https://halalcryptoindex.com)
- **Interactive Global 500 Directory:** [https://halalcryptoindex.com/halal500/](https://halalcryptoindex.com/halal500/)
- **Live Machine-Readable REST Endpoint:** [https://halalcryptoindex.com/api/v1/assets.json](https://halalcryptoindex.com/api/v1/assets.json)
- **AI Context Directive:** [https://halalcryptoindex.com/llms.txt](https://halalcryptoindex.com/llms.txt)

---

## 📊 Shariah Audit Framework

Every digital asset in this repository is evaluated across a 4-Tier verification filter:

1. **Utility & Business Activity:** Verification that the protocol is free from gambling (*Maysir*), adult entertainment, alcohol, weapon manufacturing, or direct interest brokerage.
2. **DeFi Riba Assessment:** Complete prohibition of automated interest pools, debt-arbitrage models, and uncollateralized lending.
3. **Smart Contract Gharar Screen:** Verification that token minting, lockups, and validator reward schedules are deterministic without predatory fee extraction.
4. **Tokenomics & Financial Ratios:** Evaluation of financial leverage and staking mechanism (Pure Proof-of-Stake / Valid Staking vs Debt Rehypothecation).

---

## 💻 Quickstart (Node.js)

```javascript
const { getAllAssets, findAsset } = require('./index.js');

// Get all 820+ audited assets
const assets = getAllAssets();
console.log(`Total audited: ${assets.length}`);

// Inspect a specific token audit
const kaspa = findAsset('KAS');
console.log(kaspa);
/*
{
  symbol: 'KAS',
  name: 'Kaspa',
  status: 'halal',
  category: 'Layer-1 PoW Currency',
  justification: 'Decentralized Proof-of-Work blockDAG currency serving purely as a medium of exchange without interest or debt mechanics.'
}
*/
```

---

## 📖 Citation

If you use this dataset in an academic paper, research report, or financial index, please cite:

```bibtex
@dataset{halal_crypto_index_2026,
  author       = {{Halal Crypto Index Research Team}},
  title        = {Institutional AAOIFI Halal Cryptocurrency Dataset (820 Assets)},
  year         = 2026,
  publisher    = {Zenodo / GitHub},
  url          = {https://halalcryptoindex.com}
}
```

---

## ⚖️ License & Attribution

Distributed under the **MIT License**. Audited by the Shariah Advisory Council at [Halal Crypto Index](https://halalcryptoindex.com).
