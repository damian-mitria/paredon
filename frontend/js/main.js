import {saveTask, getTasks} from './firebase.js'

$(async() => {
    const querySnapShots = await getTasks();
    $("#spinner").hide();
    querySnapShots.forEach(doc => {
        let objeto = doc.data();
        $(`<div class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${objeto.nombre}</p><p class='contenido-texto'>${objeto.texto}</p></div>`)
        .prependTo("#pared")
        .on('click', function(event){
            $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
            $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
            $("#divFecha").text(objeto.fecha);  
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
                .prependTo("#pared")
                .on('click', function(event){
                    $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                    $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                    $("#divFecha").text(fecha);  
                });
                $(".contenido-texto").hide();
                saveTask(nombre, texto, fecha); //guardo todos los datos para el firebase
               
                $("#nombre").val(""); //reseteo los input
                $("#texto").val("");
                }  
        }
    });
});