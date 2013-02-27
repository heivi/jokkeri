$(function() {

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
    
	$("#tabs, #header, img").on("click dblclick mousedown keydown mouseup keyup contextmenu", function(e) {
		e.preventDefault();
	});
  
  $(window).resize(function (e) {
    if (currsivu == "Ajastin") {
      posNextMove();
    }
  });

	var sivut = {"etusivu": "Etusivu", "liikkeet": "Liikkeet", "ajastin": "Ajastin", "tietoa": "Tietoa"};
	$("#noscript").css("display", "none");
	
	var ohjeet = ["Hiihtohyppely, hyppele vaihtaen ilmassa toista jalkaa eteen", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
	
	liiketypes = [];
	
	$("[data-page=liikkeet] li").each( function (i, el) {
		liiketypes[i] = parseInt($(this).data("type"));
	});
	
	changePage("Etusivu");
	currsivu = "Etusivu";
	
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
	
  var b=0;
	$.each(sivut, function (i, val) {
		var a = '<a class="navi">'+val+'</a>';
    if (b%2==1) {
      a += '<br class="hidden" />';
    } else {
      a += '<br class="hidden2" />';
    }
		if (i == "etusivu") {
			a = '<a class="navi" style="background-color: white; color: black; border-bottom: solid white 1px;">'+val+'</a><br class="hidden2" />';
		}
		$("#tabs").append(a);
    b++;
	});
	
	$(".navi").click(function (e) {
		e.preventDefault();
		$(".navi").css("background-color", "#333");
		$(".navi").css("color", "white");
		$(".navi").css("border-bottom", "solid black 1px");
		$(this).css("background-color", "white");
		$(this).css("border-bottom", "solid white 1px");
		$(this).css("color", "black");
		changePage($(this).html());
	});
	
	$(".navi").dblclick(function (e) {
		e.preventDefault();
	});
	
	$("#tabs").dblclick(function (e) {
		e.preventDefault();
	});
	
	$("#tabs").click(function (e) {
		e.preventDefault();
	});
	
	function changePage(sivu) {
		$("#content").html("");
		//$("#content").append(sivu);
		currsivu = sivu;
		if (sivu == "Liikkeet") {
			$("#content").html($("div[data-page=liikkeet]").html());
			$("#"+sarja+"ohjelma").attr("checked", "true");
			$("#content li").each( function(i, el) {
				if ($.inArray($(this).data('num'), disabled) != -1) {
					$(this).css("text-decoration", "line-through");
				}
			});
			
			$('input:radio[name=ohjelma]').change(function (e) {
				sarja = $('input:radio[name=ohjelma]:checked').val();
			});
			
			$("#content li").click(function(e) {
        needretime = true;
				if ($(this).css("text-decoration") != "line-through") {
					$(this).css("text-decoration", "line-through");
					if ($.inArray($(this).data('num'), disabled) == -1) {
						disabled.push($(this).data('num'));
					}
				} else {
					$(this).css("text-decoration", "none");
					disabled.splice( $.inArray($(this).data('num'), disabled), 1 );
				}
			});
      
      $("#kaikkiliikkeet").click(function (e) {
        if (disabled.length < 1) {
          $("#content li").each( function(i, el) {
            $(this).css("text-decoration", "line-through");
            disabled.push($(this).data('num'));
          });
        } else {
          $("#content li").each( function(i, el) {
            $(this).css("text-decoration", "none");
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
			
		} else if (sivu == "Ajastin") {
			var timeleft = calcFullTime();
			
			$("#content").html('<div id="seuraavakuva"></div><img id="tamaliike" /><br /><span id="tamakuvaus"></span> <span id="kierros">1/1</span><br />Kokonaisaika jäljellä:<br /><div id="aika"><span class="isoaika"><span id="kokoh">0</span>:<span id="kokom">00</span>:<span id="kokos">00</span></span><br /><span id="liiketta"></span> jäljellä:<br /><span class="pieniaika"><span id="liikem">0</span>:<span id="liikes">00</span></span></div><div id="seuraavaliike"></div><div id="ajastinnappulat"></div>');
			
			updateTime(timeleft);
			
			$("#ajastinnappulat").append('<button type="button" id="start">Käynnistä</button> <button type="button" id="restart">Nollaa</button> <button type="button" id="skip">Hyppää liikkeen yli</button>');
      
      if (timeron) {
        $("#start").html("Tauko");
      }
      
      if (kierros == 0) {
        $("#kierros").html("");
      } else {
        $("#kierros").html(((liikekierrokset-kierros)+1)+"/"+liikekierrokset);
      }
			
			//$("#tamaliike").css("width", "10em");
      if (!tauko) {
        $("#liiketta").html("Liikettä");
        $("#tamaliike").attr("src", "animaatio/"+state+".gif");
      } else {
        $("#liiketta").html("Taukoa");
        $("#tamaliike").attr("src", "animaatio/0.gif");
      }
      $("#tamakuvaus").html($("[data-page=liikkeet] li[data-num="+state+"]").html());
      
      if (tauko) {
        $("#tamakuvaus, #kierros").html("");
        $("#tamaliike").css("border", "solid red thick");
      } else {
        $("#tamaliike").css("border", "solid green thick");
      }
			
			$("#seuraavaliike").append('Seuraava liike on <span id="seuraavaon"></span>');
      
      posNextMove();
        
			nextstate = state + 1;
			console.log(nextstate);
			console.log($.inArray(nextstate, disabled));
			while ($.inArray(nextstate, disabled) != -1 && nextstate < 22) {
				nextstate++;
			}
      if (nextstate < 22) {
        if (kierros > 1) {
          nextstate--;
        }
        $("#seuraavaon").html($("[data-page=liikkeet] li[data-num="+(nextstate)+"]").html());
        $("#seuraavaon").data("num", nextstate);
        //$("#seuraavaon").off("mouseover mouseleave");
        $("#seuraavakuva").html('Seuraava:<br /><img src="animaatio/'+nextstate+'.gif" style="width: 100%;" />');
        //$("#seuraavaon").mouseover(function (e) {
        //  //$(this).data("num");
        //  
        //  $("#tooltip").html('<img src="animaatio/'+$(this).data("num")+'.gif" style="width: 9em;" /><br />'+ohjeet[$(this).data("num")-1]);
        //  $("#tooltip").css("position", "absolute");
        //  $("#tooltip").css("top", (e.pageY - $("#tooltip").height()) +"px");
        //  $("#tooltip").css("left", e.pageX+"px");
        //  $("#tooltip").css("display", "block");
        //  
        //  $("#seuraavaon").mouseleave(function (e2) {
        //    $("#tooltip").html();
        //    $("#tooltip").css("display", "none");
        //  });
        //  
        //});
        if (kierros > 1) {
          nextstate++;
        }
      } else {
        //$("#seuraavaon").off("mouseover mouseleave");
				$("#seuraavaon").html("lepo");
      }
			
			$("#start").click(function(e) {
        if ($("#start").html() == "Käynnistä") {
          startTimer();
          $("#start").html("Tauko");
        } else if ($("#start").html() == "Tauko") {
          stopTimer();
          $("#tamaliike").attr("src", "animaatio/0.gif");
          $("#tamaliike").css("border", "solid red thick");
          $("#tauko").css("display", "block");
					$("body").css("padding-bottom", "0");
          $("#start").html("Jatka");
        } else {
          startTimer();
          $("#tamaliike").attr("src", "animaatio/"+state+".gif");
          $("#tamaliike").css("border", "solid green thick");
          $("#tauko").css("display", "none");
					$("body").css("padding-bottom", "20px");
          $("#start").html("Tauko");
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
          changePage("Ajastin");
        }
			});
			
			$("#skip").click(function(e) {
        var conf = confirm("Haluatko vaihtaa seuraavaan liikkeeseen?");
        if (conf == true) {
          console.log("skip");
          if (state < 21) {
            disabled.push(state);
            state = nextstate;
            liiketime = 0;
            needretime = true;
            kierros = 0;
            tauko = true;
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
            changePage("Ajastin");
          }
        }
			});
			
		} else if (sivu == "Etusivu") {
			console.log("etusivu");
			$("#content").html($("div[data-page=etusivu]").html());
      setTimeout(function() {
        $("#content .etuliike").attr("src", "images/"+Math.floor((Math.random()*8)+1)+".svg");
      }, 500);
		} else if (sivu == "Tietoa") {
			console.log("etusivu");
			$("#content").html($("div[data-page=tietoa]").html());
			$("#content .tietoaliike").attr("src", "images/"+Math.floor((Math.random()*8)+1)+".svg");
		}
	}
	
	function calcFullTime(start, maximi) {
		start = start || 1
		var max = maximi || 21;
		var secs = 0;
		for (var i = (start-1); i < max; i++) {
			if ($.inArray((i+1), disabled) == -1) {
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
		secs -= 30;
		
		//var hours = Math.floor(secs/60/60);
		//secs -= hours*60*60;
		//var mins = Math.floor(secs/60);
		//secs -= mins*60;
		return secs;
	}
	
	function updateTime(secs) {
	
		if (currsivu == "Ajastin") {
			//console.log("secs: " + secs);
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
	}
	
	function updateLiikeTime(secs) {
		
		if (currsivu == "Ajastin") {
			var mins = Math.floor(secs/60);
			secs -= mins*60;
			
			if (secs<10) {
				secs = "0"+secs;
			}
		
			$("#liikem").html(mins);
			$("#liikes").html(secs);
		}
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
		}
	}
	
	function runner() {
	
		liiketime--;
		fulltime--;
		
		if (needretime) {
			fulltime = calcFullTime(state);
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
					
          if (currsivu == "Ajastin") {
            $("#liiketta").html("Liikettä");
            $("#tamaliike").css("border", "solid green thick");
            $("#tamaliike").attr("src", "animaatio/"+state+".gif");
            $("#tamakuvaus").html($("[data-page=liikkeet] li[data-num="+state+"]").html());
            posNextMove();
          }
					$("#tauko").css("display", "none");
					$("body").css("padding-bottom", "20px");      
          
					//selvitä seuraava liike
					nextstate = state + 1;
					//console.log(nextstate);
					//console.log($.inArray(nextstate, disabled));
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
          
          if (currsivu == "Ajastin") {
            if (nextstate < 22) {
              if (kierros > 1) {
                nextstate--;
              }
              $("#seuraavaon").css("font-size", "1em");
              $("#seuraavaon").html($("[data-page=liikkeet] li[data-num="+(nextstate)+"]").html());
              $("#seuraavaon").data("num", nextstate);
              //$("#seuraavaon").off("mouseover mouseleave");
              $("#seuraavakuva").html('Seuraava:<br /><img src="animaatio/'+nextstate+'.gif" style="width: 100%;" />');
              //$("#seuraavaon").mouseover(function (e) {
              //	//$(this).data("num");
              //	
              //	$("#tooltip").html('<img src="animaatio/'+$(this).data("num")+'.gif" style="width: 9em;" /><br />'+ohjeet[$(this).data("num")-1]);
              //	$("#tooltip").css("position", "absolute");
              //	$("#tooltip").css("top", (e.pageY - $("#tooltip").height()) +"px");
              //	$("#tooltip").css("left", e.pageX+"px");
              //	$("#tooltip").css("display", "block");
              //	
              //	$("#seuraavaon").mouseleave(function (e2) {
              //		$("#tooltip").html();
              //		$("#tooltip").css("display", "none");
              //	});
              //	
              //});
              if (kierros > 1) {
                nextstate++;
              }
            } else {
              $("#seuraavaon").off("mouseover mouseleave");
              $("#seuraavaon").html("lepo");
              $("#seuraavakuva").html('');
            }
          }
          
          if (currsivu == "Ajastin") {
            if (kierros == 0) {
              $("#kierros").html("");
              //console.log("!");
            } else {
              $("#kierros").html(((liikekierrokset-kierros)+1)+"/"+liikekierrokset);
              //console.log("!!");
            }
          }
					
					
				} else {
					tauko = true;
					
					if (kierros == 1) {
						kierros = 0;
						if (nextstate < 22) {
							liiketime = 30;
              if (currsivu == "Ajastin") {
                $("#tamakuvaus, #kierros").html("");
                $("#seuraavakuva").css("z-index", "1");
                $("#seuraavakuva").animate({left: $("#tamaliike").position().left + (($("#tamaliike").width() - $("#tamaliike").width()/1.2) / 2), width: $("#tamaliike").width()/1.2}, 2000);
                $("#seuraavaon").animate({"font-size": "1.2em"}, 2000);
              }
						} else {
							liiketime = 0;
						}
            if (currsivu == "Ajastin") {
              $("#liiketta").html("Taukoa");
              $("#tamaliike").css("border", "solid red thick");
              $("#tamaliike").attr("src", "animaatio/0.gif");
            }
            
						if (nextstate == 22) {
							stopTimer();
						}
					} else {
						liiketime = 20;
            if (currsivu == "Ajastin") {
              $("#liiketta").html("Taukoa");
              $("#tamaliike").css("border", "solid red thick");
              $("#tamaliike").attr("src", "animaatio/0.gif");
            }
					}

					$("#tauko").css("display", "block");
					$("body").css("padding-bottom", "0");
					
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
  
  function posNextMove() {
      
    var position = $("#tamaliike").position();
    var width = $("#tamaliike").width();
    var height = $("#tamaliike").height();
    
    $("#seuraavakuva").css("position", "absolute").css("z-index", "-1")
      .css("left", position.left + width).css("top", position.top)
      .css("width", $("#tamaliike").width() / 1.5);
    
  }

	
});