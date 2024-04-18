(function($, core, ui, undefined){
	ui.HEADER = function(){
		var $$ = core.Selector(arguments[0], {
			header: "#header",
			hambuger: ".menu .hambuger",
			allMenu: ".menu .all_menu",
		});
		var data = {
			isMenu: false,
		}

		var events = this.events = {
			_init: function(){
				this.menu._init();
				if(!$$.container.hasClass("year_50")) core.observer.on("LOAD", $.proxy(this.scroll._init, this.scroll));
			},
			scroll: {
				_init: function(){
					core.$body.mCustomScrollbar({
						scrollbarPosition: "outside",
						theme: "minimal-dark",
						mouseWheel:{ 
							scrollAmount: 300
						},
						//scrollInertia: 1200,
						callbacks: {
							onInit: this._scrollInit,
							whileScrolling: this._detect,
							onTotalScrollBack: function(){
								$$.header.removeClass("white");
							},
						},
						
					});
				},
				_scrollInit: function(){
					data.top = this.mcs.top;
					core.observer.notify("createScroll");
				},
				_detect: function(){
					var top = this.mcs.top;
					core.observer.notify("mscroll", {scrollTop:top});

					return;
					if(data.top > top) events.scroll._hideHeader();
					if(data.top < top){
						$$.header.addClass("white");
						events.scroll._showHeader();
					}
					data.top = top;
				},
				_hideHeader: function(){
					TweenMax.to($$.header, .5, {y:"-100%"});
				},
				_showHeader: function(){
					TweenMax.to($$.header, .5, {y:"0%"});
				}
			},
			menu: {
				_init: function(){
					$$.hambuger.on("click", $.proxy(this._click, this));
				},
				_click: function(){
					if(!$$.hambuger.hasClass("on")){
						this._show();
						core.$body.mCustomScrollbar("disable");
					}else{
						this._hide();
						core.$body.mCustomScrollbar("update");
					}
					$$.hambuger.toggleClass("on");
				},
				_show: function(){
					TweenMax.to($$.allMenu, 1, {top:0, ease:Power2.easeInOut});
				},
				_hide: function(){
					TweenMax.to($$.allMenu, 1, {top:-1080, ease:Power2.easeInOut});
				}
			}
		}
	}

	//work Section
	ui.WORK = function(){
		var $$ = core.Selector(arguments[0], {
			workPointer: ".pointer",
			workPointerA: ".pointer a",
			workList : ".work_list >div",
			workImg: ".work_list .img >div",
			timer: ".timer",
			timerItem: ".timer span"
		});

		var data = {
			timerDuration: 5,
			duration: 1,
			isIntro: true,
			isPause: false,
		};

		var work = {
			active: "uk",
			uk: {
				idx: 0,
				clip: [
					//{from:"1px 780px 2px 780px", to:"340px 1790px 740px 130px"},
					//{from:"939px 762px 940px 761px", to:"140px 1160px 940px 760px"},
					//{from:"739px 1780px 740px 1779px", to:"340px 1780px 740px 780px"},
					{from:"0 1920px 1080px 0", to:"340px 1790px 740px 130px"},
					{from:"0 1920px 1080px 0", to:"140px 1160px 940px 760px"},
					{from:"0 1920px 1080px 0", to:"340px 1780px 740px 780px"},
				]
			},
			lee: {
				idx: 0,
				clip: [
					{from:"0 1920px 1080px 0", to:"359px 1920px 721px 0px"},
					{from:"0 1920px 1080px 0", to:"244px 1256px 837px 664px"},
					{from:"0 1920px 1080px 0", to:"0 1392px 1080px 528px"},


					//2 ,      244 664 243 664


					// {from:"540px 960px 540px 960px", to:"0 1210px 1080px 710px"},
					// {from:"540px 960px 540px 960px", to:"305px 1920px 776px 0px"},
					// {from:"540px 960px 540px 960px", to:"240px 1260px 840px 660px"},
				],
				scale: [
					0.34,
					0.3074,
					0.45
				]
			},
		}

		var events = this.events = {
			_init: function(){
				this._bind();
				this.timer._init();
				this._intro();

				core.observer.on("mscroll", function(e){
					var top = -e.data.scrollTop;
					var $active = $$.workList.filter(".on").find(".timer .active");
					if(top > 500){
						data.isPause = true;
						$active.trigger("default");
					}else{
						if(!data.isPause) return;
						$active.removeClass("default").trigger("active");
						data.isPause = false;
					}
				});
			},
			_bind: function(){
				$$.workPointer.on("click", ">a", $.proxy(this._clickPeople, this));
				$$.workImg.on("change", $.proxy(this._change, this));
			},
			_intro: function(){
				var $uk = $$.workList.filter("[data-work='uk']"),
					$ukImg = $uk.find(".img"),
					$ukText = $uk.find(".white img"),
					$ukTimer = $uk.find(".timer span").first();

				
				TweenMax.fromTo($ukImg, 3, {clip:work.uk.clip[0].from}, {clip:work.uk.clip[0].to, ease:Power1.easeOut});
				TweenMax.fromTo($ukImg.children().eq(0), 4, {scale:1.5}, {scale:1, ease:Power2.easeIn});
				TweenMax.staggerFromTo($ukText, .5, {x:-100, opacity:0}, {delay:1, x:0, opacity:1}, .2, 
					function(){
						//$ukTimer.trigger("play");
						data.isIntro = false;
					}
				);
				$ukTimer.trigger("play");
			},
			_clickPeople: function(e){
				if(data.isIntro) return;
				var idx = $(e.currentTarget).index();
				if(idx == $$.workPointer.attr("data-name")) return;
				this._changeWork(idx);
			},
			_change: function(e){
				var $el = $(e.currentTarget),
					idx = $el.index(),
					$img = $el.parent(),
					$prt = $img.parent(),
					theme = $el.data("theme");

				this._animationClipRect({$img: $img, index: idx});
				//this._changeImage({$el: $el, index: idx});
				this._changeInfo({$prt: $prt, index: idx});
				this._changeTheme({$prt: $prt, theme: theme});
			},
			_animationClipRect: function(obj){
				var activeWork = work.active;
				var rect = work[activeWork].clip[obj.index]
				var t = new TimelineMax();
				
				this._changeImage(obj.index);

				t.to(obj.$img, .75, {clip:rect.from, ease:Power1.easeOut,
					onComplete: $.proxy(function(){
						//this._changeImage(obj.index)
					},this)
				})
				.to(obj.$img, 3, {clip:rect.to, ease:Power1.easeOut});
			},
			_changeImage: function(idx){ // nextImage
				var $img = $$.workList.filter(".on").find(".img").children();
				var $c = $img.filter(".on");
				var $n = $img.eq(idx);

				TweenMax.to($c, 1.5, {opacity:0});
				TweenMax.set($n , {zIndex:5, display:"block", opacity:0});
				TweenMax.to($n, 1.5, {opacity:1,
					onComplete: function(){
						$c.removeAttr("style").removeClass("on");
						$c.removeClass("on");
						$n.removeAttr("style").addClass("on");
					}
				})

				if(work.active == "uk"){
					TweenMax.fromTo($n, 4, {scale:1.5}, {scale:1, ease:Power3.easeIn});
				}else{
					TweenMax.fromTo($n, 4, {scale:1}, {scale:work.lee.scale[idx], ease:Power1.easeIn});
				}
			},
			_changeInfo: function(obj){ // nextInfo
				var $info = obj.$prt.find(".info"),
					$next = $info.children().eq(obj.index),
					$current = $info.children().filter(".on");
				
				$next.addClass("on");
				$current.removeClass("on");
			},
			_changeTheme: function(obj){ //nextTheme Text
				var $name = obj.$prt.find(".name"),
					$nextTheme = $name.children("."+obj.theme),
					$currentTheme = $name.children().filter(".on");

				if($nextTheme.hasClass("on")) return;
			
				TweenMax.set($nextTheme, {display:"block", zIndex:3, opacity:0});
				TweenMax.to($nextTheme, 1.5, {opacity:1});
				TweenMax.to($currentTheme, 1.5, {opacity:0,
					onComplete: function(){
						$currentTheme.removeClass("on");
						$nextTheme.addClass("on").removeAttr("style");
					}
				});
			},
			_changeWork: function(i){
				$$.workPointer.attr("data-name", i);
				work.active = (i !== 0) ? "lee" : "uk";
				TweenMax.killTweensOf($$.timerItem.find("em"));
				TweenMax.set($$.timerItem.find("em"), {height: 0});

				var $current = $$.workList.filter(".on");
				var $next = $$.workList.eq(i);
				var $img = $next.find(".img");
				var $item = $next.find(".img >div.on");
				var idx = $item.index();

				var rect = work[work.active].clip[idx];
				if(work.active == "uk"){
					TweenMax.fromTo($img, 3, {clip:rect.from}, {clip:rect.to, ease:Power1.easeOut});
					TweenMax.fromTo($item, 4, {scale:1.2}, {scale:1, ease:Power1.easeIn});
				}else{
					TweenMax.fromTo($img, 3, {clip:rect.from}, {clip:rect.to, ease:Power1.easeOut});
					TweenMax.fromTo($item, 4, {scale:1}, {scale:work.lee.scale[idx], ease:Power1.easeIn});
				}
				
				//var rect = work[activeWork].clip[obj.index]
				//$img.trigger("change");
				//TweenMax.fromTo($next, {}, {});
				//.to(obj.$img, 5, {clip:rect.to, ease:Power2.easeOut});

				$current.removeClass("on");
				$next.addClass("on")
				.find(".timer span.active").trigger("play");
			},
			timer: {
				_init: function(){
					$$.timerItem.on("active", $.proxy(this._active, this));
					$$.timerItem.on("play", $.proxy(this._play, this));
					$$.timerItem.on("default", $.proxy(this._default, this));
				},
				_active: function(e){
					var $target = $(e.currentTarget);
					$target.addClass("active").siblings().removeClass("active");
					TweenMax.delayedCall(0.75, function(){
						$target.trigger("play");
					});
				},
				_play: function(e){
					var $bar = $(e.currentTarget).find("em");
					TweenMax.fromTo($bar, data.timerDuration, {height:"0%"}, {height:"100%", ease:Power0.easeNone,
						onComplete: this._end
					});
				},
				_end: function(){
					var $target = this.target;
					var $span = $target.parent();
					var $next = ($span.next().length < 1) ? $span.siblings().eq(0) : $span.next();
					var idx = $next.index();
					var $img = $$.workList.filter(".on").find(".img").children();
					
					TweenMax.set($target, {height:"0"});
					$span.removeClass("active");
					$next.trigger("active");
					
					$img.eq(idx).trigger("change");
				},
				_default: function(e){
					var $span = $(e.currentTarget);
						$em = $span.find("em");

					$span.addClass("default");
					TweenMax.set($em, {height:0+"%"});
					TweenMax.killTweensOf($em);
				}
			}
		}
	}

	ui.EXHIBITION = function(){
		var $$ = core.Selector(arguments[0], {
			slideWrapper : ".slide_wrapper",
			slideItem: ".slide",
			btnPrev: ".prev",
			btnNext: ".next",
			timerItem : ".timer span",
			timerBar: ".timer span em",
			defaultImg: ".default_img"
		});

		var data = {
			idx: 0,
			start: 1390,
			gap: 580,
			isAni: false,
			length: $$.slideItem.length,
			height: $$.container.outerHeight(),
			timerDuration: 4,
			intro: true
		};

		var events = this.events = {
			_init: function(){
				this._set();
				this.timer._init();
				//core.observer.on("mscroll", this._scroll);
				$$.btnPrev.on("click", {dir: -1}, $.proxy(this._detectSlide, this));
				$$.btnNext.on("click", {dir: 1}, $.proxy(this._detectSlide, this));
			},
			_set: function(){
				$$.slideItem.each(function(i){
					TweenMax.set(this, {x:data.start + i*data.gap})
				})
			},
			_scroll: function(e){
				var scrollTop = Math.abs(e.data.scrollTop);
				var contentTop = $$.container[0].offsetTop;
				var contentEnter = contentTop - (core.screen.height - data.height);
				var contentLeave = contentTop + data.height;
				
				if(scrollTop >= contentEnter && scrollTop < contentLeave){
					$$.timerItem.filter(".active").trigger("play");
				}else{
					$$.timerItem.trigger("pause");
				}
			},
			_detectSlide: function(e){
				if(data.isAni) return;
				this.timer._pause();

				var dir = e.data.dir;
				var nextIndex = data.idx + dir;
				if(nextIndex > data.length) return this._moveSlide(0);
				if(nextIndex < 0) return;
				data.isAni = true;

				var $current = (dir == -1) ? $$.slideItem.eq(nextIndex) : $$.slideItem.eq(data.idx);
				var $siblings = $current.siblings();
				var $currentText = $current.find(".txt");
				var $siblingsText = $siblings.find(".txt");
				var posX = (dir == -1) ? "0%" : "100%";

				TweenMax.to($siblings, 1, {x:"-="+580*dir,});
				TweenMax.to($current, 1, {x:"-="+1060*dir,
					onComplete: function(){
						data.idx += dir;
						data.isAni = false;
					}
				});
				TweenMax.to($currentText, 1, {x:posX});
				if(dir == -1){
					TweenMax.to($current.prev().find(".txt"), 1, {x:"100%"});
					$$.timerItem.eq(nextIndex-1).trigger("active");
				}else{
					TweenMax.to($siblingsText, 1, {x:"0%"});
					$$.timerItem.eq(data.idx).trigger("active");
				}

				this._detectButton(nextIndex);
				this._detectIntro(nextIndex, dir);
			},
			_moveSlide: function( i ){
				var $sItem = $$.slideItem.eq(i);
				var $sItemSiblings = $sItem.siblings();
				$$.timerItem.eq(i).trigger("active");

				TweenMax.to($sItem, 1, {x:330});
				TweenMax.to($sItem.find(".txt"), 1, {x:"100%",
					onComplete: function(){
						data.idx = 1;
						data.isAni = false;
					}
				});
				TweenMax.staggerTo($sItemSiblings, 1, {
					cycle: {
						x: function(i){
							return 1390 + (i * 580);
						}
					},
				}, function(){
					data.idx = 1;
					data.isAni = false;
				});
				TweenMax.to($sItemSiblings.find(".txt"), 1, {x:"0%"});
			},
			_detectIntro: function(i, dir){
				if(data.intro){
					$$.timerItem.first().trigger("active");
					data.intro = false;
					this.timer._pause();

					setTimeout(function(){
						$$.defaultImg.addClass("hidden");
					}, 1000);
				}
				if(i == 0 && dir == -1){
					data.intro = true;
					this.timer._pause();
					$$.timerItem.removeClass("active");
					$$.defaultImg.removeClass("hidden");
				};
				
			},
			_detectButton: function( i ){
				if(i > 0) $$.btnPrev.fadeIn();
				else $$.btnPrev.fadeOut();
			},
			timer: {
				_init: function(){
					$$.timerItem.on("active", $.proxy(this._active, this));
					$$.timerItem.on("play", $.proxy(this._play, this));
					$$.timerItem.on("pause", $.proxy(this._pause, this));
				},
				_active: function(e){
					var $target = $(e.currentTarget);
					var idx = $target.index();

					$$.slideItem.eq(idx).addClass("on").siblings().removeClass("on");

					$target.addClass("active").siblings().removeClass("active");
					TweenMax.delayedCall(0.75, function(){
						$target.trigger("play");
					});
				},
				_play: function(e){
					var $bar = $(e.currentTarget).find("em");
					TweenMax.fromTo($bar, data.timerDuration, {width:"0%"}, {width:"100%", ease:Power0.easeNone,
						onComplete: this._end
					});
				},
				_pause: function(){
					TweenMax.set($$.timerBar, {width:0})
					TweenMax.killTweensOf($$.timerBar);
				},
				_end: function(){
					if(data.intro) return;
					var $target = this.target;
					var $span = $target.parent();
					var $next = ($span.next().length < 1) ? $span.siblings().eq(0) : $span.next();
					var nIndex = $next.index();

					TweenMax.set($target, {width:"0"});
					events._detectButton(1);
					$next.trigger("active");
					$$.btnNext.trigger("click");
					
					if(nIndex == 0){
						events._moveSlide(0);
					}
				}
			}
		}
	}

	ui.STORIES = function(){
		var $$ = core.Selector(arguments[0], {
			itemGroup: ".list >ul",
			items: ".list >ul >li"
		});

		this.events = {
			_init: function(){
				this._set();
				core.observer.on("mscroll", this._scroll);
				$$.itemGroup.one("showItem", this._showItem);
			},
			_set: function(){
				TweenMax.set($$.items , {opacity:0});
			},
			_scroll: function(e){
				var scrollTop = -e.data.scrollTop;
				$$.itemGroup.each(function(){
					var offsetTop = this.offsetTop + core.screen.height - 100;
					if(scrollTop > offsetTop){
						$(this).trigger("showItem");
					}
				});
			},
			_showItem: function(){
				var $el = $(this).children();
				TweenMax.staggerFromTo($el, .75, {y:100, opacity:0}, {y:0, opacity:1, ease:Sine.easeOut}, .2);
			}
		}
	}

	ui.ARTIST = function(){
		var $$ = core.Selector(arguments[0], {
			intro: ".intro",
			more: ".more",
			bg: ".bg"
		});

		var is;

		this.events = {
			_init: function(){
				this._set();
				core.observer.on("mscroll", $.proxy(this._detect, this));
			},
			_set: function(){
				TweenMax.set($$.bg, {width:0});
				TweenMax.set([$$.intro, $$.more], {y:100, opacity:0});
			},
			_detect: function(e){
				var top = -e.data.scrollTop;
				var contentTop = $$.container[0].offsetTop - 1080 + 470;
				if(contentTop <= top && !is){
					is = true;
					TweenMax.to($$.bg, .75, {width:100+"%", ease:Power2.easeInOut});
					TweenMax.staggerTo([$$.intro, $$.more], 1, {delay:.7, y:0, opacity:1, ease:Power2.easeOut}, .1);
				}
				
			}
		}
	}

	ui.PUBLICATIONS = function(){
		var $$ = core.Selector(arguments[0], {
			book: ".book",
			text: ".text",
			timerItem: ".timer span",
			bookItem: ".book .slide",
		});

		var data = {
			timer: false,
			timerDuration: 4,
		};

		var events = this.events = {
			_init: function(){
				this.timer._init();
				/*
				core.observer.on("createScroll", function(){
					core.$body.mCustomScrollbar("scrollTo",".publications .left", 0);
				});*/
				core.observer.on("mscroll", $.proxy(this._detectScroll, this));
			},
			_detectScroll: function(e){
				var top = -e.data.scrollTop;
				var contentTop = $$.container[0].offsetTop - core.screen.height / 2;
				if(top >= contentTop && !data.timer){
					$$.timerItem.filter(".active").trigger("play");
					
				}
				if(top < contentTop && data.timer){
					this.timer._pause();
				}
			},
			_setSwiper: function(){
				/*
				data.bookSwiper = new Swiper($$.book, {
					allowTouchMove: false,
					parallax: true,
					effect: 'fade',
					fadeEffect: {
						crossFade: true
					},
				});*/
			},
			_moveBook: function(idx){
				var $current = $$.bookItem.filter(".on");
				var $currentItem = $current.children();
				var $next = $$.bookItem.eq(idx);
				var $nextItem = $next.children();

				TweenMax.to($currentItem.eq(1), .5, {rotationY:-90, ease:Power1.easeIn,
					onComplete: function(){
						//TweenMax.set($current, {rotationY:0});
						$current.removeClass("on");
						$next.addClass("on");

						TweenMax.fromTo($nextItem.eq(1), .5, {rotationY:90, zIndex:3}, {rotationY:0, ease:Power1.easeOut,
							onComplete: function(){
								$nextItem.removeAttr("style");
							}
						});
					}
				});
			},
			timer: {
				_init: function(){
					$$.timerItem.on("play", $.proxy(this._play, this));
				},
				_active: function($el){
					var idx = $el.index();
					$$.text.attr("data-idx", idx);
					events._moveBook(idx);
					$el.addClass("active").trigger("play")
					.siblings().removeClass("active");
				},
				_play: function(e){
					data.timer = true;
					var $me = $(e.currentTarget);
					var $bar = $me.children();
					var $next = $me.next().length < 1 ? $$.timerItem.eq(1) : $me.next();

					TweenMax.fromTo($bar, data.timerDuration, {width:"0%"}, {width:"100%", ease:Power0.easeNone,
						onComplete: $.proxy(function(){
							this._active($next)
						}, this)
					});
				},
				_pause: function(){
					TweenMax.killTweensOf($$.timerItem.find("em"));
					TweenMax.set($$.timerItem.find("em"), {width:"0%"});
					data.timer = false;
				}
			}
		}
	}

	ui.YEAR50 = function(){
		var $$ = core.Selector(arguments[0], {
			page: ".page",
			item: ".page >div",
			header: "#header",
			headerTheme: "#header .logo, #header .hambuger, #header .icon, #header .year",
			videoWrap: ".video",
			video: ".video video",
			closeVideo: ".page_01 .close_video",
			openVideo: ".page_01 .open_video",
			nextBtn: ".next_btn"
		});
	
		var data = {
			cIdx: 0,
			isAni: false,
			length: $$.item.length,
			duration: 1,
			isPlayVideo: false,
		}
	
		this.events = {
			_init: function(){
				core.observer.on("WHEEL_UP WHEEL_DOWN", $.proxy(this._detectWheel, this))
				core.observer.on("animationEnd", this._animationEnd);
				data.pos = this._GetPosition();
				if(data.cIdx !== 0) this._setPage();
				$$.nextBtn.on("click", function(){
					core.observer.notify("WHEEL_DOWN", {dir:1});
				})
				this.video._init();
				this._intro();
			},
			_intro: function(){
				var $img1 = $$.item.eq(0).find(".img1 img");
				var $img2 = $$.item.eq(0).find(".img2");
				TweenMax.staggerFromTo($img1, 1, {y:20, opacity:0}, {delay:.5, y:0, opacity:1, ease:Back.easeOut}, .04);
				//TweenMax.staggerFromTo($img1, 1, {scale:2, opacity:0}, {delay:.5, scale:1, opacity:1, ease:Back.easeOut}, .04);
				TweenMax.fromTo($img2, 1.5, {y:100, opacity:0}, {delay:1.5, y:0, opacity:1, ease:Power2.easeInOut});
			},
			video: {
				_init: function(){
					$$.closeVideo.on("click", this._close);
					$$.video.on("canplay", $.proxy(function(){
						$$.openVideo.on("click", this._open);
					}, this));
				},
				_open: function(){
					$$.header.addClass("hide");
					$$.videoWrap.addClass("active");
					TweenMax.to($$.video, 1, {opacity:1,
						onComplete: function(){
							$$.video[0].play();
						}
					});
				},
				_close: function(){
					$$.header.removeClass("hide");
					$$.videoWrap.removeClass("active");
					TweenMax.to($$.video, 1, {opacity:0});
					$$.video[0].pause();
					$$.video[0].currentTime = 0;
				}
			},
			_GetPosition: function(){
				var x = [];
				$$.item.each(function(i){
					var $me = $(this);
					var $prev = $me.prev(),
						hasFix = $prev.hasClass("fixWidth") && $me.hasClass("fixWidth"),
						offLeft = this.offsetLeft;
					
					if(hasFix) offLeft -= 1920 - this.clientWidth;
					x.push(offLeft);
				})
				return x;
			},
			_setPage: function(){
				TweenMax.set($$.page, {x:-data.pos[data.cIdx]});
				this._detectTheme(data.cIdx);
			},
			_detectWheel: function(e){
				if(data.isAni) return;
			
				data.dir = e.data.dir;
				data.forX = data.dir*200;
				data.nIdx = data.cIdx + data.dir;
				if(data.nIdx < 0 || data.nIdx >= data.length) return;
				data.isAni = true;
	
				$$.currentItem = $$.item.eq(data.cIdx);
				$$.nextItem = $$.item.eq(data.nIdx);
	
				this.animation[data.cIdx].leave();
				this.animation[data.nIdx].enter();
	
				this._detectTheme(data.nIdx);
				this._movePage();
			},
			_movePage: function(){
				TweenMax.to($$.page, data.duration, {x:-data.pos[data.nIdx], ease:Power2.easeInOut,
					onComplete: function(){
						core.observer.notify("animationEnd");
					}
				});
			},
			_detectTheme: function(i){
				var theme = $$.item.eq(i).data("black");
				var black = (theme !== undefined) ? theme.split(",") : false;

				setTimeout(function(){
					if(black){
						for(var i=0;i<black.length;i++){
							$$.container.find("."+black[i]).removeClass("white");
						}
					}else{
						$$.headerTheme.addClass("white");
					}
				}, 1000);
			},
			animation: [
				{//PAGE 01 : video
					enter: function(){
						
					},
					leave: function(){
						
					}
				},
				{//PAGE 02 : history
					enter: function(){
						TweenMax.fromTo($$.nextItem.find(".img img"), 2, {scale:1.9, x:500*data.dir}, {scale:1, x:0, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".txt"), 1, {x:1600*data.dir}, {delay:.7, x:0, ease:Power3.easeOut});
						TweenMax.staggerFromTo($$.nextItem.find(".txt img"), 1, {opacity:0, x:100*data.dir}, {opacity:1, delay:1.3, x:0, ease:Power1.easeOut}, .01);
					},
					leave: function(){
						TweenMax.to($$.currentItem.find(".img img"), 2, {scale:1.5, ease:Power1.easeOut});
						//TweenMax.fromTo($$.currentItem.find(".txt"), 1, {x:0}, {x:-1600*data.dir, ease:Power1.easeOut});
					}
				},
				{//PAGE 03 : 1970S
					enter: function(){
						var color = (data.dir == 1) ? "#f5f5f5" : "#ffffff";
						TweenMax.killChildTweensOf($$.nextItem);
						TweenMax.fromTo($$.nextItem, .75, {backgroundColor:color}, {delay:.8, backgroundColor:"#252525", ease:Power1.easeOut});

						var $flowItem = $$.nextItem.find(".flow-slide");
						var t = new TimelineMax();
						t.add(TweenMax.fromTo($$.nextItem.find(".tit"), .5, {x:data.dir* 50, opacity:0}, {delay:1.2, x:0, opacity:1}));
						t.add(TweenMax.staggerFromTo($flowItem.eq(0).children(), 2, {opacity:0, y:100}, {opacity:1, y:0}, 0.5));
						t.add(TweenMax.staggerTo($flowItem.eq(0).children(), 1, {y:-50, opacity:0, ease:Power1.easeInOut}, .1), "-=0.2");
						t.add(TweenMax.staggerFromTo($flowItem.eq(1).children(), 1.5, {y:50, opacity:0}, {y:0, opacity:1}, 0.5), "-=0.2");
						t.add(TweenMax.fromTo($$.nextItem.find(".next_btn"), .5, {y:50, opacity:0}, {y:0, opacity:1}));
					},
					leave: function(){
						//TweenMax.fromTo($$.currentItem, 2, {backgroundColor:"#252525"}, {delay:data.duration, backgroundColor:"#f5f5f5", ease:Power2.easeOut});
					}
				},
				{//PAGE 04 : 
					enter: function(){
						var _delay = (data.dir == 1) ? [0.4, 0.5] : [0.4, 0.5];

						TweenMax.fromTo($$.nextItem.find(".img1"), 1, {x:data.dir*300, opacity:0}, {delay:_delay[0], x:0, opacity:1, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img2 img"), 3, {scale:1.2}, {scale:1,});
					},
					leave: function(){
						TweenMax.to($$.currentItem.find(".img1"), 1, {x:0}, {x:data.dir*300, opacity:0, ease:Power1.easeOut});
						TweenMax.to($$.currentItem.find(".img2 img"), 3, {scale:1.2});
					}
				},
				{//PAGE 05 : 
					enter: function(){
						var _delay = (data.dir == 1) ? [0.4, 0.5] : [0.5, 0.4];

						TweenMax.fromTo($$.nextItem.find(".img1"), 1, {x:data.dir*300, opacity:0}, {delay:_delay[0], x:0, opacity:1, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img2"), 1, {x:data.dir*300, opacity:0}, {delay:_delay[1], x:0, opacity:1, ease:Power1.easeOut});
					},
					leave: function(){
						
					}
				},
				{//PAGE 06 : 
					enter: function(){
						if(data.dir == -1) return
						TweenMax.staggerFromTo($$.nextItem.children(), 1, {x:data.dir*300, opacity:0}, {delay:.4, x:0, opacity:1, ease:Power1.easeOut}, .1);
					},
					leave: function(){
						if(data.dir == -1){

						}
					}
				},
				{//PAGE 07 : 
					enter: function(){
						TweenMax.staggerFromTo($$.nextItem.find(".img img"), .75, {opacity:0, y:50}, {delay:.7, opacity:1, y:0, ease:Power1.easeOut}, .1);

						if(data.dir == -1){
							var $item = $$.item.eq(5).children();
							var $ritem = $($item.get().reverse());
							TweenMax.staggerFromTo($ritem, 1, {x:data.dir*300, opacity:0}, {opacity:1, delay:.4, x:0, ease:Power1.easeOut}, .1);
						}
					},
					leave: function(){
						//TweenMax.staggerTo($$.currentItem.find(".img img"), 1, {opacity:0, y:100, ease:Power1.easeOut}, .1);
					}
				},
				{//PAGE 08 : 
					enter: function(){
						var color = (data.dir == 1) ? "#e7e5f8" : "#ffffff";
						TweenMax.killChildTweensOf($$.nextItem);
						TweenMax.fromTo($$.nextItem, .75, {backgroundColor:color}, {delay:0.8, backgroundColor:"#252525", ease:Power2.easeOut});

						var $flowItem = $$.nextItem.find(".flow-slide");
						var t = new TimelineMax();
						t.add(TweenMax.fromTo($$.nextItem.find(".tit"), .5, {x:data.dir* 50, opacity:0}, {delay:1.2, x:0, opacity:1}));
						t.add(TweenMax.staggerFromTo($flowItem.eq(0).children(), 2, {opacity:0, y:100}, {opacity:1, y:0}, 0.5));
						t.add(TweenMax.staggerTo($flowItem.eq(0).children(), 1, {y:-50, opacity:0, ease:Power1.easeInOut}, .1), "-=0.2");
						t.add(TweenMax.staggerFromTo($flowItem.eq(1).children(), 1.5, {y:50, opacity:0}, {y:0, opacity:1}, 0.5), "-=0.2");
						t.add(TweenMax.fromTo($$.nextItem.find(".next_btn"), .5, {y:50, opacity:0}, {y:0, opacity:1}));
					},
					leave: function(){
						//TweenMax.fromTo($$.currentItem, 2, {backgroundColor:"#252525"}, {delay:data.duration, backgroundColor:"#f5f5f5", ease:Power2.easeOut});
					}
				},
				{//PAGE 09 : 
					enter: function(){
						var _delay = (data.dir == 1) ? [0.4, 0.5] : [0.5, 0.4];

						TweenMax.fromTo($$.nextItem.find(".img1"), 1, {x:data.dir*300, opacity:0}, {delay:_delay[0], x:0, opacity:1, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img2 img"), 3, {scale:1.2}, {scale:1,});
					},
					leave: function(){
						TweenMax.to($$.currentItem.find(".img2 img"), 3, {scale:1.2});
					}
				},
				{//PAGE 10 : 
					enter: function(){
						var _delay = (data.dir == 1) ? [0.4, 0.5, 0.6] : [0.6, 0.5, 0.4]
						TweenMax.fromTo($$.nextItem.find(".img1"), 1, {y:-100, opacity:0}, {delay:_delay[0], opacity:1, y:0, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img2"), 1, {y:100, opacity:0}, {delay:_delay[1], opacity:1, y:0, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img3 img"), 3, {scale:1.2}, {scale:1});
					},
					leave: function(){
						TweenMax.to($$.currentItem.find(".img1"), 1, {y:-100, opacity:0, ease:Power1.easeOut});
						TweenMax.to($$.currentItem.find(".img2"), 1, {y:100, opacity:0, ease:Power1.easeOut});
						TweenMax.to($$.currentItem.find(".img3 img"), 3, {scale:1.2});
					}
				},
				{//PAGE 11 : 
					enter: function(){
						if(data.dir == -1) return;
						TweenMax.fromTo($$.nextItem.find(".img1"), 1, {x:300, opacity:0}, {delay:.4, x:0, opacity:1, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img2"), 1, {y:300, opacity:0}, {delay:.5, y:0, opacity:1, ease:Power1.easeOut});
						TweenMax.fromTo($$.nextItem.find(".img3"), 1, {y:-300, opacity:0}, {delay:.6, y:0, opacity:1, ease:Power1.easeOut});
					},
					leave: function(){
						if(data.dir == -1){
							TweenMax.to($$.currentItem.find(".img1"), 1, {x:-300*data.dir}, {x:0, ease:Power1.easeOut});
							TweenMax.to($$.currentItem.find(".img2"), 1, {y:-300*data.dir}, {y:0, ease:Power1.easeOut});
							TweenMax.to($$.currentItem.find(".img3"), 1, {y:300*data.dir}, {y:0, ease:Power1.easeOut});
						}
					}
				},
				{//LAST : 
					enter: function(){
						TweenMax.staggerFromTo($$.nextItem.find(".img img"), .75, {opacity:0, y:50}, {delay:.7, opacity:1, y:0, ease:Power1.easeOut}, .1);
					},
					leave: function(){
						//TweenMax.staggerFromTo($$.currentItem.find(".img img"), 1.4, {opacity:1, x:0}, {opacity:0, x:100, ease:Power2.easeOut}, .1);
					}
				},
			],
			_animationEnd: function(){
				data.cIdx = data.nIdx;
				data.isAni = false;
				$$.currentItem.removeClass("on");
				$$.nextItem.addClass("on");
			}
		}
	}
	
	core.observer.on("LOAD", function(){
		ui("HEADER", "#wrap");
		ui("WORK", ".work_container");
		ui("EXHIBITION", ".exhibition");
		ui("STORIES", ".stories");
		ui("ARTIST", ".artist");
		ui("PUBLICATIONS", ".publications");
		ui("YEAR50", ".year_50");
	});
})(jQuery, window[APP_NAME], window[APP_NAME].ui);