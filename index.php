<script src="fUnit/fUnit.js">
</script>
<body>
	<div id='testPlaceHolder'></div>
</body>
<script>
	var person= {
		name: 'pessoa',
		age:25,
		run: function(speed, time){
			var ret= time * speed;
			return ret.toFixed(2); // distance
		}
	}
	
	function getSpeed(distance, time)
	{
		var ret= distance/time;
		return ret.toFixed(2);
	}
	
	function getArray()
	{
		return [1,2,3,4];
	}
	
	fUnit.config({
		format: 'html',
		placeHolder: document.getElementById('testPlaceHolder'),
		name: 'test example'
	});
	
	fUnit.assert(person.run, 10, 5, 50);
	fUnit.assert(getSpeed, 10, 4, 2.50, function(ret){ /* alert(ret); */ });
	
	
	
	fUnit.assert({
		call: person.run,
		speed:10,
		time: 6,
		name: 'getSpeed',
		expected: 60.01,
		onSuccess: function(ret){ /* alert('ok'); */},
		success: "aeeee",
		fail: "aeeee",
		onFail: function(){ /* alert('poutz!'); */},
		callback: function(ret){
			//alert("\\o/ "+ret);
		}
	});
	fUnit.assert({call:person.run, speed:10, time:3, expected:30});
	fUnit.assert({call:person.run, speed:10, time:3, expected:50, name:'getSpeed'});
	fUnit.assert({call:getArray, expected:[1,2,3,4], name:'getArray'});
	fUnit.assert({call:getArray, expected:[1,2,3,5], name:'getArray'});
	
	fUnit.run();
	
</script>
