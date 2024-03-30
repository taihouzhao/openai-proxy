import handleRequest from "../../src/handle-request";

export const config = {
  runtime: "edge", // this is a pre-requisite
  // exclude hongkong cause it's not supported by OpenAI
  regions: [
    "sin1",
    "hkg1",
    "hnd1",
    "kix1",
    "syd1",
  ],
};

export default handleRequest;
