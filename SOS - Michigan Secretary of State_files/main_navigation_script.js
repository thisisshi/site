$(document).ready(function () {
	
function setOpenNav(){
	//var docUrl = '/emichigan/0,4575,7-112-15476_16243_31695---,00.html';
	//var docUrl = '/emichigan/0,4575,7-112-61994_1125---,00.html'
	//var docUrl = '/emichigan/0,4575,7-112-10666_11113---,00.html'
	//var docUrl = '/emichigan/0,4575,7-112-10666_11113---,00.html'
	var docUrl = document.location + '';
	//alert (docUrl);
	urlcat = docUrl.split('-');

	//alert(urlcat)

	if(urlcat[2]){
		category = urlcat[2].split('_');

		//if(category){
		//alert(category);
		//alert(category.length);

		for (i=0;i<=category.length-1;i=i+1){
		
			if (document.getElementById(category[i]) == undefined){
				return false
			} else {
			//|| document.getElementById('ul_'+category[i]).firstChild == undefined) {
			//document.getElementById(category[2]).firstChild.className="current"
			//} else {
			document.getElementById(category[i]).firstChild.className="current"
			}
			
			
			if(document.getElementById('ul_'+category[i])){
				//alert("ok 1")
				//document.getElementById('ul_'+category[i]).style.position = "relative";
				//document.getElementById('ul_'+category[i]).style.top = "0px";
				//document.getElementById('ul_'+category[i]).style.margin = "0px";
				//document.getElementById('ul_'+category[i]).style.left = "0px";
				document.getElementById('ul_'+category[i]).className = "Open";
				document.getElementById('ul_'+category[i]).firstChild.className = "current";
				document.getElementById(category[i]).firstChild.className="current"
			
			if(document.getElementById(category[i]).firstChild){
				//alert("ok 2")
				document.getElementById(category[i]).firstChild.className="current0"	
				if(document.getElementById(category[1])){
					//alert("ok 3")
					document.getElementById(category[1]).className = "Open1";
					document.getElementById(category[1]).firstChild.className="current"	
				}
				if(document.getElementById(category[2])){
					//alert("ok 4")
					document.getElementById(category[2]).className = "Open2";
				}
				}
				
				//document.getElementById(category[i]).firstChild.style.backgroundColor = "#ffffff";
				//document.getElementById(category[i]).firstChild.style.color = "#000000";
				//document.getElementById(category[i]).firstChild.style.fontWeight = "bold";
			
			}
			
		}
	}
}
setOpenNav();
}
);