$(function () {

  var venueCount=0;
  var initialParameters;

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

       $('#goDate').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); 


        initialParameters = {
          'location': $('#location').val(),
          'startTime' : $('#startTime').val(),
          'endTime' : $('#endTime').val(),
          'venueName1' : $('#venuename1').val(),
          'price1' : $('#trending1').val(),
          'trending1' : $('#trending1').val(),
          'venueName2' : $('#venuename2').val(),
          'price2' : '',
          'trending2' : $('#trending2').val(),
          'venueName3' : $('#venuename3').val(),
          'price3' : '',
          'trending3' : $('#trending3').val(),
        };

        console.dir(initialParameters);


      });



       $('#goDate').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); 
      

        var query = 'location=' + initialParameters.location;
            // query+= '&startTime=' + initialParameters.startTime;
            // query+= '&endTime=' + initialParameters.endTime;
            // query+= '&venueName1=' + initialParameters.venuename1;
            // query+= '&price1=' + initialParameters.price1;
            // query+= '&trending1=' + initialParameters.trending1;
            // query+= '&venueName2=' + initialParameters.venuename2;
            // query+= '&price2=' + initialParameters.price2;
            // query+= '&trending2=' + initialParameters.trending2;
            // query+= '&venueName3=' + initialParameters.venuename3;
            // query+= '&price3=' + initialParameters.price3;
            // query+= '&trending3=' + initialParameters.trending3;
            

        window.location.replace("./index.html?" + query);


      });


       $(document).ready(function (){
        $("#startTime").clockpick({
          starthour : 8,
          endhour : 23,
        });

        $("#endTime").clockpick({
          starthour : 8,
          endhour : 23,

        });

      });

     });

