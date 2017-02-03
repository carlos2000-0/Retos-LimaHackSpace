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

$(document).ready(
  function(){
    definirWorkerID();
  }
);

function definirWorkerID(){
  $('#id').val(parseInt(Math.random() * 10000000))
}

var url = new Array();

$('#image').on('change',
  function(evt){
    var file = evt.target.files[0];
    var metadata = {
      'contentType' : file.type
    };
    var userId = document.getElementById('id').value;
    var uploadTask = storage.ref().child(userId + '/' + file.name).put(file,metadata);
    uploadTask.on('state_changed', null,
      function(error){
        console.log(error);
      },
      function(){
        url.push(uploadTask.snapshot.metadata.downloadURLs[0]);
      });
  }
);

$('#sign').submit(
  function(evt){
    var worker = new Object();
    $('form').serializeArray().forEach(
      function(currentValue, index){
        worker[currentValue.name] = currentValue.value;
      }
    );
    existsMail(worker);
    document.getElementById("sign").reset()
    evt.preventDefault();
  }
);

function registerInform(worker){
  var messageText = new Object();
  messageText['id'] = parseInt(Math.random()*10000000);
  messageText['imagen'] = "https://firebasestorage.googleapis.com/v0/b/zero-demo-d5884.appspot.com/o/2848652%2Fchicken.png?alt=media&token=3d088ac1-19fe-40b5-a38b-859133e1ec34";
  messageText['mensaje'] = "El usuario " + worker.nombre + " se acaba de regitrar, denle su bienvenida";
  messageText['usuarioid'] = "2848652";
  messageText['nombreid'] = "Admin";
  database.ref("chat/messages/" + messageText.id).set(messageText);
  console.log(messageText);
}

function existsMail (worker){
  var emailState = false;
  database.ref("chat/users").once('value',
    function(snapshot){
      snapshot.forEach(
        function(currentValue){
          if(worker.email == currentValue.val().email){
            emailState = true;
          }
        }
      );
      if(emailState){
        message = "El correo ya se encuentra registrado";
      }
      else {
        storeWorker(worker);
        message = "Usuario registrado";
        registerInform(worker);
      }
      alert(message);
    });
}

function storeWorker(worker){
  worker.imagen = url[0];
  database.ref('chat/users/' + worker.nombre).set(worker);
}
