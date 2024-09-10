import requests

url = "https://api.coingecko.com/api/v3/coins/neo"

headers = {
    "accept": "application/json",
    "x-cg-demo-api-key": "CG-UUQ5YQ6CTpT9eFPV7DP8g9aW"
}

response = requests.get(url, headers=headers)

print(response.text)