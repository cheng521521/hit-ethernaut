![](./Level_Success.png)
# 执行Level_Fallback.js
先进入leve1目录
```shell
cd ./level1
node Level_Fallback.js
```

# 通关条件
* 提取走合约里面的所有余额

# 解题思路

观察合约发现，只有一个方法可以让我们提取走合约的所有余额，那就下面这个方法
```shell
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
```
但是这个方法的唯一条件就是我们必须是fallback合约的`owner`才可以调用这个函数。那我们接下来的思考
如何才能变成合约的`owner`。

那么将`msg.sender`变成`owner`的地方有两处。\

* contribute函数
* receive函数

`contribute函数`
```shell
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```
这个函数允许`msg.sender`向他发送小于0.001 ether。如果发送者的贡献程度大于`owner`，那么发送者将
成为新的`owner`。不过问题是当前`owner`的贡献数是`1000 ETH`.这个是在合约创建之初构造函数里面设置
好的。因此我们得看看`receive函数`。\

`receive函数`
```shell
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```
在`receive函数`中，只有当与交易一起发送的wei数额>0并且我们在`contributions`` msg.sender`中的贡献>0时，`owner`就会更新`msg.sender`。
到这里估计你已经有解决方案了，让我们看看解决方案!

# 解题流程
1. 先调用contribute函数发送小于`0.001 ether`，让`msg.sender`变成`contribution`。
2. 调用`receive函数`，让`msg.sender`变成`owner`.
3. 调用`withdraw函数`，取走所有余额。
