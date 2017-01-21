var config = {
    apiKey: "AIzaSyA8t9jkEtOm0WSBXR8VB-VHC4nXAw2aepo",
    authDomain: "zero-demo-d5884.firebaseapp.com",
    databaseURL: "https://zero-demo-d5884.firebaseio.com",
    storageBucket: "zero-demo-d5884.appspot.com",
  };
firebase.initializeApp(config);

//Para modificar la hora de entrada en horas (0 - 24h)

var hhentrada = 7;

//Para modificar la hora de entrada en minutos (0 - 60min)
var mmentrada = 30;

//-----------------------------------------------------

function loadAutoComplete(data){
  $("#tags").autocomplete(
    {
      source : data,
    });
}

function getElements(substring){
  var val = substring;
  var i = 0;
  var names = [];
  firebase.database().ref('asistencia/').on('value', function(snapshot){
    for(key in snapshot.val()){
      if(key.indexOf(val) > -1){
        if(i < 5){
          names.push(key);
          i++;
        }
      }
    }
    loadAutoComplete(names);
  });
}

function loadInf(data){
  firebase.database().ref('asistencia/' + data + '/llegada').on('value', function(snapshot){
    const hour = document.getElementById('hour');
    const min = document.getElementById('min');

    hour.innerHTML = "Hora: "+ snapshot.val().hora;
    min.innerHTML = "Minuto: "+snapshot.val().minuto;
  });
  firebase.database().ref('asistencia/' + data).on('value', function(snapshot){
    const sms = document.getElementById('message');
    sms.innerHTML = "Mensaje: "+snapshot.val().mensaje;
  });
}

function storeData(data, hh, mm){
  var now = new Date(),
      hhe = parseInt(now.getHours()),
      mme = parseInt(now.getMinutes());

  var diftime = (60*hhe + mme) - (60*hh + mm);


  if(diftime < 0){
    firebase.database().ref('asistencia/' + data).set({
      mensaje:"Has madrugado, te mereces un premio"
    });
  }else{
    if(diftime > 15){
      firebase.database().ref('asistencia/' + data).set({
        mensaje:"Has llegado tarde"
      });
    }else{
      firebase.database().ref('asistencia/' + data).set({
        mensaje:"Llegaste a la hora"
      });
    }
  }

  firebase.database().ref('asistencia/' + data + '/llegada').set({
    hora:hhe,
    minuto:mme
  });
  firebase.database().ref('asistencia/' + data + '/entrada').set({
    hora:hh,
    minuto:mm
  });
}

function main(hh, mm){
  $('#reg').on('keyup', function(a){
    if(a.which == 13){
      storeData($(this).val(), hh, mm);
      const list = document.getElementById('list')
      list.innerHTML = "Registro completo"
    }
  });

  $('#tags').on('keyup', function(e){
    if(e.which == 13){
      loadInf($(this).val());
    }else{
      getElements($(this).val());
    }
  });
}

$(document).ready(main(hhentrada, mmentrada));
