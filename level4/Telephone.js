const {ethers} = require("ethers");
require('dotenv').config();

const Goerli_URL = process.env.Goerli_URL
const Private_KEY = process.env.Private_KEY

async function telephone(){

    //注意这里的bytecode只是bytecode中的object的value值
    const bytecode = "608060405234801561001057600080fd5b506102ef806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063f00d4b5d1461003b578063fa54416114610057575b600080fd5b61005560048036038101906100509190610201565b610087565b005b610071600480360381019061006c91906101a7565b6100f6565b60405161007e9190610250565b60405180910390f35b8173ffffffffffffffffffffffffffffffffffffffff1663a6f9dae1826040518263ffffffff1660e01b81526004016100c09190610250565b600060405180830381600087803b1580156100da57600080fd5b505af11580156100ee573d6000803e3d6000fd5b505050505050565b60008173ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561013e57600080fd5b505afa158015610152573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061017691906101d4565b9050919050565b60008135905061018c816102a2565b92915050565b6000815190506101a1816102a2565b92915050565b6000602082840312156101bd576101bc61029d565b5b60006101cb8482850161017d565b91505092915050565b6000602082840312156101ea576101e961029d565b5b60006101f884828501610192565b91505092915050565b600080604083850312156102185761021761029d565b5b60006102268582860161017d565b92505060206102378582860161017d565b9150509250929050565b61024a8161026b565b82525050565b60006020820190506102656000830184610241565b92915050565b60006102768261027d565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b6102ab8161026b565b81146102b657600080fd5b5056fea2646970667358221220f60e704f2d1af978c196c0d9b84563b6164a516d2350b228d4852259d6fe958c64736f6c63430008070033";
    const abiPeople = "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_TelephoneAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"changeOwner\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_TelephoneAddress\",\"type\":\"address\"}],\"name\":\"getOwner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]";
    //生成goerli的provider
    console.log("Goerli_URL===" + Goerli_URL);
    const provider = new ethers.providers.StaticJsonRpcProvider(Goerli_URL);

    //校验网络是不是goerli
    const network = await provider.getNetwork();
    console.log("network===" + network.name);

    //fallback合约的abi地址
    const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xa6f9dae1"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x8da5cb5b"}]';

    //合约地址
    const contract_address = process.env.ADDRESS;

    //创建钱包对象
    const wallet = new ethers.Wallet(Private_KEY, provider);
    //创建合约对象
    const contract = new ethers.Contract(contract_address, abi, wallet);

    //查看合约的owner
    const owner = await contract.owner();
    console.log("当前合约的owner是===", owner);

    //部署People合约
    const factoryPeople = new ethers.ContractFactory(abiPeople, bytecode, wallet);
    console.log("开始部署People合约");
    const People = await factoryPeople.deploy();
    console.log("部署合约的交易详情")
    console.log(People.deployTransaction)
    console.log("合约地址",People.address);
    console.log("等待合约部署上链");
    await People.deployed();
    console.log("合约已经上链");
    //执行people中的changeOwner函数
    const reponse = await People.changeOwner("0x24fa185662fC3f2Bc6e74e6899be07CC7BA952fB", "0x37955cd11cc0f3C991A86979D1bBa9c25B01372F");
    await  reponse.wait();

    //再次查看合约的owner()
    const newOwner = await contract.owner();
    console.log("当前合约的owner是===", newOwner);
}
telephone();