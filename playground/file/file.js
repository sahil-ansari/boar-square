// NOTE: It seems that to do it this way, you need to run chrome with special permisions. 
// Ex: open /Applications/Google\ Chrome.app --args --allow-file-access-from-files
// Apparently, accessing via the "file://" protocol is different... hopefully the TA's are aware. 

// The read in this file doesn't seem to work but all of the tutorial's I've read assure me
// that this is a valid way to do it so hopefully it's just a permission's issue that we can figure out. 

var fileData = ['Test File Data!'];
var blob = new Blob(fileData, {type : 'text/plain'}); // the blob

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
 



$(document).ready( function () {
  window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
    var buttonCreate = $('#create');
    buttonCreate.click(function(e) {
      fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function(e) {
            console.log('Write completed.');
          };
          fileWriter.write(blob);
          
        }, errorHandler);
      }, errorHandler);
    });
  
    var buttonLoad = $('#load');
    buttonLoad.click(function(e) {
      fs.root.getFile('log.txt', {}, function(fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
           var reader = new FileReader();

           reader.onloadend = function(e) {
              if (e.target.readyState == FileReader.DONE) {
                 console.log('Done Loading File: ' + file.name)
                 console.log(e.target.result);
              }
            };

           reader.readAsText(file, 'text/plain');
        }, errorHandler);
      }, errorHandler);
    });
  }, errorHandler);

  function errorHandler(e) {
      alert(e);
  }    

});