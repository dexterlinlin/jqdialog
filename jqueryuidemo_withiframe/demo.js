jQuery.extend(jQuery, {
  // jQuery UI alert弹出提示
  jqalert: function(text, title, fn) {
    var html =
    '<div class="dialog" id="dialog-message">' +
    '  <p>' +
    '    <span class="ui-icon ui-icon-circle-check" style="float: left; margin: 0 7px 0 0;"></span>' + text +
    '  </p>' +
    '</div>';
    return $(html).dialog({
      //autoOpen: false,
      resizable: false,
      modal: true,
      show: {
        effect: 'fade',
        duration: 300
      },
      title: title || "提示信息",
      buttons: {
        "确定": function() {
          var dlg = $(this).dialog("close");
          fn && fn.call(dlg);
        }
      }      
    });
  },
  // jQuery UI alert弹出提示,一定间隔之后自动关闭
  jqtimeralert: function(text, title, fn, timerMax) {
    var dd = $(
    '<div class="dialog" id="dialog-message">' +
    '  <p>' +
    '    <span class="ui-icon ui-icon-circle-check" style="float: left; margin: 0 7px 0 0;"></span>' + text +
    '  </p>' +
    '</div>');
    dd[0].timerMax = timerMax || 3;
    return dd.dialog({
      //autoOpen: false,
      resizable: false,
      modal: true,
      show: {
        effect: 'fade',
        duration: 300
      },
      open: function(e, ui) {
        var me = this,
          dlg = $(this),
          btn = dlg.parent().find(".ui-button-text").text("确定(" + me.timerMax + ")");
        --me.timerMax;
        me.timer = window.setInterval(function() {
          btn.text("确定(" + me.timerMax + ")");
          if (me.timerMax-- <= 0) {
            dlg.dialog("close");
            fn && fn.call(dlg);
            window.clearInterval(me.timer); // 时间到了清除计时器
          }
        }, 1000);
      },
      title: title || "提示信息",
      buttons: {
        "确定": function() {
          var dlg = $(this).dialog("close");
          fn && fn.call(dlg);
          window.clearInterval(this.timer); // 清除计时器
        }
      },
      close: function() {
        window.clearInterval(this.timer); // 清除计时器
      }
    });
  },
  // jQuery UI confirm弹出确认提示
  jqconfirm: function(text, title, fn1, fn2) {
    var html =
    '<div class="dialog" id="dialog-confirm">' +
    '  <p>' +
    '    <span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>' + text +
    '  </p>' +
    '</div>';
    return $(html).dialog({
      //autoOpen: false,
      resizable: false,
      modal: true,
      show: {
        effect: 'fade',
        duration: 300
      },
      title: title || "提示信息",
      buttons: {
        "确定": function() {
          var dlg = $(this).dialog("close");
          fn1 && fn1.call(dlg, true);
        },
        "取消": function() {
          var dlg = $(this).dialog("close");
          fn2 && fn2(dlg, false);
        }
      }
    });
  },
  // jQuery UI 弹出iframe窗口
  jqopen: function(url, options) {
    var html =
    '<div class="dialog" id="dialog-window" title="提示信息">' +
    ' <iframe src="' + url + '" frameBorder="0" style="border: 0; " scrolling="auto" width="100%" height="100%"></iframe>' +
    '</div>';
    return $(html).dialog($.extend({
      modal: true,
      closeOnEscape: false,
      draggable: true,
      resizable: true,
      close: function(event, ui) {
        $(this).dialog("destroy"); // 关闭时销毁
      }
    }, options));
  },
  // jQuery UI confirm提示
  confirm: function(evt, text, title) {
    evt = $.event.fix(evt);
    var me = evt.target;
    if (me.confirmResult) {
      me.confirmResult = false;
      return true;
    }
    jQuery.jqconfirm(text, title, function(e) {
      me.confirmResult = true;
      if (e) {
        if (me.href && $.trim(me.href).indexOf("javascript:") == 0) {
          $.globalEval(me.href);
          me.confirmResult = false;
          return;
        }
        var t = me.type && me.type.toLowerCase();
        if (t && me.name && (t == "image" || t == "submit" || t == "button")) {
          __doPostBack(me.name, "");
          me.confirmResult = false;
          return;
        }
        if (me.click) me.click(evt);
      }
      return false;
    });
    return false;
  }
});