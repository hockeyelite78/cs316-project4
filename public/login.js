// login page - check the account list, and remember the username if the box is checked

const usernameBox = document.getElementById("username");
const passwordBox = document.getElementById("password");
const remember = document.getElementById("remember");

// put back the checkbox and username from last time
if (localStorage.getItem("remember") === "yes") {
   remember.checked = true;
   usernameBox.value = localStorage.getItem("savedUsername");
}

// save the checkbox state whenever it changes
remember.addEventListener("change", function() {
   if (remember.checked) {
      localStorage.setItem("remember", "yes");
   } else {
      localStorage.removeItem("remember");
      localStorage.removeItem("savedUsername");
   }
});

document.getElementById("loginButton").addEventListener("click", function() {
   if (remember.checked) {
      localStorage.setItem("savedUsername", usernameBox.value);
   }

   fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameBox.value, password: passwordBox.value })
   })
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
      if (data.ok) {
         // remember which account is logged in, then go to the form
         localStorage.setItem("accountId", data.id);
         window.location.href = "form.html";
      } else {
         alert("Login information is incorrect.");
      }
   });
});

document.getElementById("createButton").addEventListener("click", function() {
   window.location.href = "new-account.html";
});
