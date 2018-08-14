// ==UserScript==
// @name Cotg Raiding helper
// @namespace https://raw.githubusercontent.com/DKhub85/
// @version 1.0.0
// @description Cotg Raiding helper
// @author Dhruv
// @match https://w12.crownofthegods.com
// @match https://w11.crownofthegods.com
// @include https://w/*.crownofthegods.com/World*
// @grant none
// @updateURL https://raw.githubusercontent.com/DKhub85/COTG-Raiding-Helper/master/RH.user.js
// @downloadURL https://raw.githubusercontent.com/DKhub85/COTG-Raiding-Helper/master/RH.user.js
// ==/UserScript==
(function D_Raiding_helper() {
    console.log("updated:march.2017");
    var other_loot=[350,1000,4270,15500,32300,56900,117200,198500,297500,441600]; //forest, hill loot
    var mountain_loot=[350,960,4100,14900,31000,54500,112500,190500,285500,423500];//mountain loot
    var bossdef=[625,3750,25000,50000,125000,187500,250000,375000,562500,750000]; //bosses defense value
    var bossdefw=[425,2500,17000,33000,83000,125000,170000,250000,375000,500000]; // bosses defense value for weakness type
    var ttattack=[0,0,30,10,25,50,70,10,40,60,90,120,0,0,3000,1200,12000]; //troops attack value
    var Res=[0,1,3,6,10,15,20,25,30,35,40,45,50];//research lvl
    var ttloot=[0,0,10,20,10,10,5,0,15,20,15,10,0,0,0,1500,3000];//troop loot
    var TS_type=[0,0,1,1,1,1,1,0,2,2,2,2,0,0,0,100,400];
    var Total_Combat_Research=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    var naera=0,vexemis=0,cyndros=0,ylanna=0;
    var bosses=[];
//    var bossinfo={x:[],y:[],lvl:[],data:[],name:[],cont:[],distance:[],cid:[]};
    var cdata; //city data return
 //   var city={cid:0,x:0,y:0,th:[0],cont:0}; //current city data
    var citytc;
    var message="Not enough TS to kill this boss!";

    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.readyState==4) {
                    var url=this.responseURL;
                    if (url.indexOf('gC.php')!=-1) {
                        cdata=JSON.parse(this.response);
   //                     city.cid=cdata.cid;
                        citytc=cdata.th;
   //                     city.x=Number(city.cid % 65536);
   //                     city.y=Number((city.cid-city.x)/65536);
   //                     city.cont=Number(Math.floor(city.x/100)+10*Math.floor(city.y/100));
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    var errz=0;
    function errorgo(j) {
        var errormsgs;
        errz = errz+1;
        var b = 'errBR' +errz;
        var c = '#' +b;
        var d = '#' +b+ ' div';
        errormsgs = '<tr ID = "' +b+ '"><td><div class = "errBR">' +j+ '<div></td></tr>';
        $("#errorBRpopup").append(errormsgs);
        $(c).show();
        $(d).animate({ opacity: 1, bottom: "+10px" }, 'slow');
        setTimeout(function(){
            $(d).animate({ opacity: 0, bottom: "-10px" }, 'slow');
            $(c).fadeOut("slow");
        }, 5000);
        setTimeout(function(){
            $(c).remove();
        }, 6000);
    }

    $(document).ready(function() {
        var newbutz="<div style='float: left; margin-left: 2%;'><button id='newbuttonu' style='font-size:8px; padding: 4px; border-radius: 8px;' class='greenb shRnTr'>Recall(<90%)</button></div>";
        $("#totalTS").before(newbutz);
        $("#newbuttonu").click(function() {
            setTimeout(function(){recallraidl100();}, 500);
        });
        $("#totalTS").click(function() {
            setTimeout(function(){carrycheck();}, 500);
        });
        $("#loccavwarconGo").click(function() {
            setTimeout(function(){getDugRows();}, 1000);
        });
        $("#raidmantab").click(function() {
            setTimeout(function(){getDugRows();}, 1000);
        });
        setTimeout(function(){Total_Research();}, 20000);
    });

    function Total_Research() {
        jQuery.ajax({url: 'includes/gaLoy.php',type: 'POST',aysnc:false,
                     success: function(data) {
                         var ldata=JSON.parse(data);
                         setloyal(ldata);
                     }
                    });
        function setloyal(ldata) {
            $.each(ldata.t, function(key, value) {
                if (key==2) {
                    $.each(this, function(key, value) {
                        vexemis+=this.f;
                    });
                }
                if (key==4) {
                    $.each(this, function(key, value) {
                        cyndros+=this.f;
                    });
                }
                if (key==6) {
                    $.each(this, function(key, value) {
                        ylanna+=this.f;
                    });
                }
                if (key==8) {
                    $.each(this, function(key, value) {
                        naera+=this.f;
                    });
                }
            });
            ylanna=Math.min(ylanna,100);
            naera=Math.min(naera,100);
            vexemis=Math.min(vexemis,100);
            cyndros=Math.min(cyndros,100);
            var research= cotg.player.research();
            Total_Combat_Research[2]+=((Number(naera)*0.5)/100)+(Number(Res[research[30]])/100);//ranger
            Total_Combat_Research[3]+=((Number(naera)*0.5)/100)+(Number(Res[research[31]])/100);//triari
            Total_Combat_Research[4]+=((Number(naera)*0.5)/100)+(Number(Res[research[32]])/100);//priestess
            Total_Combat_Research[5]+=((Number(vexemis)*0.5)/100)+(Number(Res[research[33]])/100);//vanq
            Total_Combat_Research[6]+=((Number(vexemis)*0.5)/100)+(Number(Res[research[34]])/100);//sorc
            Total_Combat_Research[7]+=((Number(vexemis)*0.5)/100)+(Number(Res[research[46]])/100);//scout
            Total_Combat_Research[8]+=((Number(naera)*0.5)/100)+(Number(Res[research[35]])/100);//arb
            Total_Combat_Research[9]+=((Number(naera)*0.5)/100)+(Number(Res[research[36]])/100);//pra
            Total_Combat_Research[10]+=((Number(vexemis)*0.5)/100)+(Number(Res[research[37]])/100);//horse
            Total_Combat_Research[11]+=((Number(vexemis)*0.5)/100)+(Number(Res[research[38]])/100);//druid
            Total_Combat_Research[14]+=((Number(ylanna)*0.5)/100)+(Number(Res[research[44]])/100);//galley
            Total_Combat_Research[15]+=((Number(ylanna)*0.5)/100)+(Number(Res[research[43]])/100);//stinger
            Total_Combat_Research[16]+=((Number(cyndros)*0.5)/100)+(Number(Res[research[45]])/100);//warship
        }
    }

    function recallraidl100(){
        console.log("1");
//        var troops = cotg.city.troops();
        var loot;
        var total;
        var total_number=0;
        var total_lootz=0;
        var i=0;

        for(var x in citytc) {
            total=Number(citytc[x]);
            total_number+=total*Number(TS_type[i]);
            total_lootz+=total*Number(ttloot[i]);
            i+=1;
            if (i === 17) { break; }
        }
        var lootpertroop=total_lootz/total_number;
        var l=1;
        var m=Number($("#commandtable tbody").length);
        function loop(){
            console.log("2");
            var trlist = $("#commandtable tbody tr:nth-child("+l+")");
            var lvlprog=$(trlist).find(".commandinntabl tbody tr:nth-child(3) td:nth-child(1) span:nth-child(1)").text();//td:nth-child(1) span:nth-child(1)
            var splitlp=lvlprog.split("(");
            var Dungeon_lvl=Number(splitlp[0].match(/\d+/gi));
            var Dungeion_prog=Number(splitlp[1].match(/\d+/gi));
            var dungeon=splitlp[0].substring(0,splitlp[0].indexOf(','));
            if(dungeon==="Mountain Cavern"){loot=mountain_loot;}
            else{loot=other_loot;}
            var total_loot_c= Math.ceil(loot[Number(Dungeon_lvl)-1] * ((1-Number(Dungeion_prog)/100)+1));
            var Unitno=$(trlist).find(".commandinntabl tbody tr:nth-child(1) td:nth-child(2) span").text();//td:nth-child(1) span:nth-child(1)
            var temp7=Unitno.match(/[\d,]+/g);
            var Units_raiding=Number(temp7[0].replace(',', ''));
            var lootperraid=lootpertroop*Units_raiding;
            var percentage_ofloot=Math.ceil((lootperraid/total_loot_c)*100);
            console.log(percentage_ofloot);
            if(Number(percentage_ofloot)<90){
                console.log("3");
                jQuery(trlist).find(".commandinntabl tbody tr:nth-child(2) td:nth-child(1) table tbody tr td:nth-child(2)")[0].click(); // table tbody tr td:nth-child(2)
                $("#raidrettimesela").val(1).change();
                setTimeout(function() {
                jQuery("#doneOG")[0].click();
                    },300);
                setTimeout(function() {
                    $("#outgoingPopUpBox").hide();
                },500);
            }
            l++;
            if(l<m){
                setTimeout(loop,1000);
            }
        }
        loop();
    }

    function carrycheck(){
 //       var troops = cotg.city.troops();
        var loot;
        var total;
        var total_number=0;
        var total_lootx=0;
        var i=0;
        for(var x in citytc) {
            total=Number(citytc[x]);
            total_number+=total*Number(TS_type[i]);
            total_lootx+=total*Number(ttloot[i]);
            i+=1;
            if (i === 17) { break; }
        }
        var lootpertroop=total_lootx/total_number;
        for (var i = 1; i < $("#commandtable tbody").length; i++) {
            var trlist = $("#commandtable tbody tr:nth-child("+i+")");
            var lvlprog=$(trlist).find(".commandinntabl tbody tr:nth-child(3) td:nth-child(1) span:nth-child(1)").text();//td:nth-child(1) span:nth-child(1)
            var splitlp=lvlprog.split("(");
            if (splitlp.length === 1) { continue; }
            var Dungeon_lvl=Number(splitlp[0].match(/\d+/gi));
            var Dungeion_prog=Number(splitlp[1].match(/\d+/gi));
            var dungeon=splitlp[0].substring(0,splitlp[0].indexOf(','));
            if(dungeon==="Mountain Cavern"){loot=mountain_loot;}
            else{loot=other_loot;}
            var total_loot_c= Math.ceil(loot[Number(Dungeon_lvl)-1] * ((1-Number(Dungeion_prog)/100)+1));
            var Unitno=$(trlist).find(".commandinntabl tbody tr:nth-child(1) td:nth-child(2) span").text();//td:nth-child(1) span:nth-child(1)
            var temp7=Unitno.match(/[\d,]+/g);
            var Units_raiding=Number(temp7[0].replace(',', ''));
            var lootperraid=lootpertroop*Units_raiding;
            var percentage_ofloot=Math.ceil((lootperraid/total_loot_c)*100);
            $(trlist).find(".commandinntabl tbody tr:nth-child(3) td:nth-child(2)").attr('rowspan',1);
            $(trlist).find(".commandinntabl tbody tr:nth-child(4) td:nth-child(1)").attr('colspan',1);
            $(trlist).find(".commandinntabl tbody tr:nth-child(4)").append('<td colspan="1" class="bottdinncommtb3" style="text-align:right"></td>');
            $(trlist).find(".commandinntabl tbody tr:nth-child(4) td:nth-child(2)").text("Carry:"+percentage_ofloot+"%");//td:nth-child(1) span:nth-child(1)
        }
    }

    function carry_percentage(total_loot){
        var troop_loot=0;
        $(".tninput").each(function() {
            var trpinpid =$(this).attr('id');
            var TSnum =$(this).val();
            var ttttt=Number(trpinpid.match(/\d+/gi));
            troop_loot+=TSnum*ttloot[ttttt];//total loot
        });
        var percentage_loot_takable=Math.ceil((troop_loot/total_loot)*100);
        $("#dungloctab").find(".addraiwc td:nth-child(3)").text("carry:"+percentage_loot_takable+"%");
    }

    function getDugRows(){
        $('#dungloctab th:contains("Distance")').click();
        $('#dungloctab th:contains("Distance")').click();
        $("#dungloctab tr").each(function() {
            var buttont=$(this).find("button");
            var buttonid=buttont.attr('id');
            var temp3=$(this).find("td:nth-child(2)").text();//lvl
            var temp4=$(this).find("td:nth-child(3)").text();//progress
            var tempz2=temp3.split(' ');
            var temp1=tempz2[1];
            var temp2=temp4.match(/\d+/gi);
            var tempz1=tempz2[2];
            if(buttonid) {
                buttont.attr('lvl',temp1);
                buttont.attr('prog',temp2);
                buttont.attr('type',tempz1);
            }
            $(buttont).click(function() {
                var count;
                var loot1;
                var countz=Number($('.splitRaid').children('option').length);//getting empty command slots
                if(countz>1){
                    count=countz-1;
                }else{count =countz;}
                var dunglvl=$(this).attr('lvl');
                var progress=$(this).attr('prog');
                var type_dung=$(this).attr('type');
                if(type_dung==="Mountain"){loot1=mountain_loot;}
                else{loot1=other_loot;}
                var total_loot= Math.ceil((loot1[Number(dunglvl)-1] * ((1-Number(progress)/100)+1))*1.02);
                $("#dungloctab").find(".addraiwc td:nth-child(4)").html("<button id='raid115' style='padding: 4px; border-radius: 8px;' class='greenb shRnTr'>115%</button>");
                $("#dungloctab").find(".addraiwc td:nth-child(2)").html("<button id='raidAll' style='padding: 4px; border-radius: 8px;' class='greenb shRnTr'>Use All TS</button>");
  //              var troops = cotg.city.troops();
                var home;
                $("#raid115").click(function(){
                    var i=0;
                    var home_loot=0;
                    var km=[];
                    for(var x in citytc) {
                        home=Number(citytc[x]);
                        home_loot+=home*ttloot[i];
                        km.push(home);
                        i+=1;
                        if (i === 17) { break; }
                    }
                    var loot_115=Math.ceil(total_loot*1.15);
                    if(home_loot>loot_115){
                        var option_numbers=Math.floor(home_loot/loot_115);
                        if(option_numbers<count){
                            $("#WCcomcount").val(option_numbers);
                        }else{$("#WCcomcount").val(count);}
                        var templ1=((home_loot/loot_115)*100)/option_numbers;
                        var templ2=((templ1-100)/templ1)*100;
                        for(var i in km){
                            if(km[i]!==0){
                                var templ3=km[i]/option_numbers;
                                km[i]=Math.floor(templ3*(1-(templ2/100)));
                                $("#rval"+i).val(km[i]);
                                if(km[14]){$("#rval14").val("0");}
                            }
                        }
                        carry_percentage(total_loot);
                    }
                });
                $("#raidAll").click(function(){
                    var i=0;
                    var home_loot=0;
                    var km=[];
                    for(var x in citytc) {
                        home=Number(citytc[x]);
                        home_loot+=home*ttloot[i];
                        km.push(home);
                        i+=1;
                        if (i === 17) { break; }
                    }
                    var loot_95=Math.ceil(total_loot*0.95);
                    if(home_loot>loot_95){
                        var option_numbers=Math.floor(home_loot/loot_95);
                        if(option_numbers<count){
                            $("#WCcomcount").val(option_numbers);
                        }else{$("#WCcomcount").val(count);}
                         for(var i in km){
                            if(count===1){
                                if(km[i]!==0){
                                    $("#rval"+i).val(km[i]);
                                }
                            }else{
                                if(km[i]!==0){
                                    if(option_numbers<count){
                                        km[i]=Math.floor(km[i]/option_numbers);
                                        $("#rval"+i).val(km[i]);
                                        if(km[14]){$("#rval14").val("0");}
                                    }else{
                                        km[i]=Math.floor(km[i]/count);
                                        $("#rval"+i).val(km[i]);
                                        if(km[14]){$("#rval14").val("0");}
                                    }
                                }}
                        }
                        carry_percentage(total_loot);
                    }
                });
                setTimeout(function(){
                    jQuery("#raidAll")[0].click();
                },100);
                setTimeout(function(){
                    carry_percentage(total_loot);
                }, 500);
                $(".tninput").change(function() {
                    carry_percentage(total_loot);
                });
                $("#WCcomcount").on('change', function() {
                    carry_percentage(total_loot);
                    $(".tninput").change(function() {
                        carry_percentage(total_loot);
                    });
                });
            });
        });
    }

    function bossele(){
        var bopti =$("#cityplayerInfo div table tbody");
        var bzTS ="<tr><td>Vanq:</td><td></td></tr><tr><td>R/T:</td><td></td></tr><tr><td>Ranger:</td><td></td></tr><tr><td>Triari:</td><td></td></tr><tr><td>Arb:</td><td></td></tr><tr><td>horse:</td><td></td></tr><tr><td>Sorc:</td><td></td></tr><tr><td>Druid:</td><td></td></tr>";
        bzTS+="<tr><td>Prietess:</td><td></td></tr><tr><td>Praetor:</td><td></td></tr><tr><td>Scout:</td><td></td></tr><tr><td>Galley:</td><td></td></tr><tr><td>Stinger:</td><td></td></tr><tr><td>Warships:</td><td></td></tr>";
        bopti.append(bzTS);
    }
        //“type” property that returns : shrine | portal | lawless | city | boss | dungeon
    cotgsubscribe.subscribe( "regional", function( data ) {
            var x=data.x;
            var y=data.y;
            var dtype=data.type;
            var type =data.info.type;
            var lvl =data.info.lvl;
            var prog =data.info.prog;
            var bossname=data.info.name;
            var bossactive=data.info.active;
     //       var troops = cotg.city.troops();
            var home;
            var optimalTS= Math.ceil((other_loot[lvl-1]/10 * ((1-prog/100)+1))*1.02);
            if(dtype==="dungeon"){
                if($("#cityplayerInfo div table tbody tr").length===11){
                    bossele();
                }
                var i=0;
                var home_loot=0;
                var km=[];
                for(var x in citytc) {
                    home=Number(citytc[x]);
                    home_loot+=home*ttloot[i];
                    km.push(home);
                    i+=1;
                    if (i === 17) { break; }
                }
                if(type==="Siren's Cove"){
                    var galleyTS= Math.ceil(optimalTS/100);
                    var stingerTS= Math.ceil(optimalTS/150);
                    var warshipTS= Math.ceil(optimalTS/300);
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if(km[14] || km[15] || km[16]){
                                if(km[16]>warshipTS){$('#raidIP16').val(warshipTS);}
                                else if(km[15]>stingerTS){$('#raidIP15').val(stingerTS);}
                                else if(km[14]>galleyTS){$('#raidIP14').val(galleyTS);}
                                else {errorgo(message);}
                                }
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text("0");//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text(galleyTS);
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text(stingerTS);
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text(warshipTS);
                }
                if(type==="Mountain Cavern"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            var total_lootm= Math.ceil((mountain_loot[Number(lvl)-1] * ((1-Number(prog)/100)+1))*1.02);
                            if(home_loot>total_lootm){
                                var option_numbersm=Math.floor(home_loot/total_lootm);
                                var templ1m=((home_loot/total_lootm)*100)/option_numbersm;
                                var templ2m=((templ1m-100)/templ1m)*100;
                                for(var i=0; i<14; i++){
                                    if(km[i]!==0){
                                        var templ3m=km[i]/option_numbersm;
                                        km[i]=Math.floor(templ3m*(1-(templ2m/100)));
                                        $("#raidIP"+i).val(km[i]);
                                    }
                                }
                            }
                        }, 1500);
                    };
                    var optimalTSM= Math.ceil((mountain_loot[lvl-1]/10 * ((1-prog/100)+1))*1.02);
                    var cavoptim=Math.ceil((optimalTSM *2)/3);
                    var praoptim=Math.ceil(optimalTSM/2);
                    var sorcoptim=Math.ceil(optimalTSM *2);
                    var RToptim=Math.ceil(optimalTSM/3);
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(optimalTSM);//vanq
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text(RToptim+"/"+RToptim);//RT
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(optimalTSM);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(praoptim);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(cavoptim);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(cavoptim);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(sorcoptim);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(optimalTSM);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(optimalTSM);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(praoptim);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text("0");//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(type==="Hill Cavern" || type==="Forest Cavern"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            var total_looto= Math.ceil((other_loot[Number(lvl)-1] * ((1-Number(prog)/100)+1))*1.02);
                            if(home_loot>total_looto){
                                var option_numbers=Math.floor(home_loot/total_looto);
                                var templ1=((home_loot/total_looto)*100)/option_numbers;
                                var templ2=((templ1-100)/templ1)*100;
                                for(var i=0; i<14; i++){
                                    if(km[i]!==0){
                                        var templ3=km[i]/option_numbers;
                                        km[i]=Math.floor(templ3*(1-(templ2/100)));
                                        $("#raidIP"+i).val(km[i]);
                                    }
                                }
                            }
                        }, 1500);
                    };
                    var cavopti=Math.ceil((optimalTS *2)/3);
                    var praopti=Math.ceil(optimalTS/2);
                    var sorcopti=Math.ceil(optimalTS *2);
                    var RTopti=Math.ceil(optimalTS/3);
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(optimalTS);//vanq
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text(RTopti+"/"+RTopti);//RT
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(optimalTS);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(praopti);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(cavopti);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(cavopti);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(sorcopti);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(optimalTS);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(optimalTS);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(praopti);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text("0");//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
            }
            if(dtype==="boss"){
                console.log(Total_Combat_Research);
                if($("#cityplayerInfo div table tbody tr").length===11){
                    bossele();
                }
                if(data.info.active){
                    message="Inactive Boss";
                    errorgo(message);
                    }
                message="Not enough TS to kill this boss!";
                var attackres=[];
                var attackwres=[];
                for(var i in ttattack){
                    var bossTS= Math.ceil((Number(bossdef[lvl-1])*4)/(Number(ttattack[i])*Number(Total_Combat_Research[i])));
                    attackres.push(bossTS);
                     var bosswTS= Math.ceil((Number(bossdefw[lvl-1])*4)/(Number(ttattack[i])*Number(Total_Combat_Research[i])));
                    attackwres.push(bosswTS);
                }
                var home_strength=0;
                var home_loot=0;
                var km=[];
                var bm=[];
                var bmw=[];
                var kg=[];
                var home_TSw=0;
                var boss_strength= Math.ceil(Number(bossdef[lvl-1])*4);
                var boss_strengthw= Math.ceil(Number(bossdefw[lvl-1])*4);
                var i=0;
                for(var x in citytc) {
                    home=Number(citytc[x]);
                    if(i===0 || i===1 || i===7 || i===12 || i===13){home=0;}
                    kg.push(home);
                    if(i===14 || i===15 || i===16){home=0;}
                    home_strength+=Number(ttattack[i])*Number(home)*Number(Total_Combat_Research[i]);//for land bosses
                    home_TSw+=home*TS_type[i];
                    km.push(home);
                    i+=1;
                    if (i === 17) { break; }
                }
                if(home_strength>boss_strength){//land strong bosses
                    var proportion=home_strength/boss_strength;
                    for(var i in km){
                        bm[i]=Math.ceil(Number(km[i])/proportion);
                    }
                }
                if(home_strength>boss_strengthw){//land weak bosses
                    var proportionw=home_strength/boss_strengthw;
                    for(var i in km){
                        bmw[i]=Math.ceil(Number(km[i])/proportionw);
                    }
                }
                if(bossname==="Triton"){
                    var bmz=[];
                    var home_strengthw=0;
                    var galleytroops=0;
                    var tempgalley=0;
                    var galley_TSneeded=Math.ceil(home_TSw/500);//imaginary
                    if(kg[14]){
                        home_strengthw=home_strength+(Number(galley_TSneeded)*(3000)*Number(Total_Combat_Research[14]));//with imaginary galley
                        if(home_strengthw>boss_strength){//galley+TS for triton
                            var proportionz=home_strengthw/boss_strength;
                            for(var i in km){
                                bmz[i]=Math.ceil(Number(km[i])/proportionz);
                                tempgalley+=bmz[i]*TS_type[i];
                            }
                        }
                        galleytroops=Math.ceil(tempgalley/500);
                    }
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            if((kg[14] || kg[15] || kg[16]) && !kg[5] && !kg[6] && !kg[8] && !kg[9] && !kg[10] && !kg[11] && !kg[2] && !kg[3] && !kg[4]){
                                if(kg[16]>attackwres[16]){$('#raidIP16').val(attackwres[16]);}
                                else if(kg[15]>attackwres[15]){$('#raidIP15').val(attackwres[15]);}
                                else if(kg[14]>attackwres[14]){$('#raidIP14').val(attackwres[14]);}
                                else {errorgo(message);}
                            }else if(kg[14] && (kg[5] || kg[6] || kg[8] || kg[9] || kg[10] || kg[11] || kg[2] || kg[3] || kg[4])){
                                if(kg[14]>galleytroops && bmz.length>0){
                                    for(var i in km){
                                        $('#raidIP'+[i]).val(bmz[i]);
                                    }
                                    $('#raidIP14').val(galleytroops);
                                }else if(kg[14]>attackwres[14]){
                                    $('#raidIP14').val(attackwres[14]);
                                }else {errorgo(message);}
                            }
                            else {errorgo(message);}
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackres[5]);//vanq  weak 14,15,16
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text("0");//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text("0");//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text("0");//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text("0");//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text("0");//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text("0");//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text(attackwres[14]);
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text(attackwres[15]);
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text(attackwres[16]);
                }
                if(bossname=="Cyclops"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[8] || km[9] || km[10]) && !km[5] && !km[6] && !km[2] && !km[3] && !km[4] && !km[11]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                       break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);
                                      if(bm.length===0){errorgo(message);
                                                        break;}}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackres[5]);//vanq weak 8,9,10
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackwres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackwres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackwres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackwres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(bossname=="Andar's Colosseum Challenge"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[8] || km[9] || km[10]) && !km[5] && !km[6] && !km[2] && !km[3] && !km[4] && !km[11]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                      break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);}
                                if(bm.length===0){errorgo(message);
                                                 break;}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackres[5]);//vanq 8,9,10
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackwres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackwres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackwres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackwres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(bossname=="Romulus and Remus"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[2] || km[3] || km[4] || km[5]) && !km[6] && !km[8] && !km[9] && !km[10] && !km[11]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                      break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);}
                                if(bm.length===0){errorgo(message);
                                                 break;}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackwres[5]);//vanq 2,3,4,5
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackwres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackwres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackwres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(bossname=="Dragon"){
                   document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[2] || km[3] || km[4] || km[5]) && !km[6] && !km[8] && !km[9] && !km[10] && !km[11]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                      break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);}
                                if(bm.length===0){errorgo(message);
                                                 break;}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackwres[5]);//vanq 2,3,4,5
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackwres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackwres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackwres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(bossname=="Gorgon"){
                     document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[6] || km[11]) && !km[4] && !km[5] && !km[3] && !km[8] && !km[9] && !km[10] && !km[2]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                      break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);}
                                if(bm.length===0){errorgo(message);
                                                 break;}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackres[5]);//vanq 6,11
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackwres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackwres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
                if(bossname=="Gladiator"){
                    document.getElementById('raidDungGo').onclick = function() {
                        setTimeout(function(){
                            for(var i in km){
                                if((km[6] || km[11]) && !km[4] && !km[5] && !km[3] && !km[8] && !km[9] && !km[10] && !km[2]){
                                    $('#raidIP'+[i]).val(bmw[i]);
                                    if(bmw.length===0){errorgo(message);
                                                      break;}
                                }else{$('#raidIP'+[i]).val(bm[i]);}
                                if(bm.length===0){errorgo(message);
                                                 break;}
                            }
                        }, 1500);
                    };
                    $("#cityplayerInfo div table tbody tr:nth-child(5) td:nth-child(2)").text(attackres[5]);//vanq 6,11
                    $("#cityplayerInfo div table tbody tr:nth-child(6) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(7) td:nth-child(2)").text(attackres[2]);//ranger
                    $("#cityplayerInfo div table tbody tr:nth-child(8) td:nth-child(2)").text(attackres[3]);//triari
                    $("#cityplayerInfo div table tbody tr:nth-child(9) td:nth-child(2)").text(attackres[8]);//arb
                    $("#cityplayerInfo div table tbody tr:nth-child(10) td:nth-child(2)").text(attackres[10]);//horse
                    $("#cityplayerInfo div table tbody tr:nth-child(11) td:nth-child(2)").text(attackwres[6]);//sorc
                    $("#cityplayerInfo div table tbody tr:nth-child(12) td:nth-child(2)").text(attackwres[11]);//druid
                    $("#cityplayerInfo div table tbody tr:nth-child(13) td:nth-child(2)").text(attackres[4]);//priestess
                    $("#cityplayerInfo div table tbody tr:nth-child(14) td:nth-child(2)").text(attackres[9]);//pra
                    $("#cityplayerInfo div table tbody tr:nth-child(15) td:nth-child(2)").text(attackres[7]);//scout

                    $("#cityplayerInfo div table tbody tr:nth-child(16) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(17) td:nth-child(2)").text("0");
                    $("#cityplayerInfo div table tbody tr:nth-child(18) td:nth-child(2)").text("0");
                }
            }
        if(dtype==="city"){
            $("#cityplayerInfo div table tbody tr:gt(6)").remove();
        }
        });
})();
