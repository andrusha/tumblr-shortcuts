class Shortcuts
    constructor: ->
        # keycode: {mod: {}, input: bool, event: function}
        @_mapping = {}
        @_lookup = 
            enter: 13
            escape: 27
            up: 38
            left: 37
            right: 39
            down: 40
        @_lookup["f#{i}"] = 111 + i for i in [1..12]
        window.addEventListener "keydown", @_interceptor

    add: (shortcut, func) ->
        unless func?
            @_add s, f  for s, f of shortcut
        else
            @_add shortcut, func

    # shortcut == "key" | "mod+key" | "mod+key:input"
    _add: (shortcut, func) ->
        [_, _, mod, key, inp] = shortcut.match /((ctrl|alt|meta|shift)\+)?([a-z0-9]+)(:input)?/i
        code = if key.length is 1 then key.toUpperCase().charCodeAt(0) else @_lookup[key]
        mod = @_serialize_mod
            altKey: mod is 'alt'
            ctrlKey: mod is 'ctrl'
            shiftKey: mod is 'shift'
            metaKey: mod is 'meta'

        @_mapping[code] = {} unless @_mapping[code]?
        @_mapping[code][mod] =
            input: inp?
            event: func

    _is_input: (el) -> (el instanceof HTMLTextAreaElement) or (el instanceof HTMLInputElement)

    #encode modifiers as an integer, this format eq to bitmask
    _serialize_mod: (m) -> 1*m.altKey + 2*m.ctrlKey + 4*m.metaKey + 8*m.shiftKey

    _interceptor: (e = window.event) =>
        press = @_mapping[e.charCode || e.keyCode]
        mod = @_serialize_mod e

        if press? and press[mod]? and @_is_input(e.target) is press[mod].input
            press[mod].event e
