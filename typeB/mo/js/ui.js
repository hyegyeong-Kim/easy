
/*
 * ui
 * create Rule
 
	ui.name|String| = function(){
		
	}
 */

(function($, core, ui, undefined){
	"use strict";
	ui.CUSTOM_SCROLL = function(){
        var $$ = core.Selector(arguments[0], {
            footer : "footer"
        })
        var data = {
            top: 0
        };

        this.events = {
            _init: function(){
                if($$.container.find(".creator").length > 0) return;
                if(core.$body.find("#wrap").length > 0) return;

                data.mcs = $$.container.mCustomScrollbar({
                    scrollbarPosition: "outside",
                    theme: "minimal-dark",
                    mouseWheel:{ 
                        scrollAmount: 300
                    },
                    callbacks: {
                        whileScrolling : this._scrolling,
                        onInit: function(){
                            $(".pairing .video").trigger("onScrollInit");
                        },
                    },
                });
            },
            _scrolling: function(){
				console.log(this.mcs.top);
				if(this.mcs.top <= -910){
					$('.fix_gnb1').hide();
					$('.fix_gnb2').show();
                }else{
					$('.fix_gnb2').hide();
					$('.fix_gnb1').show();
				}
            }
        }
    }

    ui.SHOW = function(){
        var $$ = core.Selector(arguments[0], {
            creatorList : ".creator_list",
            comingSwiper : ".coming_soon .swiper-container",
            bottomSwiper: ".bottom_swiper",
            pairing: ".pairing",
            openPairing: ".open_pairing",
            closePairing: ".close_pairing",
            s_marker: ".schedule .marker",
            s_day: ".schedule .day >a",
            s_video: ".schedule .video",
            timer: ".broad .timer",
            broadItem: ".broad >li:first",
            broadVideo: ".broad video",
        });

        var data = {
            top: 0
        };

        this.events = {
            _init: function(){
                this.swiper._set();
                this.pairing._init();
                this.broad._init();
            },
            pairing: {
                _init: function(){
                    $$.openPairing.on("click", $.proxy(this._open, this));
                    $$.closePairing.on("click", $.proxy(this._close, this));
                    $$.s_day.on("click", $.proxy(this._clickMarker, this));
                    $$.s_video.on("onScrollInit", function(){
                        data.videoSwiper = new Swiper($$.s_video, {
                            direction: "vertical",
                            slidesPerView: "auto",
                            speed: 500,
                            on: {
                                slideChange: function(){
                                    console.dir(this.activeIndex)
                                    $$.s_day.eq(this.activeIndex).trigger("click");
                                }
                            },
                        })
                    })
                    
                    // $$.s_video.mCustomScrollbar({
                    //     scrollbarPosition: "outside",
                    //     theme: "minimal-dark",
                    //     callbacks: {
                    //         whileScrolling : function(){
                    //             var top = Math.abs(this.mcs.top);
                    //             var idx = parseInt(top/330);

                    //             //$$.s_day.eq(idx).trigger("click");
                    //             console.dir(idx);
                    //         },
                    //     },
                    // })
                },
                _clickMarker: function(e){
                    var $target = $(e.currentTarget);
                    var idx = $$.s_day.index($target);

                    if(idx > 8) return;

                    $$.s_day.removeClass("on");
                    $$.s_day.eq(idx).addClass("on")

                    if(idx < 1){
                        $$.s_day.eq(idx).next().addClass("on");
                        $$.s_marker.css("top",70.27*idx+"px").removeClass("small");
                    }else{
                        $$.s_marker.css("top",70.27*idx+"px").addClass("small");
                    }
                    data.videoSwiper.slideTo(idx, 500);
                    
                },
                _open: function(){
                    TweenMax.to($$.pairing, .7, {x:"0%", ease:Power2.easeInOut});
                    $("body").mCustomScrollbar("disable");
                },
                _close: function(){
                    TweenMax.to($$.pairing, .7, {x:"100%", ease:Power2.easeInOut})
                    $("body").mCustomScrollbar("update");
                }
            },
            swiper: {
                _set: function(){
                    data.creatorSwiper = new Swiper($$.creatorList.find(".swiper-container"), {
                        //freeMode: true,
                        slidesPerView: "auto",
                        spaceBetween: 10
                    });

                    data.comingSwiper = new Swiper($$.comingSwiper, {
                        slidesPerView: "auto",
                        spaceBetween: 22
                    });

                    data.bSwiper = new Swiper($$.bottomSwiper, {
                        slidesPerView: "auto",
                        spaceBetween: 22
                    })
                }
            },
            broad: {
                _init: function(){
                    $$.timer.each($.proxy(this._count, this));
                    $$.broadItem.on("mouseenter", function(){
                        $$.broadVideo.fadeIn();
                        $$.broadVideo[0].play();
                    });
                    $$.broadItem.on("mouseleave", function(){
                        $$.broadVideo.fadeOut();
                        $$.broadVideo[0].pause();
                    });
                },
                _count: function(e, el){
                    var $span = $(el).find("span");
                    this.DailyMissionTimer(1, $span);
                },
                DailyMissionTimer(duration, $el) {
                    var timer = 2783;
                    var hours, minutes, seconds;
                    
                    var interval = setInterval(function(){
                        hours	= parseInt(timer / 3600, 10);
                        minutes = parseInt(timer / 60 % 60, 10);
                        seconds = parseInt(timer % 60, 10);
                        
                        hours 	= hours < 10 ? "0" + hours : hours;
                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;
                        $el.text(hours+":"+minutes+":"+seconds);
                
                        if (--timer < 0) {
                            timer = 0;
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            }
        }
    }

    ui.CREATOR = function(){
        var $$ = core.Selector(arguments[0], {
            hotSwiper : ".hot .swiper-container",
            openDetail: ".hot .open_detail",
            list: ".list",
            detail: ".detail",
            back: ".back"
        });
        $$.footer = $("footer");

        var data = {
            top: 0
        };

        this.events = {
            _init: function(){
                this.scroll._init();
                this.swiper._init();
                $$.openDetail.on("click", function(){
                    data.offsetTop = $(this).offset().top;
                    $$.detailClone = $("<div style='position:fixed;width:219px;height:331px;z-index:10;left:30px;top:"+data.offsetTop+"px;background:url(img/creator_detail.png);background-size:cover;overflow:hidden;border-radius:24px;z-index:5'></div>");
                    $$.container.append($$.detailClone);

                    TweenMax.to($$.list, .5, {opacity:0});
                    TweenMax.to($$.detailClone, .5, {left:0, top:0, width:420, height:599, borderRadius:0, ease:Power2.easeInOut,
                        onComplete: function(){
                            $$.detail.show();
                            $$.detailClone.css("visibility","hidden")
                        }
                    });
                });

                $$.back.on("click", function(){
                    $$.detail.fadeOut();
                    TweenMax.to($$.list, .5, {opacity:1});
                    TweenMax.set($$.detailClone, {zIndex:10, visibility:"visible"});
                    TweenMax.to($$.detailClone, .5, {left:30, top:data.offsetTop, width:219, height:331, borderRadius:30, ease:Power2.easeInOut,
                        onComplete: function(){
                            $$.detailClone.remove();
                        }
                    });
                });
            },
            scroll: {
                _init: function(){
                    data.mcs = $$.list.mCustomScrollbar({
                        scrollbarPosition: "outside",
                        theme: "minimal-dark",
                        mouseWheel:{ 
                            scrollAmount: 300
                        },
                        callbacks: {
                            onScrollStart : function(){
                                data.top = this.mcs.top;
                            },
                            onScroll: function(){
                                data.top = this.mcs.top;
                            },
                            whileScrolling : this._scrolling,
                        },
                    });

                    data.mcs = $$.detail.mCustomScrollbar({
                        scrollbarPosition: "outside",
                        theme: "minimal-dark",
                        mouseWheel:{ 
                            scrollAmount: 300
                        },
                        callbacks: {
                            onScrollStart : function(){
                                data.top = this.mcs.top;
                            },
                            whileScrolling : this._scrolling,
                        },
                    });
                },
                _scrolling: function(){
                    if(data.top < this.mcs.top){
                        TweenMax.to($$.footer, .5, {y:"0%"});
                    }else if(data.top > this.mcs.top){
                        TweenMax.to($$.footer, .5, {y:"100%"});
                    }
                    data.top = this.mcs.top;
                }
            },
            swiper: {
                _init: function(){
                    data.hotSwiper = new Swiper($$.hotSwiper, {
                        slidesPerView: "auto",
                        spaceBetween: 10
                    });
                }
            }
        }
    }

    ui.COMMON = function(){
        var $$ = core.Selector(arguments[0], {
            footer: "footer",
            openMenu: "footer .open_menu",
            menu: ".menu",
            closeMenu: ".menu .close_menu",
        })

        this.events = {
            _init: function(){
                $$.openMenu.on("click", function(){
                    $(".step_02, .step_03").hide();
                    $(".step_01").show();
                    $$.menu.removeClass("above");

                    TweenMax.to($$.menu, .7, {top:"0%", ease:Power2.easeInOut});
                    $("body").mCustomScrollbar("disable");
                    $(".creator").children().mCustomScrollbar("disable");
                })
                $$.closeMenu.on("click", function(){
                    TweenMax.to($$.menu, .7, {top:"100%", ease:Power2.easeInOut});
                    $("body").mCustomScrollbar("update");
                    $(".creator").children().mCustomScrollbar("update");
                });

                $(".step_01_btn").click(function(){
                    $(".step_01").hide();
                    $(".step_02").show();

                    $$.menu.addClass("above");
                });
            
                $(".step_02_btn").click(function(){
                    $(".step_02").hide();
                    $(".step_03").show().mCustomScrollbar("update");
                });
            },
        }
    }
	
	core.observer.on("READY", function(){
        ui("SHOW", ".show");
        ui("CREATOR", ".creator");
        ui("COMMON", "body");
	});
	core.observer.on("LOAD", function(){
        ui("CUSTOM_SCROLL", "body");

        if($("body").find("#wrap").length > 0) return;
        $(".step_03").mCustomScrollbar({
            scrollbarPosition: "outside",
            theme: "minimal-dark",
            mouseWheel:{ 
                scrollAmount: 300
            },
        })
	});
	
})(jQuery, window[APP_NAME], window[APP_NAME].ui);
