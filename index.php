<script src="fUnit/fUnit.js"></script>
<script>
	function toggleMenu(el)
	{
		if(el)
			el= el.getElementsByTagName('ul')[0];
		else
			el= document.getElementsByTagName('ul')[0];
		el.style.display= (el.style.display=='none')? '': 'none';
	}
	function clearMenus()
	{
		document.getElementsByTagName('ul')[0].style.display= 'none';
		document.getElementsByTagName('ul')[1].style.display= 'none';
	}
	function clicked()
	{
		alert('SubSubSubMenu 2 clicked');
		clearMenus();
		return true;
	}
	function startTests()
	{
		clearMenus();
		fUnit.run();
	}
</script>
<body>
	<div style="height:180px">
		<span style="cursor:pointer;"
			  onclick="toggleMenu()"
			  id="menuToBeClickedAt">Menu</span>
		<ul style="display:none;">
			<li>SubMenu 1</li>
			<li>SubMenu 2</li>
			<li>SubMenu 3</li>
			<li id="subMenuToBeHovered"
				onmouseover="toggleMenu(this)"
				onmouseout="toggleMenu(this)">
				SubMenu 4 >>
				<ul style="display:none;position:absolute;margin-left:75px;margin-top:-20px;">
					<li>SubSubMenu 1</li>
					<li id="secondSubMenuToBeHOvered"
						onmouseover="toggleMenu(this)"
						onmouseout="toggleMenu(this)">
						SubSubMenu 2 >>
						<ul style="display:none;position:absolute;margin-left:95px;margin-top:-20px;">
							<li>SubSubSubMenu_1</li>
							<li id="subMenuToBeClicked"
								onclick="clicked()">SubSubSubMenu_2</li>
							<li>SubSubSubMenu_3</li>
						</ul>
					</li>
					<li>SubSubMenu 3</li>
				</ul>
			</li>
			<li>SubMenu 5</li>
			<li>SubMenu 6</li>
		</ul>
	</div>
	<div id='testPlaceHolder'></div>
	<input type="button" value="Run Tests" onclick="startTests();">
</body>
<script>
	fUnit.config({
		format: 'html',
		placeHolder: document.getElementById('testPlaceHolder'),
		name: 'test example'
	});

	//fUnit.assert(function(){return 10;}, 10);
	//fUnit.assert(function(){return 10;}, 10);
	//fUnit.assert(function(){return 10;}, 10);
	fUnit.assert({
		call:function(){
			document.getElementById('menuToBeClickedAt').onclick();
			return true;
		},
		expected: true,
		delay:1000
	});
	//fUnit.assert(function(){return 10;}, 10);
	fUnit.assert({
		call:function(){
			document.getElementById('subMenuToBeHovered').onmouseover();
			return true;
		},
		expected: true,
		delay:1000
	});
	fUnit.assert({
		call:function(){
			document.getElementById('secondSubMenuToBeHOvered').onmouseover();
			return true;
		},
		expected: true,
		delay:1000
	});
	fUnit.assert({
		call:function(){
			document.getElementById('subMenuToBeClicked').onclick();
			return true;
		},
		expected: true,
		delay:1000
	});
	//fUnit.assert(function(){return 10;}, 10);

	//fUnit.run();
	
</script>