tumblr = new Tumblr
shortcuts = new Shortcuts
help = new Help

shortcuts.add
    'f1': help.toggle

loc = window.location.href.toLowerCase()
if loc.indexOf('/dashboard') != -1
    shortcuts.add 
        'r':        -> tumblr.reblog Tumblr.curPost()
        'v':        -> tumblr.view Tumblr.curPost()
        'p':        -> tumblr.page Tumblr.curPost()
        'alt+r':    -> tumblr.reblog Tumblr.curPost(), true
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
