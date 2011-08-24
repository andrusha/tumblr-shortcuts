
$ = (id) -> document.getElementById(id)

hasClass = (elem, cls) -> elem.className?.match(new RegExp('\\b'+cls+'\\b', 'im'))

noModifiers  = (e) -> !e.ctrlKey and !e.shiftKey and !e.altKey and !e.metaKey
ctrlModifier = (e) ->  e.ctrlKey and !e.shiftKey and !e.altKey and !e.metaKey
altModifier  = (e) -> !e.ctrlKey and !e.shiftKey and  e.altKey and !e.metaKey

inputField = (el) -> (el instanceof HTMLTextAreaElement) or (el instanceof HTMLInputElement)

# Keycodes
btn =
    l: 76
    r: 82
    v: 86
    q: 81
    enter: 13
    escape: 27

clickElement = (elem, ctrl = false) ->
    if not elem
        return
    
    evt = document.createEvent("MouseEvents")
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null)

    elem.dispatchEvent(evt)

changeSelected = (elem, index) ->
    if not elem
        return

    elem.selectedIndex = index

    evt = document.createEvent("Event")
    evt.initEvent('change', true, false)

    elem.dispatchEvent(evt)

reblog = (post_id, new_tab = false) ->
    elem = $(post_id)
    controls = elem.getElementsByClassName("post_controls")[0]
    links = controls.getElementsByTagName("a")

    for a in links
        if a.href?.match 'reblog'
            return clickElement(a, new_tab)

like = (post_id) ->
    #post_id == post_[0-9]*
    like_id = 'like_button_' + post_id.substring(5)
    clickElement($(like_id))

view = (post_id) ->
    # id == view_[0-9]+
    permalink = 'permalink_' + post_id.substring(5)
    clickElement($(permalink), true)

sendReply = (elem) ->
    #id == reply_field_[0-9]+
    reply_id = 'reply_button_' + elem.id.substring(12)
    clickElement($(reply_id))

confirmReblog = -> clickElement($('save_button'))

cancelReblog  = -> clickElement($('cancel_button'))

queuePost = -> changeSelected($('post_state'), 1)

getPosts = ->
    getPos    = (elem) -> {id: elem.id, top: elem.offsetTop, height: elem.offsetHeight}
    posts     = $("posts").childNodes
    positions = (getPos(elem) for elem in posts when hasClass elem, 'post')

    return positions

getCurPost = ->
    # 7px is a gap between posts when you use j/k navigation
    cur_pos = document.body.scrollTop + 7 

    for post in getPosts()
        if cur_pos >= post.top and cur_pos <= post.top + post.height
            return post.id

keyOnDashboard = (e, code) ->
    el = e.target

    if [btn.l, btn.r, btn.v].indexOf(code) > -1 and not inputField(el)
        post_id = getCurPost()
        if noModifiers(e)
            switch code
                when btn.l then like(post_id)
                when btn.r then reblog(post_id)
                when btn.v then view(post_id)
        else if altModifier(e) and code == btn.r
            reblog(post_id, true)
    else if code == btn.enter and ctrlModifier(e) and inputField(el) and hasClass(el, 'reply_text')
        # Submit textareas on ctrl+enter
        sendReply(el)

keyOnReblog = (e, code) ->
    if code == btn.enter and ctrlModifier(e)
        return confirmReblog()
    else if code == btn.escape and noModifiers(e)
        return cancelReblog()
    else if code == btn.q and (noModifiers(e) or ctrlModifier(e))
        queuePost()
        if ctrlModifier(e)
            confirmReblog(e)

window.addEventListener "keydown", (e = window.event) ->
    code = if e.charCode then e.charCode else e.keyCode
    loc  = window.location.href.toLowerCase()

    if loc.indexOf('/reblog/') != -1
        return keyOnReblog(e, code)
    else if loc.indexOf('/dashboard') != -1
        return keyOnDashboard(e, code)
