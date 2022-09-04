var http = require('http');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

xhr.open('GET', 'localhost:5000/api/name', true);
xhr.send();

xhr.onreadystatechange = function() { // (3)
    if (xhr.readyState != 4) return;
  
    button.innerHTML = 'Готово!';
  
    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      alert(xhr.responseText);
    }
  
  }
  
  button.innerHTML = 'Загружаю...'; // (2)
  button.disabled = true;