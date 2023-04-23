import os
from dotenv import load_dotenv
from uniswap import Uniswap
from flask import Flask, render_template, request


from flask import Flask

app = Flask(__name__)


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
    my_function()
    return "Function executed successfully!"


def my_function():

    load_dotenv()
    private_key = os.getenv('GOERLI_PRIVATE_KEY')
    endpoint = os.getenv('ENDPOINT')
    address = "0x8d9e386fE320b41bFB9b53A2E1D3412CBaF5148F"  # or None if you're not going to make transactions
    private_key = os.getenv('GOERLI_PRIVATE_KEY')  # or None if you're not going to make transactions
    version = 2  # specify which version of Uniswap to use
    provider = os.getenv('ENDPOINT')  # can also be set through the environment variable `PROVIDER`
    uniswap = Uniswap(address=address, private_key=private_key, version=version, provider=provider)

    # Some token addresses we'll be using later in this guide
    eth = "0x0000000000000000000000000000000000000000"
    usdc = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C"
    tx = uniswap.make_trade(eth, usdc, 1000000000000000)  # sell 1 ETH for BAT
    print(tx)

    print("Function executed!")


if __name__ == "__main__":
    app.run()