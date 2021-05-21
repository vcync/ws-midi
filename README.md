# ws-midi
> Send MIDI using WebSocket communication

<p align="center"><img alt="Animated image of two terminals demonstrating the usage of ws-midi" src="https://github.com/vcync/ws-midi/raw/main/images/ws-midi.gif" width="100%" /></p>

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
