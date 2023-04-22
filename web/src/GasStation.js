import { useState, useEffect } from "react";
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
  const setPageName = props.setPageName
  const [sidebarButtonProps, setSidebarButtonProps] = useState([
    new ButtonProp("Info", <GasStationInfo />),
    new ButtonProp("Interact", <GasStationInteract />),
    new ButtonProp("Settings", <GasStationSettings />),
    new ButtonProp("Home", <GasStationInfo />),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (selectedIndex == 3){
      setPageName('original');
    }
  })
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
  return (
    <div className="w-full h-full p-20 font-mono">
      <div className="w-5/12 mx-auto border-4 h-56 border-yellow-200 flex flex-row justify-around text-3xl">
        <GasStationInteractionButton text="FULL" />
        <GasStationInteractionButton text="AUTO" />
      </div>
      <div className="w-full mx-auto h-3/5 mt-20 flex flex-col">
        <div className="basis-1/6 border-y-2 border-gray-200 flex flex-row">
          {recordHeaderElements.map((item, key) => {
            return <GasStationRecordHeaderElement text={item} index={key} />;
          })}
        </div>
        <ul className="flex flex-col w-full h-full overflow-y-auto text-sm">
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
    <div className="flex flex-row basis-1/6 w-full border-t-2">
      {fields.map((text, index) => {
        return <GasStationRecordHeaderElement text={text} index={index} />;
      })}
    </div>
  );
}
function GasStationRecordHeaderElement(prop) {
  const [widthControl, setWidthControl] = useState([
    "w-16",
    "w-16",
    "w-16",
    "w-20",
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
      } text-center flex flex-col justify-center ${mrControl[prop.index]}`}
    >
      <div>{prop.text}</div>
    </div>
  );
}
function GasStationSettings(props) {
  return (
    <div className="w-full h-full pt-20 flex flex-col">
      <GasStationSetCarID />
    </div>
  );
}
function GasStationSetCarID(props) {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="w-full basis-1/4">
      <div className="w-5/6 mx-auto h-full flex flex-col">
        <div className="w-full basis-1/3 border-b-2 border-yellow-200 text-xl flex flex-col justify-center pl-4">
          <div>Set your car ID</div>
        </div>
        <div className="w-full mt-6 pl-4 flex flex-row h-2/3">
          <div className = "w-1/3 h-1/2">
            <input className = "w-full h-full border-2 border-gray-200 rounded-lg active:border-yellow-200 pl-2 text-lg"
                value = {inputValue} onChange = {(event) => setInputValue(event.target.value)} />
          </div>
          <div className = "h-1/2 w-1/2 pl-10">
            <button className = "h-full w-1/4 border-2 border-yellow-200 rounded-lg active:bg-yellow-300 hover:bg-yellow-100">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GasStationPage;
