function resetURL(){
	history.back()
}

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
