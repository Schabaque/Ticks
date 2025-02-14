require("dotenv").config();
const { ethers } = require("ethers");
const Abi = require("./abi.json");
const { manta } = require("viem/chains");

// RPC URLs for different networks
const RPC_URLS = {
  manta: "https://pacific-rpc.manta.network/http",
  base: "https://mainnet.base.org",
  degen: "https://rpc.degen.tips"
};
const Stratergy_Address = {
  manta: "0x4778CAAa0E52F0B58eAF5e947Ae81A0a10cDe707",
  base: "0x6c6775C38974eB57d06E710020fFF78512BcBfB6",
  degen: "0xBC91a7a0eE37085af193C61747ecE693979Ec0C1"
}

;
const POOL_ADDRESSES = {
  manta: "0xD7f09148Eb22686Cb5Dcbdd0cF27D04123d14c74",
  base: "0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA",
  degen: "0x342B19546cD25716E9D709DF87049ea5885d298F"
};

// Uniswap V3 Pool ABI (tickSpacing and slot0)
const POOL_ABI = [
  "function tickSpacing() external view returns (int24)",
  "function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)"
];

async function getTickInfo(network) {
  const rpcUrl = RPC_URLS[network];
  const poolAddress = POOL_ADDRESSES[network];

  if (!rpcUrl || !poolAddress) {
    console.error(`Invalid network: ${network}`);
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const strategyContract = new ethers.Contract(Stratergy_Address[network], Abi, provider); 

  try {
    const tickSpacing = await poolContract.tickSpacing();
    const slot0 = await poolContract.slot0();
    const currentTick = slot0[1];

    const lowerTick = await strategyContract.tickLower();
    const upperTick = await strategyContract.tickUpper();

    console.log(`\n Network: ${network}`);
    console.log(` Pool Address: ${poolAddress}`);
    console.log(` Stratergy Address: ${Stratergy_Address[network]}`);
    console.log(` Tick Spacing: ${tickSpacing}`);
    console.log(` Current Tick: ${currentTick}`);
    console.log(` Lower Tick: ${lowerTick}`);
    console.log(` Upper Tick: ${upperTick}`);
  } catch (error) {
    console.error(` Error fetching data for ${network}:`, error);
  }
  
}

// Loop through all networks
async function fetchAllTickInfo() {
  for (const network of Object.keys(RPC_URLS)) {
    await getTickInfo(network);
  }
}

// Run the function
fetchAllTickInfo();
