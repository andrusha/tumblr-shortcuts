var just_clicked_account_menu=false,just_clicked_search_menu=false,just_clicked_user_menu=false,just_clicked_dashboard_switch_blog_menu=false,notes_slide_effect=false,reply_slide_effect=false,key_commands_are_suspended=false,report_tumblelog_bar_timeout=false,video_thumbnail_hover=false,running_image_queue=false,footer_animating=false,footer_hover=false,loading_next_page=false,stop_checking_for_new_posts=false,search_text_for_current_page=l10n_str.my_posts,is_ie=(navigator.appName&&navigator.appName=="Microsoft Internet Explorer"?true:false),assets_url=('https:'==document.location.protocol?'https://www.tumblr.com':'http://assets.tumblr.com'),preload_filenames=[assets_url+'/images/chrome_button_active_bg.png?2',assets_url+'/images/chrome_button_active_left.png?2',assets_url+'/images/chrome_button_active_right.png?2',assets_url+'/images/chrome_button_disabled_bg.png',assets_url+'/images/chrome_button_disabled_left.png',assets_url+'/images/chrome_button_disabled_right.png',assets_url+'/images/inline_photo_loading.gif',assets_url+'/images/black_75.png',assets_url+'/images/white_80.png'],preload_images=[],image_queue=[];
Event.observe(window,'dom:loaded', function() {
	preload_filenames.each( function(filename,i) {
		add_to_image_queue(false,filename)
	})
});
if(top!=self)
	top.location.href=self.location.href;
function track_link_click(link) {
	link.original_href=link.href;
	link.href='http://www.tumblr.com/route?url='+encodeURIComponent(link.href);
	setTimeout( function() {
		link.href=link.original_href
	},0)
}

function select_field(element) {
	el=$(element);
	if(el.createTextRange) {
		var oRange=el.createTextRange();
		oRange.moveStart("character",0);
		oRange.moveEnd("character",el.value.length);
		oRange.select()
	} else if(el.setSelectionRange) {
		el.setSelectionRange(0,el.value.length)
	}
}

function suspend_key_commands() {
	key_commands_are_suspended=true
}

function resume_key_commands() {
	key_commands_are_suspended=false
}

function click_body() {
	if(just_clicked_account_menu) {
		if($('account_menu'))
			$('account_menu').toggle();
		if($('search_controls'))
			$('search_controls').hide();
		if($('dashboard_switch_blog_menu_wrapper'))
			$('dashboard_switch_blog_menu_wrapper').hide();
		just_clicked_account_menu=false
	} else if(just_clicked_search_menu) {
		if($('account_menu'))
			$('account_menu').hide();
		if($('search_controls'))
			$('search_controls').toggle();
		if($('dashboard_switch_blog_menu_wrapper'))
			$('dashboard_switch_blog_menu_wrapper').hide();
		just_clicked_search_menu=false
	} else if(just_clicked_dashboard_switch_blog_menu) {
		if($('account_menu'))
			$('account_menu').hide();
		if($('search_controls'))
			$('search_controls').hide();
		if($('dashboard_switch_blog_menu_wrapper'))
			$('dashboard_switch_blog_menu_wrapper').show();
		just_clicked_dashboard_switch_blog_menu=false
	} else {
		if($('account_menu'))
			$('account_menu').hide();
		if($('search_controls'))
			$('search_controls').hide();
		if($('dashboard_switch_blog_menu_wrapper'))
			$('dashboard_switch_blog_menu_wrapper').hide()
	}
	if($('account_menu')) {
		if(Element.visible('account_menu')||window.location.toString().match('settings')||window.location.toString().match('preferences')) {
			$('account_nav_item').addClassName('active')
		} else {
			$('account_nav_item').removeClassName('active')
		}
	}
	if($$('.user_menu')) {
		if(!just_clicked_user_menu) {
			hide_user_menus()
		} else {
			just_clicked_user_menu=false
		}
	}
}

function hide_user_menus() {
	if($$('.user_menu')) {
		$$('.user_menu').each( function(item) {
			$(item).hide()
		})
	}
	if($$(".user_menu_info")) {
		$$('.user_menu_info').each( function(item) {
			item.style.display='inline'
		})
	}
}

function refresh_search_controls() {
	$$('#search_controls .check').invoke('hide');
	$$('#'+$('search_scope').value+' .check').invoke('show');
	if($('search_scope').value=='all_of_tumblr')
		default_search_text=l10n_str.search_tumblr;
	else if($('search_scope').value=='everyone_i_follow')
		default_search_text=l10n_str.my_dashboard;
	else if($('search_scope').value=='my_posts')
		default_search_text=search_text_for_current_page;
	else if($('search_scope').value=='help_docs')
		default_search_text=l10n_str.search_help;
	else if($('search_scope').value=='posts_by_tag')
		default_search_text=l10n_str.search_by_tag;
	if([l10n_str.search,l10n_str.search_tumblr,l10n_str.my_dashboard,l10n_str.my_posts,l10n_str.search_help,l10n_str.search_by_tag,l10n_str.this_tumblelog].include($('search_query').value)) {
		$('search_query').value=default_search_text
	}
}

function track(action,tags) {new Ajax.Request('/beacon?'+escape(action).replace('%20','+')+(tags?'&'+escape(tags).replace('%20','+'):''), {
		method:'get',
		asynchronous:false
	})
}

function track_event(link,category,action,label) {
	if(window.pageTracker!==undefined) {
		pageTracker._trackEvent(category,action,label)
	}
	if(link) {
		setTimeout('document.location = "'+link.href+'"',100)
	}
}

function reset_post_notes(post_id) {
	$('notes_outer_container_'+post_id).hide();
	$('notes_hide_link_'+post_id).hide();
	$('notes_container_'+post_id).hide();
	$('notes_loader_'+post_id).show()
}

function display_post_notes(id,tumblelog_key) {
	if(notes_slide_effect&&notes_slide_effect.state=='running')
		return;
	if(Element.visible('notes_outer_container_'+id)) {
		if(Element.visible('notes_loader_'+id))
			return false;
		if(is_ie) {
			$('notes_outer_container_'+id).hide()
		} else {
			notes_slide_effect=Effect.SlideUp('notes_outer_container_'+id)
		}
		return false
	}
	if(Element.visible('notes_hide_link_'+id)) {
		if(is_ie) {
			$('notes_outer_container_'+id).show()
		} else {
			notes_slide_effect=Effect.SlideDown('notes_outer_container_'+id)
		}
		return false
	}new Ajax.Updater('notes_container_'+id,'/dashboard/notes/'+id+'/'+tumblelog_key, {
		evalScripts:true,
		onComplete: function() {
			$('notes_control_'+id).style.height='auto';
			$('notes_loader_'+id).hide();
			$('notes_hide_link_'+id).show();
			if(is_ie) {
				$('notes_container_'+id).show()
			} else {
				notes_slide_effect=Effect.SlideDown('notes_container_'+id, {
					duration:0.5
				})
			}
		}
	});
	if(is_ie) {
		$('notes_outer_container_'+id).show()
	} else {
		notes_slide_effect=Effect.SlideDown('notes_outer_container_'+id, {
			duration:0.5,
			afterFinish: function() {
				$('notes_outer_container_'+id).style.height='auto'
			}
		})
	}
}

function display_more_post_notes(post_id,key,from,dashboard) {
	var more_container_id='more_notes_container_'+post_id;new Ajax.Updater(more_container_id,(dashboard?'/dashboard':'')+'/notes/'+post_id+'/'+key, {
		parameters: {
			from_c:from
		},
		insertion:Insertion.Bottom,
		onComplete: function() {
			this.show();
			this.previous('.show_more_notes').remove()
		}.bind($(more_container_id))
	})
}

function display_reply_pane(post,context) {
	if(typeof post!='object') {
		post=[post,false]
	}
	if(typeof context=='undefined') {
		context=false
	}
	if(reply_slide_effect&&reply_slide_effect.state=='running')
		return;
	var post_id=post[0];
	var post_tumblelog_key=post[1];
	if(!$('reply_pane_outer_container_'+post_id))
		return false;
	if(!$('reply_pane_'+post_id)) {
		if(!post_tumblelog_key)
			return;
		$('reply_pane_outer_container_'+post_id).innerHTML=''+'<div style="padding:0 0 18px 0;">'+'<div class="reply_pane" id="reply_pane_'+post_id+'">'+'<form action="/reply" method="post" id="reply_form_'+post_id+'" '+'onsubmit="if ($(\'reply_field_'+post_id+'\').value){submit_reply('+post_id+');} return false;">'+'<input type="hidden" name="post_id" value="'+post_id+'" />'+'<input type="hidden" name="key" value="'+post_tumblelog_key+'" />'+'<div class="nipple" id="reply_pane_nipple_'+post_id+'" style="left:420px"></div>'+'<textarea soft_maxlength="250" id="reply_field_'+post_id+'" name="reply_text" class="reply_text" '+'onfocus="focus_reply_field('+post_id+')" onblur="blur_reply_field('+post_id+')"'+(is_ie?' style="background:#fff;"':'')+'></textarea>'+'<div class="reply_pane_controls_left">'+'<div style="float:left; padding-right:8px;">'+'<button id="reply_button_'+post_id+'" class="chrome" type="submit" disabled="disabled"><div class="chrome_button"><div class="chrome_button_left"></div>'+l10n_str.reply+'<div class="chrome_button_right"></div></div></button>'+'</div>'+'<div class="reply_char_count">'+'<span id="reply_char_max_'+post_id+'">'+l10n_str['250_max']+'</span>'+'<span id="reply_char_count_'+post_id+'" style="display:none;">250</span>'+'</div>'+'</div>'+'<div class="reply_pane_controls_right">'+'<a href="#" onclick="display_reply_pane('+post_id+'); return false;">'+l10n_str.cancel+'</a>'+'</div>'+'<div class="clear"></div>'+'</form>'+'</div>'+'</div>'
	}
	if(Element.visible('reply_pane_outer_container_'+post_id)) {
		if(is_ie) {
			$('reply_pane_outer_container_'+post_id).hide()
		} else {
			reply_slide_effect=Effect.SlideUp('reply_pane_outer_container_'+post_id, {
				duration:0.5
			})
		}
		if($('reply_char_count_'+post_id).hasClassName('over_limit'))
			$('reply_char_count_'+post_id).removeClassName('over_limit');
		$('reply_char_count_'+post_id).innerHTML=$('reply_field_'+post_id).getAttribute('soft_maxlength');
		if(Element.visible('reply_char_count_'+post_id))
			$('reply_char_count_'+post_id).hide();
		if(!Element.visible('reply_char_max_'+post_id))
			$('reply_char_max_'+post_id).show();
		$('reply_field_'+post_id).value='';
		$('reply_button_'+post_id).disabled=true;
		if(context&&(context=='note'||context=='notification')&&$('reply_toggle_'+post_id)&&$('reply_toggle_'+post_id).hasClassName('dont_show_on_hover')) {
			(function() {
				$('reply_toggle_'+post_id).removeClassName('dont_show_on_hover')
			}).delay(0.5)
		}
		return false
	}
	if(is_ie) {
		$('reply_pane_outer_container_'+post_id).show()
	} else {
		reply_slide_effect=Effect.SlideDown('reply_pane_outer_container_'+post_id, {
			duration:0.5
		})
	}
	(function() {
		$('reply_field_'+post_id).focus()
	}).delay(0.51);
	if($('reply_pane_nipple_'+post_id)&&!$('reply_pane_nipple_'+post_id).getAttribute('in_final_position')) {
		var label_left=$('post_control_reply_'+post_id).positionedOffset().left;
		var label_width=$('post_control_reply_'+post_id).getWidth();
		var nipple_offset=24;
		if(is_ie)
			nipple_offset=114;
		$('reply_pane_nipple_'+post_id).style.left=Math.floor((label_left-nipple_offset)+(label_width/2))+"px";
		$('reply_pane_nipple_'+post_id).setAttribute('in_final_position','true')
	}
	if(context&&(context=='note'||context=='notification')&&$('reply_toggle_'+post_id)&&!$('reply_toggle_'+post_id).hasClassName('dont_show_on_hover')) {
		$('reply_toggle_'+post_id).addClassName('dont_show_on_hover')
	}
}

function focus_reply_field(post_id) {
	suspend_key_commands();
	var max_length=$('reply_field_'+post_id).getAttribute('soft_maxlength');new Form.Element.Observer('reply_field_'+post_id,0.2, function(el,value) {
		if(value.length) {
			if(!Element.visible('reply_char_count_'+post_id))
				$('reply_char_count_'+post_id).show();
			if(Element.visible('reply_char_max_'+post_id))
				$('reply_char_max_'+post_id).hide();
			$('reply_char_count_'+post_id).innerHTML=max_length-value.length;
			if(value.length>max_length) {
				if(!$('reply_char_count_'+post_id).hasClassName('over_limit'))
					$('reply_char_count_'+post_id).addClassName('over_limit');
				if(!$('reply_button_'+post_id).disabled)
					$('reply_button_'+post_id).disabled=true
			} else {
				if($('reply_char_count_'+post_id).hasClassName('over_limit'))
					$('reply_char_count_'+post_id).removeClassName('over_limit');
				if($('reply_button_'+post_id).disabled)
					$('reply_button_'+post_id).disabled=false
			}
		} else {
			$('reply_char_count_'+post_id).innerHTML=max_length;
			if($('reply_char_count_'+post_id).hasClassName('over_limit'))
				$('reply_char_count_'+post_id).removeClassName('over_limit');
			if(!$('reply_button_'+post_id).disabled)
				$('reply_button_'+post_id).disabled=true
		}
	})
}

function blur_reply_field(post_id) {
	resume_key_commands()
}

function submit_reply(post_id,context) {
	if(typeof context=='undefined') {
		context=false
	}new Ajax.Request('/reply', {
		asynchronous:true,
		parameters:$('reply_form_'+post_id).serialize()
	});
	if($('post_control_reply_'+post_id))
		$('post_control_reply_'+post_id).hide();
	display_reply_pane(post_id,context)
}

function submit_answer(post_id) {
	increment_note_count(post_id);new Ajax.Request('/answer', {
		asynchronous:true,
		parameters:$('answer_form_'+post_id).serialize()
	});
	if(is_ie) {
		$('answer_container_'+post_id).innerHTML='<div class="answer_container">'+l10n_str.you_answered+' <span style="font-weight:normal;">'+$('answer_text_'+post_id).value.replace('<','&lt;')+'</span></div>'
	} else {
		$('answer_status_'+post_id).innerHTML=l10n_str.thank_you;
		$('answer_text_'+post_id).disable();
		Effect.SlideUp('answer_container_'+post_id, {
			afterFinish: function() {
				$('answer_container_'+post_id).innerHTML='<div class="answer_container">'+l10n_str.you_answered+' <span style="font-weight:normal;">'+$('answer_text_'+post_id).value.replace('<','&lt;')+'</span></div>';
				Effect.SlideDown('answer_container_'+post_id)
			}
		})
	}
}

function increment_note_count(post_id) {
	if(!($('notes_outer_container_'+post_id)&&$('show_notes_link_'+post_id)&&$('note_link_more_'+post_id)&&$('note_link_less_'+post_id)&&$('note_link_current_'+post_id)))
		return false;
	if(!$('notes_outer_container_'+post_id).visible())
		reset_post_notes(post_id);
	$('show_notes_link_'+post_id).show();
	if($('note_link_less_'+post_id).visible()) {
		$('note_link_less_'+post_id).hide();
		$('note_link_current_'+post_id).show();
		$('note_link_more_'+post_id).hide()
	} else {
		$('note_link_less_'+post_id).hide();
		$('note_link_current_'+post_id).hide();
		$('note_link_more_'+post_id).show()
	}
}

function decrement_note_count(post_id) {
	if(!($('show_notes_link_'+post_id)&&$('note_link_more_'+post_id)&&$('note_link_less_'+post_id)&&$('note_link_current_'+post_id)))
		return false;
	$('show_notes_link_'+post_id).show();
	if($('note_link_more_'+post_id).visible()) {
		$('note_link_less_'+post_id).hide();
		$('note_link_current_'+post_id).show();
		$('note_link_more_'+post_id).hide()
	} else {
		$('note_link_less_'+post_id).hide();
		$('note_link_current_'+post_id).hide();
		$('note_link_less_'+post_id).show()
	}
}

function _submit_like_toggler(post_id) {
	var unlike=$('like_button_'+post_id).hasClassName('already_like')?true:false;
	var like_form_action=$('like_form_'+post_id).action;
	var root_id=$('like_button_'+post_id).hasAttribute('data-root-post-id')?$('like_button_'+post_id).getAttribute('data-root-post-id'):false;
	if(unlike) {
		$('like_button_'+post_id).removeClassName('already_like');
		$('like_form_'+post_id).action=like_form_action.replace('/unlike','/like');
		decrement_note_count(post_id);
		if(root_id) {
			$$('.like_root_'+root_id).invoke('removeClassName','already_like')
		}
	} else {
		$('like_button_'+post_id).addClassName('already_like');
		$('like_form_'+post_id).action=like_form_action.replace('/like','/unlike');
		increment_note_count(post_id);
		if(root_id) {
			$$('.like_root_'+root_id).invoke('addClassName','already_like')
		}
	}
}

function submit_like(post_id,custom_toggler) {
	var like_form_action=$('like_form_'+post_id).action;
	if(typeof custom_toggler=='undefined') {
		_submit_like_toggler(post_id)
	} else {
		custom_toggler()
	}new Ajax.Request(like_form_action, {
		asynchronous:true,
		parameters:Form.serialize($('like_form_'+post_id)),
		onFailure: function() {new Ajax.Request(like_form_action, {
				asynchronous:true,
				parameters:Form.serialize($('like_form_'+post_id)),
				onFailure: function() {
					alert(l10n_str.ajax_error);
					if(typeof custom_toggler=='undefined') {
						_submit_like_toggler(post_id)
					} else {
						custom_toggler()
					}
				}
			})
		}
	})
}

function set_cookie(name,value,expire_days) {
	var ex_date=new Date();
	ex_date.setDate(ex_date.getDate()+expire_days);
	document.cookie=name+"="+escape(value)+((expire_days==null)?"":"; expires="+ex_date.toGMTString())+'; path=/'
}

function pad_seconds(value) {
	return(!isNaN(value)&&value.toString().length==1)?'0'+value:value
}

function generic_follow(form_key,who_to_follow,function_init,function_on_success,function_on_failure,function_shutdown) {
	if(typeof function_init=='undefined'||!function_init) {
		function_init= function() {
			return true
		}
	}
	if(typeof function_on_success=='undefined'||!function_on_success) {
		function_on_success= function() {
			return true
		}
	}
	if(typeof function_on_failure=='undefined'||!function_on_failure) {
		function_on_failure= function() {
			return true
		}
	}
	if(typeof function_shutdown=='undefined'||!function_shutdown) {
		function_shutdown= function() {
			return true
		}
	}
	function_init();new Ajax.Request('/follow', {
		method:'post',
		asynchronous:true,
		parameters: {
			form_key:form_key,
			id:who_to_follow
		},
		onSuccess: function() {
			function_on_success()
		},
		onFailure: function() {
			function_on_failure()
		}
	});
	return function_shutdown()
}

function block(tumblelog,el,context,form_key,show_report_bar) {
	if(typeof(show_report_bar)=='undefined')
		show_report_bar=false;
	var target_is_ip=tumblelog.substring(0,3)=='ip:'?true:false;
	var confirm_text=target_is_ip?l10n_str.confirm_block_this_person:l10n_str.confirm_block.replace('%1$s',tumblelog);
	el=$(el);
	if(confirm(confirm_text)) {
		block_tumblelog(tumblelog,form_key);
		if(context=='note') {new Effect.Fade(el.up(), {
				duration:0.5
			})
		} else if(context=='notification') {new Effect.Fade(el.up(), {
				duration:0.5,
				to:0.5
			});
			el.innerHTML=''
		} else if(context=='followers') {new Effect.Fade(el, {
				duration:0.5
			})
		}
		if(show_report_bar&&$('report_tumblelog_bar')) {
			if(target_is_ip) {
				$('report_tumblelog_name').innerHTML='';
				$('report_tumblelog_with_name').hide();
				$('report_tumblelog_without_name').show()
			} else {
				$('report_tumblelog_name').innerHTML=tumblelog;
				$('report_tumblelog_with_name').show();
				$('report_tumblelog_without_name').hide()
			}
			$('report_tumblelog_target').value=tumblelog;
			if(is_ie) {
				$('report_tumblelog_bar').show();
				window.clearTimeout(report_tumblelog_bar_timeout);
				report_tumblelog_bar_timeout=(function() {
					$('report_tumblelog_bar').hide()
				}).delay(5)
			} else {
				Effect.Queues.get('report_tumblelog_bar').invoke('cancel');new Effect.Appear('report_tumblelog_bar', {
					duration:0.35,
					queue: {
						scope:'report_tumblelog_bar',
						position:'end'
					}
				});new Effect.Fade('report_tumblelog_bar', {
					duration:0.5,
					to:0.8,
					delay:2,
					queue: {
						scope:'report_tumblelog_bar',
						position:'end'
					}
				});new Effect.Fade('report_tumblelog_bar', {
					duration:0.5,
					delay:4,
					queue: {
						scope:'report_tumblelog_bar',
						position:'end'
					}
				})
			}
		}
	}
}

function block_tumblelog(tumblelog,form_key) {new Ajax.Request('/block/add', {
		method:'post',
		asynchronous:true,
		parameters: {
			tumblelog:tumblelog,
			form_key:form_key
		},
		onFailure: function() {
			alert(l10n_str.ajax_error)
		}
	})
}

function report_tumblelog(tumblelog,form_key,reason,custom_fadeout) {
	if(typeof custom_fadeout=='undefined') {
		_immediately_fade_report_tumblelog_bar()
	} else {
		custom_fadeout()
	}
	if(reason!='other') {new Ajax.Request('/block/report', {
			method:'post',
			asynchronous:true,
			parameters: {
				tumblelog:tumblelog,
				form_key:form_key,
				reason:reason
			},
			onFailure: function() {
				alert(l10n_str.ajax_error)
			},
			onSuccess: function() {
			}
		})
	}
}

function _immediately_fade_report_tumblelog_bar() {
	if($('report_tumblelog_bar')&&$('report_tumblelog_bar').visible()) {
		if(is_ie) {
			window.clearTimeout(report_tumblelog_bar_timeout);
			$('report_tumblelog_bar').hide()
		} else {
			Effect.Queues.get('report_tumblelog_bar').invoke('cancel');new Effect.Fade('report_tumblelog_bar', {
				duration:0.5,
				queue: {
					scope:'report_tumblelog_bar',
					position:'end'
				}
			})
		}
	}
}

function auto_paginator(pe) {
	if(!next_page) {
		if($('auto_pagination_loader')&&$('auto_pagination_loader').visible()) {
			$('auto_pagination_loader').hide()
		}
		pe.stop();
		return
	}
	var posts;
	if(next_page&&!loading_next_page&&(posts=$$('#posts > li'))&&posts[posts.length-1].positionedOffset().top-(document.viewport.getDimensions().height+document.viewport.getScrollOffsets().top)<300) {
		loading_next_page=true;
		$('auto_pagination_loader_loading').show();
		$('auto_pagination_loader_failure').hide();
		if(!$('footer').visible())
			$('footer').show();new Ajax.Request(next_page+(next_page.indexOf('?')==-1?'?lite':''), {
			onFailure: function() {new Ajax.Request(next_page+(next_page.indexOf('?')==-1?'?lite':''), {
					onFailure: function() {
						_give_up_on_auto_paginator()
					},
					onComplete: function(transport) {
						if(200==transport.status) {
							_process_auto_paginator_response(transport)
						}
					}
				})
			},
			onComplete: function(transport) {
				if(200==transport.status) {
					_process_auto_paginator_response(transport)
				}
			}
		})
	}
}

function retry_auto_paginator_request() {
	$('auto_pagination_loader_loading').show();
	$('auto_pagination_loader_failure').hide();
	if(!$('footer').visible())
		$('footer').show();new Ajax.Request(next_page+(next_page.indexOf('?')==-1?'?lite':''), {
		onFailure: function() {
			$('auto_pagination_loader_loading').hide();
			$('auto_pagination_loader_failure').show();
			if($('footer').visible())
				$('footer').hide()
		},
		onComplete: function(transport) {
			if(200==transport.status) {
				_process_auto_paginator_response(transport)
			}
		}
	})
}

function _process_auto_paginator_response(transport) {
	if(transport.responseText.indexOf('<script type="text/javascript" language="javascript" src="http://assets.tumblr.com/languages/errors.js')!==-1) {
		_give_up_on_auto_paginator();
		return false
	}
	var new_posts=transport.responseText.split('<!-- START POSTS -->')[1].split('<!-- END POSTS -->')[0];
	$('posts').insert({
		bottom:new_posts
	});
	loading_next_page=false;
	if(window.after_auto_paginate!==undefined)
		after_auto_paginate();
	if(window.pageTracker!==undefined)
		pageTracker._trackPageview(next_page);
	next_page=transport.responseText.match('id="next_page_link" href="')?transport.responseText.split('id="next_page_link" href="')[1].split('"')[0]:false;
	if(quantserve) {
		_qpixelsent=undefined;
		quantserve()
	}
}

function _give_up_on_auto_paginator() {
	$('auto_pagination_loader_loading').hide();
	$('auto_pagination_loader_failure').show();
	if($('footer').visible())
		$('footer').hide()
}

function catch_photo_reply(src,post_id) {
	$('photo_reply_'+post_id).hide();
	$('photo_reply_image_'+post_id).src=src
}

function user_menu_toggle_following(user_menu_group_id,current_user_form_key,tumblelog_name) {
	var unfollow=($$('.user_menu_item_toggle_following_'+user_menu_group_id).first().getAttribute('following')=='true'?true:false);
	if(unfollow) {
		if(pageTracker)
			pageTracker._trackEvent('User Menu','Unfollow',tumblelog_name);
		$$('.user_menu_item_toggle_following_'+user_menu_group_id).each( function(element) {
			element.setAttribute('following','false')
		});
		$$('.user_menu_list_item_follow_'+user_menu_group_id).each( function(element) {
			element.style.display='block'
		});
		$$('.user_menu_list_item_unfollow_'+user_menu_group_id).each( function(element) {
			element.style.display='none'
		})
	} else {
		if(pageTracker)
			pageTracker._trackEvent('User Menu','Follow',tumblelog_name);
		$$('.user_menu_item_toggle_following_'+user_menu_group_id).each( function(element) {
			element.setAttribute('following','true')
		});
		$$('.user_menu_list_item_follow_'+user_menu_group_id).each( function(element) {
			element.style.display='none'
		});
		$$('.user_menu_list_item_unfollow_'+user_menu_group_id).each( function(element) {
			element.style.display='block'
		})
	}new Ajax.Request((unfollow?'/unfollow':'/follow'), {
		asynchronous:true,
		parameters: {
			id:tumblelog_name,
			form_key:current_user_form_key
		},
		onFailure: function() {
			alert(l10n_str.ajax_error)
		}
	})
}

function center_and_scale_img(img,parent,src,scale,fade) {
	if(typeof(scale)=='undefined')
		scale=false;
	if(typeof(fade)=='undefined')
		fade=false;
	img=$(img);
	parent=$(parent);
	var img_obj=new Image();
	img_obj.onload= function() {
		width=img_obj.width;
		height=img_obj.height;
		if(scale) {
			width=width*scale;
			height=height*scale;
			img.style.width=width+'px';
			img.style.height=height+'px'
		}
		max_dimensions=parent.getDimensions();
		max_width=max_dimensions.width;
		max_height=max_dimensions.height;
		if(parent.hasClassName('border')) {
			max_width-=2;
			max_height-=2
		}
		img.style.left=((max_width-width)/2)+'px';
		img.style.top=((max_height-height)/2)+'px';
		if(fade)
			img.hide();
		img.src=src;
		if(fade)
			img.appear({
				duration:0.3
			})
	};
	img_obj.src=src
}

var pay_widget_success,pay_widget_cancel;
function show_pay_widget(amount,key,origin_element,nipple_direction,nipple_offset,y_adjust,x_adjust,on_success,on_cancel,params) {
	if($('pay_widget'))
		return;
	pay_widget_success=on_success;
	pay_widget_cancel=on_cancel;
	$(document.getElementsByTagName('body')[0]).insert('<div id="dim" style="width:100%; height:100%; background:#000 url(/images/dim_loader.gif) center no-repeat; position:fixed; left:0px; top:0px; z-index:150; opacity:0.6; filter:alpha(opacity=60);"></div>');
	$(origin_element+'_anchor').style.position='relative';
	$(origin_element+'_anchor').style.zIndex='200';
	if(!nipple_direction)
		nipple_direction='bottom';
	if(!nipple_offset)
		nipple_offset=125;
	y_offset=(nipple_direction=='top'?10:-350)+(y_adjust?y_adjust:0);
	x_offset=-133+(125-nipple_offset)+(x_adjust?x_adjust:0);
	$(origin_element+'_anchor').insert('<iframe src="/pay/'+amount+'/'+key+'/'+nipple_direction+'/'+nipple_offset+(params?'?'+params:'')+'" id="pay_widget" frameborder="0" scrolling="no" allowTransparency="true" style="display:none; width:302px; height:350px; border-width:0px; overflow:hidden; position:absolute; left:'+x_offset+'px; top:'+y_offset+'px; background-color:transparent; z-index:200;" onload="$(this).show(); $(\'dim\').style.background = \'#000\';"></iframe>');
	setInterval( function() {
		if(document.cookie.length>0) {
			if(document.cookie.indexOf('pay_widget_close=')!=-1) {
				hide_pay_widget((document.cookie.indexOf('pay_widget_close=success')!=-1))
			}
		}
	},100)
}

function hide_pay_widget(success) {
	if($('pay_widget'))
		$('pay_widget').remove();
	if($('dim'))
		$('dim').remove();
	document.cookie='pay_widget_close=0; expires=Tue, 06 Jul 1999 00:00:00 GMT'+'; path=/; domain=tumblr.com';
	if(success) {
		if(pay_widget_success)
			pay_widget_success()
	} else {
		if(pay_widget_cancel)
			pay_widget_cancel()
	}
}

function toggle_video_embed(post_id) {
	if(!$('watch_video_'+post_id).visible()) {
		$('video_embed_'+post_id).innerHTML=$('video_code_'+post_id).value;
		$('video_toggle_'+post_id).hide();
		$('watch_video_'+post_id).show()
	} else {
		$('video_embed_'+post_id).innerHTML='';
		$('video_toggle_'+post_id).show();
		$('watch_video_'+post_id).hide()
	}
}

function cycle_video_thumbnails(post_id,action) {
	var img=$('video_thumbnail_'+post_id);
	if(!img.hasAttribute('thumbnails'))
		return false;
	var thumbnails=img.getAttribute('thumbnails').split(' | ');
	if(!thumbnails.length)
		return false;
	if(action=='preload') {
		for(i=0;i<thumbnails.length;i++) {
			add_to_image_queue(false,thumbnails[i])
		}
	} else if(action=='start') {
		img.setAttribute('original_src',img.src);
		img.setAttribute('thumbnail_index',1);
		img.src=thumbnails[1];
		video_thumbnail_hover=window.setInterval( function() {
			index=parseInt(img.getAttribute('thumbnail_index'),10)+1;
			if(index==thumbnails.length)
				index=0;
			img.src=thumbnails[index];
			img.setAttribute('thumbnail_index',index)
		},500)
	} else if(action=='stop') {
		window.clearInterval(video_thumbnail_hover);
		img.src=img.getAttribute('original_src');
		img.removeAttribute('thumbnail_index');
		img.removeAttribute('original_src')
	}
}

function toggle_external_inline_image(thumbnail,external_src) {
	if(thumbnail.hasClassName('enlarged')) {
		thumbnail.src=thumbnail.getAttribute('original_src');
		thumbnail.removeClassName('enlarged')
	} else {
		thumbnail.setAttribute('original_src',thumbnail.src);
		thumbnail.addClassName('enlarged');
		if(thumbnail.hasAttribute('loader')) {
			thumbnail.src=thumbnail.getAttribute('loader')
		}
		var img_obj=new Image();
		img_obj.onload= function() {
			thumbnail.src=external_src
		};
		img_obj.src=external_src
	}
}

function add_to_image_queue(id,url,how) {
	if(typeof how=='undefined') {
		how=false
	}
	image_queue.push([id,url,how])
}

function process_image_queue() {
	for(i=image_queue.length-1;i>=0;i--) {
		var id=image_queue[i][0];
		var url=image_queue[i][1];
		var how=image_queue[i][2];
		if(id===false) {
			img_obj=new Image();
			img_obj.src=url;
			preload_images.push(img_obj)
		} else {
			var el=$(id);
			if(!el)
				continue;
			if(how=='bg') {
				el.style.backgroundImage='url('+url+')'
			} else if(how=='src') {
				el.src=url
			}
		}
		image_queue.splice(i,1)
	}
}

function start_processing_image_queue() {
	if(running_image_queue)
		return true;
	running_image_queue=window.setInterval( function() {
		if(image_queue.length)
			process_image_queue()
	},500)
}

function start_observing_key_commands(auto_paginate) {
	document.onkeydown= function(e) {
		if(!key_commands_are_suspended) {
			if(!e)
				e=window.event;
			var code=e.charCode?e.charCode:e.keyCode;
			if(!e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey) {
				if(code==Event.KEY_LEFT) {
					if(!auto_paginate) {
						if($('previous_page_link'))
							location.href=$('previous_page_link').href
					}
				} else if(code==Event.KEY_RIGHT) {
					if(!auto_paginate) {
						if($('next_page_link'))
							location.href=$('next_page_link').href
					}
				} else if(code==74||code==75) {
					var post_positions=new Hash();
					$('posts').childElements().each( function(post) {
						if(post.hasClassName('post')&&post.id&&post.id!='new_post') {
							post_positions.set(post.id,post.offsetTop)
						}
					});
					var go_to_position=0;
					post_positions.each( function(pair) {
						var post_id=pair.key;
						var post_position=pair.value;
						var current_position=document.viewport.getScrollOffsets().top+7;
						if(code==74) {
							if(post_position>current_position&&(post_position<go_to_position||!go_to_position)) {
								go_to_position=post_position
							}
						} else if(code==75) {
							if(post_position<current_position&&post_position>go_to_position) {
								go_to_position=post_position
							}
						}
					});
					if(go_to_position)
						window.scrollTo(0,go_to_position-7)
				}
			}
		}
	}
}

function show_footer(browser) {
	footer_animating=true;
	if(is_ie) {
		$('footer').setOpacity(1);
		footer_animating=false
	} else {new Effect.Opacity('footer', {
			to:1,
			duration:0.15,
			afterFinish: function() {
				footer_animating=false
			}
		})
	}
}

function hide_footer() {
	footer_animating=true;
	if(is_ie) {
		$('footer').setOpacity(0.001);
		footer_animating=false
	} else {new Effect.Opacity('footer', {
			to:0.001,
			duration:0.25,
			afterFinish: function() {
				footer_animating=false
			}
		})
	}
}

function show_or_hide_footer_and_elevator() {
	if(!footer_animating) {
		if(!footer_hover&&$('footer').getOpacity()==1) {
			hide_footer()
		} else if(footer_hover&&$('footer').getOpacity().toString().substr(0,5)=='0.001') {
			show_footer()
		}
	}
	if(is_ie) {
		if(document.viewport.getScrollOffsets().top>=1500&&!$('return_to_top').visible()) {
			$('return_to_top').show()
		} else if(document.viewport.getScrollOffsets().top<1500&&$('return_to_top').visible()) {
			$('return_to_top').hide()
		}
	} else {
		if(document.viewport.getScrollOffsets().top>=1500&&$('return_to_top').getOpacity()===0) {new Effect.Opacity('return_to_top', {
				to:1,
				duration:0.50
			})
		} else if(document.viewport.getScrollOffsets().top<1500&&$('return_to_top').getOpacity()==1) {new Effect.Opacity('return_to_top', {
				to:0,
				duration:0.50
			})
		}
	}
}

function check_for_new_posts(ms_to_wait) {
	if(!ms_to_wait)
		ms_to_wait=0;
	setTimeout( function() {
		if(stop_checking_for_new_posts)
			return;
		var script_include=document.createElement('script');
		script_include.setAttribute('id','check_for_new_posts_js');
		script_include.setAttribute('type','text/javascript');
		script_include.setAttribute('src',check_for_new_posts_url+'?'+new Date().getTime());
		document.getElementsByTagName("head")[0].appendChild(script_include)
	},ms_to_wait);
	setTimeout( function() {
		stop_checking_for_new_posts=true
	},1800000)
}

function update_new_post_count(count) {
	count=parseInt(count,10);
	if(count) {
		if(count>=100) {
			count='100+';
			stop_checking_for_new_posts=true
		}
		document.title='('+count+') '+(document.title.indexOf(')')!=-1?document.title.split(')')[1]:document.title);
		$('new_post_notice_container').innerHTML='<a href="" class="new_post_notice" title="'+l10n_str.new_posts.replace('%1$s',count)+'">'+count+'<div class="new_post_notice_nipple"></div></a>'
	}
	if(!stop_checking_for_new_posts) {
		check_for_new_posts(90000)
	}
	Element.remove('check_for_new_posts_js')
}

function track_tag(tag,form_key,untrack) {
	$('tag_loader_'+tag).show();new Ajax.Request($('tag_'+tag).href.replace('/tagged/',(untrack?'/untrack_':'/track_')+'tag/'), {
		parameters: {
			form_key:form_key
		},
		onSuccess: function() {
			$((untrack?'untrack_':'track_')+tag).hide();
			$((untrack?'track_':'untrack_')+tag).show()
		},
		onFailure: function() {
			$((untrack?'untrack_':'track_')+tag).show();
			$((untrack?'track_':'untrack_')+tag).hide();
			alert(l10n_str.ajax_error)
		},
		onComplete: function() {
			$('tag_loader_'+tag).hide()
		}
	})
}

function tracked_tag_unread_counts() {new Ajax.Request('/tracked_tag_unread_counts', {
		method:'get',
		onSuccess: function(transport) {
			var c=transport.responseJSON;
			for(var tag in c) {
				if($('tag_unread_'+tag)) {
					$('tag_unread_'+tag).innerHTML=' ('+c[tag]+')';new Effect.Appear('tag_unread_'+tag)
				}
			}
		}
	})
}

Event.observe(window,'load', function() {
	if(document.cookie.indexOf('Glitter=')!==-1) {
		var glitter_branch=document.cookie;
		glitter_branch=glitter_branch.substr(glitter_branch.indexOf('Glitter=')+8);
		glitter_branch=glitter_branch.substr(0,glitter_branch.indexOf(';'));
		document.title=document.title+' ['+glitter_branch+']'
	}
});