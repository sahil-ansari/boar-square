$(function () {

  var venueCount=0;

  //If Create new is clicked
  $('#newDate').click( function() {

        // $("#bottomLogo").addClass("hidden");
        $(".jumbotron").animate({height:"+=225px"}, 200);
        $("#landing-date-planning").removeClass("hidden");
        
        document.getElementById('newDate').disabled=true;


        return false;
      });

  $('#addVenue').click( function() {
    if(venueCount==3)
      document.getElementById('addVenue').disabled=true;

    else{
        // $("#bottomLogo").addClass("hidden");
        $(".jumbotron").animate({height:"+=200px"}, 200);
        if(venueCount==2){
          $("#venue3").removeClass("hidden");
          
          document.getElementById('addVenue').disabled=true;
          $( "#addVenue" ).empty();
          $( "#addVenue" ).append("Maximum Venues Added!");
        }


        if(venueCount==1){
          $("#venue2").removeClass("hidden");
          venueCount++;
        }

        if(venueCount==0){
          $("#venue1").removeClass("hidden");
          venueCount++;
        }

      }



      return false;
    });

       // DO FILE LOAD STUFF HERE!!!!!
       $('#oldDate').click(
        function() {

          window.alert("sometext");

          return false;
        });


       //Make a Date
<<<<<<< HEAD
       $('#goDate').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); 


        var initialParameters = {
          'location': $('#location').val(),
          'startTime' : $('#startTime').val(),
          'endTime' : $('#endTime').val(),
          'venueName1' : $('#venuename1').val(),
          'price1' : $('#trending1').val(),
          'trending1' : $('#trending1').val(),
          'venueName2' : $('#venuename2').val(),
          'price2' : 'eMGJpozcJOAm8pHDUOCW63RUnsSxhlwIU1nF9P5uHE',
          'trending2' : $('#trending2').val(),
          'venueName3' : $('#venuename3').val(),
          'price3' : 'eMGJpozcJOAm8pHDUOCW63RUnsSxhlwIU1nF9P5uHE',
          'trending3' : $('#trending3').val(),
        };

        console.dir(initialParameters);


      });


     });
=======
    $('#goDate').click(function(e) {
            e.preventDefault();
            e.stopPropagation(); 
          var searchPlace = $('#location').val();
          
          window.location.replace("./index.html");
  
    });
    
  
});
>>>>>>> 4d312f773f6f7be738b10836e786aff9c6bc5b3c
