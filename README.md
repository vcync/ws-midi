<h1>ws-midi</h1>
> Send MIDI using WebSocket communication

<p align="center"><img alt="Animated image of two terminals demonstrating the usage of ws-midi" src="https://github.com/vcync/ws-midi/raw/main/images/ws-midi.gif" width="100%" /></p>

---

<!-- TOC -->

- [Usage](#usage)
  - [Usage with ngrok](#usage-with-ngrok)
- [Requirements](#requirements)

<!-- /TOC -->

---

## Usage

* Clone the repo
* `yarn`
* `yarn start`
* You'll need to port-forward/open 5006 on your router
* Start the receiver first
* When it asks for an IP, that's your WAN IP (search "what's my IP" on Google)
* The receiver will have a virtual MIDI device called "ws-midi" to use in MIDI-capable apps


### Usage with ngrok

To get the connection working over network where we don't have access to the network-settings, we can use a service like ngrok to tunnel the connection:

* Setup account at ngrok
* Start ws-midi receiver on the remote host that should receive the signal
* Start ngrok with `ngrok http 5006` (the port used by ws-midi) on the remote host
* Start ws-midi send on the local host that should send the signal to the remote host
  * Use the host url as provided by ngrok in this format: `wss://<ngrok-url>` (we don't need the port as this goes over HTTPS)

This should then pipe the signal from a local host to the remote host and you should see the MIDI signals arriving there. 

## Requirements

* node.js
* yarn
