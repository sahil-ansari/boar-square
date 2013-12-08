$(function () {

  var venueCount=0;
  initialParameters = {
          'location': $('#location').val(),
          'startTime' : $('#startTime').val(),
          'endTime' : $('#endTime').val(),
          'venueName1' : $('#venuename1').val(),
          'category1' : '',
          'price1' : $('#trending1').val(),
          'trending1' : $('#trending1').val(),
          'venueName2' : $('#venuename2').val(),
          'category2' : '',
          'price2' : '',
          'trending2' : $('#trending2').val(),
          'venueName3' : $('#venuename3').val(),
          'category3' : '',
          'price3' : '',
          'trending3' : $('#trending3').val(),
        };

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
          'category1' : '',
          'price1' : $('input[name=price1]:checked').val(),
          'venueName2' : $('#venuename2').val(),
          'category2' : '',
          'price2' : '',
          'venueName3' : $('#venuename3').val(),
          'category3' : '',
          'price3' : '',
        };

        console.dir(initialParameters);


      });

        $('.filters1').click( 
            function autofill(){
              venuename1.value="(Category: "+this.id+")";
              initialParameters.category1=this.id;
               $('#category1params').hide();
              $('#category1params').removeClass("hidden");
              $('#category1params').fadeIn('slow');
console.dir();

            });



       $('#goDate').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); 
      

        var query = 'location=' + initialParameters.location;
            // query+= '&startTime=' + initialParameters.startTime;
            // query+= '&endTime=' + initialParameters.endTime;
            // query+= '&venueName1=' + initialParameters.venuename1;
            // query+= '&category1=' + initialParameters.category1;
            // query+= '&price1=' + initialParameters.price1;
            // query+= '&category2=' + initialParameters.category2;
            // query+= '&venueName2=' + initialParameters.venuename2;
            // query+= '&price2=' + initialParameters.price2;
            // query+= '&category3=' + initialParameters.category3;
            // query+= '&venueName3=' + initialParameters.venuename3;
            // query+= '&price3=' + initialParameters.price3;

            

        window.location.replace("./index.html?" + query);


      });


       $(document).ready(function (){
        $("#startTime").clockpick({
          starthour : 8,
          endhour : 23,
          layout : "horizontal",
          event : "mouseover"
        });

        $("#endTime").clockpick({
          starthour : 8,
          endhour : 23,
          layout : "horizontal",
          event : "mouseover"

        });

      });

     });

