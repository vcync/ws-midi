# ws-midi
> Send MIDI using WebSocket communication

## Usage

* Clone the repo
* `yarn`
* `yarn start`
* You'll need to port-forward/open 5006 on your router
* Start the receiver first
* When it asks for an IP, that's your WAN IP (search "what's my IP" on Google)
* The receiver will have a virtual MIDI device called "ws-midi" to use in MIDI-capable apps

## Requirements

* node.js
* yarn
