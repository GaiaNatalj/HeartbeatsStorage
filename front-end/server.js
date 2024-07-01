/*import express from "express";

function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/heartbeat", (req, res) => {
    const { bpm, bps } = req.query;
    console.log(`Received heartbeat data - BPM: ${bpm}, BPS: ${bps}`);
    // Puoi elaborare i dati qui, salvarli su un database, ecc.
    res.sendStatus(200);
  });

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  return server;
}

export default startServer;*/
