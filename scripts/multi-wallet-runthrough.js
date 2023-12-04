const {ethers} = require("hardhat");

async function main(){

    const [owner, auth1, auth2, receiver] = await ethers.getSigners();
    console.log("Owner: " + owner.address);
    console.log("Auth1: " + auth1.address);
    console.log("Auth2: " + auth2.address);
    console.log("Receiver: " + receiver.address);
    console.log();

    const ACFactory = await ethers.getContractFactory('AC', owner);
    const AC = await ACFactory.deploy();
    const ACTokenAddress = await AC.getAddress();
    console.log("AC Token Address: ", ACTokenAddress);

    const WalletFactory = await ethers.getContractFactory('MultiSmartWallet', owner);
    const Wallet = await WalletFactory.deploy();
    const WalletAddress = await Wallet.getAddress();
    console.log("Wallet Address: ", WalletAddress);  
    console.log("Wallet Owner: ", await Wallet.owner());
    console.log();                                                                                                                                                                                                           

    await AC.connect(owner).mint(
        owner.address,
        ethers.parseEther('1000')
    );

    console.log("Minted 1000 $AC to owner . . .");
    console.log("Owner's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(owner.address)));
    console.log();
    
    await AC.connect(owner).transfer(
        WalletAddress,
        ethers.parseEther('500')
    );
    console.log("Transferred 500 $AC to smart wallet . . .")
    console.log("Wallet getTokenBalance: ", await Wallet.getTokenBalance(ACTokenAddress));
    console.log("Owner's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(owner.address)));
    console.log("Wallet's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(WalletAddress)));
    console.log();

    await Wallet.transferERC20(ACTokenAddress, ethers.parseEther('50'), receiver.address);
    console.log("Transferred 50 $AC . . .");
    console.log("Receiver's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(receiver.address)));
    console.log("Wallet's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(WalletAddress)));
    console.log();

    await owner.sendTransaction({
        to: WalletAddress,
        value: ethers.parseEther("10")
    });
    console.log("Sent 10 ETH from Owner to Smart Wallet . . .");
    console.log("Smart Wallet ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("Owner's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(owner.address)));
    console.log();

    await Wallet.transferETH(ethers.parseEther('1'), receiver.address);
    console.log("Transferred 1 $ETH . . .");
    console.log("Smart Wallet ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("Receiver's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(receiver.address)));
    console.log();

    try{
        await Wallet.connect(auth1).transferERC20(ACTokenAddress, ethers.parseEther('50'), receiver.address);
    }
    catch(e){
        console.log("Executed unauthorized transfer of wallet from auth1: ", e.message);
    }
    console.log();

    await Wallet.addAuthorized(auth1.address);
    await Wallet.addAuthorized(auth2.address);
    console.log("Added auth1 and auth2 as authorized . . .");
    console.log();

    await Wallet.connect(auth1).transferERC20(ACTokenAddress, ethers.parseEther('50'), receiver.address);
    console.log("Executed authorized ERC20 transfer of wallet from auth1 to receiver . . .");
    console.log("Transferred 50 $AC . . .");
    console.log("Receiver's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(receiver.address)));
    console.log("Wallet's AC Token Balance: ", ethers.formatEther(await AC.balanceOf(WalletAddress)));
    console.log();

    await Wallet.connect(auth2).transferETH(ethers.parseEther('3'), auth2.address);
    console.log("Executed authorized ETH transfer of wallet from auth2 to auth2. . .");
    console.log("Transferred 3 $ETH . . .");
    console.log("Smart Wallet ETH Balance: ", ethers.formatEther(await Wallet.getETHBalance()));
    console.log("Auth2's ETH Balance: ", ethers.formatEther(await ethers.provider.getBalance(auth2.address)));
    console.log();

    await Wallet.removeAuthorized(auth2.address);
    console.log("Remove authorization from auth2");
    try{
        await Wallet.connect(auth2).transferERC20(ACTokenAddress, ethers.parseEther('50'), receiver.address);
    }
    catch(e){
        console.log("Executed unauthorized transfer of wallet from auth2: ", e.message);
    }
    console.log();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });