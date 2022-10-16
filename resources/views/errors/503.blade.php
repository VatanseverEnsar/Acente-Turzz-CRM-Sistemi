<!DOCTYPE HTML>
<html lang="en">
<head>
<title>UCUZUCUYORUM.COM | ÇOK YAKINDA</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="{{ url('img/favicon.png') }}" type="image/x-icon"/>
<meta charset="UTF-8">
<style>
    
/*
====================================================

* 	[Master Stylesheet]
	
	Theme Name :  
	Version    :  
	Author     :  
	Author URI :  

====================================================

	TOC
	
	1. PRIMARY STYLES
	2. COMMONS FOR PAGE DESIGN
		JQUERY LIGHT BOX
	3. MAIN SECTION
		TIME COUNTDOWN
		SOCIAL BTN

====================================================

/* ---------------------------------
1. PRIMARY STYLES
--------------------------------- */

html{ font-size: 100%; height: 100%; width: 100%; overflow-x: hidden; margin: 0px;  padding: 0px; touch-action: manipulation; }


body{ font-size: 16px; font-family: 'Open Sans', sans-serif; width: 100%; height: 100%; margin: 0; font-weight: 400;
	-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; word-wrap: break-word; overflow-x: hidden; 
	color: #333; }

h1, h2, h3, h4, h5, h6, p, a, ul, span, li, img, inpot, button{ margin: 0; padding: 0; }

h1,h2,h3,h4,h5,h6{ line-height: 1.5; font-weight: inherit; }

h1,h2,h3{ font-family: 'Poppins', sans-serif; }

p{ line-height: 1.6; font-size: 1.05em; font-weight: 400; color: #555; }

h1{ font-size: 3.5em; line-height: 1; }
h2{ font-size: 3em; line-height: 1.1; }
h3{ font-size: 2.5em; }
h4{ font-size: 1.5em; }
h5{ font-size: 1.2em; }
h6{ font-size: .9em; letter-spacing: 1px; }

a, button{ display: inline-block; text-decoration: none; color: inherit; transition: all .3s; line-height: 1; }

a:focus, a:active, a:hover,
button:focus, button:active, button:hover,
a b.light-color:hover{ text-decoration: none; color: #E45F74; }

b{ font-weight: 500; }

img{ width: 100%; }

li{ list-style: none; display: inline-block; }

span{ display: inline-block; }

button{ outline: 0; border: 0; background: none; cursor: pointer; }

b.light-color{ color: #444; }

.icon{ font-size: 1.1em; display: inline-block; line-height: inherit; }

[class^="icon-"]:before, [class*=" icon-"]:before{ line-height: inherit; }

html {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

*,
*::before,
*::after {
  -webkit-box-sizing: inherit;
          box-sizing: inherit;
}



/* ---------------------------------
2. COMMONS FOR PAGE DESIGN
--------------------------------- */

.center-text{ text-align: center; } 

.display-table{ display: table; height: 100%; width: 100%; }

.display-table-cell{ display: table-cell; vertical-align: middle; }



::-webkit-input-placeholder { font-size: .9em; letter-spacing: 1px; }

::-moz-placeholder { font-size: .9em; letter-spacing: 1px; }

:-ms-input-placeholder { font-size: .9em; letter-spacing: 1px; }

:-moz-placeholder { font-size: .9em; letter-spacing: 1px; }


.full-height{ height: 100%; }

.position-static{ position: static; }

.font-white{ color: #fff; }


/* ---------------------------------
3. MAIN SECTION
--------------------------------- */

.main-area{ position: relative; z-index: 1; height: 100%; padding: 0 20px; background-size: cover;
	box-shadow: 2px 5px 30px rgba(0,0,0,.3); color: #fff; }

.main-area:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    opacity: .7;
    background: linear-gradient(-9deg, #4CAF50 0%, #009688 40%, #4CAF50 100%);
}

.main-area .desc{ margin: 20px auto; max-width: 500px; }
	
.main-area .notify-btn{ margin: 20px 0; padding: 13px 35px; border-radius: 50px; border: 2px solid #F84982;
	color: #fff; background: #F84982; }

.main-area .notify-btn:hover{ background: none; }


/* EMAIL INPUT */

.main-area .email-input-area{ margin: 40px auto; position: relative; width: 450px; height: 53px; }

.main-area .email-input-area .email-input{ width: 100%; position: absolute; top: 0; bottom: 0; left: 0; 
	border-radius: 40px; border: 0; outline: 0; padding: 0 140px 0 25px; transition: all .2s; background: #F1F2F3; 
	box-shadow: inset 0 0 1px rgba(0,0,0,.1), 0px 0px 0px 5px rgba(255,255,255,.3); border: 1px solid transparent; }

.main-area .email-input-area .email-input:focus{ border-color: #f89fbc; }


.main-area .email-input-area .submit-btn{ width: 120px; text-align: center; position: absolute; top: 5px; bottom: 5px; right: 5px; font-size: .9em;
	border-radius: 40px; transition: all .3s; background: #F84982; color: #fff; }

.main-area .email-input-area .submit-btn:hover{ background: #e40b52; }



/* TIME COUNTDOWN */

#normal-countdown{ text-align: center; }

#normal-countdown .time-sec{ position: relative; display: inline-block; margin: 12px; height: 90px; width: 90px; 
	border-radius: 100px; box-shadow: 0px 0px 0px 5px rgba(255,255,255,.5); background: #fff; color: #333; }

#normal-countdown .time-sec .main-time{ font-weight: 500; line-height: 70px; font-size: 2em; color: #F84982; }

#normal-countdown .time-sec span{ position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
	font-size: .9em; font-weight: 600; }


/* SOCIAL BTN */

.main-area .social-btn{ position: absolute; bottom: 30px; width: 100%; left: 50%; transform: translateX(-50%); }


.main-area .social-btn .list-heading{ display: block; margin-bottom: 15px; }

.main-area .social-btn > li > a > i{ display: inline-block; height: 35px; width: 35px; line-height: 35px; border-radius: 40px;
	font-size: 1.04em; margin: 0 5px; }

.main-area .social-btn > li > a > i:hover{ background: #fff!important; }	
	
.main-area .social-btn > li > a > i[class*="facebook"]{ background: #2A61D6; }
.main-area .social-btn > li > a > i[class*="twitter"]{ background: #3AA4F8; }
.main-area .social-btn > li > a > i[class*="google"]{ background: #F43846; }
.main-area .social-btn > li > a > i[class*="instagram"]{ background: #8F614A; }
.main-area .social-btn > li > a > i[class*="pinterest"]{ background: #E1C013; }
</style>
</head>
<body>
<div class="main-area center-text">
<div class="display-table">
<div class="display-table-cell">
<h1 class="title"><b>Çok Yakında Sizlerleyiz!</b></h1>
<p class="desc font-white">Dünya'nın en uygun uçak bileti portalı ucuzucuyorum.com, çok yakında sizlerle!</p>

</div>
</div>
</div>
</body>
</html>