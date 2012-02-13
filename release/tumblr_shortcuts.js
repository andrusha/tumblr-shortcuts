(function() {
  var $, Help, Shortcuts, Tumblr, hasClass, help, loc, shortcuts, toggleClass, tumblr,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = function(id) {
    return document.getElementById(id);
  };

  hasClass = function(elem, cls) {
    var _ref;
    return (_ref = elem.className) != null ? _ref.match(new RegExp('\\b' + cls + '\\b', 'im')) : void 0;
  };

  toggleClass = function(elem, cls) {
    if (hasClass(elem, cls)) {
      return elem.className = elem.className.replace(cls, '');
    } else {
      return elem.className += cls;
    }
  };

  Shortcuts = (function() {

    function Shortcuts() {
      this._interceptor = __bind(this._interceptor, this);
      var i;
      this._mapping = {};
      this._lookup = {
        enter: 13,
        escape: 27,
        up: 38,
        left: 37,
        right: 39,
        down: 40
      };
      for (i = 1; i <= 12; i++) {
        this._lookup["f" + i] = 111 + i;
      }
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
      if (this._mapping[code] == null) this._mapping[code] = {};
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
      if (e == null) e = window.event;
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
      this.curPost = __bind(this.curPost, this);
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
      this.page = __bind(this.page, this);
      this.reblog = __bind(this.reblog, this);
    }

    Tumblr.prototype._clickElement = function(elem, ctrl) {
      var evt;
      if (ctrl == null) ctrl = false;
      if (elem == null) return;
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
      if (elem == null) return;
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
        if ((_ref = a.href) != null ? _ref.match('reblog') : void 0) return a;
      }
    };

    Tumblr.prototype.reblog = function(post_id, new_tab) {
      if (new_tab == null) new_tab = false;
      return this._clickElement(this._getReblogLink(post_id), new_tab);
    };

    Tumblr.prototype.page = function(post_id) {
      var el, link;
      el = this._getReblogLink(post_id);
      link = decodeURIComponent(el.href.match(/redirect_to=.*/)[0].substring('redirect_to='.length));
      return window.location.replace(link);
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

    Tumblr.prototype.curPost = function() {
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

    return Tumblr;

  })();

  Help = (function() {

    function Help() {
      this.toggle = __bind(this.toggle, this);
      this.injectHTML = __bind(this.injectHTML, this);
      this.injectStyles = __bind(this.injectStyles, this);
      var _this = this;
      this.injected = false;
      window.addEventListener("load", function() {
        return _this.inject();
      });
    }

    Help.prototype.inject = function() {
      if (this.injected) return;
      this.injected = true;
      this.injectStyles();
      return this.injectHTML();
    };

    Help.prototype.injectStyles = function() {
      var content, style;
      style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      content = document.createTextNode("#tumblr_shortcuts_help {\n    color: white;\n    cursor: pointer;\n}\n#tumblr_shortcuts_help.hidden {\n    display: none;\n}\n#tumblr_shortcuts_curtain {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    background: black;\n    opacity: 0.3;\n    z-index: 10000;\n}\n#tumblr_shortcuts_popup {\n    position: fixed;\n    width: 400px;\n    top: 150px;\n    left: 50%;\n    margin-left: -200px;\n    background: black;\n    opacity: 0.8;\n    padding: 30px;\n    border-radius: 10px;\n    z-index: 20000;\n}\n#tumblr_shortcuts_popup h1, #tumblr_shortcuts_popup h2, #tumblr_shortcuts_popup p {\n    color: white;\n}\n#tumblr_shortcuts_popup table tr td:last {\n    padding-left: 10px;\n}");
      style.appendChild(content);
      return document.head.appendChild(style);
    };

    Help.prototype.injectHTML = function() {
      var container;
      container = document.createElement('div');
      container.setAttribute('id', 'tumblr_shortcuts_help');
      container.setAttribute('class', 'hidden');
      container.innerHTML = "<div id=\"tumblr_shortcuts_curtain\"></div>\n<div id=\"tumblr_shortcuts_popup\">\n    <h1>Shortcuts</h1>\n\n    <h2>Dashboard</h2>\n    <p>\n        <table>\n        <tbody>\n            <tr>\n                <td>j</td><td>next post</td>\n            </tr>\n            <tr>\n                <td>k</td><td>previous post</td>\n            </tr>\n            <tr>\n                <td>l</td><td>like</td>\n            </tr>\n            <tr>\n                <td>r</td><td>reblog</td>\n            </tr>\n            <tr>\n                <td>alt&nbsp;+&nbsp;r</td><td>reblog in a new tab</td>\n            </tr>\n            <tr>\n                <td>v</td><td>view post in a new tab (without loosing focus)</td>\n            </tr>\n            <tr>\n                <td>p</td><td>open current page</td>\n            </tr>\n            <tr>\n                <td>ctrl&nbsp;+&nbsp;enter</td><td>(while writing a reply) send reply</td>\n            </tr>\n        </tbody>\n        </table>\n    </p>\n\n    <h2>Reblog page</h2>\n    <p>\n        <table>\n        <tbody>\n            <tr>\n                <td>ctrl&nbsp;+&nbsp;enter</td><td>confirm reblogging</td>\n            </tr>\n            <tr>\n                <td>esc</td><td>cancel</td>\n            </tr>\n            <tr>\n                <td>q</td><td>select \"add to queue\" instead of \"publish now\"</td>\n            </tr>\n            <tr>\n                <td>alt&nbsp;+&nbsp;q</td><td>place post in the queue</td>\n            </tr>\n            <tr>\n                <td>b</td><td>switch blogs</td>\n            </tr>\n            <tr>\n                <td>alt&nbsp;+&nbsp;b</td><td>switch blog & publish</td>\n            </tr>\n        </tbody>\n        </table>\n    </p>\n\n</div>";
      container.addEventListener('click', this.toggle);
      return document.body.appendChild(container);
    };

    Help.prototype.toggle = function() {
      this.inject();
      return toggleClass($('tumblr_shortcuts_help'), 'hidden');
    };

    return Help;

  })();

  tumblr = new Tumblr;

  shortcuts = new Shortcuts;

  help = new Help;

  shortcuts.add({
    'f1': help.toggle
  });

  loc = window.location.href.toLowerCase();

  if (loc.indexOf('/dashboard') !== -1) {
    shortcuts.add({
      'r': function() {
        return tumblr.reblog(Tumblr.curPost());
      },
      'v': function() {
        return tumblr.view(Tumblr.curPost());
      },
      'p': function() {
        return tumblr.page(Tumblr.curPost());
      },
      'alt+r': function() {
        return tumblr.reblog(Tumblr.curPost(), true);
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
