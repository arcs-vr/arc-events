# ARCS Event Normalization

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

This component serializes and deserializes HTML Events and aims for minimal data usage.

## Usage

```js
import {parsePayload, createPayload} from 'arc-events' 
```

### Functions

#### `createPayload(Event event, String|Number type = null): String`

Serializes an event. You can pass in a custom type if you want it to differ from what's in `event.type`.

#### `parsePayload(String payload): Event`

Deserializes a payload and returns the appropriate event that can be dispatched.
For general purposes, look at the [arc-aframe-system](https://github.com/arcs-vr/arc-aframe-system), which does this for
you.

## More

Look at the [`arcs-vr/arc-aframe-vue-template`](https://github.com/arcs-vr/arc-aframe-vue-template) for easier setup and at the
[`arcs-vr/arc-demo`](https://github.com/arcs-vr/arc-demo) for example usage.

## Authors and contributors

- Barthélémy Bonhomme, [@barthy-koeln](https://github.com/barthy-koeln/): [post@barthy.koeln](mailto:post@barthy.koeln)
