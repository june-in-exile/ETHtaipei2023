import { useState, useEffect } from "react";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { interactWithFun } from "./Web3Client";
function TokenSelectDropDown(props){
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['DAI', 'USDT', 'USDC', 'WBTC'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative mt-2">
      <button
        type="button"
        className="inline-flex justify-between items-center w-5/6 h-8 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-lg" //focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : 'Select Token'}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul
            className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            tabIndex="-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option) => (
              <li
                key={option}
                className="text-gray-900 cursor-pointer hover:bg-gray-100 block px-4 py-2 text-sm"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


function TokenTable (props) {
  const {tokens} = props
  return (
    <div className="flex flex-col w-1/2 mx-auto mt-4 shadow-lg">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-yellow-300 sm:rounded-lg">
            <table className="min-w-full divide-y divide-yellow-300">
              <thead className="bg-yellow-300">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Token
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Token Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-300">
                {tokens.map((option) => (
                  <tr key={option.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{option.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{option.amount}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

class ButtonProp {
  constructor(name, content) {
    this.name = name;
    this.insideContent = content;
  }
}
function PageButton(props) {
  const { item, index, selectHandler, selected } = props;
  function onClickHandler() {
    selectHandler(index);
  }
  return (
    <div
      className={`bg-white w-full h-12 font-mono border-r-2 ${
        selected ? "border-yellow-500" : "border-transparent"
      }`}
    >
      <div
        className="w-7/12 h-full mx-auto mt-5 text-center flex flex-col justify-center rounded-lg border-2 border-yellow-200 shadow-lg hover:bg-yellow-100 active:bg-yellow-300"
        onClick={onClickHandler}
      >
        <div>{item.name}</div>
      </div>
    </div>
  );
}
function GasStationPage(props) {
  const setPageName = props.setPageName;
  const [sidebarButtonProps, setSidebarButtonProps] = useState([
    new ButtonProp("Info", <GasStationInfo />),
    new ButtonProp("Interact", <GasStationInteract />),
    new ButtonProp("Settings", <GasStationSettings />),
    new ButtonProp("Home", <GasStationInfo />),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (selectedIndex == 3) {
      setPageName("original");
    }
  });
  return (
    <div className="w-full h-full flex flex-row">
      <aside className="basis-1/6 pt-6 border-r-2 border-gray-200">
        {sidebarButtonProps.map((item, index) => {
          return (
            <PageButton
              item={item}
              index={index}
              selectHandler={setSelectedIndex}
              selected={selectedIndex == index}
            />
          );
        })}
      </aside>
      <main className="basis-5/6 font-mono">
        {sidebarButtonProps[selectedIndex].insideContent}
      </main>
    </div>
  );
}
function GasStationInfo(props) {
  return (
    <div className="w-full h-full p-16">
      Introducing This Gas Station Page: A Web3-powered Platform for Hassle-free
      Gas Payment. <br />
      <br />
      This Gas Station Page is a decentralized platform that simplifies gas
      payment for vehicle owners. With the power of Web3 technology, This Gas
      Station Page enables vehicle owners to register their license plate number
      and wallet address on the blockchain. This allows for seamless gas
      payments using any supported cryptocurrency or stablecoin. <br />
      <br />
      This Gas Station Page offers a range of features that make gas payment
      easy and convenient. Vehicle owners can register their license plate
      number and wallet address on the platform, making it easy to manage their
      gas payments. They can also update their registration information to avoid
      any errors. Additionally, This Gas Station Page allows for quick and easy
      deposits of any supported cryptocurrency or stablecoin into the platform.{" "}
      <br />
      <br />
      For gas station operators, This Gas Station Page provides a simple and
      secure way to receive payments. With the platform's Web3 integration,
      payments are instantly converted to stablecoins and transferred to This
      Gas Station Page's account. <br />
      <br />
      This Gas Station Page is built using the latest Web3 technology, making it
      a secure and reliable platform for gas payment. With its user-friendly
      interface and convenient features, This Gas Station Page is the ideal
      solution for vehicle owners looking for hassle-free gas payment. <br />
      <br />
    </div>
  );
}
function GasStationInteractionButton(props) {
  return (
    <div className="basis-5/12 h-48 bg-yellow-300 my-auto text-center flex flex-col justify-center cursor-pointer hover:bg-yellow-400 active:bg-yellow-500">
      <div>{props.text}</div>
    </div>
  );
}
class GasStationRecord {
  constructor(
    year,
    month,
    day,
    currency,
    gasAmount,
    location,
    payment,
    transaction
  ) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.curreny = currency;
    this.gasAmount = gasAmount;
    this.payment = payment;
    this.location = location;
    this.transaction = transaction;
    this.mapping = {
      Year: year,
      Month: month,
      Day: day,
      "Gas Added": gasAmount,
      Payment: payment,
      Currency: currency,
      Location: location,
      "Tx Hash": transaction.substr(0, 5) + "..." + transaction.substr(63, 66),
    };
  }
}

function GasStationInteract(props) {
  const [records, setRecords] = useState([
    new GasStationRecord(
      2023,
      4,
      22,
      "DAI",
      "34.1",
      "China Gas",
      "44.5",
      "0x922d3b7ada02e47aee0483a767dd0b4c65d424bbb05ba6f9fe56b3a660c58fc4"
    ),
    new GasStationRecord(
      2023,
      4,
      12,
      "USDT",
      "45.6",
      "China Gas",
      "34.5",
      "0x7b729ad07e94ea910760ea380128e5a7b2c3ecf38b4439ec68b78de43e2c2634"
    ),
  ]);
  const [recordHeaderElements, setRecordHeaderElements] = useState([
    "Year",
    "Month",
    "Day",
    "Gas Added",
    "Payment",
    "Currency",
    "Location",
    "Tx Hash",
  ]);
  const [tokens, setTokens] = useState([
    { id: 0, name: 'DAI', amount: 10 },
    { id: 1, name: 'USDT', amount: 5 },
    { id: 2, name: 'USDC', amount: 20 },
    { id: 3, name: 'DAI', amount: 15 },
  ])
  return (
    <div className="w-full h-full p-10 font-mono flex flex-col overflow-y-auto">
      {/* <div className="w-5/12 mx-auto border-4 h-56 border-yellow-200 flex flex-row justify-around text-3xl">
        <GasStationInteractionButton text="FULL" />
        <GasStationInteractionButton text="AUTO" />
      </div> */}
      <GasStationDeposit />
      <TokenTable tokens = {tokens}/>
      <div className="w-full mx-auto h-3/5 mt-20 flex flex-col">
        <div className="mx-auto mb-6 text-3xl flex flex-row">
          <div className = "w-96">
          Payment Records
          </div>
          <div className = "w-96">
          </div>
          <div className="w-8">
          </div>
        </div>
        <div className="h-16 border-y-2 border-gray-200 flex flex-row mx-auto">
          {recordHeaderElements.map((item, key) => {
            return <GasStationRecordHeaderElement text={item} index={key} />;
          })}
        </div>
        <ul className="flex flex-col h-full overflow-y-auto text-sm mx-auto">
          {records.map((item, key) => {
            return (
              <GasStationRecordLi
                item={item}
                index={key}
                elementSequence={recordHeaderElements}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
function GasStationRecordLi(prop) {
  const [fields, setFields] = useState(
    prop.elementSequence.map((item, index) => {
      return prop.item.mapping[item];
    })
  );
  return (
    <div className="flex flex-row h-12 border-t-2 w-full shrink-0">
      {fields.map((text, index) => {
        return <GasStationRecordHeaderElement text={text} index={index} />;
      })}
    </div>
  );
}
function GasStationRecordHeaderElement(prop) {
  const [widthControl, setWidthControl] = useState([
    "w-12",
    "w-16",
    "w-12",
    "w-24",
    "w-24",
    "w-24",
    "w-24",
    "w-24",
  ]);
  const [mrControl, setMrControl] = useState([
    "mr-0 ml-6",
    "mr-0",
    "mr-8",
    "mr-8",
    "mr-8",
    "mr-8",
    "mr-8",
    "mr-0",
  ]);
  return (
    <div
      className={`h-full ${
        widthControl[prop.index]
      } text-center flex flex-col justify-center ${mrControl[prop.index]} shrink-0`}
    >
      <div>{prop.text}</div>
    </div>
  );
}
function GasStationSettings(props) {
  return (
    <div className="w-full h-full pt-20 flex flex-col over-y-auto">
      <GasStationSetCarID />
    </div>
  );
}
class CarID {
  constructor(carID, time) {
    this.carID = carID;
    this.time = time;
  }
}
function GasStationSetCarID(props) {
  const [inputValue, setInputValue] = useState("");
  const [carIDItems, setCarIDItems] = useState([
    new CarID("4626-RG", "2022/4/4"),
    new CarID("234F-3G", "2023/5/3"),
  ]);
  const date = new Date();
  const submitHandler = async () => {
    await interactWithFun()
    setCarIDItems(
      carIDItems.concat([
        new CarID(
          inputValue.toUpperCase(),
          `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        ),
      ])
    );
  };
  const elementDeleteHandler = (key) => {
    setCarIDItems(
      carIDItems.filter(function (value, index, arr) {
        return index != key;
      })
    );
  };
  return (
    <div className="w-full h-96">
      <div className="w-5/6 mx-auto h-40 flex flex-col">
        <div className="w-full h-16 border-b-2 border-yellow-300 text-xl flex flex-col justify-center pl-4">
          <div>Add your car ID</div>
        </div>
        <div className="w-full mt-6 pl-4 flex flex-row h-1/3">
          <div className="w-1/3 h-1/2">
            <input
              className="w-full h-10 border-2 border-gray-200 rounded-lg active:border-yellow-200 pl-2 text-lg"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </div>
          <div className="h-1/2 w-1/2 pl-10">
            <button
              className="h-10 w-1/4 border-2 border-yellow-400 rounded-lg active:bg-yellow-300 hover:bg-yellow-100"
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="w-5/6 mx-auto h-2/3">
        <div className="w-1/2 h-12 border-y-2 border-yellow-300 shrink-0">
          <div className="flex flex-row w-full h-full justify-evenly">
            <div className="flex flex-col justify-center text-center">
              <div className="w-24"> Car ID</div>
            </div>
            <div className="flex flex-col justify-center text-center">
              <div className="w-36 ">Added Time</div>
            </div>
            <div className="flex flex-col justify-center text-center">
              <div className="w-28 ">Cancelation</div>
            </div>
          </div>
        </div>
        <ul className="w-1/2 h-5/6 overflow-y-scroll flex flex-col">
          {carIDItems.map((item, key) => {
            return (
              <CarIDItem
                item={item}
                index={key}
                elementDeleteHandler={elementDeleteHandler}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
function CarIDItem(props) {
  const { item, index, elementDeleteHandler } = props;
  const deleteHandler = () => {
    elementDeleteHandler(index);
  };
  return (
    <div className="w-full h-11 border-b-2 border-gray-200 text-sm shrink-0">
      <div className="flex flex-row w-full h-full justify-evenly">
        <div className="flex flex-col justify-center text-center">
          <div className="w-24"> {item.carID}</div>
        </div>
        <div className="flex flex-col justify-center text-center">
          <div className="w-36 "> {item.time} </div>
        </div>
        <div className="flex flex-col justify-center text-center">
          <div className="w-28 h-full flex flex-col justify-center">
            <button
              className="border-2 border-yellow-300 w-4/5 h-8 mx-auto rounded-lg hover:bg-yellow-100 active:bg-yellow-300"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function GasStationDeposit(props) {
  function saveHandler(){
    interactWithFun();
  }
  return (
    <div className="w-full h-96 flex flex-col justify-center shrink-0">
      <div className="h-5/6 w-72 border-2 mx-auto rounded-3xl border-yellow-300 p-6 shadow-lg">
        <div className="h-1/6 bg-yellow-300 w-2/5 flex flex-col justify-center rounded-2xl shadow-lg">
          <div className="text-center text-white font-bold">Deposit</div>
        </div>
        <div className="mt-6 h-2/5 w-full border-2 border-yellow-300 rounded-3xl pt-4 px-4 shadow-lg">
          <input className="text-3xl w-full  focus:outline-none" placeholder="0"/>
          <TokenSelectDropDown/>
        </div>
        <div className="mt-8 bg-yellow-300 w-full mx-auto h-1/6 rounded-2xl flex flex-col justify-center shadow-lg active:bg-yellow-500 hover:bg-yellow-400 cursor-pointer">
            <div className = "w-full text-center font-bold text-xl text-white" onClick={saveHandler}>Save</div>
        </div>
      </div>
    </div>
  );
}
export default GasStationPage;

