const term = require('terminal-kit').terminal;
const midi = require('midi');
const WebSocket = require('ws');
const { VIRTUAL_MIDI_DEVICE_NAME, PORT } = require('./constants.js');

function heartbeat() {
  this.isAlive = true;
}

module.exports = () => {
  term.clear();
  term.cyan(`please pick a midi device to send received MIDI to\n`);

  // Set up a new input.
  const output = new midi.Output();

  // Count the available output ports.
  const numPorts = output.getPortCount();

  // Get the name of a specified input port.
  const deviceNames = [];
  for(let i = 0; i < numPorts; i++) {
    const name = output.getPortName(i);

    if (name !== VIRTUAL_MIDI_DEVICE_NAME) {
      deviceNames.push(name);
    }
  }

  term.singleColumnMenu([`Virtual MIDI device (${VIRTUAL_MIDI_DEVICE_NAME})`, ...deviceNames], {
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

    if (response.selectedIndex > 0) {
      output.openPort(response.selectedIndex - 1);
    } else {
      output.openVirtualPort(VIRTUAL_MIDI_DEVICE_NAME);
      term.black.bgCyan(`virtual midi device available as ${VIRTUAL_MIDI_DEVICE_NAME}\n`);
    }
    
    const wss = new WebSocket.Server({ port: PORT });

    const interval = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
    
        ws.isAlive = false;
        ws.ping();
      });
    }, 10 * 1000);
    
    wss.on('close', function close() {
      clearInterval(interval);
    });

    wss.on('listening', function listening() {
      term.black.bgGreen(`websocket server listening on ${PORT}\n`);
    });
  
    wss.on('connection', function connection(ws) {
      console.log('new connection');

      ws.isAlive = true;
      ws.on('error', console.error);
      ws.on('pong', heartbeat);
  
      ws.on('message', function incoming(wsMessage) {
        const message = JSON.parse(wsMessage)
        console.log('received:', message);
        output.sendMessage(message);
      });
    });
  });
};
