import {saveTask, getTasks} from './firebase.js'

$(async() => {
    const querySnapShots = await getTasks();
    querySnapShots.forEach(doc => {
        let objeto = doc.data();
        $(`<div class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${objeto.nombre}</p><p class='contenido-texto'>${objeto.texto}</p></div>`)
        .appendTo("#pared")
        .on('click', function(event){
            $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
            $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
            $("#divFecha").text(objeto.fecha);  
        //alert(`Soy ${$(event.currentTarget).children(".contenido-nombre").get(0).innerHTML} y mi texto es: ${$(event.currentTarget).children(".contenido-texto").get(0).innerHTML} - ${output}`);
        });
        $(".contenido-texto").hide();
    });
    
});

$(function(){

    $("#boton-enviar").on('click', function(){
        /*obtengo datos del html*/
        let nombre = $("#nombre").val();
        let texto = $("#texto").val();
        let d = new Date();
        let month = d.getMonth()+1;
        let day = d.getDate();
        let fecha = (day<10 ? '0' : '') + day + '/' + (month<10 ? '0' : '') + month + '/' + d.getFullYear();

        


        $("#mensaje").empty();
        $("#nombre, #texto").removeClass("error");

        if(nombre===""){
            $("#nombre").addClass("error");
            $("#mensaje").append("<p>El nombre es obligatorio</p>");
        }

        if(texto==""){
            $("#texto").addClass("error");
            $("#mensaje").append("<p>El texto es obligatorio</p>");
            if(nombre.length >=12){
                $("#mensaje").append("<p>El nombre no puede tener mas de 11 caracteres</p>");
                $("#nombre").addClass("error");
            }
        }

        if(nombre!=="" && texto!==""){
            if(nombre.length >=12){
                $("#mensaje").append("<p>El nombre no puede tener mas de 11 caracteres</p>");
                $("#nombre").addClass("error");
       
            }else{
                $(`<div class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`)
                .appendTo("#pared")
                .on('click', function(event){
                    $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                    $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                    $("#divFecha").text(fecha);  
                //alert(`Soy ${$(event.currentTarget).children(".contenido-nombre").get(0).innerHTML} y mi texto es: ${$(event.currentTarget).children(".contenido-texto").get(0).innerHTML} - ${output}`);
                });
                $(".contenido-texto").hide();
                saveTask(nombre, texto, fecha); //guardo todos los datos para el firebase
                  //reseteo los input
                  // $("#nombre").val("");
                  // $("#texto").val("");
                }
                
                
    
              
        }

        
      

    });
});





/*
        if(nombre!=="" && texto!==""){
            const algo = $(`<div class='ladrillo'></div>`)
            .appendTo("#pared")
            .on('click', function(event){
                console.log($(event.currentTarget));
            });
            $(`<p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p>`)
            .appendTo(algo)
            algo.on('click', function(){
                console.log(`hola soy ${nombre} y digo ${texto}`);
            });;
            $(".contenido-texto").hide();
           
        }
*/

             
/* anterior
         $("#boton-enviar").on('click', function(){
        let nombre = $("#nombre").val();
        let texto = $("#texto").val();
        $("#mensaje").empty();
        $("#nombre, #texto").removeClass("error");
        if(nombre===""){
            $("#nombre").addClass("error");
            $("#mensaje").append("<p>El campo nombre es obligatorio</p>");
        }

        if(texto==""){
            $("#texto").addClass("error");
            $("#mensaje").append("<p>El texto nombre es obligatorio</p>");
        }

        if(nombre!=="" && texto!==""){
            $("#pared").append((`<div class='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`));
            $("#pared").children().last().on('click', function(event){
                console.log($(event.currentTarget));
            });
            $(".contenido-texto").hide();
           
        }
        
       */ 

    

 
 /*   $("#pared").on('click', function(event){
       //$(event.target).addClass("hover");
    
        alert(`Hola soy ${event.target.innerHTML} ${event.target.lastChild}`);
        //$(".contenido-texto").show(); 
    });

    $("#pared").on('dblclick',function(event){
        $(event.target).removeClass("hover");
        //console.log(event.target);
        //$(".contenido-texto").hide(); 
    }); */





/*
    $("#ladrillo").on('click',function(){
        var nombre = $("#nombre").val();
        alert(`Hola soy ${nombre}`);   INTENTE PONER LOS DATOS EN UN ALERT PERO ME PASA LO MISMO QUE NO PUEDO IDENTIFICAR A LOS LADRILLON
    });
*/



/*
function validar(e){
    let error=false;
    $("#mensaje").empty();
    $("#formulario, #nombre, #texto").removelass();
    let nombre = $("#nombre").val();
    let texto = $("#texto").val();
    
    if(nombre==""){
        error=true;
        $("#mensaje").append("<p>El campo nombre es obligatorio</p>");
        $("#nombre").addClass("error");
    }
    if(texto==""){
        error=true;
        $("#mensaje").append("<p>El campo texto es obligatorio</p>");
        $("#texto").addClass("error");
    }
    
    if(error){
        e.preventDefault();
    }else{
        $("#mensaje").empty();
        $("#formulario, #nombre, #texto").removeClass();
        /*$("#ladrillo").append(document.createElement('p'));
        $("p").append("<p class='ladrillito'>"+nombre+"a</p>");
        */
       /*
        $("#ladrillo").append(`<div class='ladrillon'><p class='ladrillito'>${nombre}</p><p class='ladrillito'>${texto}</p></div>`);
    }
}

/*else{
    $("#mensaje").empty();
    $("#formulario, #nombre, #texto").removeClass();
    $("#ladrillo").append("<p>"+nombre+"a</p>");
}*/




/*
FORMA DE PARED MUY CASERA
if(nombre!=""){
            if(contador<=13){
                $("#p1").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide();  
                contador++;
            }else if(contador <=25){
                $("#p2").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide(); 
                contador++;
            }
            else if(contador <=38){
                $("#p3").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide(); 
                contador++;
            }
            else if(contador <=50){
                $("#p4").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide(); 
                contador++;
            }
            else if(contador <=63){
                $("#p5").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide(); 
                contador++;
            }
            else if(contador <=75){
                $("#p6").append(`<div class='ladrillo' id='ladrillo'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p></div>`);
                $(".contenido-texto").hide(); 
                contador++;
            }
            
        }

*/