const term = require('terminal-kit').terminal;
const midi = require('midi');
const WebSocket = require('ws');
const { VIRTUAL_MIDI_DEVICE_NAME, PORT } = require('./constants.js');
let host;

module.exports = () => {
  // Set up a new input.
  const input = new midi.Input();

  // Count the available input ports.
  const numInputPorts = input.getPortCount();

  // Get the name of a specified input port.
  const inputDeviceNames = [];
  for(let i = 0; i < numInputPorts; i++) {
    const name = input.getPortName(i);

    if (name !== VIRTUAL_MIDI_DEVICE_NAME) {
      inputDeviceNames.push(name);
    }
  }

  // Set up a new ouput.
  const output = new midi.Output();

  // Count the available ouput ports.
  const numOutputPorts = output.getPortCount();

  // Get the name of a specified input port.
  const outputDeviceNames = [];
  for(let i = 0; i < numOutputPorts; i++) {
    const name = output.getPortName(i);

    if (name !== VIRTUAL_MIDI_DEVICE_NAME) {
      outputDeviceNames.push(name);
    }
  }

  term.cyan(`please enter the HOST of the recipient in the format ws://host[:port] or wss://host[:port]\n`);

  term.inputField((error, response) => {
    term.clear();
    host = response;

    term.cyan(`opening websocket connection to ${host}\n`);
    const ws = new WebSocket(`${host}`);

    ws.on('open', () => {
      term.clear();
      term.cyan(`opened websocket connection to ${host}\n\n`);

      term.cyan(`please pick a midi input device to send to ${host}\n`);

      term.singleColumnMenu(inputDeviceNames, {
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

        const midiInputDeviceId = response.selectedIndex;

        term.cyan(`opened websocket connection to ${host}\n\n`);

        term.cyan(`please pick a midi output device to route locally`);

        term.singleColumnMenu(outputDeviceNames, {
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

          input.openPort(midiInputDeviceId);
          output.openPort(response.selectedIndex);
          // Configure a callback.
          input.on('message', (deltaTime, message) => {
            console.log(message);
            ws.send(JSON.stringify(message));
            output.sendMessage(message);
          });
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