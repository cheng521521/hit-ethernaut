const {ethers} = require("ethers");
require('dotenv').config();

const Goerli_URL = process.env.Goerli_URL
const Private_KEY = process.env.Private_KEY

async function CoinFlip() {
    //生成goerli的provider
    console.log("Goerli_URL===" + Goerli_URL);
    const provider = new ethers.providers.StaticJsonRpcProvider(Goerli_URL);

    //校验网络是不是goerli
    const network = await provider.getNetwork();
    console.log("network===" + network.name);

    //fallback合约的abi地址
    const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"consecutiveWins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xe6f334d7"},{"inputs":[{"internalType":"bool","name":"_guess","type":"bool"}],"name":"flip","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function","signature":"0x1d263f67"}]';

    //合约地址
    const contract_address = process.env.CoinFlip_ADDRESS;

    //创建钱包对象
    const wallet = new ethers.Wallet(Private_KEY, provider);
    //创建合约对象
    const contract = new ethers.Contract(contract_address, abi, wallet);

    //查看合约的owner
    const consecutiveWins = await contract.consecutiveWins();
    var wins = consecutiveWins.toNumber();
    console.log("consecutiveWins==" + wins);

    const tx = {gasPrice: 1500000000, gasLimit: 210000000}

    if (wins < 11) {
        while (true) {
            console.log("当前猜对次数===", wins)

            if (wins == 11) {
                break;
            }
            try {
                //循环调用flip(),直到consecutiveWins = 11 跳出循环
                const receipt = await contract.flip(true);
                await receipt.wait().then(res => {
                    //console.log(res)
                    console.log("区块高度", res.blockNumber)
                })
            } catch (e) {
                console.log("交易失败了===", e.reason);
            }
            const foo = await contract.consecutiveWins();
            wins = foo.toNumber();
        }
    }
    console.log("恭喜你已经全部猜对10次！！！！！")
}

CoinFlip();
