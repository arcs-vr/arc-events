/**
 * @file Type definitions for proxy events, and an enum for event types as well as functions for conversions between enum keys and ordinates.
 * @author Barthy Bonhomme <post@barthy.koeln>
 * @licence MIT
 */

/**
 * Proxy Event Types. Numbers take less bandwidth than strings.
 * @readonly
 * @enum {Number}
 */
export const ArcEvents = {
  KEYDOWN: 0,
  KEYUP: 1,
  MOUSEMOVE: 2,
  CLICK: 3,
  MOUSEDOWN: 4,
  MOUSEUP: 5,
  STICKMOVE: 6,
  DEVICEBUMP: 7
}

/**
 * @readonly
 * @enum {string}
 */
export const ArcTopics = {
  STATUS: 'status',
  DATA: 'data',
  ADD_EVENT_LISTENER: 'add_el',
  REMOVE_EVENT_LISTENER: 'remove_el'
}

/**
 *
 * @param {String} type
 * @return {String}
 */
export function eventNameToType (type) {
  const name = type.toUpperCase()

  if (name in ArcEvents) {
    return ArcEvents[name]
  }

  return type
}

/**
 *
 * @param {Number} ordinate
 * @return {string}
 */
export function eventTypeToName (ordinate) {
  const key = Object.keys(ArcEvents).find(key => ArcEvents[key] === ordinate)

  if (key) {
    return key.toLowerCase()
  } else {
    throw new Error(`The ArcEvents enum does not have a value for the ordinate ${ordinate}.`)
  }
}

/**
 *
 * @param {object} payload
 * @return {CustomEvent<object>}
 */
function createCustomEvent (payload) {
  const typeName = eventTypeToName(payload.t)

  return new window.CustomEvent(
    typeName,
    {
      detail: payload.d
    }
  )
}

/**
 *
 * @param {object} payload
 * @return {KeyboardEvent}
 */
function createKeyboardEvent (payload) {
  const typeName = eventTypeToName(payload.t)

  return new window.KeyboardEvent(
    typeName,
    {
      code: payload.c,
      key: payload.k
    }
  )
}

/**
 *
 * @param {object} payload
 * @return {MouseEvent}
 */
function createMouseEvent (payload) {
  const typeName = eventTypeToName(payload.t)

  return new window.MouseEvent(
    typeName,
    {
      button: payload.b,
      detail: payload.d,
      movementX: payload.x,
      movementY: payload.y
    }
  )
}

/**
 *
 * @param {object} payload
 * @return {CustomEvent}
 */
function createStickEvent (payload) {
  const typeName = eventTypeToName(payload.t)

  return new window.CustomEvent(
    typeName,
    {
      detail: {
        radians: payload.r,
        force: payload.f
      }
    }
  )
}

function createGestureEvent (payload) {
  const typeName = eventTypeToName(payload.t)

  return new window.CustomEvent(
    typeName,
    {
      detail: {
        direction: payload.d
      }
    }
  )
}

/**
 * @param {object} payload
 * @return {CustomEvent|MouseEvent|KeyboardEvent} event
 */
export function parsePayload (payload) {
  switch (payload.t) {
    case ArcEvents.KEYDOWN:
    case ArcEvents.KEYUP:
      return createKeyboardEvent(payload)

    case ArcEvents.MOUSEMOVE:
    case ArcEvents.MOUSEDOWN:
    case ArcEvents.MOUSEUP:
    case ArcEvents.CLICK:
      return createMouseEvent(payload)

    case ArcEvents.STICKMOVE:
      return createStickEvent(payload)

    case ArcEvents.DEVICEBUMP:
      return createGestureEvent(payload)

    default:
      return createCustomEvent(payload)
  }
}

/**
 * Converts any event to an appropriate payload for minimal data transfer
 * @param {CustomEvent|MouseEvent|KeyboardEvent} event
 * @param {?Number|?String} type
 * @return {object} payload
 */
export function createPayload (event, type = null) {
  const payload = {
    t: type !== null ? type : eventNameToType(event.type)
  }

  switch (payload.t) {
    case ArcEvents.MOUSEMOVE:
      if (event.movementX === 0 && event.movementY === 0) {
        return
      }

      payload.x = event.movementX
      payload.y = event.movementY
      break
    case ArcEvents.MOUSEDOWN:
    case ArcEvents.MOUSEUP:
    case ArcEvents.CLICK:
      payload.b = event.button
      if (event.detail) {
        payload.d = event.detail
      }
      break
    case ArcEvents.KEYDOWN:
    case ArcEvents.KEYUP:
      payload.c = event.code
      payload.k = event.key
      break
    case ArcEvents.STICKMOVE:
      payload.r = event.detail.radians
      payload.f = event.detail.force
      break
    case ArcEvents.DEVICEBUMP:
      payload.g = 'bump'
      payload.d = event.detail.direction
      break
  }

  return payload
}
