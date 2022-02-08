import { saveTask, getTasks, saveMeGusta } from './firebase.js'

$(async () => {

    const querySnapShots = await getTasks();
    $("#spinner").hide();
    querySnapShots.forEach(doc => {
        let objeto = doc.data();
        $(`<div id='${doc.id}' class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${objeto.nombre}</p><p class='contenido-texto'>${objeto.texto}</p><div class='sticker'>${objeto.contadorMeGusta}</div><p class='contenido-texto'>${objeto.texto}</p></div>`)
            .prependTo("#pared")
            .on('click', function (event) {
                $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                $("#divFecha").text(objeto.fecha);
                $("#divId").text(doc.id);
            });
        $(".contenido-texto").hide();
        $("#divId").hide();
    });

    contarLadrillos();

});

$(function () {

    $("#boton-enviar").on('click', async function () {
        /*obtengo datos del html*/
        let nombre = $("#nombre").val();
        let texto = $("#texto").val();
        let d = new Date();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let fecha = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        let contadorMeGusta = 0;

        $("#mensaje-nombre").empty();
        $("#mensaje-texto").empty();
        $("#nombre, #texto").removeClass("error");

        if (nombre === "") {
            $("#nombre").addClass("error");
            $("#mensaje-nombre").append("<p>El nombre es obligatorio</p>");
        }

        if (texto === "") {
            $("#texto").addClass("error");
            $("#mensaje-texto").append("<p>El texto es obligatorio</p>");
            if (nombre.length >= 12) {
                $("#mensaje-nombre").append("<p>El nombre no puede tener más de 11 caracteres</p>");
                $("#nombre").addClass("error");
            }
        }

        if (nombre !== "" && texto !== "") {
            if (nombre.length >= 12) {
                $("#mensaje-nombre").append("<p>El nombre no puede tener mas de 11 caracteres</p>");
                $("#nombre").addClass("error");

            } else {

                let id = await saveTask(nombre, texto, fecha, d, contadorMeGusta); //guardo todos los datos para el firebase

                $(`<div id='${id}' class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p><div class='sticker'>${contadorMeGusta}</div></div>`)
                    .prependTo("#pared")
                    .on('click', function (event) {
                        $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                        $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                        $("#divFecha").text(fecha); 
                        $("#divId").text(id);                 
                    });
                $(".contenido-texto").hide();
                $("#nombre").val(""); //reseteo los input
                $("#texto").val("");
                
                contarLadrillos();
            }
        }
    });

    $("#boton-meGusta").on('click', async function (event) {
        var id = $(event.currentTarget).children("#divId").get(0).innerHTML;
       //console.log(id);
       //console.log($("#divId").val());
        let contador = await saveMeGusta(id);
        console.log(`#${id}`);
        console.log($(`#${id}`).children(".sticker").get(0));
        $(`#${id}`).children(".sticker").get(0)
        $(`#${id}`).children(".sticker").get(0).innerHTML = contador;

    });

   
  

    /*const singupForm = document.querySelector("#singup-form");
    singupForm.addEventListener('submit', (e) =>{
        e.preventDefault();

        const email = document.querySelector("#singup-email").value;
        const password = document.querySelector("#singup-password").value;

        
        console.log(email,password);
    });*/

});

function contarLadrillos() {
    let contadorDeLadrillos = document.getElementsByClassName("contenido-nombre").length;
    $("#contadorDeLadrillos").empty();
    $("#contadorDeLadrillos").append(`<p>La cantidad de ladrillos por el momento es: ${contadorDeLadrillos}</p>`);
}

