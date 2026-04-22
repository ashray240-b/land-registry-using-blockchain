let web3;
let contract;
let account;

// Replace with your deployed Hardhat contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const contractABI = [{
      "inputs": [],
      "name": "getAllLandIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_landId",
          "type": "uint256"
        }
      ],
      "name": "getLand",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_landId",
          "type": "uint256"
        }
      ],
      "name": "isLandRegistered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_landId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_ownerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_location",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "registerLand",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_landId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_newOwnerName",
          "type": "string"
        }
      ],
      "name": "transferLand",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    } /* Paste ABI JSON here */ ];

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Connect wallet
    document.getElementById("connectWallet").addEventListener("click", async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("walletAddress").innerText = "Connected: " + account;
      } catch (err) {
        console.error(err);
      }
    });

    // Register Land
   document.getElementById("registerLand").addEventListener("click", async () => {
  const landId = parseInt(document.getElementById("landId").value);
  const ownerName = document.getElementById("ownerName").value;
  const location = document.getElementById("location").value;
  const price = parseInt(document.getElementById("price").value);

  if (!account) { alert("Please connect wallet!"); return; }

  try {
    // First check if land already exists
    const exists = await contract.methods.isLandRegistered(landId).call();
    if (exists) {
      document.getElementById("registerStatus").innerText = "❌ Land ID already exists!";
      return;
    }

    // Proceed with registration
    await contract.methods.registerLand(landId, ownerName, location, price)
      .send({ from: account, gas: 500000 });

    document.getElementById("registerStatus").innerText = "✅ Land registered successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("registerStatus").innerText = "❌ " + err.message;
  }
});

    // Check Land
    document.getElementById("checkLand").addEventListener("click", async () => {
      const landId = parseInt(document.getElementById("checkLandId").value);
      try {
        const exists = await contract.methods.isLandRegistered(landId).call();
        document.getElementById("checkStatus").innerText = exists ? "✅ Land exists" : "❌ Land not found";
      } catch (err) { console.error(err); }
    });

    // View Land
    document.getElementById("viewLand").addEventListener("click", async () => {
      const landId = parseInt(document.getElementById("viewLandId").value);
      try {
        const land = await contract.methods.getLand(landId).call();
        document.getElementById("landDetails").innerText =
          `ID: ${land[0]}, Owner: ${land[1]}, Location: ${land[2]}, Price: ${land[3]}, Address: ${land[4]}`;
      } catch (err) { console.error(err); document.getElementById("landDetails").innerText = "❌ " + err.message; }
    });

    // Transfer Land
    document.getElementById("transferLandBtn").addEventListener("click", async () => {
      const landId = parseInt(document.getElementById("transferLandId").value);
      const newOwnerName = document.getElementById("newOwnerName").value;
      const newOwnerAddress = document.getElementById("newOwnerAddress").value;

      if (!account) { alert("Connect wallet first!"); return; }

      try {
        await contract.methods.transferLand(landId, newOwnerAddress, newOwnerName)
          .send({ from: account });
        document.getElementById("transferStatus").innerText = "✅ Land transferred!";
      } catch (err) { console.error(err); document.getElementById("transferStatus").innerText = "❌ " + err.message; }
    });

    // List All Land Details in Table
    document.getElementById("listLandIds").addEventListener("click", async () => {
      try {
        const ids = await contract.methods.getAllLandIds().call();
        if (ids.length === 0) { document.getElementById("allLandIds").innerHTML = "No lands registered yet."; return; }

        let html = `<table>
                      <tr>
                        <th>Land ID</th>
                        <th>Owner Name</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Owner Address</th>
                      </tr>`;

        for (let id of ids) {
          const land = await contract.methods.getLand(id).call();
          html += `<tr>
                    <td>${land[0]}</td>
                    <td>${land[1]}</td>
                    <td>${land[2]}</td>
                    <td>${land[3]}</td>
                    <td>${land[4]}</td>
                  </tr>`;
        }
        html += "</table>";
        document.getElementById("allLandIds").innerHTML = html;

      } catch (err) { console.error(err); document.getElementById("allLandIds").innerText = "❌ " + err.message; }
    });

  } else { alert("Please install MetaMask!"); }
});