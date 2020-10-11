$(document).ready(function() {
  var arr=[];
 
function buttonGet(btnVal,arr){// to Get the val enter & limit it
  var clicked=$(btnVal).text();
  if($(".control-screen").text().length<=14){
   actionSelect(clicked,arr);
  }else{
    $(".control-screen").text('Digit Limit Met');
    if(clicked=="AC" || clicked=="CE"){
      $(".control-screen").text('0');
      arr.splice(0,arr.length);
    }  
  }
}//end buttonControl()

function historic(resultCalc){// to add calc in memory
  var memoryCalc=$(".control-screen").text();
  $(".memory").text(memoryCalc+"="+resultCalc);
}//end historic
  
function actionSelect(clicked,arr){// to build an arr, calc it and trigger actions
  var regNumber=/(\d)/g;
  var testNumber=regNumber.test(clicked);
  var regOp=/(²|\.|\+|-|x|÷|(√\()|\))$/gi;
  
  if(clicked=="AC"){
    arr.splice(0,arr.length);
    $("#sqrt").text("√");
    
  }else if(clicked=="CE" || clicked=="Backspace"){
    if(arr[arr.length-1]=="√("){
      $("#sqrt").text("√");
    }else if(arr[arr.length-1]==")"){
      $("#sqrt").text(")");
    }
    arr.splice(arr.length-1,1);

  }else if(clicked=="±"){
    arr.splice(arr.length-1,1,-arr[arr.length-1]);

  }else if(testNumber){
    if(typeof arr[arr.length-1]=="number"){arr.splice(0,1);}
    if(arr[arr.length-1]!==undefined && !(regOp).test(arr[arr.length-1])){
      arr[arr.length-1]+=clicked;
    }
    else{arr.push(clicked);}
    
  }else if( (clicked=="=" || clicked=="Enter") && arr.length>0){
    
    var resultCalc=Result(arr);
    arr.splice(0,arr.length,resultCalc);
    historic(resultCalc);
    
        
  }else if(clicked=="√"){
    arr.push(clicked+"(");
    $("#sqrt").text(")");
    
    
  }else if(clicked==")"){
    if(arr[arr.length-1]!=="√("){
      arr.push(clicked);
      $("#sqrt").text("√");
    }

  }else if(clicked=="." && !(regOp).test(arr[arr.length-1]) ){
    arr.push(clicked);
    
  }else if(clicked=="x²"||clicked=="²"){
    if(arr.length>0 &&  (/\d|\)/g.test(arr[arr.length-1])) ) {arr.push("²");}
    
  }else if(clicked=="log"){// load console
    console.log(arr);
    
  }else if( (/\*|\/|\+|-|x|÷/gi).test(clicked) && (/\d|\)|²/).test(arr[arr.length-1])){
    if(clicked=="*"){arr.push("x");}
    else if(clicked=="/"){arr.push("÷");}
    else{arr.push(clicked);}
  }
  
  if(arr.length==0){$(".control-screen").text('CALC');}
  else if(arr.length>0){$(".control-screen").text(arr.join(''));}
}//end actionSelect

function calculator(arr){
    var result=arr.reduce(function(acc,curr,index,array){
    var reader=array[index-1];
    if( (/(\+|-|x|÷)$/gi).test(curr) ){
      return acc;
    }
    else if(reader=="+"){
      return acc+curr;
    }
    else if(reader=="-"){
      return acc-curr;
    }
    else if(reader=="x"){
      return acc*curr;
    }
    else if(reader=="÷"){
      if(curr==0){return "Impossible ÷0";}
      else{return acc/curr;}
    }else{
      return acc*curr;
    }
    
  });
  
  return (Math.round(result*Math.pow(10,5))/Math.pow(10,5));
  }
  
function priority(arr){// to calc x & + at first
  var prioCalc=[];
  
  for(var t=0;t<arr.length;t++){
    if(arr[t]=="x" || arr[t]=="÷"){
      prioCalc=arr.slice(t-1,t+2);//selection of the part concerned
      console.log(["sliced",prioCalc])
      arr.splice(t-1,3,calculator(prioCalc));//calc of this part
      console.log(["spliced",arr,arr.length]);
      t=0;
    }
  }//end for loop
  if(arr.indexOf("x")==-1 && arr.indexOf("÷")==-1){return arr;}
}//end priority()
  
function sqrtCalc(arr){
  for(var k=0;k<arr.length;k++){//sqrt selector
    if(arr[k]=="√("){
      var indexClose=arr.indexOf(")");
      var toCalc=arr.slice(k+1,indexClose);
      arr.splice(k,indexClose-k+1,Math.sqrt(calculator(toCalc)));
    }//end sqrt 
  }//end for loop sqrt
  return arr;
}//end sqrtCalc()
  
function cubeCalc(arr){
  for(var l=0;l<arr.length;l++){//cube selector
    if(arr[l]=="²" && arr[l-1]!==")"){
      arr.splice(l-1,2,arr[l-1]*arr[l-1] );
    }
    else if(arr[l]=="²"){
      cubeCalc(sqrtCalc(arr));
    }
  }//end for loop cube
  return arr;
}
  

  
function Result(arr){
  
  var regNum=/(\d+)/g;
  
  var arrCalc=arr.map(function(curr){
    if(regNum.test(curr) && typeof curr=="string"){
      return curr=parseInt(curr);
    }else{return curr;}
  }); 
  
  //Dec calculator
  var preResult=arrCalc;
  var toDec=[];
  var divisor=1;
  for(var j=0;j<preResult.length;j++){//decimal
    if(preResult[j]=="."){
      toDec=arr.slice(arr.indexOf(".")-1,arr.indexOf(".")+2);
      divisor=Math.pow(10,toDec[2].length);
      preResult.splice(j-1,3,preResult[j-1]+(preResult[j+1]/divisor ) );
    }
  }//end for loop decimal
  
  if(preResult.indexOf("²")!==-1){preResult=cubeCalc(preResult);}
  if(preResult.indexOf("√("!==-1)){preResult=sqrtCalc(preResult);}
  

  
    if($("input").prop("checked")){preResult=priority(preResult);}
    //console.log(preResult);
    return calculator(preResult);

}//end result
 
function keyboardAction(pressed){
  if($(".control-screen").text().length<=14){
    $("button").blur();
    actionSelect(pressed,arr);
  }else{
    
    $(".control-screen").text('Digit Limit Met');
      if(pressed=="AC" || pressed=="Backspace"){
        $(".control-screen").text('0');
        arr.splice(0,arr.length);
      }//end if
  }//end else
  
}//end keyboardAction
  
  $( "button" ).click(function(){
    buttonGet(this,arr);
  });

  document.addEventListener('keydown', function(event){
    	var pressed = event.key;
      //console.log(pressed);
      keyboardAction(pressed);
  });
  
  $(".tip").click(function(){
    $(".tooltipblock").toggle("drop", 400);
  });
  
  $( "input" ).click(function(){
   if($( "input" ).prop( "checked" )){
     $(".OFF").hide();
     $(".ON").show("fade","slow");
   }
    else{
     $(".ON").hide();
     $(".OFF").show("fade","slow");
    }
   });

});