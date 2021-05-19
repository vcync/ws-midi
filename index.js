const term = require('terminal-kit').terminal;
const setupSend = require('./send.js');
const setupReceive = require('./receive.js');

// Handle CTRL_C
function terminate() {
  term.grabInput(false);
  setTimeout(() => process.exit(), 100);
}

term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') {
    terminate();
  }
});

term.fullscreen();

term.cyan(`do you want to send or receive midi?\n`);

  term.singleColumnMenu(['send', 'receive'], {
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

    if (response.selectedIndex === 0) {
      setupSend();
    }

    if (response.selectedIndex === 1) {
      setupReceive();
    }
  });