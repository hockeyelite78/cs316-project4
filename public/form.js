// form page - load the old answers, and save new ones to the logged in account

const accountId = localStorage.getItem("accountId");

// have to be logged in to use this page
if (!accountId) {
   window.location.href = "index.html";
}

// fill the form with the last answers, if there are any
fetch("/form-data?id=" + accountId)
   .then(function(response) {
      return response.json();
   })
   .then(function(form) {
      if (form) {
         document.getElementById("name").value = form.name;
         document.getElementById("age").value = form.age;
         document.getElementById("drink").value = form.drink;
         document.getElementById("comments").value = form.comments;

         let radios = document.getElementsByName("cups");
         for (let i = 0; i < radios.length; i++) {
            if (radios[i].value === form.cups) {
               radios[i].checked = true;
            }
         }
      }
   });

document.getElementById("surveyForm").addEventListener("submit", function(event) {
   event.preventDefault();

   // find which radio button is picked
   let cups = "";
   let radios = document.getElementsByName("cups");
   for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
         cups = radios[i].value;
      }
   }

   let form = {
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      drink: document.getElementById("drink").value,
      cups: cups,
      comments: document.getElementById("comments").value
   };

   fetch("/form-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: accountId, form: form })
   })
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
      document.getElementById("message").textContent = "Answers saved!";
   });
});
