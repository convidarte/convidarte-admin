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

/*
function downloadElementAsPDF(elementId,filename) {
    var pdf = new jsPDF('p', 'pt', 'a4');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    source = document.getElementById(elementId).innerHTML;
	//alert(source);
    // we support special element handlers. Register them with jQuery-style 
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors 
    // (class, of compound) at this time.
    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function(element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    margins = {
        top: 80,
        bottom: 40,
        left: 40,
        width: 515
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, {// y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },
    function(dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save(filename);
    }
    , margins);
}
*/



