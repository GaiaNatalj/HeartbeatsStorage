import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";

// Inizializzare ethers
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const secureStore = new ethers.Contract(contractAddress, abi, signer);

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

// Funzione per connettersi a MetaMask
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected";
      window.location.href = "main.html"; // Redirect alla pagina principale dopo la connessione
    } catch (error) {
      console.error("Errore durante il tentativo di connessione: ", error);
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}
