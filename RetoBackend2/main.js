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
            }
          }
        }
      );
      if(existEmail){
        if(existPass){
          alert('Te has logeado con exito');
        } else{
          alert('Contraseña incorrecta');
        }
      } else{
        alert('Correo inexistente');
      }
    });
}
