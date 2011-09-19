$ = (id) -> document.getElementById(id)
hasClass = (elem, cls) -> elem.className?.match(new RegExp('\\b'+cls+'\\b', 'im'))

class Shortcuts
    constructor: ->
        # keycode: {mod: {}, input: bool, event: function}
        @_mapping = {}
        @_lookup = 
            enter: 13
            escape: 27
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

class Tumblr
    _clickElement: (elem, ctrl = false) ->
        return unless elem?
        
        evt = document.createEvent("MouseEvents")
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null)
        elem.dispatchEvent(evt)

    _changeSelected: (elem, index) ->
        return unless elem?

        elem.selectedIndex = index

        evt = document.createEvent("Event")
        evt.initEvent('change', true, false)
        elem.dispatchEvent(evt)

    _getReblogLink: (post_id) ->
        elem = $(post_id)
        controls = elem.getElementsByClassName("post_controls")[0]
        links = controls.getElementsByTagName("a")

        for a in links
            if a.href?.match 'reblog'
                return a

    reblog: (post_id, new_tab = false) =>
        @_clickElement @_getReblogLink(post_id), new_tab

    page: (post_id) =>
        el = @_getReblogLink post_id
        link = decodeURIComponent el.href.match(/redirect_to=.*/)[0].substring('redirect_to='.length)
        window.location.replace link

    like: (post_id) =>
        like_id = 'like_button_' + post_id.substring('post_'.length)
        @_clickElement $(like_id)

    view: (post_id) =>
        permalink = 'permalink_' + post_id.substring('view_'.length)
        @_clickElement $(permalink), true

    sendReply: (elem) =>
        reply_id = 'reply_button_' + elem.id.substring('reply_field_'.length)
        @_clickElement $(reply_id)

    confirmReblog: => @_clickElement $('save_button')

    cancelReblog : => @_clickElement $('cancel_button')

    queuePost: => @_changeSelected $('post_state'), 1

curPost = ->
    pos = document.body.scrollTop + 7 
    posts = $("posts").childNodes

    for elem in posts when hasClass elem, 'post'
        if pos >= elem.offsetTop and pos <= elem.offsetTop + elem.offsetHeight
            return elem.id

tumblr = new Tumblr
shortcuts = new Shortcuts

loc  = window.location.href.toLowerCase()
if loc.indexOf('/dashboard') != -1
    shortcuts.add 
        'l':        -> tumblr.like curPost()
        'r':        -> tumblr.reblog curPost()
        'v':        -> tumblr.view curPost()
        'p':        -> tumblr.page curPost()
        'alt+r':    -> tumblr.reblog curPost(), true
        'ctrl+enter:input': (e) -> tumblr.sendReply e.target
else if loc.indexOf('/reblog/') != -1
    shortcuts.add 
        'q':            tumblr.queuePost
        'escape':       tumblr.cancelReblog
        'ctrl+enter':   tumblr.confirmReblog
        'ctrl+q':       -> tumblr.queuePost(); tumblr.confirmReblog()
