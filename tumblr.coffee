class Tumblr
    _clickElement: (elem, ctrl = false) ->
        return unless elem?

        meta = false
        if ctrl and window.navigator.appVersion.indexOf('Mac OS') != -1
            meta = true
            ctrl = false
        
        evt = document.createEvent "MouseEvents"
        evt.initMouseEvent "click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, meta, 0, null
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

    curPost: =>
        pos = document.body.scrollTop + 7 
        posts = $("posts").childNodes

        for elem in posts when hasClass elem, 'post'
            if pos >= elem.offsetTop and pos <= elem.offsetTop + elem.offsetHeight
                return elem.id
