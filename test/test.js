const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const chai = require("chai");
chai.use(require("chai-as-promised"));

describe("heartbeatsStorage", function () {
  let contractFactory, contract, owner, user;

  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("heartbeatsStorage");
    contract = await contractFactory.deploy();
    // Ottieni gli account di test forniti da Hardhat
    [owner, user] = await ethers.getSigners();
  });

  // Test: verifica che la lista dei battiti sia inizialmente vuota
  it("Should start with an empty list of heartbeats", async function () {
    const currentValue = await contract.connect(owner).retrieveAllHeartbeats();
    // Verifica che la lunghezza della lista sia 0
    assert.equal(currentValue.length, 0);
    console.log("test-1:", currentValue.length);
  });

  // Test: verifica che il proprietario possa memorizzare un battito
  it("Should store a heartbeat when the owner calls store", async function () {
    const expectedValue = "valorebattiti";
    const expectedDate = "data";

    // Chiamata alla funzione store con il proprietario
    const transactionResponse = await contract
      .connect(owner)
      .store(expectedDate, expectedValue);
    await transactionResponse.wait(1);

    // Recupera tutti i battiti memorizzati dal proprietario
    const currentValue = await contract.connect(owner).retrieveAllHeartbeats();

    // Verifica che la lunghezza della lista sia 1 e che i valori siano corretti
    assert.equal(currentValue.length, 1);
    assert.equal(currentValue[0].timestamp, expectedDate);
    assert.equal(currentValue[0].heartbeat, expectedValue);

    console.log("test-2:", currentValue.length);
    console.log("timestamp:", currentValue[0].timestamp);
    console.log("heartbeat:", currentValue[0].heartbeat);
  });

  // Test: verifica che un utente non proprietario non possa memorizzare un battito
  it("Should not allow a non-owner to store a heartbeat", async function () {
    const expectedValue = "valorebattiti";
    const expectedDate = "data";

    // Chiamata alla funzione store con un utente non proprietario
    await expect(
      contract.connect(user).store(expectedDate, expectedValue)
    ).to.be.revertedWith("Accesso consentito solo al proprietario.");
  });

  // Test: verifica che un utente autorizzato possa leggere i battiti
  it("Should authorize a user to read heartbeats", async function () {
    const expectedValue = "valorebattiti";
    const expectedDate = "data";

    // Il proprietario memorizza un battito
    await contract.connect(owner).store(expectedDate, expectedValue);

    // Autorizza l'utente
    await contract.connect(owner).authorizeUser(user.address);

    // L'utente autorizzato recupera tutti i battiti memorizzati
    const currentValue = await contract.connect(user).retrieveAllHeartbeats();
    // Verifica che la lunghezza della lista sia 1 e che i valori siano corretti
    assert.equal(currentValue.length, 1);
    assert.equal(currentValue[0].timestamp, expectedDate);
    assert.equal(currentValue[0].heartbeat, expectedValue);

    console.log("test-4:", currentValue.length);
    console.log("timestamp:", currentValue[0].timestamp);
    console.log("heartbeat:", currentValue[0].heartbeat);
    console.log("user:", user.address);
  });

  // Test: verifica che un utente non autorizzato non possa leggere i battiti
  it("Should not allow a non-authorized user to read heartbeats", async function () {
    // L'utente non autorizzato tenta di recuperare tutti i battiti memorizzati
    await expect(
      contract.connect(user).retrieveAllHeartbeats()
    ).to.be.revertedWith("Accesso non autorizzato.");
  });

  // Test: verifica che l'autorizzazione di un utente possa essere revocata
  it("Should revoke a user's authorization", async function () {
    // Autorizza l'utente
    await contract.connect(owner).authorizeUser(user.address);

    // Revoca l'autorizzazione dell'utente
    await contract.connect(owner).revokeAuthorization(user.address);

    // L'utente cui è stata revocata l'autorizzazione tenta di recuperare tutti i battiti memorizzati
    await expect(
      contract.connect(user).retrieveAllHeartbeats()
    ).to.be.revertedWith("Accesso non autorizzato.");
  });

  // Test: verifica lo stato di autorizzazione degli utenti

  it("Should correctly check user authorization status", async function () {
    // Autorizza l'utente
    await contract.connect(owner).authorizeUser(user.address);
    // Verifica che l'utente sia autorizzato
    let isAuthorized = await contract.isUserAuthorized(user.address);
    assert.equal(isAuthorized, true);
    console.log("test-7:", isAuthorized);

    // Revoca l'autorizzazione dell'utente
    await contract.connect(owner).revokeAuthorization(user.address);
    // Verifica che l'utente non sia più autorizzato
    isAuthorized = await contract.isUserAuthorized(user.address);
    assert.equal(isAuthorized, false);

    console.log("test-7:", isAuthorized);
    console.log("user:", user.address);
  });
});
