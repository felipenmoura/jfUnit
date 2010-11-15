fUnit= {
	passes:0,
	failures:0,
	messages: Array(),
	format: 'html',
	placeHolder: false,
	htmlElement: false,
	currentTest: null,
	log: function(msg)
	{
		this.messages.push(msg);
		if(console)
			console.log(msg);
	},
	toggleDetailes: function(el){
		vals= el.parentNode.getElementsByTagName('table')[0];
		
		if(vals.style.display=='none')
		{
			el.innerHTML= "hide values";
			vals.style.display='';
		}else{
				el.innerHTML= "see values";
				vals.style.display='none'
			 }
	},
	tearDown: function(){
		var totalTests= fUnit.passes+ fUnit.failures;
		var perc= (fUnit.passes*100)/totalTests;
		var dt= new Date();
		fUnit.testEnd= dt.getTime()
		fUnit.totalTime= fUnit.testEnd - fUnit.testStart;
		var terDownPlaceHowder= document.createElement("div");
		fUnit.terDownPlaceHowder= terDownPlaceHowder;
		fUnit.container.appendChild(fUnit.terDownPlaceHowder);
		fUnit.terDownPlaceHowder.style.color= 'white';
		perc= perc<100? perc.toFixed(1): '100';
		document.getElementById('fUnitDivHTMLElement_percentBar').style.width= perc+"%";
		document.getElementById('fUnitDivHTMLElement_percent').innerHTML= perc+"%";
		fUnit.terDownPlaceHowder.innerHTML= 'Finished: '+totalTests+' tests &nbsp; | '+
											fUnit.passes+" passes &nbsp; | "+fUnit.failures+" failures"+
											" &nbsp; | "+perc+"% &nbsp; in "+fUnit.totalTime+"ms";
		if(fUnit.failures>0)
		{
			fUnit.htmlElement.style.borderColor= "red";
			fUnit.htmlElement.style.WebkitBoxShadow= "0px 0px 16px red";
			fUnit.htmlElement.style.MozBoxShadow= "0px 0px 16px red";
		}else
			fUnit.htmlElement.style.borderColor= "#44a";
	},
	pass: function(test){
		test.status= 'passed';
		test.onSuccess();
		fUnit.passes++;
	},
	fail: function(test, message){
		test.status= 'failed';
		test.notMatched= message;
		test.onFail();
		fUnit.failures++;
	},
	config: function(conf){
		fUnit.format= conf.format||fUnit.format;
		fUnit.placeHolder= conf.placeHolder||fUnit.placeHolder;
		fUnit.name= conf.name||'';
	},
	tests:[],
	recursiveSweep: function(ret, expected){
		for(el in ret)
		{
			if(undefined===expected[el] ||
			  (fUnit.currentTest.structureOnly? typeof expected[el] != typeof ret[el]: expected[el]!=ret[el]))
			{
				retType= (typeof ret[el]).toLowerCase();
				if(typeof ret[el] == 'function' && typeof expected[el] == 'function')
				{
					if(ret[el].name != expected[el].name)
					{
						if(fUnit.reverseTest)
						{
							fUnit.currentTest.notMatched= "Missing method '"+(ret[el].name || expected[el].name)+"'";
							fUnit.reverseTest= !fUnit.reverseTest;
						}else
							fUnit.currentTest.notMatched= "Extra method '"+(ret[el].name || expected[el].name)+"'";
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
						
						if(fUnit.reverseTest)
						{
							var tmp= expMsg;
							expMsg= retMsg;
							retMsg= tmp;
						}
						
						if(isNaN(el))
						{
							if(!expected[el])
								if(fUnit.reverseTest)
									MSG= "extra property '"+el+ "'";
								else
									MSG= "Property '"+el+ "' is missing";
							else
								MSG= "Property '"+el+"' does not match:";
						}else{
								if(!expected[el])
									if(fUnit.reverseTest)
										MSG= "Extra index '"+el+"'";
									else
										MSG= "Index '"+el+"' is missing";
								else
									MSG= "Index '"+el+"' has a different value:";
							 }
						fUnit.currentTest.notMatched= MSG+"<div style='cursor:pointer;margin-left:30px;float:right'"+
													  " onclick='fUnit.toggleDetailes(this);'>see values</div>"+
													  "<table style='width:100%; display:none;'><tr><td style='"+
													  "-webkit-box-shadow:2px 0px 4px #777; width:50%;'>"+
													  (expMsg||"Null")+"</td><td style='-webkit-box-shadow:-2px 0px 4px #777;"+
													  " padding-left:8px;'>"+(retMsg||"Null")+
													  "</td></tr></table>";
						if(fUnit.reverseTest)
							fUnit.reverseTest= !fUnit.reverseTest;
						return false;
					 }
			 }
		}
		return true;
	},
	equals: function(ret, expected){
		retType= (typeof ret).toLowerCase();
	
		switch(retType)
		{
			case 'string':
			case 'numeric':
			case 'number':
			case 'boolean':
			case 'regexp':
				if(ret != expected)
				{
					fUnit.currentTest.notMatched= false;
					return false;
				}
				return true; 
		}
		if(msg= fUnit.recursiveSweep(ret, expected))
		{
			fUnit.reverseTest= true;
			return fUnit.recursiveSweep(expected, ret);
		}
		else
			return msg;
	},
	run: function(){
		fUnit.failures= 0;
		fUnit.passes= 0;
		var dt= new Date();
		fUnit.testStart= dt.getTime();
		if(fUnit.format=='html')
		{
			if(!fUnit.htmlElement)
			{
				fUnit.htmlElement= document.createElement('div');
				with(fUnit.htmlElement.style)
				{
					border='solid 4px #44a';
					backgroundColor= "#44a";
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
				fUnit.htmlElement.id= 'fUnitDivHTMLElementRoot';
			}
			var htmlContent=  "<table style='width:100%;'>";
				htmlContent+= "<tr><td style='width:180px;font-size:16px; font-weight:bold; color:#f0f0f0;'>"+
							  "fUnit test battery</td>";
				htmlContent+= "<td>";
				htmlContent+= "<div style='background-color:red; height:8px; width:100%;border:solid 1px #444;"+
							  " -webkit-box-shadow:6px 0px 20px #99f;"+
							  " -moz-box-shadow:6px 0px 20px #99f;"+
							  "'>";
				htmlContent+= "<div style='background-color:#0d0; height:8px; width:0%;"+
							  "border-right:solid 1px #000;' id='fUnitDivHTMLElement_percentBar'></div>";
				htmlContent+= "</div>";
				htmlContent+= "</td><td style='width:46px;text-align:right;color:white;' id='fUnitDivHTMLElement_percent'>0%";
				htmlContent+= "</td></tr>";
				htmlContent+= "</table>";
			fUnit.htmlElement.innerHTML= htmlContent;
			fUnit.htmlElement.innerHTML+= "<div id='fUnitDivHTMLElement'> </div>";
			fUnit.placeHolder= fUnit.placeHolder||document.body;
			fUnit.placeHolder.appendChild(fUnit.htmlElement);
			fUnit.container= document.getElementById('fUnitDivHTMLElement');
		}
		
		var argsToPass= null;
		for(test in this.tests)
		{ 
			test= this.tests[test];
			fUnit.currentTest= test;
			argsToPass= Array();
			
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

			var ret= eval(commandToTest);
			if((message= fUnit.equals(ret, test.expected)) == true)
			{
				fUnit.pass(test);
			}else{
					fUnit.fail(test, fUnit.currentTest.notMatched);
				 }
			
			if(fUnit.container && fUnit.format=='html')
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
						 (test.status=='passed'? '#bfb': 'f66')+";'> </div>";
				if(test.status == 'passed')
					dv.innerHTML= dvStats+test.funcName+ (!test.description || test.description == ''? "": ": <i>"+test.description+"</i>");
				else
				{
					var expct= test.expected;
					var r= ret;
					if(typeof expct == 'string')
						expct= '"'+expct+'"';
					else
						expct= expct.toString();
					if(typeof r == 'string')
						r= '"'+r+'"';
					else
						r= r.toString();
					
					dv.innerHTML= dvStats+test.funcName + ": "+
								  '<b>expected:</b> '+ expct+
								  ' <b> received: </b>'+ r +
								  (!test.description || test.description== ''? "": ": <i>"+test.description+"</i>");
					if(fUnit.currentTest.notMatched)
					{
						dv.innerHTML+='<br/><b style="float:left;">diff:</b> <div style="padding:2px;margin-left:30px; white-space: pre; font-style: italic; border-left:dashed 1px #777;"> '+fUnit.currentTest.notMatched+"</div>";
					}
				}
				fUnit.container.appendChild(dv);
			}
			
			if(test.callBack)
				test.callBack(test.status);
			fUnit.log(test.status);
		}
		fUnit.tearDown();
		return true;
	},
	test: function(){
		fUnit.run();
	},
	perform: function(){
		fUnit.run();
	},
	assert: function(){
		var args = Array.prototype.slice.call(arguments);
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
					structureOnly:false
				  };

		if(typeof arguments[0] == 'object')
		{
			var o= arguments[0];			
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
					default:
						test.args[arg]= o[arg];
						break;
				}
			}
		}else{
				if(arguments.length < 2)
				{
					this.log("Invalid parameters");
				}
				
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
		if(fUnit.tests[test.funcName])
		{
			var tmpName= test.funcName;
			var c= 0;
			while(fUnit.tests[tmpName])
			{
				c++;
				tmpName= test.funcName+'_'+c;
			}
			test.funcName= tmpName;
		}
		fUnit.tests[test.funcName]= test;
	},
	init: function(){
	}
};
fUnit.init();







