const fs = require("fs-extra");
const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractFactory = await ethers.getContractFactory("heartbeatsStorage");
  console.log("Distribuzione del contratto...");
  // Deploy del contratto
  const contract = await contractFactory.deploy();
  await contract.deploymentTransaction();
  console.log(`Contratto distribuito all'indirizzo: ${contract.target}`);

  // Verifica del contratto su Etherscan
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await contract.deploymentTransaction().wait(6);
    await verify(contract.target, []);
  }

  try {
    const oraCorrente = date();
    console.log(oraCorrente);
    let t = await contract.retrieveAllHeartbeats();
    console.log("Aggiornamento dei battiti...");

    // Creazione della transazione
    const transaction = await contract.store(oraCorrente, "dato: 1, dato: 2");
    await transaction.wait();
    console.log("Transazione avvenuta con successo!");
    const heartbeat1 = await contract.retrieveAllHeartbeats();
    console.log("Heartbeat recuperati:", heartbeat1);
  } catch (error) {
    console.error("Errore durante la lettura:", error);
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifica del contratto...");
  try {
    // Esegue la verifica del contratto utilizzando il plugin hardhat-etherscan
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contratto già verificato!");
    } else {
      console.log(e);
    }
  }
};

const date = () => {
  var dataOdierna = new Date();
  var ora = dataOdierna.getHours();
  var minuti = dataOdierna.getMinutes();
  var secondi = dataOdierna.getSeconds();
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
