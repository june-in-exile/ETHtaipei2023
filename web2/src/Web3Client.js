import Fun from "./Fun.json";
import DriverPayment from "./DriverPayment.json"
import Web3 from "web3";
import ContractConfig from "./ContractConfig.json"

const web3 = new Web3(window.ethereum);
const connectMetamask = async () => {
  try {
    // Request accounts from Metamask
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Return the first account
    return accounts[0];
  } catch (error) {
    console.error(error);
  }
};

// Interact with smart contract
const interactWithFun = async () => {
  try {
    // Connect to Metamask
    const account = await connectMetamask();

    // Create an instance of the smart contract
    const contractAddress = "0x0A5A3C79E81E575d3937Bea95987C38e9F35bf59";
    console.log(contractAddress);
    const contractInstance = new web3.eth.Contract(Fun.abi, contractAddress);
    contractInstance.options.address = contractAddress;
    const result = await contractInstance.methods
      .forFun()
      .send({ from: account });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
const deposit = async (tokenAddress, amount) => {
  try {
    const account = await connectMetamask();
    const depositContractAddress = ContractConfig.DriverPaymentAddress;
    const contractInstance = new web3.eth.Contract(DriverPayment.abi, depositContractAddress);
    contractInstance.options.address = depositContractAddress
    const result = await contractInstance.methods
        .deposit(amount, tokenAddress)
        .send({from: account, value: web3.utils.toWei(amount, 'ether')});
    console.log(result)
    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenAddress: tokenAddress,
          amount: amount,
          userAddress: account.address
        })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
  } catch (err) {
    console.error(err)
  }
}
export { interactWithFun };
