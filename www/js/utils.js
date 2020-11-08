function tidySpaces(s){
	return s.replace(/\s+/g, ' ').trim();
}

function resetURL(){
	history.back()
}

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const average = list => list.reduce((prev, curr) => prev + curr) / list.length;

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`
}

function setCookie(cname, cvalue, expirationMilliseconds) {
  var d = new Date();
  d.setTime(d.getTime() + expirationMilliseconds);
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function downloadElementAsPDF(elementId,filename,mode) {
    // Get the element.
    var element = document.getElementById(elementId);

    // Choose pagebreak options based on mode.
    var pagebreak = (mode === 'specify') ?
        { mode: '', before: '.before', after: '.after', avoid: '.avoid' } :
        { mode: mode };

    // Generate the PDF.
    html2pdf().from(element).set({
      filename: filename,
      pagebreak: pagebreak,
      jsPDF: {orientation: 'portrait', unit: 'in', format: 'a4', compressPDF: true}
    }).save();
}

// https://stackoverflow.com/a/24468752
function do_request(endpoint, payload, authorize, method) {
    return new Promise (
        function(callback, fail) {
            var xhr = new XMLHttpRequest();
            var url = apiBaseUrl + endpoint
            xhr.open(method, url, true);
            if(method != "GET" && payload) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            if(authorize) {
                xhr.setRequestHeader("Authorization", "Bearer " + store.state.token);
            }
            xhr.onreadystatechange = function () {
                if(xhr.readyState == XMLHttpRequest.DONE) {
                    if (200 <= xhr.status && xhr.status < 300) {
                        //console.log("PAYLOAD: " + endpoint + " + " + payload + " => " + xhr.responseText.substr(0,1000) );
                        var json = JSON.parse(xhr.responseText);
                        callback(json);
                    } else {
                        console.log("request failed")
                        console.log(url)
                        console.log(xhr.readyState)
                        console.log(xhr.status)
                        console.log(xhr.response)
                        var json = JSON.parse(xhr.responseText);
                        fail(json);
                    }
                }
            };
            if(!payload) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(payload));
            }
        }
    );
}

