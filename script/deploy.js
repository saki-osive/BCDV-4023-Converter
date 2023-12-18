const { utils } = require('ethers');

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory('Convertor');

    const contract = await contractFactory.deploy();

    await contract.deployed();

    console.log('Contract deployed to address:', contract.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });