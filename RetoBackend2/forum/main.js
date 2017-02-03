var config = {
  apiKey: "AIzaSyA8t9jkEtOm0WSBXR8VB-VHC4nXAw2aepo",
  authDomain: "zero-demo-d5884.firebaseapp.com",
  databaseURL: "https://zero-demo-d5884.firebaseio.com",
  storageBucket: "zero-demo-d5884.appspot.com",
  messagingSenderId: "653892241154"
};
firebase.initializeApp(config);

var storage = firebase.storage();
var database = firebase.database();

var horaEntrada = 7 //Desde 0 al 24 horas - modificar
var minEntrada = 30 //Desde 0 al 59 min - modificar

var userId = new Object();
var messageText = new Object();
var updateMessage = false;

$(document).ready(
    function(){
      $('#myModal').modal()
      updateWindow();
    }
);

function updateWindow(){
  database.ref("chat/messages/").on('child_added',
    function(data){
        addForeignText(data.val());
    });
}

function addForeignText(data){
  if(userId.id != data.usuarioid){
    var $template = $('.template').clone();
    $template.children('div').children('img').attr('src', data.imagen);
    $template.children('div').children('div').children('.chat-message-content').append('<p>'+ data.mensaje + '</p>');
    $template.children('div').children('div').children('.chat-details').append(data.nombreid);
    $template.children('div').addClass('chat-message-recipient');
    $('.chat-wrapper>.chat-message').append($template.html());
  }
}

$('#log').submit(
  function(evt){
    var worker = new Object();
    $('#log').serializeArray().forEach(
      function(currentValue, index){
        worker[currentValue.name] = currentValue.value;
      }
    );
    existsLogin(worker);
    evt.preventDefault();
  }
)

function existsLogin(worker){
  var existEmail = false;
  var existPass = false;
  database.ref("chat/users").once('value',
    function(snapshot){
      snapshot.forEach(
        function(currentValue){
          if(worker.email == currentValue.val().email){
            existEmail = true;
            if(worker.password == currentValue.val().password){
              existPass = true;
              userId = currentValue.val();
            }
          }
        }
      );
      if(existEmail){
        if(existPass){
          alert('Te has logeado con exito');
          $('#myModal').modal('hide')
          assistenceSystem(updateMessage, userId);
          updateMessage = true;
          console.log(userId)
        } else{
          alert('Contraseña incorrecta');
        }
      } else{
        alert('Correo inexistente');
      }
    });
}

function assistenceSystem(updateMessage, userId) {
  if(updateMessage == false){
    var now = new Date(),
        horaNow = parseInt(now.getHours()),
        minNow = parseInt(now.getMinutes());

    var diftime = (60*horaNow + minNow) - (60*horaEntrada + minEntrada);
    var textAdmin = new String();

    if(diftime < 0){
      textAdmin = "Has madrugado, te mereces un premio";
    }else{
      if(diftime > 15){
        textAdmin = "Muy mal " + userId.nombre +" has llegado " + (diftime - 15) + " minutos tarde";
      }else{
        textAdmin = "Llegaste a la hora";
      }
    }
    var dataAdmin = new Object();
    dataAdmin['id'] = parseInt(Math.random()*10000000);
    dataAdmin['imagen'] = "https://firebasestorage.googleapis.com/v0/b/zero-demo-d5884.appspot.com/o/2848652%2Fchicken.png?alt=media&token=3d088ac1-19fe-40b5-a38b-859133e1ec34";
    dataAdmin['mensaje'] = textAdmin;
    dataAdmin['usuarioid'] = "2848652";
    dataAdmin['nombreid'] = "Admin";
    database.ref("chat/asistance/" + dataAdmin.id).set({
      id: userId.nombre,
      idUsuario: userId.id
    });
    database.ref("chat/asistance/" + dataAdmin.id + "/llegada").set({
      hora: horaNow,
      minuto: minNow
    });
    database.ref("chat/asistance/" + dataAdmin.id + "/entrada").set({
      hora: horaEntrada,
      minuto: minEntrada
    });
    addForeignText(dataAdmin);
  }
}

$('#message').on('keypress',
  function(evt){
    if(updateMessage){
      if(evt.which == 13){
        evt.preventDefault();
        messageText['id'] = definirMessageId();
        messageText['usuarioid'] = userId.id;
        messageText['imagen'] = userId.imagen;
        messageText['mensaje'] = $(this).val();
        messageText['nombreid'] = userId.nombre;
        console.log(messageText)
        updateChat(messageText);
      }
    }
  }
);

function definirMessageId(){
  return parseInt(Math.random()*10000000);
}

function updateChat(messageText){
  addMineText(userId.nombre, messageText.mensaje, messageText.imagen);
  database.ref("chat/messages/" + messageText.id).set(messageText);
  mensaje = new Object();
}

function addMineText(name, text, imageSource){
  var $template = $('.template').clone();
  $template.children('div').children('img').attr('src', imageSource);
  $template.children('div').children('div').children('.chat-message-content').append('<p>'+ text + '</p>');
  $template.children('div').children('div').children('.chat-details').append(name);
  $template.children('div').addClass('chat-message-sender');
  $('.chat-wrapper>.chat-message').append($template.html());
}
