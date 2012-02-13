$ = (id) -> document.getElementById(id)

hasClass = (elem, cls) -> elem.className?.match(new RegExp('\\b'+cls+'\\b', 'im'))

toggleClass = (elem, cls) ->
    if hasClass elem, cls
        elem.className = elem.className.replace cls, ''
    else
        elem.className += cls
