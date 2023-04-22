import Fun from "./Fun.json";
import Web3 from "web3";
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

export { interactWithFun };
