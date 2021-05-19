const term = require('terminal-kit').terminal;
const midi = require('midi');
const WebSocket = require('ws');
const { VIRTUAL_MIDI_DEVICE_NAME, PORT } = require('./constants.js');
let ip;

module.exports = () => {
  // Set up a new input.
  const input = new midi.Input();

  // Count the available input ports.
  const numPorts = input.getPortCount();

  // Get the name of a specified input port.
  const deviceNames = [];
  for(let i=0; i < numPorts; i++) {
    const name = input.getPortName(i);

    if (name !== VIRTUAL_MIDI_DEVICE_NAME) {
      deviceNames.push(name);
    }
  }

  term.cyan(`please enter the IP of the recipient\n`);

  term.inputField((error, response) => {
    term.clear();
    ip = response;

    term.cyan(`opening websocket connection to ${ip}:${PORT}\n`);
    const ws = new WebSocket(`ws://${ip}:${PORT}`);

    ws.on('open', () => {
      term.clear();
      term.cyan(`opened websocket connection to ${ip}:${PORT}\n\n`);

      term.cyan(`please pick a midi device to send to ${ip}:${PORT}\n`);

      term.singleColumnMenu(deviceNames, {
        cancelable: true,
      }, (error, response) => {
        term.clear();
        // term('\n').eraseLineAfter.green(
        //   "#%s selected: %s (%s,%s)\n",
        //   response.selectedIndex,
        //   response.selectedText,
        //   response.x,
        //   response.y
        // );

        input.openPort(response.selectedIndex);
        // Configure a callback.
        input.on('message', (deltaTime, message) => {
          console.log(message);
          ws.send(JSON.stringify(message));
        });
      });
    });

    ws.on('close', () => {
      term.clear();
      term.black.bgYellow(`websocket connection to server closed`);
    });

    ws.on('error', () => {
      term.clear();
      term.red.bgYellow(`websocket connection to server errored`);
    });
  });
}