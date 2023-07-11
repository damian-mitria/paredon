import { saveTask, getTasks, saveMeGusta, saveNOMeGusta, auth, saveSetMeGusta, saveSetNoMeGusta, getArrayMeGustaFirebase, getArrayNoMeGustaFirebase } from './firebase.js'

const setDeIdsDeLosLadrillos = new Set();

$(async () => {

    const querySnapShots = await getTasks();
    $("#spinner").hide();
    querySnapShots.forEach(doc => {
        let objeto = doc.data();
        $(`<div id='${doc.id}' class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${objeto.nombre}</p><p class='contenido-texto'>${objeto.texto}</p><div class='stickerLike'><span class="material-icons-round likeYDislikeBlanco">favorite</span><div class='sticker'>${objeto.contadorMeGusta}</div></div><div class='stickerDislike'><span class='material-icons-round likeYDislikeBlanco'>thumb_down</span><div class='sticker2'>${objeto.contadorNOMeGusta}</div></div><p class='contenido-texto'>${objeto.texto}</p></div>`)
        
            .prependTo("#pared")
            .on('click', function (event) {
                $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                $("#divFecha").text(objeto.fecha);
                $("#divId").text(doc.id);
                $("#divIdNoMeGusta").text(doc.id);
            });
        $(".contenido-texto").hide();
        $("#divId").hide();
        $("#divIdNoMeGusta").hide();
        setDeIdsDeLosLadrillos.add(doc.id);
        if (!auth) {
        } else {
            // ocultarStickerMeGusta();
            ocultaBotonMeGusta();
            ocultaBotonNoMeGusta();
        }
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
        let contadorNOMeGusta = 0;


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

                let id = await saveTask(nombre, texto, fecha, d, contadorMeGusta, contadorNOMeGusta); //guardo todos los datos para el firebase

                $(`<div id='${id}' class='ladrillo' data-bs-toggle='modal' data-bs-target='#myModal'><p class='contenido-nombre'>${nombre}</p><p class='contenido-texto'>${texto}</p><div class='stickerLike'><span class="material-icons-round likeYDislikeBlanco">favorite</span><div class='sticker'>${contadorMeGusta}</div></div><div class='stickerDislike'><span class='material-icons-round likeYDislikeBlanco'>thumb_down</span><div class='sticker2'>${contadorNOMeGusta}</div></div>`)
                    .prependTo("#pared")
                    .on('click', function (event) {
                        $("#modalTitle").text($(event.currentTarget).children(".contenido-nombre").get(0).innerHTML);
                        $("#divMensaje").text($(event.currentTarget).children(".contenido-texto").get(0).innerHTML);
                        $("#divFecha").text(fecha);
                        $("#divId").text(id);
                        $("#divIdNoMeGusta").text(id);
                    });
                $(".contenido-texto").hide();
                $("#nombre").val(""); //reseteo los input
                $("#texto").val("");
                setDeIdsDeLosLadrillos
                    .add(id); // agrego id al set
                if (!auth) {
                    ocultaBotonMeGusta();
                    ocultaBotonNoMeGusta();
                } else {
                    // ocultarStickerMeGusta();
                }
        
            }
        }
    });

    //click boton me gusta
    $("#boton-meGusta").on('click', async function (event) {
        var id = $(event.currentTarget).children("#divId").get(0).innerHTML; // obtengo el id de cada ladrillo

        let likeUnicos = id + auth.currentUser.uid; //guardo id del ladrillo mas id del usuario concatenado

        const arrayDeMeGusta = await getArrayMeGustaFirebase();

        arrayDeMeGusta.forEach(async doc => {
            let objeto = doc.data();
            let array = Array.from(objeto.arrayMeGusta); // Crea un nuevo array a partir de otro (o de un objeto iterable)

            if (array.includes(likeUnicos)) {
                alert("Solamente puede darle like una vez a cada ladrillo.")
            } else {
                let contador = await saveMeGusta(id);
                $(`#${id}`).children(".stickerLike").children(".sticker").get(0).innerHTML = contador;  // llego al div del sticker a traves del id del ladrillo
                saveSetMeGusta(likeUnicos);
            }
        });
    });


    // Click boton NO me gusta
    $("#boton-NoMeGusta").on('click', async function (event) {
        var id = $(event.currentTarget).children("#divIdNoMeGusta").get(0).innerHTML; // obtengo el id de cada ladrillo

        let likeUnicos = id + auth.currentUser.uid; //guardo id del ladrillo mas id del usuario concatenado

        const arrayDeNoMeGusta = await getArrayNoMeGustaFirebase();

        arrayDeNoMeGusta.forEach(async doc => {
            let objeto = doc.data();
            let array = Array.from(objeto.arrayNoMeGusta); // Crea un nuevo array a partir de otro (o de un objeto iterable)

            if (array.includes(likeUnicos)) {
                alert("Solamente puede darle like una vez a cada ladrillo.")
            } else {
                let contador = await saveNOMeGusta(id);
                $(`#${id}`).children(".stickerDislike").children(".sticker2").get(0).innerHTML = contador;  // llego al div del sticker a traves del id del ladrillo
                saveSetNoMeGusta(likeUnicos);
            }
        });
    });
});

function contarLadrillos() {
    let contadorDeLadrillos = document.getElementsByClassName("contenido-nombre").length;
    $("#contadorDeLadrillos").empty();
    $("#contadorDeLadrillos").append(`<p class='letraBlanca'>La cantidad de ladrillos por el momento es: ${contadorDeLadrillos}</p>`);
}

function ocultarStickerMeGusta() {
    for (let actual of setDeIdsDeLosLadrillos
    ) { // oculto los stickers de los me gusta
        $(`#${actual}`).children(".sticker").hide();
    }
}

function ocultaBotonMeGusta() {
    for (let actual of setDeIdsDeLosLadrillos
    ) { // oculto los stickers de los me gusta
        if ($(actual === $("#divId").val())) {
            $("#boton-meGusta").hide();
            //console.log("aca estoy")
        };
    }
}

function ocultaBotonNoMeGusta() {
    for (let actual of setDeIdsDeLosLadrillos
    ) { // oculto los stickers de los me gusta
        if ($(actual === $("#divId").val())) {
            $("#boton-NoMeGusta").hide();
            //console.log("aca estoy")
        };
    }
}

// Efecto matrix
/*
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

canvas.width = document.body.offsetWidth;

const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);

const cols = Math.floor(w/20)+1;
const posicion_y = Array(cols).fill(0);

function matrix() {
    ctx.fillStyle = '#0001';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#0f0';
    ctx.font = '12pt monospace';

    posicion_y.forEach((y , ind) => {
        const text = String.fromCharCode(Math.random()*128);
        const x = ind*20;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000){
            posicion_y[ind] = 0;
        } else{
            posicion_y[ind] = y + 20;
        }
    });
};

setInterval(matrix, 50);
*/


export default setDeIdsDeLosLadrillos; 
