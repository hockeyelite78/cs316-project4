// records page - drop-down of every account id, and a table of the picked account's answers

const idSelect = document.getElementById("idSelect");
const dataTable = document.getElementById("dataTable");

// fill the drop-down with every id
fetch("/ids")
   .then(function(response) {
      return response.json();
   })
   .then(function(ids) {
      for (let i = 0; i < ids.length; i++) {
         let option = document.createElement("option");
         option.value = ids[i];
         option.textContent = ids[i];
         idSelect.appendChild(option);
      }
   });

// show the table when an id is picked
idSelect.addEventListener("change", function() {
   dataTable.innerHTML = "";
   if (idSelect.value === "") {
      return;
   }

   fetch("/form-data?id=" + idSelect.value)
      .then(function(response) {
         return response.json();
      })
      .then(function(form) {
         if (!form) {
            dataTable.innerHTML = "<tr><td>This account has not filled out the form yet.</td></tr>";
            return;
         }

         let labels = ["Name", "Age", "Favorite drink", "Cups per day", "Comments"];
         let values = [form.name, form.age, form.drink, form.cups, form.comments];

         for (let i = 0; i < labels.length; i++) {
            let row = document.createElement("tr");
            let th = document.createElement("th");
            let td = document.createElement("td");
            th.textContent = labels[i];

            if (values[i] === "") {
               td.textContent = "(left empty)";
            } else {
               td.textContent = values[i];
            }

            row.appendChild(th);
            row.appendChild(td);
            dataTable.appendChild(row);
         }
      });
});
