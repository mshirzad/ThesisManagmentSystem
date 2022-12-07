const mainTag = document.getElementById("main-tag");

const addBtn = document.getElementById("add-btn");
const m_form = document.getElementById("m_form");
const m_file = document.getElementById("m_file");
const source_code_file = document.getElementById("source_code_file");
const DBErrorAlertBox = document.getElementById("DBErrorAlertBox");
const errorAlertBox = document.getElementById("errorAlertBox");
const successAlertBox = document.getElementById("successAlertBox");
const warningBox = document.getElementById("warningBox");
const animationContainer = document.getElementById("animation-container");

const m_url = "http://127.0.0.1:8000/api/main/add-record/";
const s_url = "http://127.0.0.1:8000/api/main/add-student/";

function getCookie(name) {
  let cookieValue = null;
  //   console.log(document.cookie);
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

if (addBtn) {
  addBtn.addEventListener("click", addNewMonographRecord);
}

function loadingAnimation(status) {
  if (status == "show") {
    animationContainer.style.display = "flex";
    mainTag.style.display = "none";
  }
  if (status == "hide") {
    mainTag.style.display = "block";
    animationContainer.style.display = "none";
  }
}

function addNewMonographRecord() {
  console.log("ADD MONO Called");
  const rawData = Object.fromEntries(new FormData(m_form).entries());

  const m_formData = new FormData();
  const s_formData = new FormData();

  m_formData.append("year", rawData["year"]);
  m_formData.append("department", rawData["department"]);
  m_formData.append("monograph_title", rawData["m_title"]);
  m_formData.append("monograph_language", rawData["m_language"]);
  m_formData.append("monograph_file", m_file.files[0]);

  if (source_code_file.files.length != 0) {
    m_formData.append("source_code_files", source_code_file.files[0]);
  } else {
    // m_formData.append("source_code_files", null);
  }

  //   console.log(m_formData);
  //   console.log(rawData);
  loadingAnimation("show");
  fetch(m_url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    body: m_formData,
    method: "POST",
  })
    .then((response) =>
      response.json().then((data) => {
        // console.log(response.status);
        loadingAnimation("hide");
        if (response.ok) {
          // console.log(data);
          addNewStudent(data["m_id"], rawData, s_formData, "s1");
          if (rawData["s2_sID"] !== "") {
            addNewStudent(data["m_id"], rawData, s_formData, "s2");
            if (rawData["s3_sID"] !== "") {
              addNewStudent(data["m_id"], rawData, s_formData, "s3");
            }
          }
          console.log(data);
          const keys = Object.keys(data);
          console.log(keys);
          if (keys.includes("0target_file")) {
            showPartialPal(data);
          }
        }
        if (response.status == 400) {
          // console.log(response.status, data);
          loadingAnimation("hide");
          console.log(data);
          showError(data);
        } else {
          loadingAnimation("hide");
          // console.log(data);
        }
      })
    )
    .catch((error) => {
      loadingAnimation("hide");
      console.log(error);
    });
}

function addNewStudent(mID, rawData, s_formData, s_number) {
  s_formData.append("s_id", rawData[s_number + "_sID"]);
  s_formData.append("en_name", rawData[s_number + "_name"]);
  s_formData.append("en_father_name", rawData[s_number + "_father_name"]);
  s_formData.append("en_last_name", rawData[s_number + "_last_name"]);
  s_formData.append("monograph", mID);

  //   console.log(s_formData);
  fetch(s_url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    body: s_formData,
    method: "POST",
  })
    .then((response) =>
      response.json().then((data) => {
        // console.log(response.status);
        if (response.ok) {
          showSuccess(mID);
          const keys = Object.keys(data);
          if (keys.includes("0target_file")) {
            showPartialPal(data);
          }
        } else {
          // console.log(data);
          // console.log(data);
        }
      })
    )
    .catch((error) => console.log(error));
}

function showSuccess(mID) {
  const recordPath = "http://127.0.0.1:8000/api/main/records/" + mID;

  successAlertBox.innerHTML = `
    <strong>Record Added Successfully</strong>
    `;
  successAlertBox.style.display = "block";
}

function showPartialPal(data) {
  console.log("partial called");
  total_pal_score = 0;
  warningBox.innerHTML = `
  <strong>Partially Plagiarism Detected</strong>`;

  dataLen = Object.keys(data).length;
  for (let i = 0; i < (dataLen - 10) / 3; i++) {
    score = Math.trunc(data[`${i}similarity score`] * 100);
    total_pal_score = total_pal_score + score;
    similarFile = data[`${i}similar with`].slice(-57);
    sFilePath = "http://127.0.0.1:8000/" + similarFile;

    resultDiv = document.createElement("div");
    resultDiv.innerHTML = `
    
    ${data["0target_file"]} is <strong> ${score}% </strong>  similar with 
            <a href="${sFilePath}" class="alert-link" target="_blank">This Monograph</a>.`;

    warningBox.append(resultDiv);
  }

  total_pal_score = total_pal_score / ((dataLen - 10) / 3);
  totalPal = document.createElement("strong");
  totalPal.innerHTML = `<strong> Average Plagiarism Detected: ${total_pal_score}% with ${
    (dataLen - 10) / 3
  }  Files</strong>`;

  warningBox.append(totalPal);

  warningBox.style.display = "block";
}
function showError(data) {
  total_pal_score = 0;
  errorAlertBox.innerHTML = `
  <strong>Plagiarism Detected</strong>`;

  dataLen = Object.keys(data).length;
  for (let i = 0; i < dataLen / 3; i++) {
    // score = Math.round(data[`${i}similarity score`], 3);

    score = Math.trunc(data[`${i}similarity score`] * 100);

    console.log(score);
    total_pal_score = total_pal_score + score;
    console.log(data[`${i}similar with`]);
    similarFile = data[`${i}similar with`].slice(-57);
    sFilePath = "http://127.0.0.1:8000/" + similarFile;

    resultDiv = document.createElement("div");
    resultDiv.innerHTML = `
    
    ${data["0target_file"]} is <strong> ${score}% </strong>  similar with 
            <a href="${sFilePath}" class="alert-link" target="_blank">This Monograph</a>.`;

    errorAlertBox.append(resultDiv);
  }
  total_pal_score = total_pal_score / (dataLen / 3);
  totalPal = document.createElement("strong");
  totalPal.innerHTML = `<strong> Average Plagiarism Detected: ${Math.round(
    total_pal_score
  )}% with ${dataLen / 3}  Files</strong>`;
  errorAlertBox.append(totalPal);

  errorAlertBox.style.display = "block";
}

function showDBError(errorArray) {
  info = "";

  errorKey = Object.keys(errorArray)[0];

  if (errorKey != "") {
    info = errorArray[errorKey];
    console.log(info);
  } else {
    info = "Some unknown error occurred, Please try again.";
  }
  DBErrorAlertBox.innerHTML = `
  <strong>Failed to Add Record</strong><hr>
  <p>${info}</p>
    `;
  DBErrorAlertBox.style.display = "block";
}
