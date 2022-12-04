const loginBtn = document.getElementById("login-btn");

function getCookie(name) {
  let cookieValue = null;
  console.log(document.cookie);
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

if (loginBtn) {
  loginBtn.addEventListener("click", login);
}

function login() {
  const username = document.getElementById("inputUsername").value;
  const password = document.getElementById("inputPassword").value;

  const data = JSON.stringify({ password: password, username: username });
  const url = "http://127.0.0.1:8000/login/";
  fetch(url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    body: data,
    method: "POST",
  })
    .then((jresp) => jresp.json())
    .then((resp) => {
      show_message(resp, "login-error");
    })
    .catch((error) => {
      console.log(error);
    });
}

function show_message(resp, id) {
  if (resp["error-key"]) {
    document.getElementById(resp["error-key"]).classList.add("input-error");
  }
  if (resp["error"]) {
    document.getElementById(id).textContent = resp["message"];
  } else {
    if (resp["success_url"]) {
      window.location = resp["success_url"];
    }
  }
}
