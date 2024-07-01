// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract heartbeatsStorage {

     struct Value {
        string timestamp;
        string heartbeat;
    }

    Value[] private heartbeats;
    // Mappa che tiene traccia degli utenti autorizzati
    mapping(address => bool) private authorizedUsers;
    // Indirizzo del proprietario del contratto
    address private owner;

    // Evento per notificare quando un nuovo battito viene memorizzato
    event  HeartbeatStored(address indexed user, string timestamp, string heartbeat);

    // Modificatore per consentire l'accesso solo al proprietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Accesso consentito solo al proprietario.");
        _;
    }

    // Modificatore per consentire l'accesso solo agli utenti autorizzati
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Accesso non autorizzato.");
        _;
    }

    // Costruttore del contratto, imposta il proprietario e autorizza il proprietario
     constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
    }

    // Funzione per memorizzare un valore dei battiti
    function store(string memory timestamp, string memory heartbeat) public onlyOwner {
        heartbeats.push(Value(timestamp,heartbeat));
        emit HeartbeatStored(msg.sender, timestamp, heartbeat);
    }

    
    // Funzione per autorizzare un utente a visualizzare i battiti
    function authorizeUser(address user) public onlyOwner{
        authorizedUsers[user] = true;
    }

    function revokeAuthorization(address user) public onlyOwner{
        authorizedUsers[user] = false;
    }

   // Funzione per recuperare tutti i battiti, accessibile solo dagli utenti autorizzati
    function retrieveAllHeartbeats() public view onlyAuthorized returns (Value[] memory) {
     return heartbeats;
  }

    // Funzione per verificare lo stato di autorizzazione di un utente
     function isUserAuthorized(address user) public view  returns (bool) {
        return authorizedUsers[user];
    }


}

