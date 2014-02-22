var mubBot = {};
var ruleSkip = {};
mubBot.misc = {};
mubBot.settings = {};
mubBot.moderators = {};
mubBot.filters = {};
botMethods = {};
mubBot.pubVars = {};

toSave = {};
toSave.settings = mubBot.settings;
toSave.moderators = mubBot.moderators;
toSave.ruleSkip = ruleSkip;

mubBot.misc.version = "2.0.30";
mubBot.misc.origin = "Este bot foi criado pelo Emub e ,DerpTheBass' sozinho, e é protegido por direitos autorais!";
mubBot.misc.changelog = "Traduzido para Português";
mubBot.misc.ready = true;
mubBot.misc.lockSkipping = true;
mubBot.misc.lockSkipped = "0";
mubBot.misc.tacos = new Array();

joined = new Date().getTime();

cancel = false;

mubBot.filters.swearWords = new Array();
mubBot.filters.racistWords = new Array();
mubBot.filters.beggerWords = new Array();

mubBot.settings.maxLength = 7; //minutes
mubBot.settings.cooldown = 10; //seconds
mubBot.settings.staffMeansAccess = true;
mubBot.settings.historyFilter = true;
mubBot.settings.swearFilter = true;
mubBot.settings.racismFilter = true;
mubBot.settings.beggerFilter = true;
mubBot.settings.interactive = true;
mubBot.settings.ruleSkip = true;
mubBot.settings.removedFilter = true;

//Emub                      DerpTheBass                 [#808]                          eBot                          -Frosty
mubBot.admins = ["50aeaf683e083e18fa2d187e", "50aeb07e96fba52c3ca04ca8", "50aeb607c3b97a2cb4c35ac1", "51264d96d6e4a966883b0702", "5155fcbe3e083e1c862e0a8e"];

mubBot.filters.swearWords = ["fuck","shit","bitch","cunt","twat","fag","queer","dumbass","putaria","p0taria","viado","viadu","bugador","fi duma rapariga","merda","caga","retardado","bosta","fdp","vtnc","vsf","funde","viadao","gay","cu","cú","viado","viadagem","rola","pau"];

mubBot.filters.racistWords = ["nigger","kike","spick","porchmonkey","camel jockey","towelhead","towel head","chink","gook","porch monkey","nigga","n1gga","preto","pretu","negro","black","branco","pret*","nigg*"];

mubBot.filters.beggerWords = ["fan4fan","fan me","fan pls","fans please","fan please","fan 4 fan","fan back","give me fans","gimme fans","fan back","f4n","f@n","troco fans","troca fan"];

mubBot.misc.tacos = ["crispy taco","mexican taco","vegetarian taco","spicy taco","meatlover taco","cheese taco","wet hamburger","taco shell","delicious taco","gross taco"];

mubBot.pubVars.skipOnExceed;
mubBot.pubVars.command = false;

Array.prototype.remove=function(){var c,f=arguments,d=f.length,e;while(d&&this.length){c=f[--d];while((e=this.indexOf(c))!==-1){this.splice(e,1)}}return this};

API.on(API.DJ_ADVANCE, djAdvanceEvent);

function djAdvanceEvent(data){
    setTimeout(function(){ botMethods.djAdvanceEvent(data); }, 500);
}

botMethods.skip = function(){
    setTimeout(function(){
        if(!cancel) API.moderateForceSkip();
    }, 3500);
};

botMethods.load = function(){
    toSave = JSON.parse(localStorage.getItem("mubBotSave"));
    mubBot.settings = toSave.settings;
    ruleSkip = toSave.ruleSkip;
};

botMethods.save = function(){localStorage.setItem("mubBotSave", JSON.stringify(toSave))};

botMethods.loadStorage = function(){
    if(localStorage.getItem("mubBotSave") !== null){
        botMethods.load();
    }else{
        botMethods.save();
    }
};

botMethods.checkHistory = function(){
    currentlyPlaying = API.getMedia(), history = API.getHistory();
    caught = 0;
    for(var i = 0; i < history.length; i++){
        if(currentlyPlaying.cid === history[i].media.cid){
            caught++;
        }
    }
    caught--;
    return caught;
};

botMethods.getID = function(username){
    var users = API.getUsers();
    var result = "";
    for(var i = 0; i < users.length; i++){
        if(users[i].username === username){
            result = users[i].id;
            return result;
        }
    }

    return "notFound";
};

botMethods.cleanString = function(string){
    return string.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&#34;/g, "\"").replace(/&#59;/g, ";").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

botMethods.djAdvanceEvent = function(data){
    $('#button-vote-positive').click();
    clearTimeout(mubBot.pubVars.skipOnExceed);
    if(mubBot.misc.lockSkipping){
        API.moderateAddDJ(mubBot.misc.lockSkipped);
        mubBot.misc.lockSkipped = "0";
        mubBot.misc.lockSkipping = false;
        setTimeout(function(){ API.moderateRoomProps(false, true); }, 500);
    }
    var song = API.getMedia();
    if(botMethods.checkHistory() > 0 && mubBot.settings.historyFilter){
        if(API.getUser().permission < 2){
            API.sendChat("Esta musica está no historico! Você devia me fazer um mod para que eu pudesse pular a musica!");
        }else if(API.getUser().permission > 1){
            API.sendChat("@" + API.getDJ().username + ", tocando músicas que estão no historico, não é permitido, por favor, verifique a próxima vez! Pulando ..");
            botMethods.skip()
        }else if(song.duration > mubBot.settings.maxLength * 60){
            mubBot.pubVars.skipOnExceed = setTimeout( function(){
                API.sendChat("@"+API.getDJ().username+" Você já jogou por quanto tempo esta sala permite, é hora de deixar alguém ter a cabine!");
                botMethods.skip();
            }, mubBot.settings.maxLength * 60);
            API.sendChat("@"+API.getDJs()[0].username+" Esta musica será pulada " + mubBot.settings.maxLength + " minutos a partir de agora, pois excede o comprimento máximo canção.");
        }else{
            setTimeout(function(){
                if(botMethods.checkHistory() > 0 && mubBot.settings.historyFilter){
                    API.sendChat("@" + API.getDJ().username + ", tocando músicas que estão na história não é permitido, por favor, verifique a próxima vez! Pulando ..");
                    botMethods.skip()
                };
            }, 1500);
        }
    }
};

    API.on(API.CHAT, function(data){
        if(data.message.indexOf('!') === 0){
            var msg = data.message, from = data.from, fromID = data.fromID;
            var command = msg.substring(1).split(' ');
            if(typeof command[2] != "undefined"){
                for(var i = 2; i<command.length; i++){
                    command[1] = command[1] + ' ' + command[i];
                }
            }
            if(mubBot.misc.ready || mubBot.admins.indexOf(fromID) > -1 || API.getUser(data.fromID).permission > 1){
                switch(command[0].toLowerCase()){
                    case "ping":
                        API.sendChat("/me pong!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                    case "weird":
                    case "weirdday":
                    case "wierd":
                    case "wierdday":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("Weird Songs - http://playmc.pw/plug/WeirdDay.html");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" Weird Songs - http://playmc.pw/plug/WeirdDay.html");
                        }else{
                            API.sendChat("Weird Songs - http://playmc.pw/plug/WeirdDay.html");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "ajuda":
                        API.sendChat("É Novo no Plug.DJ? Não sabe como isso funciona? > http://i.imgur.com/rVsnr54.png?1");
                    break;
                    
                    case "mubpt":
                        API.sendChat("mubBot Criado por ,DerpTheBass' e por Emub. Traduzido para Português por -Frosty.");
                    break;
                        
                    case "irc":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("IRC - http://derpthebass.com/IRC/");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" IRC - http://derpthebass.com/IRC/");
                        }else{
                            API.sendChat("IRC - http://derpthebass.com/IRC/");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "commands":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("Comandos do mubBot - http://playmc.pw/plug/commands.html");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" Comandos do mubBot - http://playmc.pw/plug/commands.html");
                        }else{
                            API.sendChat("Comandos do mubBot - http://playmc.pw/plug/commands.html");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "comandos":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("Comandos do mubBot - http://goo.gl/p29e9w");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" Comandos do mubBot - http://goo.gl/p29e9w");
                        }else{
                            API.sendChat("Comandos do mubBot - http://goo.gl/p29e9w");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "wiki":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("@"+data.from+" https://en.wikipedia.org/wiki/Special:Random");
                        }else{
                            var r = data.message.substring(6).replace(/ /g, "_");
                            $.getJSON("http://jsonp.appspot.com/?callback=?&url=" + escape("http://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles="+r.replace(/ /g,"_")),
                                function(wikiData){
                                    if (!wikiData || !wikiData.query || !wikiData.query.pages) // there's an error. pssh, don't let anyone know ;)
                                        return API.sendChat("@"+data.from+" http://en.wikipedia.org/wiki/"+r+" (NOT GUARANTEED TO BE CORRECT)");
                                    if (wikiData.query.pages[-1]) {
                                        API.sendChat("@"+data.from+" article not found");
                                    }else{
                                        for (var i in wikiData.query.pages)
                                            // note: the #... is just to make the url look nicer
                                            return API.sendChat("@"+data.from+" https://en.wikipedia.org/wiki/?curid="+i+"#"+escape(wikiData.query.pages[i].title) );
                                    }
                                }
                            );
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "steam":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("http://steamcommunity.com/groups/plugfim#");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" http://steamcommunity.com/groups/plugfim#");
                        }else{
                            API.sendChat("http://steamcommunity.com/groups/plugfim#");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "skype":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("http://goo.gl/NjSO6j");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" http://goo.gl/NjSO6j");
                        }else{
                            API.sendChat("http://goo.gl/NjSO6j");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "linkify":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("@" + data.from + " You need to put a link!");
                        }else if(command[1].toLowerCase().indexOf("plug.dj") === -1 && command[1].toLowerCase().indexOf("bug.dj") === -1){
                            API.sendChat("http://"+command[1]);
                        }else{
                            API.sendChat("Nice try! Advertising is not allowed in this room.");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "musica":
                        if(API.getMedia().format == 1){
                            API.sendChat("@" + data.from + " " + "http://youtu.be/" + API.getMedia().cid);
                        }else{
                            var id = API.getMedia().cid;
                            SC.get('/tracks', { ids: id,}, function(tracks) {
                                API.sendChat("@"+data.from+" "+tracks[0].permalink_url);
                            });
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "brutos":
                        API.sendChat("/me Bugado!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "assis":
                        API.sendChat("/me Broxa!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "jaum":
                        API.sendChat("/me viadaum!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "hiana":
                        API.sendChat("/me tezuda!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "ipasoca":
                        API.sendChat("/me noia!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "eltoon":
                        API.sendChat("/me jhown!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "pedo":
                        API.sendChat("/me bear! :bear:");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "guilherme":
                        API.sendChat("/me verme!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                
                    case "frosty":
                        API.sendChat("/me foda!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "regras":
                        API.sendChat("/me Regras da Sala - http://goo.gl/2K0xh8!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "temas":
                        if(typeof command[1] == "undefined"){
                            API.sendChat("Os ritmos musicas permitidos são :  Dubstep, Electro, Electro-House, House, Progressive House, Drum and Bass, Drumstep, Drum and Bass, Trance, Trap, Glitch-Hop, Hardstyle");
                        }else if(command[1].indexOf("@") > -1){
                            API.sendChat(command[1]+" Os ritmos musicas permitidos são :  Dubstep, Electro, Electro-House, House, Progressive House, Drum and Bass, Drumstep, Drum and Bass, Trance, Trap, Glitch-Hop, Hardstyle");
                        }else{
                            API.sendChat("Os ritmos musicas permitidos são :  Dubstep, Electro, Electro-House, House, Progressive House, Drum and Bass, Drumstep, Drum and Bass, Trance, Trap, Glitch-Hop, Hardstyle");
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                
                    case "etd":
                        API.sendChat("/me Grupo : https://www.facebook.com/groups/647914285267897/ | Página : https://www.facebook.com/ETDPlugdj | Twitter : https://twitter.com/ETDBR");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                                        
                    case "fdk":
                        API.sendChat("/me Grupo : https://www.facebook.com/groups/622101017802230/");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                                                            
                    case "sweet":
                        API.sendChat("/me PC com AIDS, Joga sapoha fora!");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                                                                
                    case "critical":
                        API.sendChat("/me guei");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                                                                                                
                    case "fusion":
                        API.sendChat("/me viadaum");
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                }
            }
        }
    });

    API.on(API.CHAT, function(data){
        if(data.message.indexOf('!') === 0){
            var msg = data.message, from = data.from, fromID = data.fromID;
            var command = msg.substring(1).split(' ');
            if(typeof command[2] != "undefined"){
                for(var i = 2; i<command.length; i++){
                    command[1] = command[1] + ' ' + command[i];
                }
            }
            if(mubBot.misc.ready || mubBot.admins.indexOf(fromID) > -1 || API.getUser(fromID).permission > 1){
                switch(command[0].toLowerCase()){
                    
                     case "meh":
                     if(API.getUser(data.fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) $("#button-vote-negative").click();
                     break;

                     case "woot":
                     if(API.getUser(data.fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1)  $("#button-vote-positive").click();
                     break;

                    case "pular":
                    if(API.getUser(data.fromID).permission > 1){
                        if(typeof command[1] === "undefined"){
                            API.moderateForceSkip();
                        }else{
                            API.sendChat('@'+API.getDJ().username+' '+command[1]);
                            API.moderateForceSkip();
                        }
                    }
                        break;
                        
                    case "travar":
                    if(API.getUser(data.fromID).permission > 1){
                        if(typeof command[1] === "undefined"){
                            API.moderateRoomProps(true);
                            break;
                            
                    case "destravar":
                    if(API.getUser(data.fromID).permission > 1){
                        if(typeof command[1] === "undefined"){
                            API.moderateRoomProps(false,true);

                    case 'cancel':
                        cancel = true;
                        API.sendChat('AutoSkip cancelled');
                        break;

                    case "lockskip":
                        if( API.getUser(data.fromID).permission > 1){
                            API.moderateRoomProps(true, true);
                            mubBot.misc.lockSkipping = true;
                            mubBot.misc.lockSkipped = API.getDJ().id;
                            setTimeout(function(){ API.moderateRemoveDJ(mubBot.misc.lockSkipped); }, 500);
                        }else{
                            API.sendChat("This command requires bouncer or higher!");
                        }
                        break;
                    case 'rvf':
                    case 'removedfilter':
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.removedFilter ? API.sendChat("Filtro de vídeo Removido está ativado") : API.sendChat("Filtro de vídeo Removido está desativado");
                        break;
                    case 'trvf':
                    case 'toggleremovedfilter':
                        mubBot.settings.removedFilter = !mubBot.settings.removedFilter;
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.removedFilter ? API.sendChat("Filtro de vídeo Removido está ativado") : API.sendChat("Filtro de vídeo Removido está desativado");
                        break;
                    case "historyfilter":
                    case "hf":
                    case "filtrodohistorico":
                    case "fdh":    
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.historyFilter ? API.sendChat("Filtro do Historico está ativado") : API.sendChat("Filtro do Historico está desativado");
                        botMethods.save();
                        break;

                    case "swearfilter":
                    case "sf":
                    case "filtroparapalavroes":
                    case "fpp":    
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.swearFilter ? API.sendChat("Filtro de palavrões está ativado") : API.sendChat("Filtro de palavrões está desativado");
                        botMethods.save();
                        break;

                    case "racismfilter":
                    case "rf":
                    case "filtropararacismo":
                    case "fpr":                       
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.racismFilter ? API.sendChat("Filtro de Racismo está ativado") : API.sendChat("Filtro de Racismo está desativado");
                        botMethods.save();
                        break;

                    case "beggerfilter":
                    case "bf":
                    case "filtroparafâns":
                    case "fpf":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1) mubBot.settings.beggerFilter ? API.sendChat("Filtro de f*ãs está ativado") : API.sendChat("Filtro de F*ãs está desativado");
                        botMethods.save();
                        break;

                    case "tsf":
                    case "afpp":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(mubBot.settings.swearFilter){
                                mubBot.settings.swearFilter = false;
                                API.sendChat("O Bot não irá mais filtrar os palavrões");
                            }else{
                                mubBot.settings.swearFilter = true;
                                API.sendChat("O Bot agora irá filtrar os palavrões, Tenha cuidado para não tomar ban :v:");
                            }
                        }
                        botMethods.save();
                        break;

                    case "trf":
                    case "afpr":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(mubBot.settings.racismFilter){
                                mubBot.settings.racismFilter = false;
                                API.sendChat("O Bot não irá mais filtrar o racismo");
                            }else{
                                mubBot.settings.racismFilter = true;
                                API.sendChat("O Bot agora irá filtrar os racismos, Tenha cuidado com a lingua,ops com os dedos");
                            }
                        }
                        botMethods.save();
                        break;

                    case "tbf":
                    case "afpf":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(mubBot.settings.beggerFilter){
                                mubBot.settings.beggerFilter = false;
                                API.sendChat("O Bot não irá mais filtrar os f*ãns");
                            }else{
                                mubBot.settings.beggerFilter = true;
                                API.sendChat("O Bot agora irã filtrar os f*ãs, Tenha cuidado seus mendigos :trollface:");
                            }
                        }
                        botMethods.save();
                        break;
                    case "thf":
                    case "afph":    
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(mubBot.settings.historyFilter){
                                mubBot.settings.historyFilter = false;!
                                    API.sendChat("O Bot não vai mais pular as músicas que estão no historico.");
                            }else{
                                mubBot.settings.historyFilter = true;
                                API.sendChat("O bot irá agora pular as músicas que estão no historico");
                            }
                        }
                        botMethods.save();
                        break;

                    case "version":
                        API.sendChat("mubBot user shell version " + mubBot.misc.version);
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                        
                    case "versao":
                        API.sendChat("mubBot-PT Versao : " + mubBot.misc.version);
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "origin":
                    case "author":
                    case "authors":
                    case "creator":
                    case "autor":
                        API.sendChat(mubBot.misc.origin);
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "status":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            var response = "";
                            var currentTime = new Date().getTime();
                            var minutes = Math.floor((currentTime - joined) / 60000);
                            var hours = 0;
                            while(minutes > 60){
                                minutes = minutes - 60;
                                hours++;
                            }
                            hours == 0 ? response = "Ligado á " + minutes + "m " : response = "Ligado á " + hours + "h " + minutes + "m";
                            response = response + " | Filtro de F*ãs: "+mubBot.settings.beggerFilter;
                            response = response + " | Filtro de Palavrões: "+mubBot.settings.swearFilter;
                            response = response + " | Filtro de Racismo: "+mubBot.settings.racismFilter;
                            response = response + " | Filtro do Historico: "+mubBot.settings.historyFilter;
                            response = response + " | Tempo Maximo: " + mubBot.settings.maxLength + "m";
                            response = response + " | Cooldown: " + mubBot.settings.cooldown + "s";
                            response = response + " | RuleSkip: "+ mubBot.settings.ruleSkip;
                            response = response + " | Filtro de Videos Removidos: "+ mubBot.settings.removedFilter;
                            API.sendChat(response);
                        }
                        break;

                    case "cooldown":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(typeof command[1] == "undefined"){
                                if(mubBot.settings.cooldown != 0.0001){
                                    API.sendChat('Cooldown is '+mubBot.settings.cooldown+' seconds');
                                }else{
                                    API.sendChat('Cooldown is disabled');
                                }
                            }else if(command[1] == "disable"){
                                mubBot.settings.cooldown = 0.0001;
                                API.sendChat('Cooldown disabled');
                            }else{
                                mubBot.settings.cooldown = command[1];
                                API.sendChat('New cooldown is '+mubBot.settings.cooldown+' seconds');
                            }
                        }
                        botMethods.save();
                        break;

                    case "maxlength":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(typeof command[1] == "undefined"){
                                if(mubBot.settings.maxLength != 1e+50){
                                    API.sendChat('Novo Tempo Maximo é de '+mubBot.settings.maxLength+' minutos');
                                }else{
                                    API.sendChat('Tempo Maximo Desativado');
                                }
                            }else if(command[1] == "disable"){
                                mubBot.settings.maxLength = Infinity;
                                API.sendChat('Tempo Maximo Desativado');
                            }else{
                                mubBot.settings.maxLength = command[1];
                                API.sendChat('Novo Tempo Maximo é de '+mubBot.settings.maxLength+' minutos');
                            }
                        }
                        botMethods.save();
                        break;
                        
                    case "tempomaximo":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(typeof command[1] == "undefined"){
                                if(mubBot.settings.maxLength != 1e+50){
                                    API.sendChat('Novo Tempo Maximo é de '+mubBot.settings.maxLength+' minutos');
                                }else{
                                    API.sendChat('Tempo Maximo Desativado');
                                }
                            }else if(command[1] == "disable"){
                                mubBot.settings.maxLength = Infinity;
                                API.sendChat('Tempo Maximo Desativado');
                            }else{
                                mubBot.settings.maxLength = command[1];
                                API.sendChat('Novo Tempo Maximo é de '+mubBot.settings.maxLength+' minutos');
                            }
                        }
                        botMethods.save();
                        break;

                    case "interactive":
                    case "into":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            mubBot.settings.interactive ? API.sendChat("o Bot é interativo.") : API.sendChat("O Bot não é interativo.");
                        }
                        break;

                    case "toggleinteractive":
                    case "ti":
                    case "ai":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            if(mubBot.settings.interactive){
                                mubBot.settings.interactive = false;
                                API.sendChat("Bot deixará de interagir.");
                            }else{
                                mubBot.settings.interactive = true;
                                API.sendChat("O bot irá agora interagir.");
                            }
                        }
                        botMethods.save();
                        break;

                    case "salvar":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            botMethods.save();
                            API.sendChat("Configurações guardadas");
                        }
                        break;

                    case "stfu":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            mubBot.settings.interactive = false;
                            API.sendChat("Yessir!");
                        }
                        botMethods.save();
                        break;

                    case "changelog":
                        if(API.getUser(fromID).permission > 1 || mubBot.admins.indexOf(fromID) > -1){
                            API.sendChat("Novo na versão " + mubBot.misc.version + " - " + mubBot.misc.changelog)
                        }
                        break;

                }
            }
        }
    });

    API.on(API.CHAT, function(data){
        if(data.message.indexOf('!') === 0){
            var msg = data.message, from = data.from, fromID = data.fromID;
            var command = msg.substring(1).split(' ');
            if(typeof command[2] != "undefined"){
                for(var i = 2; i<command.length; i++){
                    command[1] = command[1] + ' ' + command[i];
                }
            }
            if(mubBot.misc.ready || mubBot.admins.indexOf(fromID) > -1 ||API.getUser(fromID).permission > 1){
                switch(command[0].toLowerCase()){
                    case "taco":
                        if(typeof command[1] == "undefined"){
                            var crowd = API.getUsers();
                            var randomUser = Math.floor(Math.random() * crowd.length);
                            var randomTaco = Math.floor(Math.random() * mubBot.misc.tacos.length);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("@" + crowd[randomUser].username + ", toma isso " + mubBot.misc.tacos[randomTaco] + ", seu bugado!");
                                    break;
                                case 1:
                                    API.sendChat("@" + crowd[randomUser].username + ", rápido! Come isso " + mubBot.misc.tacos[randomTaco] + " Antes que eu coma isso!");
                                    break;
                                case 2:
                                    API.sendChat("Um grátis " + mubBot.misc.tacos[randomTaco] + " para ti, @" + crowd[randomUser].username + ". :3");
                                    break;
                                case 3:
                                    API.sendChat("/me atirou um " + mubBot.misc.tacos[randomTaco] + " para @" + crowd[randomUser].username + "!");
                                    break;
                            }
                        }else{
                            if(command[1].indexOf("@") === 0) command[1] = command[1].substring(1);
                            var randomTaco = Math.floor(Math.random() * mubBot.misc.tacos.length);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("@" + botMethods.cleanString(command[1]) + ", toma isso " + mubBot.misc.tacos[randomTaco] + ", seu bugado!");
                                    break;
                                case 1:
                                    API.sendChat("@" + botMethods.cleanString(command[1]) + ", rápido! Come isso " + mubBot.misc.tacos[randomTaco] + " Antes que eu coma isso!");
                                    break;
                                case 2:
                                    API.sendChat("Um grátis " + mubBot.misc.tacos[randomTaco] + " para ti, @" + botMethods.cleanString(command[1]) + ". :3");
                                    break;
                                case 3:
                                    API.sendChat("/me atirou um " + mubBot.misc.tacos[randomTaco] + " para @" + botMethods.cleanString(command[1]) + "!");
                                    break;
                            }
                        }
                        if(mubBot.admins.indexOf(fromID) > -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                    case "hug":
                        if(typeof command[1] == "undefined"){
                            var crowd = API.getUsers();
                            var randomUser = Math.floor(Math.random() * crowd.length);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("Abraços? Esqueça isso!");
                                    setTimeout(function(){
                                        API.sendChat("/me grabs @"+crowd[randomUser].username+" 's ass");
                                    }, 650);
                                    break;
                                case 1:
                                    API.sendChat("/me da á @"+crowd[randomUser].username+" um grande abraço");
                                    break;
                                case 2:
                                    API.sendChat("/me da á @"+crowd[randomUser].username+" um abraço macio, peludo");
                                    break;
                                case 3:
                                    API.sendChat("/me da á @"+crowd[randomUser].username+" um abraço desajeitado");
                                    break;
                            }
                        }else{
                            if(command[1].indexOf("@") === 0) command[1] = command[1].substring(1);
                            var crowd = API.getUsers();
                            var randomUser = Math.floor(Math.random() * crowd.length);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("Hugs? Forget that!");
                                    setTimeout(function(){
                                        API.sendChat("/me grabs @"+botMethods.cleanString(command[1])+" 's ass");
                                    }, 650);
                                    break;
                                case 1:
                                    API.sendChat("/me gives @"+botMethods.cleanString(command[1])+" a big bear hug");
                                    break;
                                case 2:
                                    API.sendChat("/me gives @"+botMethods.cleanString(command[1])+" a soft, furry hug");
                                    break;
                                case 3:
                                    API.sendChat("/me gives @"+botMethods.cleanString(command[1])+" an awkward hug");
                                    break;
                            }
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;
                    case "cookie":
                        if(typeof command[1] == "undefined"){
                            var crowd = API.getUsers();
                            var randomUser = Math.floor(Math.random() * crowd.length);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("/me joga uma banana de dinamite em @"+crowd[randomUser].username);
                                    break;
                                case 1:
                                    API.sendChat("/me afoga @"+crowd[randomUser].username+" na massa");
                                    break;
                                case 2:
                                    API.sendChat("/me mostra @"+crowd[randomUser].username+" o poder da amizade. Golpeando-os com um BOLINHO");
                                    break;
                                case 3:
                                    API.sendChat("/me mãos um antraz bolinho atado a @"+crowd[randomUser].username);
                                    break;
                            }
                        }else{
                            if(command[1].indexOf("@") === 0) command[1] = command[1].substring(1);
                            var randomSentence = Math.floor(Math.random() * 4);
                            switch(randomSentence){
                                case 0:
                                    API.sendChat("/me joga uma banana de dinamite e @"+botMethods.cleanString(command[1]));
                                    break;
                                case 1:
                                    API.sendChat("/me afoga @"+botMethods.cleanString(command[1])+" na massa");
                                    break;
                                case 2:
                                    API.sendChat("/me hands an anthrax laced cookie to @"+botMethods.cleanString(command[1]));
                                    break;
                                case 3:
                                    API.sendChat("/me mostra @"+botMethods.cleanString(command[1])+" o poder da amizade. Golpeando-os com um BOLINHO");
                                    break;
                            }
                        }
                        if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                            mubBot.misc.ready = false;
                            setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                        }
                        break;

                    case "run":
                        if(mubBot.admins.indexOf(fromID) > -1){
                            a = botMethods.cleanString(command[1]);
                            console.log(a);
                            eval(a);
                        }
                        break;

                }
            }
        }
    });

    API.on(API.CHAT, function(data){
        if(data.message.indexOf('!leia ') === 0){
            var msg = data.message, from = data.from, fromID = data.fromID;
            var command = msg.substring(1).split(' ');

            if(mubBot.misc.ready || mubBot.admins.indexOf(fromID) > -1 ||API.getUser(fromID).permission > 1){
                switch(command[1]){
                    case '1':
                        API.sendChat('/me Os ritmos musicas permitidos são :  Dubstep, Electro, Electro-House, House, Progressive House, Drum and Bass, Drumstep, Drum and Bass, Trance, Trap, Glitch-Hop, Hardstyle');
                        break;
                    case '2':
                        API.sendChat('/me Sem flood/spam no chat');
                        break;
                    case '3':
                        API.sendChat('/me Não fique pedindo cargos');
                        break;
                    case '4':
                        API.sendChat('/me Qualquer musica que esteja no historico irá ser pulada');
                        break;
                    case '5':
                        API.sendChat('/me Salas de Publicidade, sites, etc, sem a aprovação do moderador é motivo para ser expulso');
                        break;
                    case '6':
                        API.sendChat('/me Evite tocar musicas longas / permitido : 5:00 é o maximo ;)');
                        break;
                    case '7':
                        API.sendChat('/me Spam no chat irá resultar em chutado');
                        break;
                    case '8':
                        API.sendChat('/me FOR THE LOVE OF CELESTIA, CONTROL THE CANTERLOCK');
                        break;
                    case '9':
                        API.sendChat('/me Há uma política de não tolerância para a briga');
                        break;
                    case '10':
                        API.sendChat('/me Todos os visitantes da sala devem ser tratados igualmente e de forma justa por todos');
                        break;
                    case '11':
                        API.sendChat('/me Não peça cargos de Bouncer/Manager/CoHost');
                        break;
                    case '12':
                        API.sendChat('/me Respeitar os outros usuários e moderadores, desrespeito contínuo resultará em ser expulso');
                        break;
                    case '13':
                        API.sendChat('/me Sem R34/clop/porn/gore. Isso inclui links, músicas e bate-papo. (Se você quiser publicar este material em qualquer lugar, falar com um moderador sobre ser adicionado ao grupo de Skype, você pode publicá-la lá com marcas próprias [NSFW / NSFL])');
                        break;
                    case '14':
                        API.sendChat('/me No playing episodes/non-music shorts unless you’re the (co)host or were giving permission to play a episode/non-music short by a (co)host');
                        break;
                    case '15':
                        API.sendChat('/me Quando postar links, por favor, adicione NSFW por nada sugestivo (qualquer coisa picante, pornografia, gore, ou trotar não é permitido). Adicionar etiquetas Spoiler quando necessário,');
                        break;
                    case '16':
                        API.sendChat('/me Xingar é permitido com moderação. Insultos racistas e pejorativas pode resultar em ser expulso');
                        break;
                    case '17':
                        API.sendChat('/me Apenas Moderadores/Adms podem perguntar quem deu votacao negativa e/ou porque');
                        break;
                    case '18':
                        API.sendChat('/me Representando outros artistas, usuários, etc, podem resultar em ser chutado');
                        break;
                    case '19':
                        API.sendChat('/me Se você usar o AutoJoin, seja responsavel quando alguem @mencionar o seu nome ou voce vai correr o risco de ser kickado');
                        break;
                    case '20':
                        API.sendChat('/me Usar contas múltiplas para entrar na lista ou tocar musica não é permitido');
                        break;
                    case '21':
                        API.sendChat('/me Não faça spam com emoticons');
                        break;
                    case '22':
                        API.sendChat('/me Não fique mendigando fans');
                        break;
                    case '23':
                        API.sendChat('/me Songs such as Nigel, Pingas, etc. are subject to being skipped on any day but Sunday. !weird for full list');
                        break;
                    case '24':
                        API.sendChat('/me Se você tem alguma queixa contra algum dos adms da sala, não fique argumentando no chat, apenas chame um dos Managers, Ou Co-Host/Host)');
                        break;
                    case '25':
                        API.sendChat('/me Não use nomes longos ou ofensivos');
                        break;
                    case '26':
                        API.sendChat('/me Divirtam-se na sala !');
                        break;
                    case '34':
                        API.sendChat('/me hu3 hu3 hu3');
                        break;
                    case '99':
                        API.sendChat('/me Just no..');
                        break;
                    default:
                        API.sendChat('/me Regra desconhecida!');
                        break;
                }
            }
        }
    });

    API.on(API.CHAT, function(data){
        var msg = data.message, fromID = data.fromID;
        command = msg.substring(1).split(' ');
        if(typeof command[3] != "undefined"){
            for(var i = 3; i<command.length; i++){
                command[2] = command[2] + ' ' + command[i];
            }
        }
        if(API.getUser(data.fromID).permission > 1){
            switch(command[0]){
                case 'add listadebanidos':
                    if(command[1].length === 13 && command[1].indexOf(':') === 1 && command[1].indexOf(1) === 0){
                        ruleSkip[command[1]] = {id: command[1], rule: command[2]};
                        $.getJSON("http://gdata.youtube.com/feeds/api/videos/"+command[1].substring(2)+"?v=2&alt=jsonc&callback=?", function(json){
                            setTimeout(function(){
                                if(typeof json.data.title !== 'undefined'){
                                    API.sendChat(json.data.title+' added to ruleskip');
                                }else{
                                    API.sendChat('Added to ruleskip');
                                }
                            }, 500)
                        });
                    }else if(command[1].length === 10 && command[1].indexOf(':') === 1 && command[1].indexOf(2) === 0){
                        ruleSkip[command[1]] = {id: command[1], rule: command[2]};
                        SC.get('/tracks', {ids: command[1].substring(2)}, function(tracks) {
                            if(typeof tracks[0].title !== 'undefined'){
                                API.sendChat(tracks[0].title+' added to ruleskip');
                            }else{
                                API.sendChat('Added to ruleskip');
                            }
                        });
                    }else if(typeof ruleSkip[API.getMedia().id] === 'undefined'){
                    ruleSkip[API.getMedia().id] = {id: API.getMedia().id, rule: command[1]};
                    API.sendChat(API.getMedia().author+ ' - ' +API.getMedia().title+' added to ruleskip');
                    API.moderateForceSkip();
                }
                    botMethods.save();
                    break;
                case 'checkruleskip':
                    if(typeof command[1] !== 'undefined'){
                        if(typeof ruleSkip[command[1]] !== 'undefined') API.sendChat(command[1]+' is in the ruleskip array!');
                        else API.sendChat(command[1]+' is not in the ruleskip array!');
                    }else{
                        if(typeof ruleSkip[API.getMedia().id] !== 'undefined') API.sendChat(API.getMedia().id+' is in the ruleskip array')
                        else API.sendChat(API.getMedia().id+' is not in the ruleskip array');
                    }
                    break;
                case 'checarbanido':
                    if(typeof command[1] !== 'undefined'){
                        if(typeof ruleSkip[command[1]] !== 'undefined') API.sendChat(command[1]+' está na lista de banidos!');
                        else API.sendChat(command[1]+' não está na lista de banidos!');
                    }else{
                        if(typeof ruleSkip[API.getMedia().id] !== 'undefined') API.sendChat(API.getMedia().id+' está na lista de banidos!')
                        else API.sendChat(API.getMedia().id+' não está na lista de banidos!');
                    }
                    break;
                case 'removerbanido':
                    if(typeof command[1] !== 'undefined' && typeof ruleSkip[command[1]] !== 'undefined'){
                        delete ruleSkip[command[1]];
                        API.sendChat(command[1]+' removido da lista de banidos');
                    }else if(typeof command[1] === 'undefined' && typeof ruleSkip[API.getMedia().id] !== 'undefined'){
                        delete ruleSkip[API.getMedia().id];
                        API.sendChat(API.getMedia().id+' removido da lista de banidos');
                    }else if(typeof command[1] !== 'undefined'){
                        API.sendChat(command[1]+' não estava na lista de banidos!');
                    }else{
                        API.sendChat(API.getMedia().id+' não estava na lista de banidos!');
                    }
                    botMethods.save()
                break;
            }
        }
    });

    API.on(API.CHAT, function(data){
        msg = data.message.toLowerCase(), chatID = data.chatID;

        for(var i = 0; i < mubBot.filters.swearWords.length; i++){
            if(msg.indexOf(mubBot.filters.swearWords[i].toLowerCase()) > -1 && mubBot.settings.swearFilter){
                API.moderateDeleteChat(chatID);
            }
        }
        for(var i = 0; i < mubBot.filters.racistWords.length; i++){
            if(msg.indexOf(mubBot.filters.racistWords[i].toLowerCase()) > -1 && mubBot.settings.racismFilter){
                API.moderateDeleteChat(chatID);
            }
        }
        for(var i = 0; i < mubBot.filters.beggerWords.length; i++){
            if(msg.indexOf(mubBot.filters.beggerWords[i].toLowerCase()) > -1 && mubBot.settings.beggerFilter){
                API.moderateDeleteChat(chatID);
            }
        }

    });

    API.on(API.CHAT, function(data){
        msg = data.message.toLowerCase(), chatID = data.chatID, fromID = data.fromID;
        if(mubBot.misc.ready || mubBot.admins.indexOf(fromID) > -1 ||API.getUser(fromID).permission > 1){
            if(msg.indexOf(':eyeroll:') > -1){
                API.sendChat('/me ¬_¬');
                if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                    mubBot.misc.ready = false;
                    setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                }
            }
            if(msg.indexOf(':notamused:') > -1){
                API.sendChat('/me ಠ_ಠ');
                if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                    mubBot.misc.ready = false;
                    setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                }
            }
            if(msg.indexOf(':yuno:') > -1){
                API.sendChat('/me ლ(ಥ益ಥლ');
                if(mubBot.admins.indexOf(fromID) == -1 || API.getUser(fromID).permission < 2){
                    mubBot.misc.ready = false;
                    setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
                }
            }
        }

    });

    API.on(API.DJ_ADVANCE, DJ_ADVANCE);
    function DJ_ADVANCE(data){
        if(mubBot.settings.ruleSkip && typeof ruleSkip[data.media.id] != "undefined"){
            switch(ruleSkip[data.media.id].rule){
                case '1':
                    API.sendChat('@'+data.dj.username+' Only Brony/My Little Pony related music and PMV’s can be played in this room');
                    botMethods.skip();
                    break;
                case '2':
                    API.sendChat('@'+data.dj.username+' All non-pony PMV’s are subject to being skipped if they are just pictures or simple loops');
                    botMethods.skip();
                    break;
                case '3':
                    API.sendChat('@'+data.dj.username+' Mashups/mixes/loops with little to no effort are subject to being skipped');
                    botMethods.skip();
                    break;
                case '13':
                    API.sendChat('@'+data.dj.username+' No R34/clop/porn/gore. This includes links, songs, and chat. (If you want to post this stuff anywhere, talk to a moderator about being added to the Skype group, you can post it there with proper tags [NSFW/NSFL])');
                    botMethods.skip();
                    break;
                case '14':
                    API.sendChat('@'+data.dj.username+' No playing episodes/non-music shorts unless you’re the (co)host or were giving permission to play a episode/non-music short by a (co)host');
                    botMethods.skip();
                    break;
                case '99':
                    API.sendChat('@'+data.dj.username+' Just no..');
                    botMethods.skip();
                    break;
                default:
                    API.sendChat('@'+data.dj.username+' '+ruleSkip[data.media.id].rule);
                    botMethods.skip();
                    break;
            }
        }
        $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+data.media.cid+'?v=2&alt=jsonc&callback=?', function(json){response = json.data});
        setTimeout(function(){
            if(typeof response === 'undefined' && data.media.format != 2 && mubBot.settings.removedFilter){
                API.sendChat('/me Este video poderá estar indisponivel!!');
                botMethods.skip();
            }
        }, 1500);

        cancel = false;
    }


    botMethods.loadStorage();
    console.log("Iniciando mubBot-PT User Shell version " + mubBot.misc.version);

    setTimeout(function(){
        $.getScript('http://connect.soundcloud.com/sdk.js');
    }, 1000);

    setTimeout(function(){
        SC.initialize({
            client_id: 'eae62c8e7a30564e9831b9e43f1d484a'
        });
    }, 3000);
    
    //really fast autorefresh
    console.log = function(data){if (data === 'sio disconnect') location.reload();}


