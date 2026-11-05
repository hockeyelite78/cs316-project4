// new account page - send the username and password to the server

document.getElementById("createButton").addEventListener("click", function() {
   let username = document.getElementById("username").value;
   let password = document.getElementById("password").value;

   if (username === "" || password === "") {
      alert("Please enter a username and a password.");
      return;
   }

   fetch("/new-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
   })
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
      document.getElementById("message").innerHTML =
         'Account created! <a href="index.html">Go to the login page</a>';
   });
});
