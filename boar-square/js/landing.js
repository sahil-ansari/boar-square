$(function () {


  //If Create new is clicked
   $('#newDate').click( function() {

        $("#bottomLogo").addClass("hidden");
        $(".jumbotron").animate({height:"+=200px"});
        $("#landing-date-planning").removeClass("hidden");
        
        document.getElementById('newDate').disabled=true;

        $('input[type=submit]', this).attr('disabled', 'disabled');
        return false;
    });

       // DO FILE LOAD STUFF HERE!!!!!
       $('#oldDate').click(
        function() {

          window.alert("sometext");

          return false;
      });
    

       //Make a Date
    $('#goDate').click(function(e) {
            e.preventDefault();
            e.stopPropagation(); 
          var searchPlace = $('#location').val();
          
          window.location.replace("./index.html");
  
    });
    
  
});