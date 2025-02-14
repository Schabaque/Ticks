require("dotenv").config();
const { ethers } = require("ethers");
const Abi = require("./abi.json");

const RPC_URLS = {
  manta: "https://pacific-rpc.manta.network/http",
  base: "https://mainnet.base.org",
  degen: "https://rpc.degen.tips"
};

const Strategy_Addresses = {
  manta: "0x4778CAAa0E52F0B58eAF5e947Ae81A0a10cDe707",
  base: "0x6c6775C38974eB57d06E710020fFF78512BcBfB6",
  degen: "0xBC91a7a0eE37085af193C61747ecE693979Ec0C1"
};
const Pool_Addresses = {
  manta: "0xD7f09148Eb22686Cb5Dcbdd0cF27D04123d14c74",
  base: "0xc9034c3E7F58003E6ae0C8438e7c8f4598d5ACAA",
  degen: "0x342B19546cD25716E9D709DF87049ea5885d298F"
};

const PRIVATE_KEY = "abc"; 



const POOL_ABI = [
  "function tickSpacing() external view returns (int24)",
  "function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)"
];

async function getTickInfo(network) {
  const rpcUrl = RPC_URLS[network];
  const poolAddress = Pool_Addresses[network];
  const strategyAddress = Strategy_Addresses[network];

  if (!rpcUrl || !poolAddress || !strategyAddress) {
    console.error(`Invalid network: ${network}`);
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);//provider allow karta hai wallet ko connect hone ke liye
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const strategyContract = new ethers.Contract(strategyAddress, Abi, wallet); //This contract instance uses wallet, meaning it's ready to sign transactions (not just read data).
  {/*provider → Reads blockchain data.
wallet → Signs & sends transactions.*/}

  try {
    const tickSpacing = await poolContract.tickSpacing();
    const slot0 = await poolContract.slot0();
    const currentTick = slot0[1];

    const lowerTick = await strategyContract.tickLower();
    const upperTick = await strategyContract.tickUpper();

  
    const newLowerTick = xyz;
    const newUpperTick = abcd;

   

    await updateTickRange(strategyContract, newLowerTick, newUpperTick);
  } catch (error) {
    console.error(` Error fetching data for ${network}:`, error);
  }
}


async function updateTickRange(strategyContract, newLowerTick, newUpperTick) {
  try {
    console.log(` Sending transaction to update tick range...`);

    const tx = await strategyContract.changeRange(newLowerTick, newUpperTick);
    await tx.wait();

    console.log(" Tick range updated successfully!");
  } catch (error) {
    console.error("Error updating tick range:", error);
  }
}




fetchAndUpdateAllTickInfo();
