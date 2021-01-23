
var url;
var registered_gateways;

var ssl_check;
var db_check;

function readregsfile(){
    /// Start reading registered-gateways.rg file.
    var request = new XMLHttpRequest();
    request.open('GET', 'assets/js/registered-gateways.rg', true);
    request.send(null);
    request.onload = function() {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                registered_gateways = JSON.parse(request.responseText);
                
                if (url.hostname in registered_gateways["registered"]){
                    db_check = true;
                }else{
                    db_check = false;
                }

                setDOM();
            }
        }
    };
}


function getct(callback) { // gets current tab's URL.
chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    url = tabs[0].url;
    callback(url);
});
}

function checkssl(url){ // checks if webpage is connected through SSL.
    if (typeof(url) == "object"){
        try{
            ssl_check = url.protocol == "https:";
            return url.protocol == "https:";
        }catch{
            ssl_check = false;
            throw "Error in parsing URL to check SSL, Plase check again."
        }
    }else{
        ssl_check = false;
        throw "Check SSL input is not a URL, Please check again."
    }
}

function checkurlindb(){ // checks if URL is already defined in database.
    readregsfile();
}


function setprocessstat(stat){ // stat can be 1. secure 2. average 3. not secure and will change html.
    switch (stat){
        case "secure":
            document.getElementById("process-state-heading").innerText = "✔ کاملا امن است";
            document.getElementById("process-state-heading").style.color = "rgb(91,191,33)";
            document.getElementById("process-image-image").setAttribute("src","/assets/img/secure-ok.svg?h=31ebcf89c96b160fa85bf147fede3629");
            break;
        case "average":
            document.getElementById("process-state-heading").innerText = "⚠ درگاه نیمه امن است";
            document.getElementById("process-state-heading").style.color = "rgb(255,147,56)";
            document.getElementById("process-image-image").setAttribute("src","/assets/img/process-warning.svg?h=6290b380f5a28b196754c9875b2edcbe");
            break;
        case "insecure":
            document.getElementById("process-state-heading").innerText = "❗ درگاه امن نیست";
            document.getElementById("process-state-heading").style.color = "rgb(252,35,102)";
            document.getElementById("process-image-image").setAttribute("src","/assets/img/process-insecure.svg?h=805eb3b642e692f547f3640db0c67ea5");
            break;
        default:
            document.getElementById("process-state-heading").innerText = "خطا در بررسی!";
            document.getElementById("process-state-heading").style.color = "rgb(142,73,5)";
            document.getElementById("process-image-image").setAttribute("src","/assets/img/feeling-angry-animate.svg?h=88a0cbaf9c139a19d6ae52e9e471ca2d");
            break;
    }
}

function setgatewayinfo(gateway){ // input is gateway information object.
    document.getElementById("gateway-icon-image").setAttribute("src","/assets/img/" + gateway["logo_path"]);
    document.getElementById("gateway-name-heading").textContent = gateway["name_fa"];
    document.getElementById("gateway-phone-heading").text = gateway["phone"];
    document.getElementById("gateway-phone-heading").setAttribute("href","tel:"+gateway["phone"]);
}

function setsslchecklist(stat){
    if (stat){
        document.getElementById("ssl-checklist-icon-image").setAttribute("src","/assets/img/icons-tick-box.svg?h=61429b05e6097d99041b07b7005b0101");
    }else{
        document.getElementById("ssl-checklist-icon-image").setAttribute("src","/assets/img/icons-delete.svg?h=f7ba2fa718f6771d9a919dc09e83a9e5");
    }
}

function setlookindbchecklist(stat){
    if (stat){
        document.getElementById("db-checlist-icon-image").setAttribute("src","/assets/img/icons-tick-box.svg?h=61429b05e6097d99041b07b7005b0101");
    }else{
        document.getElementById("db-checlist-icon-image").setAttribute("src","/assets/img/icons-delete.svg?h=f7ba2fa718f6771d9a919dc09e83a9e5");
    }
}


function setDOM(){

    console.log(ssl_check);
    console.log(db_check);

// set information on DOM
if(ssl_check && db_check){
    setprocessstat('secure');
}else if(ssl_check || db_check){
    setprocessstat('average');
}else if (!ssl_check && !db_check){
    setprocessstat('insecure');
}else{
    setprocessstat('no_info');
}

if (db_check){
    setgatewayinfo(registered_gateways["registered"][url.hostname]);
    setlookindbchecklist(true);
}else{
    setlookindbchecklist(false);
 
}

if (ssl_check){
    setsslchecklist(true);
}else{
    setsslchecklist(false);

}

// unhide DOM elements.
document.getElementById("check-box-card").removeAttribute('hidden');

if (db_check){
    document.getElementById("gateway-information-row").removeAttribute('hidden');
}

}

getct(function(callback_url){ // Get URL


    url = new URL(callback_url);

    // check the url
    checkssl(url);
    checkurlindb();

});
