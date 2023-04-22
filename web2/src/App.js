
import { useState, useEffect } from "react";
import restaurant from "./images/restaurant.png";
import gasStation from "./images/gasoline-pump.png";
import GasStationPage from "./GasStation";

function WalletButton(props) {
  const [isMetamaskInstalled, setMetamaskInstalled] = useState(true);
  const [isConnected, setConnected] = useState(false);
  const [isLogged, setLogged] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const connectWalletAccount = async () => {
    // to detect whether the wallet is installed
    if (isConnected === false) {
      // if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        setConnected(true);
        setLogged(true);
      // }
    }
    console.log(isLogged);
  };
  const showAccount = () => {
    const prefix = accounts[0].substr(0, 5);
    const suffix = accounts[0].substr(36, 40);
    return prefix + "..." + suffix;
  };
  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setMetamaskInstalled(false);
    }
  }, []);
  return (
    <div
      className="basis-5/12 w-2/5 ml-auto text-center flex flex-col justify-center rounded-2xl border-2 border-yellow-200 hover:border-yellow-300 active:border-yellow-400 shadow-lg cursor-pointer"
      onClick={connectWalletAccount}
    >
      <div>
        {isMetamaskInstalled
          ? isLogged
            ? showAccount()
            : "Log In"
          : "Please Install MetaMask"}
      </div>
    </div>
  );
}
function Header(props) {
  return (
    <div className="w-full h-36 flex flex-row border-b-2 border-yellow-400">
      <div className="basis-7/12  flex flex-col justify-center">
        <div className="font-mono text-4xl pl-10">Banana</div>
      </div>
      <div className="basis-5/12 flex flex-col justify-center pr-5">
        <WalletButton />
      </div>
    </div>
  );
}
function Item(props) {
  const { item, index, setPageName } = props;
  function handleItemClick() {
    console.log(item.name);
    setPageName(item.name);
  }
  return (
    <div
      className="flex flex-col border-2 border-yellow-300 shadow-lg cursor-pointer hover:shadow-xl active:shadow-2xl w-56 h-56 mx-8 my-8 rounded-3xl font-mono p-4"
      onClick={handleItemClick}
    >
      
      <div className="basis-1/2 w-full border-b-2 border-yellow-300 mt-5 flex flex-row">
        <img src={item.photo} className = "h-12 ml-1" />
        <div className = "h-12 w-full text-center flex flex-col justify-center">
          <div className = "">
            {item.name}
          </div>
        </div>
        
      </div>
      <div className="text-sm basis-3/5 mt-5">{item.description}</div>
    </div>
  );
}

function Content(props) {
  const [pageName, setPageName] = useState("original");
  const [items, setItems] = useState([
    {
      name: "Gas Station",
      description: "Get your oil tank full by seamless experience with web3",
      photo: gasStation,
    },
    {
      name: "Restaurant",
      description: "Get your belly full by seamless experience with web3",
      photo: restaurant,
    },
  ]);
  const [pages, setPages] = useState({
    "Gas Station": <GasStationPage setPageName={setPageName} />,
  });
  return (
    <div className="w-full h-full overflow-y-auto flex flex-row">
      {pageName == "original"
        ? items.map((item, key) => {
            return <Item item={item} index={key} setPageName={setPageName} />;
          })
        : pages[pageName]}
    </div>
  );
}
function App() {
  return (
    <div className="w-full h-screen container mx-auto">
      <div className="flex flex-col h-screen">
        <Header />
        <Content />
      </div>
    </div>
  );
}

export default App;
