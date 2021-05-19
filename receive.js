const term = require('terminal-kit').terminal;
const midi = require('midi');
const WebSocket = require('ws');
const { VIRTUAL_MIDI_DEVICE_NAME, PORT } = require('./constants.js');
let ip;

module.exports = () => {
  term.clear();

  // Create a virtual input port.
  const output = new midi.Output();
  output.openVirtualPort(VIRTUAL_MIDI_DEVICE_NAME);
  term.black.bgCyan(`virtual midi device available as ${VIRTUAL_MIDI_DEVICE_NAME}\n`);

  const wss = new WebSocket.Server({ port: PORT });

  wss.on('listening', function listening() {
    term.black.bgGreen(`websocket server listening on ${PORT}\n`);
  });

  wss.on('connection', function connection(ws) {
    console.log('new connection');

    ws.on('message', function incoming(wsMessage) {
      const message = JSON.parse(wsMessage)
      console.log('received:', message);
      output.sendMessage(message);
    });
  });
};
