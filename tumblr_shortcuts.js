(function() {
  var $, Shortcuts, Tumblr, curPost, hasClass, loc, shortcuts, tumblr;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = function(id) {
    return document.getElementById(id);
  };
  hasClass = function(elem, cls) {
    var _ref;
    return (_ref = elem.className) != null ? _ref.match(new RegExp('\\b' + cls + '\\b', 'im')) : void 0;
  };
  Shortcuts = (function() {
    function Shortcuts() {
      this._interceptor = __bind(this._interceptor, this);      this._mapping = {};
      this._lookup = {
        enter: 13,
        escape: 27,
        up: 38,
        left: 37,
        right: 39,
        down: 40
      };
      window.addEventListener("keydown", this._interceptor);
    }
    Shortcuts.prototype.add = function(shortcut, func) {
      var f, s, _results;
      if (func == null) {
        _results = [];
        for (s in shortcut) {
          f = shortcut[s];
          _results.push(this._add(s, f));
        }
        return _results;
      } else {
        return this._add(shortcut, func);
      }
    };
    Shortcuts.prototype._add = function(shortcut, func) {
      var code, inp, key, mod, _, _ref;
      _ref = shortcut.match(/((ctrl|alt|meta|shift)\+)?([a-z0-9]+)(:input)?/i), _ = _ref[0], _ = _ref[1], mod = _ref[2], key = _ref[3], inp = _ref[4];
      code = key.length === 1 ? key.toUpperCase().charCodeAt(0) : this._lookup[key];
      mod = this._serialize_mod({
        altKey: mod === 'alt',
        ctrlKey: mod === 'ctrl',
        shiftKey: mod === 'shift',
        metaKey: mod === 'meta'
      });
      if (this._mapping[code] == null) {
        this._mapping[code] = {};
      }
      return this._mapping[code][mod] = {
        input: inp != null,
        event: func
      };
    };
    Shortcuts.prototype._is_input = function(el) {
      return (el instanceof HTMLTextAreaElement) || (el instanceof HTMLInputElement);
    };
    Shortcuts.prototype._serialize_mod = function(m) {
      return 1 * m.altKey + 2 * m.ctrlKey + 4 * m.metaKey + 8 * m.shiftKey;
    };
    Shortcuts.prototype._interceptor = function(e) {
      var mod, press;
      if (e == null) {
        e = window.event;
      }
      press = this._mapping[e.charCode || e.keyCode];
      mod = this._serialize_mod(e);
      if ((press != null) && (press[mod] != null) && this._is_input(e.target) === press[mod].input) {
        return press[mod].event(e);
      }
    };
    return Shortcuts;
  })();
  Tumblr = (function() {
    function Tumblr() {
      this.prevPost = __bind(this.prevPost, this);
      this.nextPost = __bind(this.nextPost, this);
      this.prevPage = __bind(this.prevPage, this);
      this.nextPage = __bind(this.nextPage, this);
      this.changeBlog = __bind(this.changeBlog, this);
      this.queuePost = __bind(this.queuePost, this);
      this.cancelReblog = __bind(this.cancelReblog, this);
      this.confirmReblog = __bind(this.confirmReblog, this);
      this.sendReply = __bind(this.sendReply, this);
      this.view = __bind(this.view, this);
      this.like = __bind(this.like, this);
      this.page = __bind(this.page, this);
      this.reblog = __bind(this.reblog, this);
    }
    Tumblr.prototype._clickElement = function(elem, ctrl) {
      var evt;
      if (ctrl == null) {
        ctrl = false;
      }
      if (elem == null) {
        return;
      }
      evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, ctrl, false, false, false, 0, null);
      return elem.dispatchEvent(evt);
    };
    Tumblr.prototype._pressKey = function(key) {
      var evt;
      evt = document.createEvent("KeyboardEvent");
      evt.initKeyboardEvent("keydown", true, true, null, key.charCodeAt(0), false, false, false, 0);
      return document.dispatchEvent(evt);
    };
    Tumblr.prototype._changeSelected = function(elem, index) {
      var evt;
      if (elem == null) {
        return;
      }
      elem.selectedIndex = index;
      evt = document.createEvent("Event");
      evt.initEvent('change', true, false);
      return elem.dispatchEvent(evt);
    };
    Tumblr.prototype._getReblogLink = function(post_id) {
      var a, controls, elem, links, _i, _len, _ref;
      elem = $(post_id);
      controls = elem.getElementsByClassName("post_controls")[0];
      links = controls.getElementsByTagName("a");
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        a = links[_i];
        if ((_ref = a.href) != null ? _ref.match('reblog') : void 0) {
          return a;
        }
      }
    };
    Tumblr.prototype.reblog = function(post_id, new_tab) {
      if (new_tab == null) {
        new_tab = false;
      }
      return this._clickElement(this._getReblogLink(post_id), new_tab);
    };
    Tumblr.prototype.page = function(post_id) {
      var el, link;
      el = this._getReblogLink(post_id);
      link = decodeURIComponent(el.href.match(/redirect_to=.*/)[0].substring('redirect_to='.length));
      return window.location.replace(link);
    };
    Tumblr.prototype.like = function(post_id) {
      var like_id;
      like_id = 'like_button_' + post_id.substring('post_'.length);
      return this._clickElement($(like_id));
    };
    Tumblr.prototype.view = function(post_id) {
      var permalink;
      permalink = 'permalink_' + post_id.substring('view_'.length);
      return this._clickElement($(permalink), true);
    };
    Tumblr.prototype.sendReply = function(elem) {
      var reply_id;
      reply_id = 'reply_button_' + elem.id.substring('reply_field_'.length);
      return this._clickElement($(reply_id));
    };
    Tumblr.prototype.confirmReblog = function() {
      return this._clickElement($('save_button'));
    };
    Tumblr.prototype.cancelReblog = function() {
      return this._clickElement($('cancel_button'));
    };
    Tumblr.prototype.queuePost = function() {
      return this._changeSelected($('post_state'), 1);
    };
    Tumblr.prototype.changeBlog = function() {
      var elem, idx;
      elem = $('channel_id');
      idx = elem.selectedIndex < elem.length - 1 ? elem.selectedIndex + 1 : 0;
      return this._changeSelected(elem, idx);
    };
    Tumblr.prototype.nextPage = function() {
      return this._clickElement($('next_page_link'));
    };
    Tumblr.prototype.prevPage = function() {
      return this._clickElement($('previous_page_link'));
    };
    Tumblr.prototype.nextPost = function() {
      return this._pressKey('J');
    };
    Tumblr.prototype.prevPost = function() {
      return this._pressKey('K');
    };
    return Tumblr;
  })();
  curPost = function() {
    var elem, pos, posts, _i, _len;
    pos = document.body.scrollTop + 7;
    posts = $("posts").childNodes;
    for (_i = 0, _len = posts.length; _i < _len; _i++) {
      elem = posts[_i];
      if (hasClass(elem, 'post')) {
        if (pos >= elem.offsetTop && pos <= elem.offsetTop + elem.offsetHeight) {
          return elem.id;
        }
      }
    }
  };
  tumblr = new Tumblr;
  shortcuts = new Shortcuts;
  loc = window.location.href.toLowerCase();
  if (loc.indexOf('/dashboard') !== -1) {
    shortcuts.add({
      'l': function() {
        return tumblr.like(curPost());
      },
      'r': function() {
        return tumblr.reblog(curPost());
      },
      'v': function() {
        return tumblr.view(curPost());
      },
      'p': function() {
        return tumblr.page(curPost());
      },
      'alt+r': function() {
        return tumblr.reblog(curPost(), true);
      },
      'ctrl+enter:input': function(e) {
        return tumblr.sendReply(e.target);
      },
      'alt+right': tumblr.nextPage,
      'alt+left': tumblr.prevPage,
      'alt+up': tumblr.prevPost,
      'alt+down': tumblr.nextPost
    });
  } else if (loc.indexOf('/reblog/') !== -1) {
    shortcuts.add({
      'b': tumblr.changeBlog,
      'alt+b': function() {
        tumblr.changeBlog();
        return tumblr.confirmReblog();
      },
      'q': tumblr.queuePost,
      'alt+q': function() {
        tumblr.queuePost();
        return tumblr.confirmReblog();
      },
      'escape': tumblr.cancelReblog,
      'ctrl+enter': tumblr.confirmReblog
    });
  }
}).call(this);
