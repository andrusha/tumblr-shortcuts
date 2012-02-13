$ = (id) -> document.getElementById(id)
hasClass = (elem, cls) -> elem.className?.match(new RegExp('\\b'+cls+'\\b', 'im'))
toggleClass = (elem, cls) ->
    if hasClass elem, cls
        elem.className = elem.className.replace cls, ''
    else
        elem.className += cls

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

class Tumblr
    _clickElement: (elem, ctrl = false) ->
        return unless elem?
        
        evt = document.createEvent "MouseEvents"
        evt.initMouseEvent "click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null
        elem.dispatchEvent evt

    _pressKey: (key) ->
        evt = document.createEvent "KeyboardEvent"
        evt.initKeyboardEvent "keydown", true, true, null, key.charCodeAt(0), false, false, false, 0
        document.dispatchEvent evt

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

    view: (post_id) =>
        permalink = 'permalink_' + post_id.substring('view_'.length)
        @_clickElement $(permalink), true

    sendReply: (elem) =>
        reply_id = 'reply_button_' + elem.id.substring('reply_field_'.length)
        @_clickElement $(reply_id)

    confirmReblog: => @_clickElement $('save_button')

    cancelReblog : => @_clickElement $('cancel_button')

    queuePost: => @_changeSelected $('post_state'), 1

    changeBlog: => 
        elem = $('channel_id')
        idx = if elem.selectedIndex < elem.length - 1 then elem.selectedIndex + 1 else 0
        @_changeSelected elem, idx

    nextPage: => @_clickElement $('next_page_link')
    prevPage: => @_clickElement $('previous_page_link')

    nextPost: => @_pressKey 'J'
    prevPost: => @_pressKey 'K'

curPost = ->
    pos = document.body.scrollTop + 7 
    posts = $("posts").childNodes

    for elem in posts when hasClass elem, 'post'
        if pos >= elem.offsetTop and pos <= elem.offsetTop + elem.offsetHeight
            return elem.id

class Help
    constructor: ->
        window.addEventListener "load", =>
            @injectStyles()
            @injectHTML()

    injectStyles: =>
        style = document.createElement 'style'
        style.setAttribute 'type', 'text/css'
        content = document.createTextNode """
            #tumblr_shortcuts_help {
                color: white;
                cursor: pointer;
            }
            #tumblr_shortcuts_help.hidden {
                display: none;
            }
            #tumblr_shortcuts_curtain {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: black;
                opacity: 0.3;
                z-index: 10000;
            }
            #tumblr_shortcuts_popup {
                position: fixed;
                width: 400px;
                top: 150px;
                left: 50%;
                margin-left: -200px;
                background: black;
                opacity: 0.8;
                padding: 30px;
                border-radius: 10px;
                z-index: 20000;
            }
            #tumblr_shortcuts_popup h1, #tumblr_shortcuts_popup h2, #tumblr_shortcuts_popup p {
                color: white;
            }
            #tumblr_shortcuts_popup table td:last {
                padding-left: 10px;
            }
        """

        style.appendChild content
        document.head.appendChild style

    injectHTML: =>
        container = document.createElement 'div'
        container.setAttribute 'id', 'tumblr_shortcuts_help'
        container.setAttribute 'class', 'hidden'
        container.innerHTML = """
            <div id="tumblr_shortcuts_curtain"></div>
            <div id="tumblr_shortcuts_popup">
                <h1>Shortcuts</h1>

                <h2>Dashboard</h2>
                <p>
                    <table>
                    <tbody>
                        <tr>
                            <td>j</td><td>next post</td>
                        </tr>
                        <tr>
                            <td>k</td><td>previous post</td>
                        </tr>
                        <tr>
                            <td>l</td><td>like</td>
                        </tr>
                        <tr>
                            <td>r</td><td>reblog</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;r</td><td>reblog in a new tab</td>
                        </tr>
                        <tr>
                            <td>v</td><td>view post in a new tab (without loosing focus)</td>
                        </tr>
                        <tr>
                            <td>p</td><td>open current page</td>
                        </tr>
                        <tr>
                            <td>ctrl&nbsp;+&nbsp;enter</td><td>(while writing a reply) send reply</td>
                        </tr>
                    </tbody>
                    </table>
                </p>

                <h2>Reblog page</h2>
                <p>
                    <table>
                    <tbody>
                        <tr>
                            <td>ctrl&nbsp;+&nbsp;enter</td><td>confirm reblogging</td>
                        </tr>
                        <tr>
                            <td>esc</td><td>cancel</td>
                        </tr>
                        <tr>
                            <td>q</td><td>select "add to queue" instead of "publish now"</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;q</td><td>place post in the queue</td>
                        </tr>
                        <tr>
                            <td>b</td><td>switch blogs</td>
                        </tr>
                        <tr>
                            <td>alt&nbsp;+&nbsp;b</td><td>switch blog & publish</td>
                        </tr>
                    </tbody>
                    </table>
                </p>

            </div>
        """

        container.addEventListener 'click', @toggle
        document.body.appendChild container

    toggle: =>
        toggleClass $('tumblr_shortcuts_help'), 'hidden'

tumblr = new Tumblr
shortcuts = new Shortcuts
help = new Help

loc  = window.location.href.toLowerCase()
shortcuts.add
    'f1': help.toggle

if loc.indexOf('/dashboard') != -1
    shortcuts.add 
        'r':        -> tumblr.reblog curPost()
        'v':        -> tumblr.view curPost()
        'p':        -> tumblr.page curPost()
        'alt+r':    -> tumblr.reblog curPost(), true
        'ctrl+enter:input': (e) -> tumblr.sendReply e.target
        'alt+right':    tumblr.nextPage
        'alt+left':     tumblr.prevPage
        'alt+up':       tumblr.prevPost
        'alt+down':     tumblr.nextPost
else if loc.indexOf('/reblog/') != -1
    shortcuts.add 
        'b':            tumblr.changeBlog
        'alt+b':        -> tumblr.changeBlog(); tumblr.confirmReblog()
        'q':            tumblr.queuePost
        'alt+q':        -> tumblr.queuePost(); tumblr.confirmReblog()
        'escape':       tumblr.cancelReblog
        'ctrl+enter':   tumblr.confirmReblog
