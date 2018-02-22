function allinone(dependencies){return `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="description" content="Dependency License Explorer">
		<meta name="keywords" content="HTML,CSS,JavaScript,License,Dependency">
		<meta name="author" content="Jonathan Marsh, Charlie Parker">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Dependency License Explorer</title>
		<style>
		body {
			margin:1px;
			background:#eee;
			font-family:Arial;
			height:min-content;
		}
		.overlay{
			display:none;
			position:absolute;
			z-index:99;
			background:rgba(0,0,0,0.5);
			top:0;
			bottom:0;
			left:0;
			right:0;
		}
		.popup{
			background:white;
			border:1px solid #eee;
			box-shadow:0 .4rem 1rem rgba(0,0,0,0.2);
			border-radius:4px;
			padding:1rem 2rem;
			position:absolute;
			top:50%;
			left:50%;
			transform:translate(-50%,-50%);
		}
		.popup label,
		.popup input{
			display:block;
			width:35rem;
			margin: .5rem 0;
		}
		.popup input{
			position:relative;
			z-index:3;
			padding: .5rem 1rem;
			background: #efefef;
			border: 2px inset;
		}
		.popup button{
			color:white;
		}
		/*List content vertically,*/
		.dependencies {
			display: inline-flex;
			flex-direction: column;
			justify-content: flex-start;
			width: min-content;
			position: absolute;
			left: 100%;
			top: 0;
			height:100%;
		}
		/*giving all the same width & height*/
		.dependency{
			height: 6rem;
		}
		/*We don't want to start 100vw to the left*/
		body > .dependencies{
			left:0;
		}
		/*Hide the radio inputs*/
		input[type="radio"]{
			display:none;
			position:absolute;
		}
		/*Hide the irrelevant tiers*/
		input[type="radio"]:not(:checked) ~ .dependencies{
			display:none;
		}
		/*Content styling*/
		.content{
			display:inline-block;
			position:relative;
			z-index:2;
			background:#aaa;
			padding:1.2rem 2rem .5rem 2rem;
			border-bottom:.2rem solid #999;
			border-radius:.3rem;
			white-space:nowrap;
			text-align:center;
			text-shadow: -1px -1px 2px rgba(0,0,0,0.2);
		}
			/*Highlight directory*/
			.item:not(:only-child):hover,
			input[type="radio"]:checked + .item {
				background: #ddd;
				cursor:pointer;
			}
			/*Highlight conflicting licenses*/
			.content.conflict{
				background:#c79300;
				border-bottom-color:#946d02;
				color:white;
			}
			/*Highlight missing licenses*/
			.content.missing{
				background:#dfa503;
				border-bottom-color:#c59100;
				color:white;
			}
			/*lighten ones with sub modules*/
			input + .item .content{	
				background:#fff;
				border-bottom:.2rem solid #eaeaea;
			}
			input + .item .content.conflict{	
				background:#red;
				border-bottom:.2rem solid #c80000;
			}
			input + .item .content.missing{	
				background:#ffbc00;
				border-bottom:.2rem solid #dfa503;
			}
			/*Stylise text*/
			.content * {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width:15rem;
				margin:0;
			}
			.content p{
				font-size:1rem;
				font-weight:bold;
			}
			.content a{
				font-size:.8rem;
				text-decoration:none;
			}
			.content a:link{
				color:blue;
			}
			.content a:hover{
				text-decoration:underline;
				cursor:pointer;
			}

		/*Add horizontal*/
		.item{
			position:relative;
			padding:1rem 2rem;
			height:4rem;
		}
		.item::before,
		input[type="radio"]:checked + .item::after {
			content: " ";
			display: block;
			height: 2px;
			position: absolute;
			top: 50%;
			left:0;
			width: 2rem;
			background: #aaa;
		}
		input[type="radio"]:checked + .item::before {
			width:100%;
		}
		/*Add vertical*/
		input[type="radio"]:checked + .item::after {
			right: -2px;
			width: 2px;
			left: unset;
			top: unset;
			margin-bottom:-2px;
			height: 1000vh; /*disgusting but works*/
			bottom: 50%;
			z-index:2;
		}
		.dependency::before{
			content: " ";
			display: block;
			height: 6rem;
			position: absolute;
			left: 0;
			z-index: 2;
			width: 2px;
			margin-top: -3rem;
			background: #eee;			
		}
		.dependency:not(:first-child)::before{
			background: #aaa;
		}
		/*icons*/
		.icons{
			position:absolute;
			z-index:3;
			top:0;
		}
		.icons *{display:inline;}
		/*.warnings*/
		.warnings::after {
			content:" ";
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110"> <path stroke-linecap="round" stroke-linejoin="round" stroke="black" stroke-width="5" fill="%23ffd42a" d="M 60,10 L 10,100 L 110,100 Z" /><g text-anchor="middle" dominant-baseline="middle" font-family="Sans-serif" font-size="60" font-weight="bolder"><text x="60" y="68" fill="%23000">!</text></g></svg>');
			display: inline-block;
			width:1rem;
			height:1rem;
			vertical-align:text-bottom;
			background-repeat:no-repeat;
		}
		/*.conflicts*/
		.conflicts::after{
			content:" ";
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="54" r="40" fill="%23c0392b"/><circle cx="50" cy="50" r="40" fill="%23e74c3c"/><g text-anchor="middle" dominant-baseline="middle" font-family="Verdana" font-size="50" font-weight="bolder"><text x="50" y="55"  fill="%23c0392b">X</text><text x="50" y="52" fill="%23fff">X</text></g></svg>');
			display: inline-block;
			width:1rem;
			height:1rem;
			vertical-align:text-bottom;
			background-repeat:no-repeat;
		}
		</style>
	</head>
	<body>
		<div class="overlay">
			<div class="popup">
				<label>Module name:</label>
				<input type="text" placeholder="Name"/>
				<label>Module package:</label>
				<input type="text" placeholder="Package"/>
				<label>Module license:</label>
				<input type="text" placeholder="License"/>	
			</div>
		</div>
		<div class="dependencies">
			${dependencies}
		</div>
		<script type="text/javascript">
		function show(ignore){
			alert(ignore);
		}
		</script>
	</body>
</html>
`;}
function htmlcss(dependencies){return `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="description" content="Dependency License Explorer">
		<meta name="keywords" content="HTML,CSS,JavaScript,License,Dependency">
		<meta name="author" content="Jonathan Marsh, Charlie Parker">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Dependency License Explorer</title>
		<style>
		body {
			margin:1px;
			background:#eee;
			font-family:Arial;
			height:min-content;
		}
		/*List content vertically,*/
		.dependencies {
			display: inline-flex;
			flex-direction: column;
			justify-content: flex-start;
			width: min-content;
			position: absolute;
			left: 100%;
			top: 0;
			height:100%;
		}
		/*giving all the same width & height*/
		.dependency{
			height: 6rem;
		}
		/*We don't want to start 100vw to the left*/
		body > .dependencies{
			left:0;
		}
		/*Hide the radio inputs*/
		input[type="radio"]{
			display:none;
			position:absolute;
		}
		/*Hide the irrelevant tiers*/
		input[type="radio"]:not(:checked) ~ .dependencies{
			display:none;
		}
		/*Content styling*/
		.content{
			position:relative;
			z-index:2;
			background:#aaa;
			padding:1.2rem 2rem .5rem 2rem;
			border-bottom:.2rem solid #999;
			border-radius:.3rem;
			white-space:nowrap;
			text-align:center;
			text-shadow: -1px -1px 2px rgba(0,0,0,0.2);
		}
			/*Highlight directory*/
			.item:not(:only-child):hover,
			input[type="radio"]:checked + .item {
				background: #ddd;
				cursor:pointer;
			}
			/*Highlight conflicting licenses*/
			.content.conflict{
				background:#c79300;
				border-bottom-color:#946d02;
				color:white;
			}
			/*Highlight missing licenses*/
			.content.missing{
				background:#dfa503;
				border-bottom-color:#c59100;
				color:white;
			}
			/*lighten ones with sub modules*/
			input + .item .content{	
				background:#fff;
				border-bottom:.2rem solid #eaeaea;
			}
			input + .item .content.conflict{	
				background:#red;
				border-bottom:.2rem solid #c80000;
			}
			input + .item .content.missing{	
				background:#ffbc00;
				border-bottom:.2rem solid #dfa503;
			}
			/*Stylise text*/
			.content * {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width:10rem;
				margin:0;
			}
			.content *:nth-child(1){
				font-size:1rem;
				font-weight:bold;
			}
		/*Add horizontal*/
		.item{
			position:relative;
			padding:1rem 2rem;
			height:4rem;
		}
		.item::before,
		input[type="radio"]:checked + .item::after {
			content: " ";
			display: block;
			height: 2px;
			position: absolute;
			top: 50%;
			left:0;
			width: 2rem;
			background: #aaa;
		}
		input[type="radio"]:checked + .item::before {
			width:100%;
		}
		/*Add vertical*/
		input[type="radio"]:checked + .item::after {
			right: -2px;
			width: 2px;
			left: unset;
			top: unset;
			margin-bottom:-2px;
			height: 1000vh; /*disgusting but works*/
			bottom: 50%;
			z-index:2;
		}
		.dependency::before{
			content: " ";
			display: block;
			height: 6rem;
			position: absolute;
			left: 0;
			z-index: 2;
			width: 2px;
			margin-top: -3rem;
			background: #eee;			
		}
		.dependency:not(:first-child)::before{
			background: #aaa;
		}
		/*icons*/
		.icons{
			position:absolute;
			z-index:3;
			right:2.1rem;
		}
		.icons *{display:inline;}
		/*.warnings*/
		.warnings::after {
			content:" ";
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 110"> <path stroke-linecap="round" stroke-linejoin="round" stroke="black" stroke-width="5" fill="%23ffd42a" d="M 60,10 L 10,100 L 110,100 Z" /><g text-anchor="middle" dominant-baseline="middle" font-family="Sans-serif" font-size="60" font-weight="bolder"><text x="60" y="68" fill="%23000">!</text></g></svg>');
			display: inline-block;
			width:1rem;
			height:1rem;
			vertical-align:text-bottom;
			background-repeat:no-repeat;
		}
		/*.conflicts*/
		.conflicts::after{
			content:" ";
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="54" r="40" fill="%23c0392b"/><circle cx="50" cy="50" r="40" fill="%23e74c3c"/><g text-anchor="middle" dominant-baseline="middle" font-family="Verdana" font-size="50" font-weight="bolder"><text x="50" y="55"  fill="%23c0392b">X</text><text x="50" y="52" fill="%23fff">X</text></g></svg>');
			display: inline-block;
			width:1rem;
			height:1rem;
			vertical-align:text-bottom;
			background-repeat:no-repeat;
		}
		</style>
	</head>
	<body>
		<div class="dependencies">
			${dependencies}
		</div>
	</body>
</html>
`;}
function separate(dependencies){return`
<!DOCTYPE html>
<html>
	<head>
		<title>OpenSource License Explorer</title>
		<link rel="stylesheet" type="text/css" href="common/index.css"/>
		<link rel="stylesheet" type="text/css" href="common/tree.css"/>
	</head>
	<body>
		<div class="overlay">
			<div class="popup">
				<label>Module name:</label>
				<input type="text" placeholder="Name"/>
				<label>Module package:</label>
				<input type="text" placeholder="Package"/>
				<label>Module license:</label>
				<input type="text" placeholder="License"/>	
			</div>
		</div>
		<div class="dependencies">
			${dependencies}
		</div>
		<script type="text/javascript" src="common/index.js"></script>
	</body>
</html>
`;}