$ = (id) -> document.getElementById id
hasClass = (elem, cls) -> elem.className?.match(new RegExp('\\b'+cls+'\\b', 'im'))
noModifiers  = (e) -> !e.ctrlKey and !e.shiftKey and !e.altKey and !e.metaKey
ctrlModifier = (e) ->  e.ctrlKey and !e.shiftKey and !e.altKey and !e.metaKey

clickElement = (elem, ctrl = false) ->
    if not elem
        return
    
    evt = document.createEvent "MouseEvents"
    evt.initMouseEvent "click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null

    elem.dispatchEvent evt

reblog = (post_id) ->
    elem = $(post_id)
    controls = elem.getElementsByClassName("post_controls")[0]
    links = controls.getElementsByTagName("a")

    for link in links
        if a.href?.match 'reblog'
            return clickElement link

like = (post_id) ->
    #post_id == post_[0-9]*
    like_id = 'like_button_' + post_id.substring(5)
    clickElement $(like_id)

view = (post_id) ->
    # id == view_[0-9]+
    permalink = 'permalink_' + post_id.substring(5)
    clickElement($(permalink), true)

sendReply = (elem) ->
    #id == reply_field_[0-9]+
    reply_id = 'reply_button_' + elem.id.substring(12)
    clickElement $(reply_id)

confirmReblog = -> clickElement $('save_button')

cancelReblog  = -> clickElement $('cancel_button')

getPosts = ->
    getPos    = (elem) -> [elem.id, elem.offsetTop, elem.offsetHeight] 
    posts     = $("posts").childNodes
    positions = (getPos elem for elem in posts when hasClass elem, 'post')

    return positions

keyOnDashboard = (e, code) ->
    if (noModifiers e and [76, 82, 86].indexOf(code) > -1 and 
            !(e.target instanceof HTMLTextAreaElement) and !(e.target instanceof HTMLInputElement))
        # accept keys only if it was pushed without any modificators and not in input element

        positions = getPosts()
        cur_pos = document.body.scrollTop + 7

        for pos in positions
            if cur_pos >= pos[1] and cur_pos <= pos[1] + pos[2]
                post_id = pos[0]
                switch code
                    when 76 then like post_id
                    when 82 then reblog post_id
                    when 86 then view post_id
    else if (code == 13 and ctrlModifier e and
               (e.target instanceof HTMLTextAreaElement) and
               (hasClass e.target, 'reply_text'))
        sendReply e.target

keyOnReblog = (e, code) ->
    if (code == 13 and ctrlModifier e)
        return confirmReblog()
    else if (code == 27 and noModifiers e)
        return cancelReblog()

window.addEventListener "keydown", (e = window.event) ->
    # 76 = l, 82 = r, 86 = v, 13 = enter, 27 = escape

    code = if e.charCode then e.charCode else e.keyCode
    loc  = window.location.href.toLowerCase()

    if (loc.indexOf('/reblog/') != -1)
        return keyOnReblog(e, code)
    else if (loc.indexOf('/dashboard') != -1)
        return keyOnDashboard(e, code)
