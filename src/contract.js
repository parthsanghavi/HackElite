const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "emailid",
				"type": "string"
			},
			{
				"name": "mobno",
				"type": "uint256"
			}
		],
		"name": "addclient",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const address = '0x2d6a776cd6cbfedf033aa6da3808d96dc35a9b48';

module.export={abi,address};