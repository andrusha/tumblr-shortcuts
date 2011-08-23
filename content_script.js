(function() {
  var $, cancelReblog, clickElement, confirmReblog, ctrlModifier, getPosts, hasClass, keyOnDashboard, keyOnReblog, like, noModifiers, reblog, sendReply, view;
  $ = function(id) {
    return document.getElementById(id);
  };
  hasClass = function(elem, cls) {
    var _ref;
    return (_ref = elem.className) != null ? _ref.match(new RegExp('\\b' + cls + '\\b', 'im')) : void 0;
  };
  noModifiers = function(e) {
    return !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
  };
  ctrlModifier = function(e) {
    return e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
  };
  clickElement = function(elem, ctrl) {
    var evt;
    if (ctrl == null) {
      ctrl = false;
    }
    if (!elem) {
      return;
    }
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null);
    return elem.dispatchEvent(evt);
  };
  reblog = function(post_id) {
    var controls, elem, link, links, _i, _len, _ref;
    elem = $(post_id);
    controls = elem.getElementsByClassName("post_controls")[0];
    links = controls.getElementsByTagName("a");
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      link = links[_i];
      if ((_ref = a.href) != null ? _ref.match('reblog') : void 0) {
        return clickElement(link);
      }
    }
  };
  like = function(post_id) {
    var like_id;
    like_id = 'like_button_' + post_id.substring(5);
    return clickElement($(like_id));
  };
  view = function(post_id) {
    var permalink;
    permalink = 'permalink_' + post_id.substring(5);
    return clickElement($(permalink), true);
  };
  sendReply = function(elem) {
    var reply_id;
    reply_id = 'reply_button_' + elem.id.substring(12);
    return clickElement($(reply_id));
  };
  confirmReblog = function() {
    return clickElement($('save_button'));
  };
  cancelReblog = function() {
    return clickElement($('cancel_button'));
  };
  getPosts = function() {
    var elem, getPos, positions, posts;
    getPos = function(elem) {
      return [elem.id, elem.offsetTop, elem.offsetHeight];
    };
    posts = $("posts").childNodes;
    positions = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = posts.length; _i < _len; _i++) {
        elem = posts[_i];
        if (hasClass(elem, 'post')) {
          _results.push(getPos(elem));
        }
      }
      return _results;
    })();
    return positions;
  };
  keyOnDashboard = function(e, code) {
    var cur_pos, pos, positions, post_id, _i, _len, _results;
    if (noModifiers(e && [76, 82, 86].indexOf(code) > -1 && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLInputElement))) {
      positions = getPosts();
      cur_pos = document.body.scrollTop + 7;
      _results = [];
      for (_i = 0, _len = positions.length; _i < _len; _i++) {
        pos = positions[_i];
        _results.push((function() {
          if (cur_pos >= pos[1] && cur_pos <= pos[1] + pos[2]) {
            post_id = pos[0];
            switch (code) {
              case 76:
                return like(post_id);
              case 82:
                return reblog(post_id);
              case 86:
                return view(post_id);
            }
          }
        })());
      }
      return _results;
    } else if (code === 13 && ctrlModifier(e && (e.target instanceof HTMLTextAreaElement) && (hasClass(e.target, 'reply_text')))) {
      return sendReply(e.target);
    }
  };
  keyOnReblog = function(e, code) {
    if (code === 13 && ctrlModifier(e)) {
      return confirmReblog();
    } else if (code === 27 && noModifiers(e)) {
      return cancelReblog();
    }
  };
  window.addEventListener("keydown", function(e) {
    var code, loc;
    if (e == null) {
      e = window.event;
    }
    code = e.charCode ? e.charCode : e.keyCode;
    loc = window.location.href.toLowerCase();
    if (loc.indexOf('/reblog/') !== -1) {
      return keyOnReblog(e, code);
    } else if (loc.indexOf('/dashboard') !== -1) {
      return keyOnDashboard(e, code);
    }
  });
}).call(this);
