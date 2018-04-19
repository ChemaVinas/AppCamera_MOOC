var app={

  inicio: function(){
    this.activar_fastClick();
    this.inicia_listeners();
    this.go_hammer();
  },

  activar_fastClick: function(){
    FastClick.attach(document.body);
  },

  inicia_listeners: function(){
    var boton_camara = document.querySelector('#boton-camara');
    boton_camara.addEventListener('click', function(){
      app.tomarFoto(Camera.PictureSourceType.CAMERA);
    });

    var boton_sepia = document.querySelector('#boton-sepia');
    boton_sepia.addEventListener('click', function(){
      app.filtrado('sepia');
    });

    var boton_negativo = document.querySelector('#boton-negativo');
    boton_negativo.addEventListener('click', function(){
      app.filtrado('negative');
    });

    var boton_byn = document.querySelector('#boton-byn');
    boton_byn.addEventListener('click', function(){
      app.filtrado('gray');
    });

    var boton_galeria = document.querySelector('#boton-galeria');
    boton_galeria.addEventListener('click', function(){
      app.tomarFoto(Camera.PictureSourceType.PHOTOLIBRARY);
    });
  },

  tomarFoto: function(source){
    var opciones_foto = {
      quality: 100,
      sourceType: source,
      destinationType: Camera.DestinationType.FILE_URI,
      targetWidth: 4032,
      targetHeight: 3024,
      correctOrientation: true,
      cameraDirection: 1
    };
    navigator.camera.getPicture(app.fotoCorrecta, app.error, opciones_foto);
  },

  fotoCorrecta: function(imageURI){
    /*var encuadre = document.querySelector('#encuadre');
    encuadre.src = imageURI;*/
    var img = document.createElement('img');
    img.onload = function(){
      app.pintarFoto(img);
    }
    img.src = imageURI;
  },

  pintarFoto: function(img){
    var canvas = document.querySelector('#encuadre');
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
  },

  error: function(mensaje){
    console.log('Error al tomar la foto: ' + mensaje);
  },

  filtrado: function(filtro){
    var canvas = document.querySelector('#encuadre');
    var context = canvas.getContext('2d');
    //Obtenemos la información de los píxeles de la imagen
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    //Asignamos el filtro de effects.js
    effects[filtro](imageData.data);
    //Volvemos a poner los datos de la imagen en el contexto
    context.putImageData(imageData, 0, 0);
  },

  go_hammer: function(){
    var encuadre = document.getElementById('encuadre');
    var hammertime = new Hammer(encuadre);

    hammertime.get('rotate').set({ enable: true });

    encuadre.addEventListener('webkitAnimationEnd', function(e){
      encuadre.className='';
    });

    hammertime.on('swipe', function(ev){
      if(ev.direction == 2) encuadre.className='swipe_izq';
      if(ev.direction == 4) encuadre.className='swipe_der';
    });

    hammertime.on('rotate', function(ev){
      if(ev.distance > 25) encuadre.className='rotate';
    });
  }

};

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    app.inicio();
  }, false);
}
