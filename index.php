<script src="fUnit/fUnit.js"></script>
<script>
	function toggleMenu()
	{
		var el= document.getElementsByTagName('ul')[0];
		el.style.display= (el.style.display=='none')? '': 'none';
	}
</script>
<body>
	<span style="cursor:pointer;" onclick="toggleMenu()">Menu</span>
	<ul style="display:none;">
		<li>SubMenu 1</li>
		<li>SubMenu 1</li>
		<li>SubMenu 1</li>
		<li>SubMenu 1</li>
		<li>SubMenu 1</li>
	</ul>
	<div id='testPlaceHolder'></div>
</body>
<script>
	fUnit.config({
		format: 'html',
		placeHolder: document.getElementById('testPlaceHolder'),
		name: 'test example'
	});

	fUnit.assert(function(){return 10;}, 10);
	fUnit.assert(function(){return 10;}, 10);
	fUnit.assert(function(){return 10;}, 10);
	fUnit.assert({
		call:function(){
			return 10;
		},
		expected: 10,
		delay:1000
	});
	fUnit.assert(function(){return 10;}, 10);
	fUnit.assert({
		call:function(){
			return 10;
		},
		expected: 11,
		delay:1000
	});
	fUnit.assert({
		call:function(){
			return 10;
		},
		expected: 10,
		delay:1000
	});
	fUnit.assert(function(){return 10;}, 10);

	fUnit.run();
	
</script>