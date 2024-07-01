//import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";
//import startServer from "./server.js";

// Inizializzare ethers
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const heartbeatStore = new ethers.Contract(contractAddress, abi, signer);

const storeButton = document.getElementById("store");
const grantAccessButton = document.getElementById("grantAccess");
const revokeAccessButton = document.getElementById("revokeAccess");
const readButton = document.getElementById("read");
const disconnectButton = document.getElementById("disconnectButton");
storeButton.onclick = store;
disconnectButton.onclick = disconnect;
grantAccessButton.onclick = grant;
revokeAccessButton.onclick = revoke;
readButton.onclick = read;

async function disconnect() {
  try {
    // Effettua la disconnessione dalla Web3 provider
    await provider.disconnect;
    window.location.href = "index.html";
  } catch (error) {
    console.log("Errore durante la disconnessione:", error);
  }
}

async function store() {
  const url = "http://192.168.56.1:3000/getData";
  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("Dati ricevuti:", data);

    const timestamp = data.timestamp;
    const bpm = data.bpm;
    const bps = data.bps;

    await heartbeatStore.store(timestamp, `BPM: ${bpm}, BPS: ${bps}`);
    console.log("Store eseguota con successo.");
    const valoriMisurati = document.getElementById("valoriMisurati");
    const listItem = document.createElement("div");
    listItem.textContent = `Timestamp: ${timestamp}, Heartbeat: BPM: ${bpm}, BPS: ${bps}`;
    valoriMisurati.appendChild(listItem);
  } catch (error) {
    console.log("Errore durante la store!", error);
    const valoriMisurati = document.getElementById("valoriMisurati");
    valoriMisurati.innerHTML = "Errore durante la store!";
  }
}

async function grant() {
  const userAddress = document.getElementById("grantAddress").value;
  try {
    const transaction = await heartbeatStore.authorizeUser(userAddress);
    console.log("Utente autorizzato con successo:", userAddress);
    document.getElementById("grantAddress").value = "";
  } catch (error) {
    console.log("Errore durante l'autorizzazione dell'utente:", error);
    alert("Errore durante l'autorizzazione dell'utente!");
  }
}

// Funzione per revocare accesso
async function revoke() {
  const user = document.getElementById("revokeAddress").value;
  try {
    const transaction = await heartbeatStore.revokeAuthorization(user);
    console.log("Utente revocato con successo:", user);
    document.getElementById("revokeAddress").value = "";
  } catch (error) {
    alert("Errore durante la revocazione dell'utente!");
    console.log("Errore durante la revocazione dell'utente:", error);
  }
}

// Funzione per leggere i dati
async function read() {
  try {
    const address = await signer.getAddress();
    const isAuthorized = await heartbeatStore.isUserAuthorized(address);
    if (isAuthorized) {
      const values = await heartbeatStore.retrieveAllHeartbeats();
      console.log(values);
      const resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML = "";
      values.forEach((value) => {
        const timestamp = value.timestamp;
        const heartbeat = value.heartbeat;
        const listItem = document.createElement("div");
        listItem.textContent = `Timestamp: ${timestamp}, Heartbeat: ${heartbeat}`;
        resultContainer.appendChild(listItem);
      });
    } else {
      const resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML =
        "L'indirizzo non è autorizzato a leggere i battiti.";
    }
  } catch (err) {
    console.log("Si è verificato un errore durante la lettura:", err);
    const resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML =
      "Si è verificato un errore durante la lettura dei battiti.";
  }
}

const date = () => {
  var dataOdierna = new Date();
  var ora = dataOdierna.getHours();
  var minuti = dataOdierna.getMinutes();
  var secondi = dataOdierna.getSeconds();
  //stringa con l'ora nel formato "HH:mm:ss"
  var oraCorrente =
    ora +
    ":" +
    (minuti < 10 ? "0" : "") +
    minuti +
    ":" +
    (secondi < 10 ? "0" : "") +
    secondi;
  return oraCorrente;
};

//await heartbeatStore.store(date, "valore valore valore");
