// 1.0.1

// 判斷href後面有無問號
function urlSearch() {
	if (window.location.search=='') {
		return false;
	} else {
		return urlSpliter(window.location);
	}
}
// 把url問號後的obj加入進某個obj裡
function addObj_to_Url(obj, url) {
	for (var key in urlSpliter(url)) {
		obj[key] = urlSpliter(url)[key];
	}
	return obj;
}
// 擷取url問號後的obj
function urlSpliter(url) {
	var pairs,
		obj = {},
		pair,
		i;
	if (typeof url == 'string') {
		pairs = url.split('?')[1].split('&');
	} else {
		pairs = url.search.substring(1).split('&');
	}
	for (i in pairs) {
		if (pairs[i] === '') continue;

		pair = pairs[i].split('=');
		obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return obj;
}


// detect device
window.mobileAndTabletcheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

// PC or mobile ?
var isMobile = mobileAndTabletcheck();

// 輸入錯誤時的震動效果
function shake(modal) {
	if (typeof modal == 'string') {
		var modal = $("" + modal + " .modal-content");
		modal
			.animate({
				left: 20
			}, 70, "swing")
			.animate({
				left: 0
			}, 60, "swing")
			.animate({
				left: 10
			}, 50, "swing")
			.animate({
				left: 0
			}, 40, "swing");
		return;
	}
	if (typeof modal == 'object') {
		modal
			.animate({
				width: '102%'
			}, 70, "swing")
			.animate({
				width: '100%'
			}, 60, "swing")
			.animate({
				width: '101%'
			}, 50, "swing")
			.animate({
				width: '100%'
			}, 40, "swing");
		return;
	}
}
function enterFail_shake(modal, button, remove, add, buttonTxt, msg) {
	$(button).removeClass(remove).addClass(add).html(msg);
	shake(modal);
	$(button).delay(1500).queue(function() {
		$(this).removeClass(add).addClass(remove).html(buttonTxt).dequeue();
	});
}


// 等modal show完成後在做高度的調整 確保iOS可scroll
function modalShow(target, callback) {
	if (target.is(':visible')) {
		target.modal('handleUpdate');
		if (callback!==undefined) {
			callback();
		}
	} else {
		target.one('shown.bs.modal', function() {
			target.modal('handleUpdate');
			if (callback!==undefined) {
				callback();
			}
		});
		target.modal('show');
	}
}

// modal垂直置中
function modalCenter(target) {
	target.children('.modal-dialog').css('top', $(window).height()/8);
}

// alert popup
function myalert(text) {
	$('#modal-messagebox .messagetext').text(scriptchecklang(text));
	$("#modal-messagebox").modal('show');
	// $.confirm({
	// 	text: text,
	// 	title: '<span class="glyphicon glyphicon-alert"></span> Message Content',
	// 	post: true,
	// 	confirmButton: '<span class="glyphicon glyphicon-ok"></span> OK',
	// 	confirmButtonClass: 'btn-default',
	// 	cancelButton: ''
	// });
}

// 把null換成空字串
function nullFilter(d) {
	$.each(d, function(index, d) {
		d[index] = d;
		$.each(d, function(index1, dd) {
			if (dd==null) {
				d[index][index1] = '';
			} else {
				d[index][index1] = dd;
			}
		});
	});
	return d;
}

// 把\n轉成<br />
function nl2br(str) {
	return str.replace(/\n/g, '<br />');
}


// scroll到哪邊
function scrollAnimate(target, val) {
	target.animate({ scrollTop: val });
}

// scrollspy
function scrollspy_in_body(target, fixed_class, section_offset, spy_top, navBar_height) {
	var navBar_height = navBar_height || 0;
	$('body').scrollspy({
		target: target,
		offset: 50
	});
	$(window).scroll(function() {
		$(target).find('a').blur();
		if (0<$(window).scrollTop()-section_offset+spy_top) {
			$(target).addClass(fixed_class).css('top', spy_top+'px');
		} else {
			$(target).removeClass(fixed_class).removeAttr('style');
		}
	});
	$(target).find('a').click(function(event) {
		event.preventDefault();
		$("html, body").animate({ scrollTop: $($(this).attr('href')).offset().top-navBar_height });
	});
}


// selectFilterByText
$.fn.selectFilterByText = function(textbox, defaultTxt) {
	return this.each(function() {
		var select = this;
		var options = [];
		$(select).find('option').each(function() {
			options.push({
				value: $(this).val(),
				text: $(this).text()
			});
		});
		$(select).data('options', options);

		textbox.bind('change keyup', function() {
			var options = $(select).empty().data('options');
			var search = $.trim($(this).val());
			var regex = new RegExp(search, "gi");

			$(select).append('<option value="">'+defaultTxt+'</option>');
			$.each(options, function(i) {
				var option = options[i];
				if (option.text.match(regex) !== null) {
					$(select).append(
						$('<option>').text(option.text).val(option.value)
					);
				}
			});
		});
	});
};

// goTop
function goTop(target) {
	var targetAnimate = target;
	if (!target) {
		target = $(window);
		targetAnimate = $("html, body");
	}
	target.scroll(function() {
		if (target.scrollTop()<100) $('body>button.goTop').fadeOut('slow');
		else $('body>button.goTop').fadeIn('slow');
	});
	$('button.goTop').click(function(event) {
		event.preventDefault();
		targetAnimate.animate({ scrollTop: "0px" });
	});
}

// 下載CSV
function shiftDownload(retData) {
	var retData1 = '\ufeff' + retData.file_content;
	var blob = new Blob([retData1], {
		type: 'text/csv;charset=utf-8;'
	});
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, "下載.csv");
	} else {
		var link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			if (retData.file_name == '' || retData.file_name == null || retData.file_name == undefined) {
				link.setAttribute("download", "下載.csv");
			} else {
				link.setAttribute("download", retData.file_name + ".csv");
			}
			link.style = "visibility:hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

// upload
function upload(postData, count, callback) {
	var formData = new FormData();
	var connecterror = false;
	$.each(postData, function(index, val) {
		if(index=='file') {
			$.each(val,function (index1, file){
				if(file[0].files[0]!==undefined) {
					formData.append('file',file[0].files[0]);
				}
			});
			delete postData.file;
		}
		 /* iterate through array or object */
	});
	var type = 'POST';
	if(demo_only) {
		postData.url = 'http://download.thinkbroadband.com/10MB.zip';
		type = 'GET';
		// console.log('test');
	}
	formData.append('data', JSON.stringify(postData));
	$.ajax({

		url: postData.url,
		data: formData,
		type: 'POST',
		processData: false,
		contentType: false,
		dataType: "json",
        xhr: function () {
            // 建立 XHR 時，加掛 onprogress 事件
            var xhr = $.ajaxSettings.xhr();
            xhr.upload.onprogress = function (event) {
                //file.uploadedBytes(event.loaded);
                if (event.lengthComputable) {
					$('#modal-progress')
						.modal('show')
						.find('.progress-bar')
						.css('width', event.loaded/event.total*100+'%')
						.html(Math.round(event.loaded/event.total*100)+'%');
                }
            };

            return xhr;
        },
		xhrFields: {
			onprogress: function(event) {
				if (event.lengthComputable) {
					$('#modal-progress')
						.modal('show')
						.find('.progress-bar')
						.css('width', event.loaded/event.total*100+'%')
						.html(Math.round(event.loaded/event.total*100)+'%');
				}
			}
		},
		success: function(retdata, textStatus, jqXHR) {
			if(count!==undefined && retdata.stat == 'success')
				startCountDown(count);
			$('#modal-progress').modal('hide');
			if(count===undefined && callback !== undefined) callback(retdata);
		},
		error: function(event) {
			// if(event.status!=200) {
			// 	myalert('Connection status: ' + event.statusText);
			// 	return;
			// }
			$('#modal-progress').modal('hide');
			var data = {
				feed : {
					msg: event.statusText
				}
			}
			if(callback !== undefined) callback(data);
		}
	});
}

// 下載by post
// function download_by_post(path, postData, method) {
function download_by_post(postData,count,callback) {
	// var formData = new FormData();
	// $.each(postData, function(index, val) {
	// 	if(index=='file') {
	// 		$.each(val,function (index1, file){
	// 			if(file[0].files[0]!==undefined) {
	// 				formData.append('file',file[0].files[0]);
	// 			}
	// 		});
	// 		delete postData.file;
	// 	}
	// 	 /* iterate through array or object */
	// });
	// formData.append('data', JSON.stringify(postData));
	var method = method || 'post';
	var form = $('<form action="' + postData.url + '" method="' + method + '" target="_blank"></form>');
	$.each(postData, function(index, val) {
			form.append('<input type="hidden" name="' + index + '" value="' + val + '">');
	});
	$('body').append(form);
	form.submit().remove();
	// $.ajax({

	// 	/*for demo*/
	// 	url: 'http://download.thinkbroadband.com/10MB.zip',
	// 	type: 'GET',
	// 	/*for demo*/

	// 	// url: serverurl,
	// 	// data: formData,
	// 	// type: 'GET',
	// 	processData: false,
	// 	contentType: false,
	// 	// dataType: "json",
	// 	xhrFields: {
	// 		onprogress: function(event) {
	// 			if (event.lengthComputable) {
	// 				$('#modal-progress')
	// 					.modal('show')
	// 					.find('.progress-bar')
	// 					.css('width', event.loaded/event.total*100+'%')
	// 					.html(Math.round(event.loaded/event.total*100)+'%');
	// 			}
	// 		}
	// 	},
	// 	success: function(data, textStatus, jqXHR) {
	// 		// if(count!==undefined)
	// 		// 	startCountDown(count);
	// 		$('#modal-progress').modal('hide');
	// 		// if(callback !== undefined) callback(data);
	// 	},
	// 	error: function(event) {
	// 		if(event.status!=200) {
	// 			myalert('Connection status: ' + event.statusText);
	// 			return;
	// 		}
	// 		$('#modal-progress').modal('hide');
	// 		// var data = {
	// 		// 	feed : {
	// 		// 		msg: 'json format error'
	// 		// 	}
	// 		// }
	// 		// if(callback !== undefined) callback(data);
	// 	}
	// });
}

// toDigits
function toDigits(num) {
	return (num<10)?'0'+num:num;
}

// 檢查key的數字範圍
function check_number_input_key(keycode,startN,endN){
	//參數異常時不檢查
	if (startN == undefined || startN<0 || endN > 9 || startN > endN ){
		startN = 0;
		endN = 9;
	}
	if ((keycode < (48+startN) || keycode > (57-9+endN)) && keycode != 8 && keycode != 46 && (keycode < 37 || keycode > 40) && (keycode < (96+startN) || keycode > (105-9+endN) )){
		return false;
	}
	return true;
}

// 檢查email格式
function emailCheck(email) {
	reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
	if (reg.test(email)) {
		return true;
	} else {
		return false;
	}
}

function keydowncheck(evt) {
	var theEvent = evt || window.event;
	var key = theEvent.keyCode || theEvent.which;
	key = String.fromCharCode( key );
	var regex = /[0-9]|\./;
	if( !regex.test(key) ) {
		theEvent.returnValue = false;
		if(theEvent.preventDefault) theEvent.preventDefault();
	}
}

// 延遲search input post
var checkTime = 0;
function searchInput_timeout_control(millisecond, doSomething) {
	checkTime++;
	if (checkTime<=1) {
		setTimeout(function() {
			doSomething();
			checkTime = 0;
		}, millisecond);
	}
}

function maxLengthCheck(object) {
	if (object.value.length > object.maxLength)
	object.value = object.value.slice(0, object.maxLength);
	if(object.value < 0 ) object.value=0;
}

//刪除最後一個逗點
function removeComma (removeThis) {

	if (removeThis.length > 0 && removeThis.charAt(removeThis.length-1)==',') {
		removeThis = removeThis.substring(0, removeThis.length-1);
	};
	return removeThis;
};

// ipv6 validation
function valid_ipv6() {
	$('.ipv6input').each(function(index, el) {
		$(el).blur(function() {
			$(el).siblings('.validTxt').remove();
			if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test($(el).val())) {
				// $(el).siblings('.label-title').after('<span class="validTxt">VALID IPV6</span>');
			} else if ($(el).val()=='') {
				return;
			} else {
				$(el).siblings('.label-title').after('<span class="label-title validTxt">INVALID IPV6</span>');
			}
		});
	});
}

var timeTimeout = '',
	countTime = 5,
	reloadit=false;

function stopCountDown(total) {
	reloadit=false;
	countTime=0;
}

var redirectToAskey = false;
function countDown() {
	if (countTime <= 0) {
		clearTimeout(timeTimeout);
		$('#loadingdiv').hide();
		$('body').removeClass('opacity');
		$('#loadingdiv>.countDown').empty();
		if (redirectToAskey) {
			window.open('http://askey.inc/index.html', '_self');
			return;
		}
		if (reloadit) {
			window.open('http://'+$('#wifirouterpage-2 .sysinfo').data('data').hostname+'/index.html', '_self');
			// location.reload();
		}
		return;
	} else {
		// $('#loadingdiv>.countDown').html(moment(countTime*1000).format('mm:ss'));
		$('#loadingdiv>.countDown').html(countTime);
	}
	countTime -= 1;
	timeTimeout=setTimeout(countDown,1000)
}
function startCountDown(total) {
	// loading position
	reloadit=true;
	$('#loadingdiv').show();
	$('body').addClass('opacity');
	countTime = Number(total);
	timeTimeout = setTimeout(countDown, 1000);
}

// unwrapInner function
jQuery.fn.extend({
	unwrapInner: function(selector) {
		return this.each(function() {
			var t = this,
			c = $(t).children(selector);
			if (c.length === 1) {
				c.contents().appendTo(t);
				c.remove();
			}
		});
	}
});


//$.POST extend
jQuery.extend({
	get: function (url, data, callback, type) {
		if(demo_only) {
			var result = {readyState: 1,error: function (e) {
				callback();
			}};
			return result;
		}
		$('#loadingdiv').show();
		// shift arguments if data argument was ommited
		if (jQuery.isFunction(data)) {
				callback = data;
				data = null;
		}
		try {
			return $.ajax({
				type: "GET",
				url: url,
				data: data,
			success: function(data1, textStatus, jqXHR) {
				$('#loadingdiv').hide();
				 if(data1 != null) {
				 	if (data1.e_code != null) {
// 1001:無此功能
// 2000:sessionid驗證失敗
// 2001:程式驗證失敗(Login only)
// 2002:傳入參數缺少
// 2003~程式錯誤回覆，錯誤內容
						switch(data1.e_code) {
						case 1001:
							// console.log('No such method');
							break;
						case 2000:
							$.confirm({
								text: scriptchecklang("Your session had expired because auto logout."),
								title: 'Message Content',
								post: true,
								confirmButton: "OK",
								cancelButton: '',
								confirm: function(button) {
									$.removeCookie('sessionID', {path: "/"});
									location.reload();
								},
							});
							break;
						case 2002:
							// console.log('Parameter not enough!');
							break;
						case 2003:
							// console.log('Program error!');
							break;
						}
						return;
					}
				 }
				callback(data1, textStatus, jqXHR);
				data1 = null;
			},
				dataType: type,
				complete: function(){
					$('#loadingdiv').hide();
					// $("[data-toggle='tooltip']").tooltip();
					// $('[data-toggle="popover"]').popover();
					// $('*').mouseleave(function() {
					// 	$('.tooltip').hide();
					// });
				},
				error: function(x, t, m) {
					$('#loadingdiv').hide();
					// $("[data-toggle='tooltip']").tooltip();
					// $('[data-toggle="popover"]').popover();
					// $('*').mouseleave(function() {
					// 	$('.tooltip').hide();
					// });
					if(t==="timeout") {
						myalert('Network timeout!');
					}
				}
			});
		} catch(e) {
				$('#loadingdiv').hide();
				// $("[data-toggle='tooltip']").tooltip();
				// $('[data-toggle="popover"]').popover();
				// $('*').mouseleave(function() {
				// 	$('.tooltip').hide();
				// });
		}
	},
	//HTTP　POST方法
	post: function (url, data, callback, type) {
		if(demo_only) {
			var result = {readyState: 1,error: function (e) {
				callback();
			}};
			return result;
		}
		var loading=true;
		if(data.method=='wizard' || data.method=='reboot' || data.method=='firmwareset'
			|| (data.method=='getwirelesswpsset' && data.statusonly)
			|| data.method=='restoredefault' || data.method=='uploadconfig'
			|| data.method=='switchmoderouteset' || data.method=='switchmodeset'
			|| data.method=='statistic' || data.method =='userstatic'
			|| (data.method=='getwirelesswpsset' && data.statusonly)
			|| (data.method=='getpptpserverset' && data.statusonly)
			|| (data.method=='getopenvpnserverset' && data.statusonly)
			|| (data.method=='getvpnclientset' && data.statusonly)
			|| (data.method=='updatefirmware' && data.statusonly)
			|| data.method=='storageinfo'
			|| data.method=='getdirectory'
			|| data.method=='getshares'
		) {
			loading=false;
		}
		if(loading) {
			$('#loadingdiv').show();
		}
		if (jQuery.isFunction(data)) {
			callback = data;
			data = {};
		}
		if(data.method=='statistic' || data.method =='userstatic'
			|| (data.method=='getwirelesswpsset' && data.statusonly)
			|| (data.method=='getpptpserverset' && data.statusonly)
			|| (data.method=='getopenvpnserverset' && data.statusonly)
			|| (data.method=='getvpnclientset' && data.statusonly)
			|| (data.method=='updatefirmware' && data.statusonly)
		) {
			defaulttime = 1000;
		} else {
			defaulttime = 0;
		}
		try {
			return $.ajax({
			type: "POST",
			url: url,
			timeout:defaulttime,
			// contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(retdata, textStatus, jqXHR) {
				var data1 = JSON.parse(retdata);
				if(loading)
					$('#loadingdiv').hide();
				 if(data1 != null) {
					if(data1.Login != null) {
						myalert('Duplicate Login from '+data1.LoginIP+'('+data1.LoginMAC+')');
						return;
					}
				 	if (data1.e_code != null) {
// 1001:無此功能
// 2000:sessionid驗證失敗
// 2001:程式驗證失敗(Login only)
// 2002:傳入參數缺少
// 2003~程式錯誤回覆，錯誤內容
						switch(data1.e_code) {
						case 1001:
							// console.log('No such method');
							break;
						case 2000:
							$.confirm({
								text: "Your session ID expired",
								title: 'Message Content',
								post: true,
								confirmButton: "OK",
								cancelButton: '',
								confirm: function(button) {
									$.removeCookie('sessionID', {path: "/"});
									location.reload();
								},
							});
							break;
						case 2002:
							// console.log('Parameter not enough!');
							break;
						case 2003:
							// console.log('Program error!');
							break;
						}
						return;
					}
				 }
				callback(data1, textStatus, jqXHR);
				data1 = null;
			},
			complete: function(){
				if(loading)
					$('#loadingdiv').hide();
				// $("[data-toggle='tooltip']").tooltip();
				// $('[data-toggle="popover"]').popover();
				// $('*').mouseleave(function() {
				// 	$('.tooltip').hide();
				// });
			},
			error: function(x, t, m) {
				if(loading)
					$('#loadingdiv').hide();
				// $("[data-toggle='tooltip']").tooltip();
				// $('[data-toggle="popover"]').popover();
				// $('*').mouseleave(function() {
				// 	$('.tooltip').hide();
				// });
				if(!(data.method=='statistic' || data.method =='userstatic'
					|| (data.method=='getwirelesswpsset' && data.statusonly)
					|| (data.method=='getpptpserverset' && data.statusonly)
					|| (data.method=='getopenvpnserverset' && data.statusonly)
					|| (data.method=='getvpnclientset' && data.statusonly)
					|| (data.method=='updatefirmware' && data.statusonly)
				)) {
					if(t==="timeout") {
						myalert('Network timeout!');
					}
				}
			}
		});
	} catch (e) {
		if(loading)
			$('#loadingdiv').hide();
		// $("[data-toggle='tooltip']").tooltip();
		// $('[data-toggle="popover"]').popover();
		// $('*').mouseleave(function() {
		// 	$('.tooltip').hide();
		// });
	}
	}
});


$(document).ready(function() {
	// loading
	$('#loading').css('margin-top', ($(window).height()/2)-($('#loading').height()/2)+$(window).scrollTop()+'px');
	// $('#loading').shCircleLoader({
	// 	color: '#4e4d50'
	// });

	// modal垂直置中
	modalCenter($('.popup'));

	// confirm modal垂直置中
	$('body').on('shown.bs.modal', '.confirmation-modal', function() {
		$('.confirmation-modal > .modal-dialog').css('top', $(window).height()/2-$(this).children('.modal-dialog').height()/1.3);
	});

	// 每一個modal預設先focus第一個form-control
	$('body').children('.popup').on('shown.bs.modal', function() {
		$(this).find('input:first:not(.btn-checkbox>input)').focus().select();
		$(this).modal('handleUpdate');
	});

	// see password
	$(document).find('[data-seepw]').each(function(index, el) {
		var text = $(el).attr('data-seepw');
		if ($(el).attr('type')=='password') {
			$(el).after(
				'<label class="checkbox-seepw">'+
					'<input type="checkbox"> '+scriptchecklang(text, 1)+
				'</label>'
			);
		} else {
			$(el).after(
				'<label class="checkbox-seepw">'+
					'<input type="checkbox" checked> '+scriptchecklang(text, 1)+
				'</label>'
			);
		}
	});
	$(document).on('change', '.checkbox-seepw>input', function() {
		var input = $(this).parent().siblings('input');
		if (input.attr('type')=='password') {
			input.attr('type', 'text');
		} else {
			input.attr('type', 'password');
		}
	});

	// folder select (兩層目錄)
	$('.folderGroup-hover').on('click', '.main, .sub', function(event) {
		event.preventDefault();
		if ($(this).hasClass('active')) {
			if ($(this).siblings().hasClass('active')) {
				$(this).removeClass('active');
			}
		} else {
			$(this).addClass('active');
		}
		$(this).siblings('.active').removeClass('active');
	});

	// table select
	$('.table-select').on('click', 'td:not(:last-child)', function(event) {
		event.preventDefault();
		if ($(this).parent().hasClass('active')) {
			if ($(this).parent().siblings().hasClass('active')) {
				$(this).parent().removeClass('active');
			}
		} else {
			$(this).parent().addClass('active');
		}
	});

	// multiSelect
	$('.multiSelectGroup').on('click', '.multiSelect>li, .btn-all, .btn-go, .btn-back, .btn-allBack, .btn-addMAC, .btn-macOK', function(event) {
		event.preventDefault();
		var group = $(this).parents('.multiSelectGroup');
		if ($(this).is('li')) {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		}
		if ($(this).hasClass('btn-all')) {
			group.find('.multiSelect-from>li').each(function(index, el) {
				$(el).clone().appendTo(group.find('.multiSelect-to'));
			});
			group.find('.multiSelect-from').empty();
			group.find('.multiSelect-to>li').removeClass('active');
		}
		if ($(this).hasClass('btn-allBack')) {
			group.find('.multiSelect-to>li').each(function(index, el) {
				$(el).clone().appendTo(group.find('.multiSelect-from'));
			});
			group.find('.multiSelect-to').empty();
			group.find('.multiSelect-from>li').removeClass('active');
		}
		if ($(this).hasClass('btn-go')) {
			group.find('.multiSelect-from>li').each(function(index, el) {
				if ($(el).hasClass('active')) {
					 $(el).clone().appendTo(group.find('.multiSelect-to'));
				}
			});
			group.find('.multiSelect-from>li.active').remove();
			group.find('.multiSelect-to>li.active').removeClass('active');
		}
		if ($(this).hasClass('btn-back')) {
			group.find('.multiSelect-to>li').each(function(index, el) {
				if ($(el).hasClass('active')) {
					 $(el).clone().appendTo(group.find('.multiSelect-from'));
				}
			});
			group.find('.multiSelect-to>li.active').remove();
			group.find('.multiSelect-from>li.active').removeClass('active');
		}
		if ($(this).hasClass('btn-addMAC')) {
			$(this).hide();
			$(this).siblings('.btn-macOK, .input-mac').attr('style', 'display:inline').focus();
		}
		if ($(this).hasClass('btn-macOK')) {
			var input = $(this).siblings('.input-mac'),
				val = input.val(),
				isEmpty = false;

			// 檢查MAC input
			if (val=='__:__:__:__:__:__') {
				isEmpty = true;
			}
			// $.each(val.split(':'), function(index, val) {
			// 	if (isNaN(val)) {
			// 		isEmpty = true;
			// 		return false;
			// 	}
			// });
			if (isEmpty) {
				$(this).hide();
				$(this).siblings('.input-mac').val('').hide();
				$(this).siblings('.btn-addMAC').show();
				return;
			}

			// 貼上
			group.find('.multiSelect-to').append(
				'<li>'+$(this).siblings('.input-mac').val()+'</li>'
			);

			// 清空 input
			input.val('');

			// 藏
			$(this).hide();
			$(this).siblings('.input-mac').hide();
			$(this).siblings('.btn-addMAC').show();
		}
	});

});

(function ($) {
	$.each(['show', 'hide'], function (i, ev) {
		var el = $.fn[ev];
		$.fn[ev] = function () {
			this.trigger(ev);
			return el.apply(this, arguments);
		};
	});
})(jQuery);
