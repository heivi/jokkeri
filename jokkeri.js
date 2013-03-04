$(function() {

  // hide js-error
  $("#noscript").css("display", "none");

  // load images to memory
  // prevents empty images?
  preload([
    "animaatio/0.gif",
    "animaatio/1.gif",
    "animaatio/2.gif",
    "animaatio/3.gif",
    "animaatio/4.gif",
    "animaatio/5.gif",
    "animaatio/6.gif",
    "animaatio/7.gif",
    "animaatio/8.gif",
    "animaatio/9.gif",
    "animaatio/10.gif",
    "animaatio/11.gif",
    "animaatio/12.gif",
    "animaatio/13.gif",
    "animaatio/14.gif",
    "animaatio/15.gif",
    "animaatio/16.gif",
    "animaatio/17.gif",
    "animaatio/18.gif",
    "animaatio/19.gif",
    "animaatio/20.gif",
    "animaatio/21.gif",
    "images/0.svg",
    "images/1.svg",
    "images/2.svg",
    "images/3.svg",
    "images/4.svg",
    "images/5.svg",
    "images/6.svg",
    "images/7.svg",
    "images/8.svg"
    ]);
  
  // in order for swipe to work properly
	$("img, #animaatiot").bind("click dblclick mousedown keydown mouseup keyup contextmenu", function(e) {
		e.preventDefault();
	});
  
  // Swiping left/right changes page
  $('[data-role="page"]').on("swipeleft", function(e) {
    // TODO: prevent click if swipe???
    var nextpage = $(this).next('div[data-role="page"]');
    if (nextpage.length > 0) {
      $.mobile.changePage(nextpage, {
        showLoadMsg: false,
        transition: "slide"
      });
    }
  });
  
  $('[data-role="page"]').on("swiperight", function(e) {
    var prevpage = $(this).prev('div[data-role="page"]');
    if (prevpage.length > 0) {
      $.mobile.changePage(prevpage, {
        showLoadMsg: false,
        transition: "slide",
        reverse: true
      });
    }
  });

  // sets all things, needed?
  $("#ajastin").on("pageshow", function (e) {
    setTimer();
  });
  
  // should add some more detailed instructions here
	//var ohjeet = ["Hiihtohyppely, hyppele vaihtaen ilmassa toista jalkaa eteen", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	
  // liiketypes hold information of the duration of each move,
  // one of the three predefined (2-5x40s/20s or 2-5min staright etc.)
	liiketypes = [];
	
	$("#liikelista li").each( function (i, el) {
		liiketypes[i] = parseInt($(this).data("type"));
	});
	
  // liiketype 3 handling
	strict = false;
	
	needretime = true;
	fulltime = 0;
	liiketime = 0;
	timer = 0;
	timeron = false;
	kierros = 0;
  liikekierrokset = 0;
	first = true;
	kierrosjalj = 0;
	
	disabled = [];
	state = 0;
	tauko = true;
	nextstate = 0;
	sarja = "0";

  //set current program as checked
	$("#"+sarja+"ohjelma").attr("checked", "checked");
  
  // set linethrough if disabled when showed
  $("#liikkeet").on("pageshow", function() {
    $("#liikelista li").each( function(i, el) {
      if ($.inArray(($(this).data('num')-1), disabled) != -1) {
        $(this).find("> span").css("text-decoration", "line-through");
      } else {
        $(this).find("> span").css("text-decoration", "none");
      }
    });
  });
			
	$('input:radio[name=ohjelma]').change(function (e) {
		sarja = $('input:radio[name=ohjelma]:checked').val();
	});
			
	$("#liikelista li").click(function(e) {
    needretime = true;
		if ($(this).find("> span").css("text-decoration") != "line-through") {
			$(this).find("> span").css("text-decoration", "line-through");
			if ($.inArray(($(this).data('num')-1), disabled) == -1) {
				disabled.push($(this).data('num')-1);
			}
		} else {
			$(this).find("> span").css("text-decoration", "none");
			disabled.splice( $.inArray($(this).data('num'), disabled), 1 );
		}
	});
      
  $("#kaikkiliikkeet").click(function (e) {
    if (disabled.length < 1) {
      $("#liikelista li").each( function(i, el) {
        $(this).find("> span").css("text-decoration", "line-through");
        disabled.push($(this).data('num')-1);
      });
    } else {
      $("#liikelista li").each( function(i, el) {
        $(this).find("> span").css("text-decoration", "none");
        disabled = [];
      });
    }
  });
			
	//$("#strict").change(function (e) {
	//	if ($("#strict").prop('checked')) {
	//		strict = false;
	//	} else {
	//		strict = true;
	//	}
	//});
	
  function setTimer() {
  
    var timeleft = 0;
    if (fulltime == 0 || needretime) {
      timeleft = calcFullTime(state+1);// - calcFullTime(state, state, true) + liiketime;
    } else {
      timeleft = fulltime;
    }
        
    updateTime(timeleft);
        
    if (kierros == 0) {
      $("#kierros").html("");
    } else {
      $("#kierros").html(((liikekierrokset-kierros)+1)+"/"+liikekierrokset);
    }
    
    updateLiikeTime(liiketime);

    if (!tauko) {
      $("#liiketta").html("Liikettä");
      $("#tamaliike").attr("src", "animaatio/"+state+".gif");
    } else {
      $("#liiketta").html("Taukoa");
      $("#tamaliike").attr("src", "animaatio/0.gif");
    }
    
    if ($.inArray((state-1), disabled) == -1 && state > 0) {
      $("#tamakuvaus").html($.trim($("#liikelista li[data-num="+(state)+"] > span").html()));
    } else {
      $("#tamakuvaus").html("");
    }
        
    if (tauko) {
      //$("#tamakuvaus, #kierros").html("");
      $("#tamaliike").css("border", "solid red thick");
    } else {
      $("#tamaliike").css("border", "solid green thick");
    }
      
    nextstate = state + 1;
    //console.log($.inArray(nextstate, disabled));
    while ($.inArray((nextstate-1), disabled) != -1 && nextstate < 22) {
      nextstate++;
    }
    console.log("nextstate: "+nextstate);
    var tempnext = nextstate;
    if (nextstate < 22) {
      if (kierros > 1) {
        nextstate = state;
      }
      $("#seuraavaon").html($("#liikelista li[data-num="+(nextstate)+"] > span").html());
      $("#seuraavaon").data("num", nextstate);
      $("#seuraavakuva").html('<span style="position: absolute; top: 10; z-index: 1">Seuraava:</span><img src="animaatio/'+nextstate+'.gif" />');
      
      if (kierros > 1) {
        nextstate = tempnext;
      }
    } else {
      $("#seuraavaon").html("lepo");
    }

  }
  
  setTimer();
			
	$("#start").click(function(e) {
    console.log($("#start").parent().find(".ui-btn-text").text());
    console.log($("#start .ui-btn-text"));
    if ($("#start").parent().find(".ui-btn-text").text() == "Käynnistä") {
      startTimer();
      $("#start").parent().find(".ui-btn-text").text("Tauko")
    } else if ($("#start").parent().find(".ui-btn-text").text() == "Tauko") {
      stopTimer();
      $("#tamaliike").attr("src", "animaatio/0.gif");
      $("#tamaliike").css("border", "solid red thick");
      $("#tauko").css("display", "block");
      $("#start").parent().find(".ui-btn-text").text("Jatka");
    } else {
      startTimer();
      $("#tamaliike").attr("src", "animaatio/"+state+".gif");
      $("#tamaliike").css("border", "solid green thick");
      $("#tauko").css("display", "none");
      $("#start").parent().find(".ui-btn-text").text("Tauko");
    }
	});
			
	$("#restart").click(function(e) {
    var conf = confirm("Haluatko varmasti aloittaa alusta?");
    if (conf == true) {
      stopTimer();
      needretime = true;
      fulltime = 0;
      liiketime = 0;
      timer = 0;
      state = 0;
      tauko = true;
      kierros = 0;
      kierrosjalj = 0;
      nextstate = 0;
      $("#start").parent().find(".ui-btn-text").text("Käynnistä");
      setTimer();
    }
	});
			
	$("#skip").click(function(e) {
      var conf = confirm("Haluatko vaihtaa seuraavaan liikkeeseen?");
      if (conf == true) {
        console.log("skip");
        if (state < 21) {
          disabled.push(state-1);
          //state = nextstate;
          liiketime = 0;
          needretime = true;
          kierros = 0;
          tauko = true;
          setTimer();
        } else {
          stopTimer();
          needretime = true;
          fulltime = 0;
          liiketime = 0;
          timer = 0;
          state = 0;
          tauko = true;
          kierros = 0;
          kierrosjalj = 0;
          nextstate = 0;
          setTimer();
        }
      }
	});
		
  setTimeout(function() {
    $("#etuliike").attr("src", "images/"+Math.floor((Math.random()*8)+1)+".svg");
  }, 200);

	$("#tietoaliike").attr("src", "images/"+Math.floor((Math.random()*8)+1)+".svg");
	
	function calcFullTime(start, maximi, tauko) {
    if (start == 0 && maximi == 0) {
      return 0;
    }
    tauko = tauko || false;
		start = start || 1
    var max = maximi || 21;
		var secs = 0;
		for (var i = (start-1); i < max; i++) {
			if ($.inArray((i), disabled) == -1 && i >= 0) {
				if (liiketypes[i] == 1) {
					secs += 40+20+40;
					secs += parseInt(sarja)*(20+40);
					secs += 30;
				} else if (liiketypes[i] == 2) {
					secs += 120;
					secs += parseInt(sarja)*(60);
					secs += 30;
				} else if (liiketypes[i] == 3) {
					if (parseInt(sarja) == 3 && strict) {
						secs += 3*40+2*20;
						secs += 30;
					} else {
						secs += 40+20+40;
						secs += parseInt(sarja)*(20+40);
						secs += 30;
					}
				}
			}
		}
		// viimeinen tauko pois
    if (!tauko) {
      secs -= 30;
    }
		
		return secs;
	}
	
	function updateTime(secs) {
	
			var hours = Math.floor(secs/60/60);
			secs -= hours*60*60;
			var mins = Math.floor(secs/60);
			secs -= mins*60;
			
			if (mins<10) {
				mins = "0"+mins;
			}
			
			if (secs<10) {
				secs = "0"+secs;
			}
		
			$("#kokoh").html(hours);
			$("#kokom").html(mins);
			$("#kokos").html(secs);
	}
	
	function updateLiikeTime(secs) {
		
		var mins = Math.floor(secs/60);
		secs -= mins*60;
		
		if (secs<10) {
			secs = "0"+secs;
		}
		
		$("#liikem").html(mins);
		$("#liikes").html(secs);

	}
	
	function startTimer() {
		if (!timeron) {
			timer = setInterval(function(){runner()}, 1000);
			timeron = true;
		} else {
			//
		}
	}
	
	function stopTimer() {
		if (timeron) {
			clearInterval(timer);
			timeron = false;
      tauko = true;
		}
	}
	
	function runner() {
	
		liiketime--;
		fulltime--;
		
		if (needretime) {
    
      // TODO: correct calculation of remaining time
      // - adding only liiketime fails - needs to be
      // time left of current move, not only this round
			fulltime = calcFullTime(state+1) - calcFullTime(state, state, true) + liiketime;
			needretime = false;
		}
		if (state > 21 || nextstate > 22 || fulltime < 1) {
			//valmis
			stopTimer();
		}
		
		{
			
			if (liiketime < 1) {
			
				if (tauko) {
			
					tauko = false;
					
					//aseta stateksi seuraava liike nextstate, laskettu aiemmin
					//paitsi jos sama liike jatkuu (kierros > 0)
					if (kierros == 0) {
						state = nextstate;
            fulltime = calcFullTime(state);
					}
					

          $("#liiketta").html("Liikettä");
          $("#tamaliike").css("border", "solid green thick");
          $("#tamaliike").attr("src", "animaatio/"+state+".gif");
          $("#tamakuvaus").html($.trim($("#liikelista li[data-num="+state+"] > span").html()));

					$("#tauko").css("display", "none");
          
					//selvitä seuraava liike
					nextstate = state + 1;
					while ($.inArray(nextstate, disabled) != -1 && nextstate < 22) {
						nextstate++;
					}
          
          
					
					liiketime = 0;
					
					//paljonko liikeaikaa jäljellä, kun ollaan nykyisessä liikkeessä (state)
					// ja onko uusi liike, eli laitetaanko kierroksia enemmän kuin yksi
					
					
					if (liiketypes[state-1] == 1) {
						//x*sarja * 40 sek + 20 sek tauot
						liiketime = 40;
						
						if (kierros == 0) {
							kierros = parseInt(sarja)+2;
              liikekierrokset = kierros;
						} else {
							kierros--;
						}
						
					} else if (liiketypes[state-1] == 2) {
						//120+sarja*60
						liiketime = parseInt(sarja)*60+120;
						
						if (kierros == 0) {
							kierros = 1;
              liikekierrokset = kierros;
						} else {
							kierros--;
						}
						
					} else if (liiketypes[state-1] == 3) {
						if (strict && parseInt(sarja) == 3) {
							liiketime = 40;
							
							if (kierros == 0) {
								kierros = 3;
                liikekierrokset = kierros;
							} else {
								kierros--;
							}
						} else {
							liiketime = 40;
						
							if (kierros == 0) {
								kierros = parseInt(sarja)+2;
                liikekierrokset = kierros;
							} else {
								kierros--;
							}
						}
					} else {
						//häikkää
						console.log("liiketyyppi ei tunnettu");
					}
          

          if (nextstate < 22) {
            if (kierros > 1) {
              nextstate--;
            }
            $("#seuraavaon").css("font-size", "1em");
            $("#seuraavaon").html($("#liikelista li[data-num="+(nextstate)+"] > span").html());
            $("#seuraavaon").data("num", nextstate);
            var seuraavas = $("#seuraavakuva img").attr("style");
            $("#seuraavakuva").html('<span style="position: absolute; top: 10; z-index: 1">Seuraava:</span><img src="animaatio/'+nextstate+'.gif" style="'+seuraavas+'" />');

            if (kierros > 1) {
              nextstate++;
            }
          } else {
            $("#seuraavaon").html("lepo");
            $("#seuraavakuva").html('');
          }

          

          if (kierros == 0) {
            $("#kierros").html("");
          } else {
            $("#kierros").html(((liikekierrokset-kierros)+1)+"/"+liikekierrokset);
          }

					
					
				} else {
					tauko = true;
					
					if (kierros == 1) {
						kierros = 0;
						if (nextstate < 22) {
							liiketime = 30;

              $("#tamakuvaus, #kierros").html("");
              //var tamapos = $("#tamaliike").position();
              //var tamawidth = $("#tamaliike").width();
              //var tamaheight = $("#tamaliike").height();

              //$("#seuraavakuva").animate({left: (tamapos.left + (tamawidth/20)), width: (tamawidth - (tamawidth/10)), top: (tamapos.top + (tamaheight/20))}, 2000);
              $("#seuraavaon").animate({"font-size": "1.2em"}, 2000);

						} else {
							liiketime = 0;
						}

            $("#liiketta").html("Taukoa");
            $("#tamaliike").css("border", "solid red thick");
            $("#tamaliike").attr("src", "animaatio/0.gif");

            
						if (nextstate == 22) {
							stopTimer();
						}
					} else {
						liiketime = 20;

            $("#liiketta").html("Taukoa");
            $("#tamaliike").css("border", "solid red thick");
            $("#tamaliike").attr("src", "animaatio/0.gif");

					}

					$("#tauko").css("display", "block");
					
				}

			}
			
			updateTime(fulltime);
			updateLiikeTime(liiketime);
			
		}
		
	}
  
  function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
      $('<img/>')[0].src = this;
      // Alternatively you could use:
      // (new Image()).src = this;
    });
  }

	
});