const readline=require('readline');
const fs=require('fs');
const rs=readline.createInterface(
{
	input:fs.createReadStream('Indicators.csv')
});

var heading=true;
var json1=[];
var json2=[];
var json3=[];
var count1=0;
var count2=0;
var summale=0;
var sumfemale=0;
var avgmale=0;
var avgfemale=0;
var countofDB=0;
var birthRate;
var deathRate;
rs.on('line',function(line){
	if(heading)
	{
		head=line.split(',');
		//console.log(head);
		heading=false;
	}
 var countries = ["MNA","JOR","KAZ","KOR","OMN","MAC","IND","NPL",
 "KWT","MYS","PHL","PAK","VNM","RUS","BHR","GEO","JOR","NPL",
 "SAU","LKA","PAK","MNG"];
 for(var i=0;i<countries.length ;i++)//loop for iterating over asian countries
 {
 if(line.indexOf(countries[i])>-1) 
 {
 	if((line.indexOf("SP.DYN.LE00.MA.IN")>-1)||(line.indexOf("SP.DYN.LE00.FE.IN")>-1)) 
 {
	var obj1 = {} ;
    var currentline=line.split( /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/ );
    for(var j=0;j<head.length;j++)
   {
   if(head[j]=="Year"||head[j]=="Value")
   {
   if(head[j]=="Year")
    {
      year=currentline[j];
    }
    if(head[j]=="Value")
    {
     if(line.indexOf("SP.DYN.LE00.MA.IN")>-1){
     count1++;
     val=parseFloat(currentline[j]);
     summale=summale+val;
     }
     else
     {
      count2++;
      val=parseFloat(currentline[j]);
      sumfemale=sumfemale+val;
  	 }
      if(count1==22){
        avgmale=summale/22;
        avgfemale=sumfemale/22;
        obj1.Year=year;
        obj1.ExpectancyOfMale = avgmale;
        obj1.ExpectancyOfFeMale= avgfemale;

         count1=0;
         summale=0;
         sumfemale=0;
          json1.push(obj1);
  }
    }//end of value if
}//end of value and year if
}//end of headers for
}//end of indicator code if
}//end of countries if
}//end of asian countries for
 //conversion ofcsv to json part two-death rate and birth rate over indian countries
if((line.indexOf("IND")>-1)&&((line.indexOf("SP.DYN.CDRT.IN")>-1)||(line.indexOf("SP.DYN.CBRT.IN")>-1)))
{
var obj2={};
var currentline=line.split( /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
for(var j=0;j<head.length;j++)
{
if(head[j]=="Year")
{
	year=currentline[j];
}
if(head[j]=="Value")
{
if(line.indexOf("SP.DYN.CDRT.IN")>-1)
{
	countofDB++;
    deathRate=currentline[j];
	
}
else
{
	countofDB++;
    birthRate=currentline[j];
	
}
}//end of  value if block 
if(countofDB==2)
{
	obj2.Year=year;
	obj2.DeathRate= +deathRate;
	obj2.BirthRate= +birthRate;
	json2.push(obj2);
	countofDB=0;
}
}//end of iteration over headers for loop
}//end of check condution over india and deathrate&birth rate
//top five countries with highest total expectancy
if(line.indexOf("SP.DYN.LE00.IN")>-1)
{ 
	var obj3={};
	var currentline=line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
	for(var j=0;j<head.length;j++)
	{
		if(head[j]=="CountryName"||head[j]=="Value")
		{
         obj3[head[j]]=currentline[j];
		}
	}//end of head for loop
	json3.push(obj3);
    
}
json3.sort(function(a, b){return b.Value - a.Value});
});
rs.on('close', function() {
 
 
 var p1=JSON.stringify(json1);
 p1=p1.replace("[","[\n\t");
 p1= p1.replace(/},/g,"},\n\t");
 p1= p1.replace(/\\"/g,"");
 p1=p1.replace(/,/g,",\n\t");
 //consconsole.log(p1);
 fs.writeFile("text1.JSON",p1,function(err) {
if(err){
    throw err;
}
});
var p2=JSON.stringify(json2);
 p2=p2.replace("[","[\n\t");
 p2= p2.replace(/},/g,"},\n\t");
 p2= p2.replace(/\\"/g,"");
 p2=p2.replace(/,/g,",\n\t");
 //consconsole.log(p1);
 fs.writeFile("text2.JSON",p2,function(err) {
if(err){
    throw err;
}
});
var ob3=json3.splice(0,5);
 var p3=JSON.stringify(ob3);
 p3=p3.replace("[","[\n\t");
 p3= p3.replace(/},/g,"},\n\t");
 p3= p3.replace(/\\"/g,"");

 //console.log(p3);
 
 fs.writeFile("text3.JSON",p3,function(err) {
if(err){
    throw err;
}

});
 });