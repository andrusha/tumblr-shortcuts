
//post_id == post_[0-9]*
function like(post_id) {
    var like_id = 'like_button_' + post_id.substring(5),
        elem = document.getElementById(like_id),
        evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    elem.dispatchEvent(evt);
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
        e=window.event;
    var code=e.charCode?e.charCode:e.keyCode;
    if(!e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey) {
        if (code == 76) {
            var positions = getPosts(),
                current_position = document.body.scrollTop + 7;

            for (var i = 0; i < positions.length; ++i) {
                if (current_position >= positions[i][1] &&
                    current_position <= positions[i][1] + positions[i][2]) {
                    like(positions[i][0]);
                }
            }
        }
    }
});
