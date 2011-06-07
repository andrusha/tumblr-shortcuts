function clickElement(elem) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    elem.dispatchEvent(evt);
}

//post_id == post_[0-9]*
function like(post_id) {
    var like_id = 'like_button_' + post_id.substring(5),
        elem = document.getElementById(like_id);
    
    clickElement(elem);
}

function reblog(post_id) {
    var elem = document.getElementById(post_id),
        controls = elem.getElementsByClassName("post_controls")[0],
        links = controls.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (!a.href)
            continue;
        
        if (a.href.match('reblog')) {
            return clickElement(a);
        }
    }
}

function hasClass(elem, cls) {
    return elem.className && elem.className.match(new RegExp('\\b'+cls+'\\b', 'im'));
}

function getPosts() {
    var posts = document.getElementById("posts").childNodes,
        positions = [];
    for (var i = 0; i < posts.length; ++i) {
        var elem = posts[i];
        if (!hasClass(elem, 'post'))
            continue;
        
        positions.push([elem.id, elem.offsetTop, elem.offsetHeight]);
    }

    return positions;
}

window.addEventListener("keydown", function (e) {
    if(!e)
        e = window.event;

    //76 = l, 82 = r
    var code=e.charCode?e.charCode:e.keyCode;
    if(!e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey &&
        [76, 82].indexOf(code) > -1) {

        var positions = getPosts(),
            current_position = document.body.scrollTop + 7;

        for (var i = 0; i < positions.length; ++i) {
            if (current_position >= positions[i][1] &&
                current_position <= positions[i][1] + positions[i][2]) {
                var post_id = positions[i][0];
                if (code == 76) {
                    return like(post_id);
                } else if (code == 82) {
                    return reblog(post_id);
                }
            }
        }
    }
});
