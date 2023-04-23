import os
from dotenv import load_dotenv
from uniswap import Uniswap
from flask import Flask, render_template, request
import web3
from flask import Flask
import json
with open("./DriverPayment.json", 'r') as f:
    driver_payment = json.load(f)
w3 = web3.Web3(web3.HTTPProvider(os.getenv('API_URL')))
if w3.is_connected():
    print("web3 is connected!")
app = Flask(__name__)
with open("./ContractConfig.json", 'r') as f:
    contract_config = json.load(f)

@app.route("/")
def index():
    return """
	<!DOCTYPE html>
	<html>
	<head>
		<title>My Webpage</title>
		<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
	</head>
	<body>
		<h1>Welcome to my webpage!</h1>
		<button id="my_button">Click me</button>
		<script>
			$("#my_button").click(function() {
				$.ajax({
					type: "POST",
					url: "/run_function",
					success: function(data) {
						alert(data);
					}
				});
			});
		</script>
	</body>
	</html>
	"""


@app.route("/run_function", methods=["POST"])
def run_function():
    data = request.json
    tokenAddress = data['tokenAddress']
    amount = data['amount']
    my_function(tokenAddress, amount)
    return "Function executed successfully!"


def my_function(tokenAddress, amount, userAddress):

    load_dotenv()
    private_key = os.getenv('GOERLI_PRIVATE_KEY')
    endpoint = os.getenv('ENDPOINT')
    address = "0x8d9e386fE320b41bFB9b53A2E1D3412CBaF5148F"  # or None if you're not going to make transactions
    private_key = os.getenv('GOERLI_PRIVATE_KEY')  # or None if you're not going to make transactions
    version = 2  # specify which version of Uniswap to use
    provider = os.getenv('ENDPOINT')  # can also be set through the environment variable `PROVIDER`
    uniswap = Uniswap(address = address, private_key = private_key, version=version, provider=provider)

    # Some token addresses we'll be using later in this guide
    eth = tokenAddress
    usdc = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C"
    tx = uniswap.make_trade(eth, usdc, amount)  # sell 1 ETH for BAT
    print(tx)
	contract_instance = w3.eth.contract(address = contract_config.DriverPaymentAddress, abi = driver_payment.abi)
	contract_instance.functions.registerUSDCForUser(amount, tokenAddress, userAddress)
    print("Function executed!")
    


if __name__ == "__main__":
    app.run()