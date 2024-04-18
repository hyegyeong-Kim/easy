var txt1_tf = true;
var txt2_tf = true;
var txt3_tf = true;
var txt4_tf = true;
function test(el){
  var $this = el
  var test = $this.find('span');

  if(!$this.hasClass('true')){
    $this.addClass('true');
    TweenMax.set(test, {opacity:0});
    if( $this.hasClass('txt1') ){
      var del = 92*0.015;
      test.each(function(i){
        if(i >= 92){
          del = del + 0.1;
          TweenMax.to($(this), 0.3, {opacity:1, delay:del});
        }else{
            TweenMax.to($(this), 1, {opacity:1, delay:i*0.015});
        }
      });
    }else if( $this.hasClass('txt2') ){
      var del = 65*0.015;
      test.each(function(i){
        if(i >= 65){
          del = del + 0.1;
          TweenMax.to($(this), 0.3, {opacity:1, delay:del});
        }else{
            TweenMax.to($(this), 1, {opacity:1, delay:i*0.015});
        }
      });

    }else if( $this.hasClass('txt3') ){
      var del = 140*0.015;
      test.each(function(i){
        if(i >= 140){
          del = del + 0.1;
          TweenMax.to($(this), 0.3, {opacity:1, delay:del});
        }else{
            TweenMax.to($(this), 1, {opacity:1, delay:i*0.015});
        }
      });
    }else{
      var del = 100*0.015;
      test.each(function(i){
        if(i >= 100){
          del = del + 0.1;
          TweenMax.to($(this), 0.3, {opacity:1, delay:del});
        }else{
            TweenMax.to($(this), 1, {opacity:1, delay:i*0.015});
        }
      });
    }

  }
};

$(function(){
  var txt = [
    "GALLERY HYUNDAI presents artists' works and<br>exhibitions of the highest quality based on its discerning eye.".split(""),
    "Discover inspiring stories of<br>art, artists, exhibitions curated by Gallery Hyundai.".split(""),
    "Since participating in the first art fair overseas,<br>continues to introduce Korean artartists and works<br>to the mainstream of the international art world.".split(""),
    "Publishing catalogs of their works is contributing to a better<br>understanding of abstract art on the Korean art scene.".split(""),
  ];
  for(var i in txt){
    var length = txt[i].length;
    var _i = parseInt(i) + 2;
    var span = "";
    var $sec = $(".sec"+_i),
        $txt = $sec.find(".txt_type").children("p").first();
    for(var x=0;x<length;x++){
        if(txt[i][x] == "<" ){
            x += 3;
            span += "<br/>";
            continue;
        }
        span += "<span>" + txt[i][x] + "</span>";
    }
    $txt.append(span);
  }



  var count = 0;

  TweenMax.set(".sec1 .slide1, .sec1_slide2", {opacity:0, ease: 'Power3.easeOut'});
  TweenMax.set(".sec1 .slide1 .img1, .sec1 .slide1 .img2, .sec1 .slide1 .img3, .scroll", {opacity:0, ease: 'Power3.easeOut'});
  TweenMax.to(".sec1_slide2", 2,{opacity:1, ease: 'Power3.easeOut'});
  TweenMax.fromTo(".sec1 .slide1", 2, {scale:1.05},{scale:1,opacity:1,y:0 ,ease: 'Power1.easeNone',
      onComplete: function(){
          TweenMax.set(".sec1 .slide1 .img1, .sec1 .slide1 .img2, .sec1 .slide1 .img3", {opacity:0, ease: 'Power3.easeOut'});
          TweenMax.to(".sec1 .slide1 .img1", 0.5, {opacity:1, y:0});
          TweenMax.fromTo(".sec1 .slide1 .img2", 1, {x:100},{opacity:1, x:0, delay:0.3});
          TweenMax.to(".sec1 .slide1 .img3", 0.5, {opacity:1, y:0});
          TweenMax.to(".sec1 .scroll", 0.5, {opacity:1, y:0});
	  }
  });
  var sec_cnt = 0;
  $('.sec1 .next').click(function(){
    if(sec_cnt == 0){
      sec1_swiper2[0].autoplay.stop();
      sec1_swiper2[1].autoplay.stop();
      sec_cnt++;
      TweenMax.to( $('.sec1 .sec1_slide2 .bg') , 1, {left:0, ease: Power1.easeNone});
      setTimeout(function(){

          setTimeout(function(){
            sec1_swiper1.slideNext();
            sec1_swiper3.slideNext();
          },1200);
          TweenMax.set(".swiper-container01 .bg", {left:'100%'});
          TweenMax.fromTo(".sec1_slide1 .img1_4, .sec1_slide1 .img2_4", 1.2,{x:0}, {x:-300, ease: Power4.easeIn});
          TweenMax.to(".swiper-container01 .bg", 1.2, {left:0, ease: Power2.easeIn,
            onComplete: function(){
              sec1_swiper2[0].slideTo(0);
              sec1_swiper2[1].slideTo(0);
              TweenMax.set(".sec1_slide1 .img1_4, .sec1_slide1 .img2_4", {x:0});
              TweenMax.fromTo(".sec1_slide1 .img3_4", 1.5, {x:300}, {x:0, ease: Power4.easeOut});
              TweenMax.set(".swiper-container01 .swiper-slide-next .bg, .swiper-slide-duplicate-next .bg", {left:'0%'});
              TweenMax.to(".swiper-container01 .bg", 1.5, {left:'-100%', ease: Power4.easeOut,});
              TweenMax.to( $('.sec1 .sec1_slide2 .bg') , 1, {left:'-100%', ease: Power1.easeNone, delay:0.3,
                onComplete:function(){
                  TweenMax.set( $('.sec1 .sec1_slide2 .bg') , {left:'100%'});
                }
              });
              TweenMax.set(".sec1 .slide .img1, .sec1 .slide .img2, .sec1 .slide .img3", {opacity:0, ease: 'Power3.easeOut'});
                  TweenMax.to(".sec1 .slide .img1", 0.5, {opacity:1, y:0, delay:1, ease: Power4.easeOut,});
                  TweenMax.fromTo(".sec1 .img2 ", 1, {opacity:0, x:100},{opacity:1, x:0, delay:1.4});
                  TweenMax.to(".sec1 .slide .img3", 0.5, {opacity:1, y:0, delay:1, ease: Power4.easeOut,});
            }
          });
        },700);

    }else{
      sec_cnt = 0;
      sec1_swiper2[0].autoplay.start();
      sec1_swiper2[1].autoplay.start();
      TweenMax.to( $('.sec1 .sec1_slide2 .bg') , 1, {left:0, ease: Power1.easeNone});
      setTimeout(function(){
          setTimeout(function(){
            sec1_swiper1.slideNext();
            sec1_swiper3.slideNext();
          },1200);
          TweenMax.set(".swiper-container01 .bg", {left:'100%'});
          TweenMax.fromTo(".sec1_slide1 .img3_4", 1.2,{x:0}, {x:-300, ease: Power4.easeIn});
      	  TweenMax.to(".swiper-container01 .bg", 1.2, {left:0, ease: Power2.easeIn,
        		onComplete: function(){
              TweenMax.set(".sec1_slide1 .img3_4", {x:0});
              TweenMax.fromTo(".sec1_slide1 .img1_4", 1.5, {x:300}, {x:0, ease: Power4.easeOut});
        		  TweenMax.set(".swiper-container01 .swiper-slide-next .bg, .swiper-slide-duplicate-next .bg", {left:'0%'});
              TweenMax.to(".swiper-container01 .bg", 1.5, {left:'-100%', ease: Power4.easeOut,});
              TweenMax.to( $('.sec1 .sec1_slide2 .bg') , 1, {left:'-100%', ease: Power1.easeNone,delay:0.3,
                onComplete:function(){
                  TweenMax.set( $('.sec1 .sec1_slide2 .bg') , {left:'100%'});
                }
              });
        		  TweenMax.set(".sec1 .slide .img1, .sec1 .slide .img2, .sec1 .slide .img3", {opacity:0, ease: 'Power3.easeOut'});
        		  	  TweenMax.to(".sec1 .slide .img1", 0.5, {opacity:1, y:0, delay:1, ease: Power4.easeOut,});
        		  	  TweenMax.fromTo(".sec1 .img2 ", 1, {opacity:0, x:100},{opacity:1, x:0, delay:1.4});
        		  	  TweenMax.to(".sec1 .slide .img3", 0.5, {opacity:1, y:0, delay:1, ease: Power4.easeOut,});
        		}
      	  });
      },700);

    }
      return false;
  });
});
