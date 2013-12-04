$(function () {

var newDateBox= '';

      newDateBox+='<input type="text" id="location" class="form-control" placeholder="Location" autofocus>';
      newDateBox+='<center>';
      newDateBox+='<input type="text" size="20" id="startField" placeholder="Start Time">';
      newDateBox+='<input type="text" size="20" id="endField" placeholder="End Time">';
      newDateBox+='</center>';
      newDateBox+='<br>';
      newDateBox+='<button class="btn btn-lg btn-primary btn-block" id="goDate" type="submit">Plan My Date!</button>';
     

  

      //If Create new is clicked
       $('#newDate').click(
        function() {

  $( "#bottomLogo" ).empty();
        $(".jumbotron").animate({height:"+=200px"});


        $('.jumbotron').append(newDateBox);
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
          
          window.location.replace("../index.html");
  
    });
    
  
});