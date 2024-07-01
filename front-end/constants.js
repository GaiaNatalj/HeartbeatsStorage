export const contractAddress = "0x125F2A3c9874907bC6eEc9B6D416532FA78099E7";
export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "timestamp",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "heartbeat",
        type: "string",
      },
    ],
    name: "HeartbeatStored",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "authorizeUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isUserAuthorized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieveAllHeartbeats",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "timestamp",
            type: "string",
          },
          {
            internalType: "string",
            name: "heartbeat",
            type: "string",
          },
        ],
        internalType: "struct heartbeatsStorage.Value[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "revokeAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "timestamp",
        type: "string",
      },
      {
        internalType: "string",
        name: "heartbeat",
        type: "string",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
