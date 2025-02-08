# Distributed WebSocket Test Runner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.7-blue)

A TypeScript-based npm package to run test cases for distributed WebSocket servers. This tool helps in load testing, connection stability checks, and real-time message validation across multiple WebSocket instances.

## Features

- Simulate multiple WebSocket clients.
- Send and receive messages in real-time.
- Validate server responses.
- Support for distributed WebSocket environments.
- Customizable test scripts.
- Detailed logs and metrics.

## Installation

```sh
npm install distributed-websocket-test-runner --save-dev
```

or with yarn:

```sh
yarn add distributed-websocket-test-runner --dev
```

## Usage

### Basic Example

```typescript
import { WebSocketTestRunner } from 'distributed-websocket-test-runner';

const runner = new WebSocketTestRunner({
  servers: [
    'ws://localhost:8080',
    'ws://localhost:9090'
  ],
  clients: 100, // Number of simulated clients
  testCases: [
    {
      send: 'Hello, WebSocket!',
      expect: 'Hello, Client!'
    }
  ]
});

runner.run().then(results => {
  console.log('Test Results:', results);
}).catch(err => {
  console.error('Test Failed:', err);
});
```

## Configuration

You can customize the test runner using a configuration file:

```json
{
  "servers": [
    "ws://localhost:8080",
    "ws://localhost:9090"
  ],
  "clients": 100,
  "testCases": [
    {
      "send": "ping",
      "expect": "pong"
    }
  ]
}
```

## CLI Usage

Run tests directly from the CLI:

```sh
dws-test-runner --config test-config.json
```

### `npm run test`

Executes the test cases and returns the results.

## Contributing

Feel free to submit issues and pull requests! Contributions are always welcome.

## License

This project is licensed under the MIT License.
