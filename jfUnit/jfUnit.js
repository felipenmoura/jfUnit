jfUnit= {
	passes:0,
	failures:0,
	messages: Array(),
	assertArgs: Array(),
	format: 'html',
	placeHolder: false,
	htmlElement: false,
	currentTest: null,
	log: function(msg)
	{
		this.messages.push(msg);
		/*if(console && console.log)
			console.log(msg);*/
	},
	toggleDetailes: function(el){
		vals= el.parentNode.getElementsByTagName('table')[0];

		if(vals.style.display=='none')
		{
			el.innerHTML= "hide values";
			vals.style.display='';
		}else{
				el.innerHTML= "show values";
				vals.style.display='none'
			 }
	},
	tearDown: function(){
		var totalTests= jfUnit.passes+ jfUnit.failures;
		var perc= (jfUnit.passes*100)/totalTests;
		var dt= new Date();
		jfUnit.testEnd= dt.getTime()
		jfUnit.totalTime= jfUnit.testEnd - jfUnit.testStart;
		var tearDownPlaceHowder= document.createElement("div");
		jfUnit.tearDownPlaceHowder= tearDownPlaceHowder;
		jfUnit.container.appendChild(jfUnit.tearDownPlaceHowder);
		jfUnit.tearDownPlaceHowder.style.color= 'white';
		perc= perc<100? perc.toFixed(1): '100';
		document.getElementById('jfUnitDivHTMLElement_percentBar').style.width= perc+"%";
		document.getElementById('jfUnitDivHTMLElement_percent').innerHTML= perc+"%";
		jfUnit.tearDownPlaceHowder.innerHTML= 'Finished: '+totalTests+' tests &nbsp; | '+
											jfUnit.passes+" passes &nbsp; | "+jfUnit.failures+" failures"+
											" &nbsp; | "+perc+"% &nbsp; in "+jfUnit.totalTime+"ms";
		if(jfUnit.failures>0)
		{
			jfUnit.htmlElement.style.borderColor= "red";
			jfUnit.htmlElement.style.WebkitBoxShadow= "0px 0px 16px red";
			jfUnit.htmlElement.style.MozBoxShadow= "0px 0px 16px red";
		}else{
				jfUnit.htmlElement.style.borderColor= "#4a4";
				jfUnit.htmlElement.style.WebkitBoxShadow= "0px 0px 16px #4a4";
				jfUnit.htmlElement.style.MozBoxShadow= "0px 0px 16px #4a4";
			 }
	},
	pass: function(test){
		test.status= 'passed';
		test.onSuccess();
		jfUnit.passes++;
	},
	fail: function(test, message){
		test.status= 'failed';
		test.notMatched= message;
		test.onFail();
		jfUnit.failures++;
	},
	/**
	 * you may set here the name of your group of
	 * tests and the placeHolder by passing an object
	 * Futuraly, it may offer more options
	 * @name config
	 * @param Object conf
	 * @return void
	 */
	config: function(conf){
		jfUnit.format= conf.format||jfUnit.format;
		jfUnit.placeHolder= conf.placeHolder||jfUnit.placeHolder;
		jfUnit.name= conf.name||'';
	},
	tests:[],
	recursiveSweep: function(ret, expected){
		for(el in ret)
		{
			if(undefined===expected[el] ||
			  (jfUnit.currentTest.structureOnly? typeof expected[el] != typeof ret[el]: expected[el]!=ret[el]))
			{
				retType= (typeof ret[el]).toLowerCase();
				if(typeof ret[el] == 'function' && typeof expected[el] == 'function')
				{
					if(ret[el].name != expected[el].name)
					{
						if(jfUnit.reverseTest)
						{
							jfUnit.currentTest.notMatched= "Missing method '"+(ret[el].name || expected[el].name)+"'";
							jfUnit.reverseTest= !jfUnit.reverseTest;
						}else
							jfUnit.currentTest.notMatched= "Extra method '"+(ret[el].name || expected[el].name)+"'";
						return false;
					}
				}else{
						var MSG= "";
						var retMsg= ret[el];
						var expMsg= expected[el];

						if(typeof expMsg == 'string')
							expMsg= '"'+expMsg+'"';
						if(typeof retMsg == 'string')
							retMsg= '"'+retMsg+'"';

						if(jfUnit.reverseTest)
						{
							var tmp= expMsg;
							expMsg= retMsg;
							retMsg= tmp;
						}

						if(isNaN(el))
						{
							if(!expected[el])
								if(jfUnit.reverseTest)
									MSG= "extra property '"+el+ "'";
								else
									MSG= "Property '"+el+ "' is missing";
							else
								MSG= "Property '"+el+"' does not match:";
						}else{
								if(!expected[el])
									if(jfUnit.reverseTest)
										MSG= "Extra index '"+el+"'";
									else
										MSG= "Index '"+el+"' is missing";
								else
									MSG= "Index '"+el+"' has a different value:";
							 }
						jfUnit.currentTest.notMatched= MSG+"<div style='cursor:pointer;margin-top:-14px; margin-left:30px;float:right'"+
													  " onclick='jfUnit.toggleDetailes(this);'>show values</div>"+
													  "<table style='width:100%; display:none;'><tr><td style='"+
													  "-webkit-box-shadow:2px 0px 4px #777; width:50%;'>"+
													  (expMsg||"Null")+"</td><td style='-webkit-box-shadow:-2px 0px 4px #777;"+
													  " padding-left:8px;'>"+(retMsg||"Null")+
													  "</td></tr></table>";
						if(jfUnit.reverseTest)
							jfUnit.reverseTest= !jfUnit.reverseTest;
						return false;
					 }
			 }
		}
		return true;
	},
	into: function(i, a){
		var x;
		for(x in a)
			if(a[x] == i)
				return true;
		return false;
	},
	between: function(i, a){
		var _min= Math.min(a[0], a[1]);
		var _max= Math.max(a[0], a[1]);
		for(_min= _min; _min<_max; _min++)
		{
			if(i == _min)
				return true;
		}
		return false;
	},
	equals: function(ret, expected){
		retType= (typeof ret).toLowerCase();

		if(jfUnit.currentTest.assertType == 'state')
		{
			var fine= null;
			if(jfUnit.currentTest.expected == ret)
				return true;
			return false;
		}

		switch(retType)
		{
			case 'string':
			case 'numeric':
			case 'number':
			case 'boolean':
			case 'regexp':
				switch(jfUnit.currentTest.assertType)
				{
					case 'not':
						return !(ret == expected);
						break;
					case 'into':
						return jfUnit.into(ret, jfUnit.currentTest.expected);
						break;
					case 'notIn':
						return !jfUnit.into(ret, jfUnit.currentTest.expected);
						break;
					case 'between':
						return jfUnit.between(ret, jfUnit.currentTest.expected);
						break;
					case 'notBetween':
						return !jfUnit.between(ret, jfUnit.currentTest.expected);
						break;
					case 'GT':
						return ret > jfUnit.currentTest.expected;
						break;
					case 'LT':
						return ret < jfUnit.currentTest.expected;
						break;
					case 'type':
						var bool= false;
						var expectedType= jfUnit.currentTest.expected.toLowerCase();
						var tmp= '';

						switch(expectedType)
						{
							case 'integer':
								tmp+= ret;
								if(tmp.indexOf('.')>=0 ||isNaN(ret))
									return false;
								else
									return true;
								break;
							case 'float':
							case 'real':
							case 'double':
							case 'number':
							case 'numeric':
								tmp+= ret;
								if(isNaN(ret))
									return false
								else
									return true;
								break
						}
						return (typeof ret == jfUnit.currentTest.expected)? true: false;
						break;
				}

				if(ret != expected)
				{
					jfUnit.currentTest.notMatched= false;
					return false;
				}
				return true;
		}
		if(jfUnit.assertArgs == 'into')
		{
			return false;
		}
		if(msg= jfUnit.recursiveSweep(ret, expected))
		{
			jfUnit.reverseTest= true;
			return jfUnit.recursiveSweep(expected, ret);
		}
		else
			return msg;
	},
	run: function(){
		jfUnit.failures= 0;
		jfUnit.passes= 0;
		var dt= new Date();
		jfUnit.testStart= dt.getTime();
		if(jfUnit.format=='html')
		{
			if(!jfUnit.htmlElement)
			{
				jfUnit.htmlElement= document.createElement('div');
				with(jfUnit.htmlElement.style)
				{
					border='solid 1px #44a';
					backgroundColor= "#66f"; // #44a
					paddingLeft= '4px';
					paddingRight= '12px';
					paddingBottom= '4px';
					fontFamily= 'Sans-Serif';
					color= "#444";
					webkitBorderRadius= '8px';
					MozBorderRadius= '8px';
					borderRadius= '8px';
					webkitBoxShadow= '1px 1px 8px #444';
					MozBoxShadow= '1px 1px 8px #444';
					boxShadow= '1px 1px 8px #444';
				}
				jfUnit.htmlElement.id= 'jfUnitDivHTMLElementRoot';
			}
			var htmlContent=  "<table style='width:100%;'>";
				htmlContent+= "<tr><td style='width:180px;font-size:16px; font-weight:bold; color:#f0f0f0;'>"+
							  "jfUnit test battery</td>";
				htmlContent+= "<td>";
				htmlContent+= "<div style='background-color:red; height:8px; width:100%;border:solid 1px #444;"+
							  " -webkit-box-shadow:6px 0px 20px #99f;"+
							  " -moz-box-shadow:6px 0px 20px #99f;"+
							  "'>";
				htmlContent+= "<div style='background-color:#0d0; height:8px; width:0%;"+
							  "border-right:solid 1px #000;' id='jfUnitDivHTMLElement_percentBar'></div>";
				htmlContent+= "</div>";
				htmlContent+= "</td><td style='width:46px;text-align:right;color:white;' id='jfUnitDivHTMLElement_percent'>0%";
				htmlContent+= "</td></tr>";
				htmlContent+= "</table>";
			jfUnit.htmlElement.innerHTML= htmlContent;
			jfUnit.htmlElement.innerHTML+= "<div id='jfUnitDivHTMLElement'> </div>";
			jfUnit.placeHolder= jfUnit.placeHolder||document.body;
			jfUnit.placeHolder.appendChild(jfUnit.htmlElement);
			jfUnit.container= document.getElementById('jfUnitDivHTMLElement');
		}

		jfUnit.runTests();
		return true;
	},
	runTests: function(){
		var argsToPass= null;
		for(testName in jfUnit.tests)
		{
			test= jfUnit.tests[testName];
			jfUnit.currentTest= test;

			var delay= test.delay;
			if(delay)
			{
				test.delay= false;
				setTimeout(jfUnit.runTests, delay);
				return;
			}


			argsToPass= Array();

			if(typeof test.func != 'function')
			{
				var ret= test.func;
			}else{
					var commandToTest= "(test.func)(";
					var quot= '';
					for(x in test.args)
					{
						argsToPass.push(test.args[x]);
						argVal= test.args[x];
						if(typeof argVal == 'string')
						{
							quot= argVal.indexOf('"')? "'": '"';
						}
						commandToTest+= (argsToPass.length>1? ', ':'')+ quot+test.args[x]+quot;
					}
					commandToTest+= ");";

					try{
						var ret= eval(commandToTest);
					}catch(e)
					{
						jfUnit.fail(test, jfUnit.currentTest.notMatched);
					}
				  }
			if((message= jfUnit.equals(ret, test.expected)) == true)
			{
				jfUnit.pass(test);
			}else{
					jfUnit.fail(test, jfUnit.currentTest.notMatched);
				 }

			if(jfUnit.container && jfUnit.format=='html')
			{
				var dv= document.createElement('div');
				dv.style.backgroundColor= '#efefef';
				dv.style.padding= '4px';
				dv.style.marginTop= '0px';
				dv.style.marginBottom= '1px';
				dv.style.width= '100%';
				dv.onmouseover= function(){ this.style.backgroundColor= '#fff'};
				dv.onmouseout= function(){ this.style.backgroundColor= '#efefef'};
				dvStats= "<div style='width:16px; height:16px; margin-right:4px;"+
						 "-webkit-box-shadow: 0px 0px 4px #444;"+
						 "-moz-box-shadow: 0px 0px 4px #444;"+
						 "box-shadow: 0px 0px 4px #444;"+
						 "-webkit-border-radius:3px;"+
						 "-moz-border-radius:3px;"+
						 "border-radius:3px;"+
						 "border:solid 1px #777; float:left; background-color:"+
						 (test.status=='passed'? '#bfb': '#f66')+";'> </div>";
				if(test.status == 'passed'){
					dv.innerHTML= dvStats+test.funcName+ (!test.description || test.description == ''? "": ": <i>"+test.description+"</i>");
				}
				else
				{
					var expct= test.expected;
					var r= ret;
					if(typeof expct == 'string')
					{
						if(jfUnit.currentTest.assertType == 'type')
						{
							expct= 'of type '+expct+'</i>';
							r= typeof ret;
						}
						else if(jfUnit.currentTest.assertType == 'notType'){
							expct= '"'+expct+'"';
						}else
							expct= '"'+expct+'"';
					}else{
							if(typeof expct == 'object')
								expct= "["+expct.toString()+"]";
							else
								expct= expct.toString();
							if(expct === '[[object Object]]')
								expct= '{Object Structure}';
							switch(jfUnit.currentTest.assertType)
							{
								case 'not':
									expct= "different than "+expct;
									break;
								case 'into':
									expct= "one of "+expct;
									break;
								case 'notIn':
									expct= "other than "+expct;
									break;
								case 'between':
									expct= "between "+expct;
									break;
								case 'notBetween':
									expct= "not between "+expct;
									break;
								case 'GT':
									expct= "Greater than "+expct;
									break;
								case 'LT':
									expct= "Less than "+expct;
									break;
								case 'type':
									expct= "type of \""+expct+"\" does not match";
									break;
								case 'state':
									expct= "The command \""+expct+"\" didn't work!";
									break;
							}
						}
					if(!r) r= 'null';
					if(typeof r == 'string')
						r= '"'+r+'"';
					else{
							if(typeof r == 'object')
								r= "["+r.toString()+"]";
							else
								r= r.toString();
							if(r === '[[object Object]]')
								r= '{Object Structure}';
						}

					dv.innerHTML= dvStats+test.funcName + ": "+
								  '<b>expected:</b> '+ expct+
								  ' <b> received: </b>'+ r +
								  (!test.description || test.description== ''? "": ": <i>"+test.description+"</i>");

					if(jfUnit.currentTest.notMatched)
					{
						dv.innerHTML+='<br/><b style="float:left;">diff:</b> <div style="padding:2px;margin-left:30px; white-space: pre; font-style: italic; border-left:dashed 1px #777;"> '+jfUnit.currentTest.notMatched+"</div>";
					}
				}
				jfUnit.container.appendChild(dv);
			}

			if(test.callBack)
				test.callBack(test.status);
			jfUnit.log(test.status);
			jfUnit.tests[testName]= false;
			delete jfUnit.tests[testName];
		}

		jfUnit.tearDown();
	},
	test: function(){
		jfUnit.run();
	},
	perform: function(){
		jfUnit.run();
	},
	/**
	 * You can pass e group of parameters to this method, or
	 * send an object with at least 'call' and 'expected' properties
	 * @name assert
	 * @return void
	 * @params Mixed...
	 */
	assert: function(){
		var args = Array.prototype.slice.call(arguments);
		if(args.length==0)
			args= jfUnit.assertArgs;
		var arg;
		var test= {
					callBack: function(){},
					func: null,
					funcName: "",
					description: "",
					okMessage: "passed",
					failMessage: "failed",
					onFail: function(){},
					onSuccess: function(){},
					args: Array(),
					assertType:args['assertType']||'equals',
					structureOnly:false
				  };

		if(typeof args[0] == 'object')
		{
			var o= args[0];
			for(arg in o)
			{
				switch(arg)
				{
					case 'callBack':
					case 'callback':
						test.callBack= o[arg];
						break;
					case 'call':
					case 'method':
					case 'func':
						test.func= o[arg];
						break;
					case 'funcName':
					case 'funcname':
					case 'name':
						test.funcName= o[arg];
						break;
					case 'expected':
						test.expected= o[arg];
						break;
					case 'description':
						test.description= o[arg];
						break;
					case 'okMessage':
					case 'success':
					case 'ok':
						test.okMessage= o[arg];
						break;
					case 'failMessage':
					case 'fail':
						test.failMessage= o[arg];
						break;
					case 'onFail':
						test.onFail= o[arg];
						break;
					case 'onSuccess':
						test.onSuccess= o[arg];
						break;
					case 'structureOnly':
						test.structureOnly= o[arg];
						break;
					case 'assertType':
						test.assertType= o[arg];
					case 'delay':
						test.delay= o[arg];
					default:
						test.args[arg]= o[arg];
						break;
				}
			}
			test.assertType= test.assertType||jfUnit.assertArgs['assertType']||'equals';
		}else{
				if(arguments.length < 2)
				{
					this.log("Invalid parameters");
				}

				test.assertType= jfUnit.assertArgs['assertType']||'equals';

				var callBack= args.pop();
				if(typeof callBack != 'function')
				{
					test.expected= callBack;
					callBack= false;
				}else{
						test.expected= args.pop();
					 }
				test.callBack= callBack;
				test.func= args.shift();
				test.args= Array();

				for(arg in args)
				{
					test.args[arg]= args[arg];
				}
				test.funcName= test.func.name;
				test.description= "";
				test.okMessage= "";
				test.failMessage= "";
		}
		if(test.funcName == '')
			test.funcName= "test_"+(this.tests.length+1);
		if(jfUnit.tests[test.funcName])
		{
			var tmpName= test.funcName;
			var c= 0;
			while(jfUnit.tests[tmpName])
			{
				c++;
				tmpName= test.funcName+'_'+c;
			}
			test.funcName= tmpName;
		}
		jfUnit.tests[test.funcName]= test;
		jfUnit.assertArgs['assertType']= 'equals';
	},
	/**
	 * Assert the returned value must be one of the
	 * values in the expected array
	 * @name assertIn
	 * @return void
	 * @param Mixed...
	 */
	assertIn: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'into';
		jfUnit.assert();
	},
	/**
	 * The inverse of assertIn
	 * @name assertNotIn
	 * @return void
	 * @param Mixed...
	 */
	assertNotIn: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'notIn';
		jfUnit.assert();
	},
	/**
	 * The inverse of assert
	 * @name assertNot
	 * @return void
	 * @param Mixed...
	 */
	assertNot: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'not';
		jfUnit.assert();
	},
	/**
	 * Assert the value return must be between two values,
	 * passed as array by your 'expected' parameter
	 * @name assertBetween
	 * @return void
	 * @param Mixed...
	 */
	assertBetween: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'between';
		jfUnit.assert();
	},
	/**
	 * The inverse of assertBetween
	 * @name assertNotBetween
	 * @return void
	 * @param Mixed...
	 */
	assertNotBetween: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'notBetween';
		jfUnit.assert();
	},
	// not yet implemented
	assertState: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'state';
		jfUnit.assert();
	},
	/**
	 * Asserts a value is greater than the expected
	 * @name assertGT
	 * @return void
	 * @param Mixed...
	 */
	assertGT: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'GT';
		jfUnit.assert();
	},
	/**
	 * Asserts a value is less than the expected
	 * @name assertLT
	 * @return void
	 * @param Mixed...
	 */
	assertLT: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'LT';
		jfUnit.assert();
	},
	/**
	 * asserts that the type of the returned value, must
	 * be the specified as expected
	 * @name assertType
	 * @param Mixed...
	 * @return void
	 */
	assertType: function(){
		var args= arguments;
		args= Array.prototype.slice.call(args);
		jfUnit.assertArgs= args;
		jfUnit.assertArgs['assertType']= 'type';
		jfUnit.assert();
	},
	init: function(){
	}
};
jfUnit.init();