/**
 * Halal Crypto Index 2026 Official Dataset Accessor
 */
const dataset = require('./data/halal-crypto-2026.json');

function getAllAssets() {
  return dataset.assets;
}

function findAsset(symbol) {
  return dataset.assets.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
}

module.exports = {
  version: dataset.version,
  standard: dataset.standard,
  totalAssets: dataset.total_assets,
  getAllAssets,
  findAsset
};
