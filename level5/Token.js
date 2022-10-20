const {ethers} = require("ethers");
require('dotenv').config();

const Goerli_URL = process.env.Goerli_URL
const Private_KEY = process.env.Private_KEY
async function token() {
    //生成goerli的provider
    console.log("Goerli_URL===" + Goerli_URL);
    const provider = new ethers.providers.StaticJsonRpcProvider(Goerli_URL);

    //校验网络是不是goerli
    const network = await provider.getNetwork();
    console.log("network===" + network.name);

    //合约地址
    const contract_address = process.env.ADDRESS;
    console.log("合约地址", contract_address);

    //abi
    const abi = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_initialSupply\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x70a08231\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true,\"signature\":\"0x18160ddd\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\",\"signature\":\"0xa9059cbb\"}]";
    //创建钱包对象
    const wallet = new ethers.Wallet(Private_KEY, provider);
    //创建合约对象
    const contract = new ethers.Contract(contract_address, abi, wallet);

    //查看合约的总供应量
    const totalSupply = await contract.totalSupply();
    console.log("总供应量", totalSupply.toNumber());

    //查看钱包地址余额
    const balance = await contract.balanceOf("0x37955cd11cc0f3C991A86979D1bBa9c25B01372F");
    console.log("钱包余额", balance.toNumber());

    //给自己转账22个Token
    const isSuccess = await contract.transfer("0x37955cd11cc0f3C991A86979D1bBa9c25B01372F", 2);
    await isSuccess.wait();
    console.log(isSuccess);

    //查看钱包地址余额
    const newBalance = await contract.balanceOf("0x37955cd11cc0f3C991A86979D1bBa9c25B01372F");
    console.log("钱包余额", newBalance.toNumber());
}
token();



