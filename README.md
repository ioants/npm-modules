# npm-package-proto
This package is used for loading proto files. It also contains some convenience functions for handling proto messages.

## How to use

Load the module and set the path to the proto file
```js
var Proto = require('ioant-proto');
Proto.setup("proto/messages.proto");
```

Get a proto message based on its corresponding **message_type**
```js
// 1 is messag_type for BootInfo message
message = Proto.getProtoMessage(1);
message.reboot_reason = "I crashed";

```
