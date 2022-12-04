const recordsTable = document.getElementById("records-table");
var arr = [];
function getCookie(name) {
  let cookieValue = null;
  // console.log(document.cookie);
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

function getRecords() {
  const url = "http://127.0.0.1:8000/api/main/records";
  fetch(url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    method: "GET",
  })
    .then((jresp) => jresp.json())
    .then((resp) => {
      arr = resp;
      renderTable(resp);
    })
    .catch((error) => {
      console.log(error);
    });
}

getRecords();

function renderTable(resp) {
  const tbody = recordsTable.querySelector("tbody");
  tbody.innerHTML = ``;

  if (resp.length != 0) {
    for (const el of resp) {
      tbody.appendChild(createTableRow(el));
    }
    let records = document.querySelectorAll(".view_record");
    records.forEach((ele) => {
      // console.log("added");
      ele.addEventListener("click", view_record_handler.bind(null, ele.id));
    });
  } else {
    tbody.innerText = "No Record Found";
  }
}

function createTableRow(el) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
  <td>${el["monograph_title"]}</td>
  <td class="pl-1">${el["year"]}</td>
  <td class="pl-4">${el["department"]}</td>
  <td class="pl-4">${el["monograph_language"]}</td>
  <td class="pl-4">
  <a  id='${el["m_id"]}' class="btn btn-sm btn-outline-secondary view_record" 
  href="#viewRecordModal" rel="modal:open">View Record</a>
 
  </td>
  <td class="pl-4"> 
  <a href="${el["monograph_file"]}" class="btn btn-sm btn-outline-secondary" target="_blank"> Open Monograph </a> 
  </td>
  `;

  return tr;
}

function view_record_handler(id) {
  const m_url = "http://127.0.0.1:8000/api/main/records/" + id;

  fetch(m_url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    method: "GET",
  })
    .then((response) =>
      response.json().then((data) => {
        // console.log(response.status);
        if (response.ok) {
          createModalViewRecord(data);

          let u_form = document.getElementById("m_form");
          let u_file = document.getElementById("m_file");
          let u_source_code_file = document.getElementById("source_code_file");

          let updateBtn = document.querySelectorAll(".update-record");

          updateBtn.forEach((ele) => {
            // console.log("added");
            ele.addEventListener(
              "click",
              updateRecord.bind(
                null,
                ele.id,
                u_form,
                u_file,
                u_source_code_file
              )
            );
          });

          let deleteBtn = document.querySelectorAll(".delete-record");
          deleteBtn.forEach((ele) => {
            // console.log("added");
            ele.addEventListener("click", deleteRecord.bind(null, ele.id));
          });
        } else {
          console.log(data);
        }
      })
    )
    .catch((error) => console.log(error));
}

function createModalViewRecord(data) {
  const defaultStudents = {
    0: {
      en_father_name: "",
      en_last_name: "",
      en_name: "",
      fa_father_name: "",
      fa_last_name: "",
      fa_name: "",
      monograph: "",
      s_id: "",
    },
    1: {
      en_father_name: "",
      en_last_name: "",
      en_name: "",
      fa_father_name: "",
      fa_last_name: "",
      fa_name: "",
      monograph: "",
      s_id: "",
    },
    2: {
      en_father_name: "",
      en_last_name: "",
      en_name: "",
      fa_father_name: "",
      fa_last_name: "",
      fa_name: "",
      monograph: "",
      s_id: "",
    },
  };
  let s1_obj = defaultStudents[0];
  let s2_obj = defaultStudents[1];
  let s3_obj = defaultStudents[2];

  if (data["students"].length == 1) {
    s1_obj = data["students"][0];
  }
  if (data["students"].length == 2) {
    s1_obj = data["students"][0];
    s2_obj = data["students"][1];
  }
  if (data["students"].length == 3) {
    s1_obj = data["students"][0];
    s2_obj = data["students"][1];
    s3_obj = data["students"][2];
  }

  const box = document.getElementById("viewRecordModal");
  box.innerHTML = `


  <div class="container-fluid">
  <div class="row">
    <main class="col-ms-12 ms-sm-auto col-lg-12 px-md-4">
      <div
        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
      >
        <h1 class="h2">Record</h1>
      </div>
      <div
        class="alert alert-danger"
        role="alert"
        style="display: none"
        id="DBErrorAlertBox"
      ></div>
      <div
        class="alert alert-danger"
        role="alert"
        style="display: none"
        id="errorAlertBox"
      ></div>
      <div
        class="alert alert-success"
        role="alert"
        style="display: none"
        id="successAlertBox"
      ></div>
      <!-- Start Card -->
      <div class="card">
        <!-- Start Card Body -->
        <div class="card-body">
          <!-- Start Form -->
          <form
            id="m_form"
            action="#"
            method=""
            class="needs-validation"
            novalidate
            autocomplete="off"
          >
            <!-- Start Input title -->
            <div class="form-group">
            <label for="">ID: ${data["m_id"]}</label> <br>
              <label for="m_title">Title</label>
              <input
                type="text"
                class="form-control"
                id="m_title"
                name="m_title"
                value="${data["monograph_title"]}"
                placeholder="Monograph Title"
              />
              <small class="form-text text-muted"
                >Please fill Monograph Title</small
              >
            </div>
            <!-- End Inp title -->
            <div class="row">
              <!-- Start Input Department -->
              <div class="form-group col">
                <label>Department</label>
                <div
                  class="d-flex flex-row justify-content-between align-items-center"
                >
                  <select
                    class="form-control mr-1"
                    id="department"
                    name="department"

                    required
                  >
                  <option value="${data["department"]}" selected>
                  ${data["department"]}
                    </option>
                    <option value="SE">
                      Software Engineering
                    </option>
                    <option value="IT">Information Technology</option>
                    <option value="IS">Information System</option>
                  </select>
                </div>
              </div>
            </div>
              <!-- End Input department -->
              <!-- Start Input year -->
              <div class="row">
              <div class="form-group col">
                <label>Year</label>
                <div
                  class="d-flex flex-row justify-content-between align-items-center"
                >
                  <select
                    class="form-control mr-1"
                    id="year"
                    name="year"
                    required
                  >
                  <option value="${data["year"]}" selected>
                  ${data["year"]}
                    </option>
                    <option value="1399">1399</option>
                    <option value="1400">1400</option>
                    <option value="1401">1401</option>
                    <option value="1400">1400</option>
                    <option value="1402">1402</option>
                    <option value="1403">1403</option>
                    <option value="1404">1404</option>
                    <option value="1405">1405</option>
                    <option value="1406">1406</option>
                    <option value="1407">1407</option>
                    <option value="1408">1408</option>
                    <option value="1409">1409</option>
                    <option value="1410">1410</option>
                  </select>
                </div>
              </div>
              </div>
              <!-- End Input year -->

              <!-- Start Input m_languege -->
              <div class"row">
              <div class="form-group">
                <label>Monograph Language</label>
                <div
                  class="d-flex flex-row justify-content-between align-items-center"
                >
                  <select
                    class="form-control mr-1"
                    id="m_language"
                    name="m_language"
                    required
                  >
                  <option value="${data["monograph_language"]}" selected>
                  ${data["monograph_language"]}
                    </option>
                    <option value="EN">English</option>
                    <option value="FA">Farsi</option>
                    <option value="PA">Pashto</option>
                  </select>
                </div>
              </div>
              <!-- End Input m_languege -->
              </div>

              <div class="input-group mt-3">

                <div class="input-group-prepend">
                  <span class="input-group-text">Update Monograph File</span>
                </div>
                <input
                  type="file"
                  class="form-control btn btn-sm border"
                  id="m_file"
                  name="m_file"
                  required
                  aria-describedby="inputGroupFileAddon01"
                  placeholder="Choose File"
                />
              </div>
              <div>
                <small class="form-text text-muted"
                  >Please Upload Monograph File (.pdf only)</small
                >
              </div>
              <div>
                <small class="form-text text-muted"
                  ><a href="${data["monograph_file"]}" target="_blank"> Show Monograph </a></small
                >
              </div>

              <div class="input-group mt-3">

                <div class="input-group-prepend">
                  <span class="input-group-text">Update Source File</span>
                </div>
                <input
                  type="file"
                  class="form-control btn btn-sm border"
                  id="source_code_file"
                  name="source_code_file"
                  aria-describedby="inputGroupFileAddon01"
                />
              </div>
              <div>
                <small class="form-text text-muted"
                  >Please Upload Source File (.zip or .rar only)</small
                >
              </div>
              <div>
                <small class="form-text text-muted mb-3"
                  ><a href="${data["source_code_files"]}" target="_blank"> Show Source Code Files </a></small
                >
              </div>
            <!-- Start Student1 Info -->
              <div>
                <div class="form-group">
                  <label class="font-weight-bold">* Student #1 Info</label>
                </div>
                    <input
                      type="text"
                      class="form-control mt-1"
                      id="s1_sID"
                      name="s1_sID"
                      placeholder="KU ID#"
                      value="${s2_obj["s_id"]}"

                      value="${s1_obj["s_id"]}"
                      required
                    />
                    <input
                      type="text"
                      class="form-control mt-1"
                      id="s1_name"
                      name="s1_name"
                      placeholder="First Name"
                      value="${s1_obj["en_name"]}"

                      required
                    />
                    <input
                      type="text"
                      class="form-control mt-1"
                      id="s1_father_name"
                      name="s1_father_name"
                      placeholder="Father Name"
                      value="${s1_obj["en_father_name"]}"

                      required
                    />
                    <input
                      type="text"
                      class="form-control mt-1"
                      id="s1_last_name"
                      name="s1_last_name"
                      placeholder="Last Name"
                      value="${s1_obj["en_last_name"]}"

                      required
                    />
              </div>
            <!-- End Student1 Info -->
            <!-- Start Student2 Info -->
            <div>
              <div class="form-group mt-2">
                <label class="font-weight-bold"
                  >Student #2 Info
                  <small class="form-text text-muted"
                    >(Optional)</small
                  ></label
                >
              </div>
                  <input
                    type="text"
                    class="form-control mt-1"
                    id="s2_sID"
                    name="s2_sID"
                    placeholder="KU ID#"
                    value="${s2_obj["s_id"]}"

                  />
                  <input
                    type="text"
                    class="form-control mt-1"
                    id="s2_name"
                    name="s2_name"
                    placeholder="First Name"
                    value="${s2_obj["en_name"]}"

                  />
                  <input
                    type="text"
                    class="form-control mt-1"
                    id="s2_father_name"
                    name="s2_father_name"
                    placeholder="Father Name"
                    value="${s2_obj["en_father_name"]}"

                  />
                  <input
                    type="text"
                    class="form-control mt-1"
                    id="s2_last_name"
                    name="s2_last_name"
                    placeholder="Last Name"
                    value="${s2_obj["en_last_name"]}"

                  />
            </div>
            <!-- End Student2 Info -->
            <!-- Start Student3 Info -->
            <div>
              <div class="form-group mt-2">
                <label class="font-weight-bold"
                  >Student #3 Info
                  <small class="form-text text-muted"
                    >(Optional)</small
                  ></label
                >
              </div>
              <input
              type="text"
              class="form-control mt-1"
              id="s3_sID"
              name="s3_sID"
              placeholder="KU ID#"
              value="${s3_obj["s_id"]}"
              />
              <input
                type="text"
                class="form-control mt-1"
                id="s3_name"
                name="s3_name"
                placeholder="First Name"
                value="${s3_obj["en_name"]}"
              />
              <input
                type="text"
                class="form-control mt-1"
                id="s3_father_name"
                name="s3_father_name"
                placeholder="Father Name"
                value="${s3_obj["en_father_name"]}"
              />
              <input
                type="text"
                class="form-control mt-1"
                id="s3_last_name"
                name="s3_last_name"
                placeholder="Last Name"
                value="${s3_obj["en_last_name"]}"
              />
            </div>

            <!-- End Student3 Info -->

            <div
              class="alert alert-danger"
              role="alert"
              style="display: none"
              id="deleteSuccessAlertBox"
              ></div>
              <!-- Start Add Record Button -->
            <div class="row">
            <!--
              <button
                class="btn btn-primary btn-block col-sm mt-2 ml-2 pl-3 pr-3 update-record"
                id="${data["m_id"]}"
                type="button"
                disabled
              >
                Update Record
              </button> 
              -->
              <button
                class="btn btn-danger btn-block col-sm mt-2 ml-2 pl-3 pr-3 delete-record"
                id="${data["m_id"]}"
                type="button"
              >
                Delete
              </button>
            </div>
            <!-- End Add Record Button -->
          </form>
          <!-- End Form -->
          </div>
        <!-- End Card Body -->
        </div>
      <!-- End Card -->
    </main>
  </div>
</div>

  `;
}

function updateRecord(id, u_form, u_file, u_source_code_file) {
  console.log("update called");
  const u_url = `http://127.0.0.1:8000/api/main/records/${id}/`;
  const rawData = Object.fromEntries(new FormData(u_form).entries());

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
  fetch(u_url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    body: m_formData,
    method: "PATCH",
  })
    .then((response) =>
      response.json().then((data) => {
        // console.log(response.status);
        if (response.ok) {
          console.log(data);
          // addNewStudent(data["m_id"], rawData, s_formData, "s1");
          // if (rawData["s2_sID"] !== "") {
          //   addNewStudent(data["m_id"], rawData, s_formData, "s2");
          //   if (rawData["s3_sID"] !== "") {
          //     addNewStudent(data["m_id"], rawData, s_formData, "s3");
          //   }
          // }
        }
        if (response.status == 400) {
          // console.log(response.status, data);
          showError(
            data["target_file"],
            data["similarity score"],
            data["similar with"]
          );
        } else {
          // console.log(data);
          // showDBError(data);
        }
      })
    )
    .catch((error) => showDBError(error));
}

function deleteRecord(id) {
  const m_url = "http://127.0.0.1:8000/api/main/records/" + id;

  fetch(m_url, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      Accept: "application/json",
    },
    method: "DELETE",
  })
    .then((response) => {
      showDeleteSuccess();
    })
    .then((res) => {
      setTimeout(function () {
        location.reload();
      }, 2000);
    })
    .catch((err) => {
      console.error(err);
    });
}

function showDeleteSuccess() {
  const successAlertBox = document.getElementById("deleteSuccessAlertBox");
  successAlertBox.innerHTML = `
    <strong>Record Deleted Successfully</strong>
    `;
  successAlertBox.style.display = "block";
}
const langDropdown = document.getElementById("langDropdown");
const departmentDropdown = document.getElementById("department");
const dateDropdown = document.getElementById("date-dropdown");
const clearFilters = document.getElementById("clearFilters");

function searchLive() {
  const searchKey = document.getElementById("search-key").value;
  let filteredData = arr.filter((data) => {
    if (data.monograph_title.includes(searchKey.toLowerCase())) {
      return data;
    }
  });
  // console.log(filteredData);
  renderTable(filteredData);
}

langDropdown.addEventListener("change", () => {
  let filteredData = arr.filter((data) => {
    if (data.monograph_language == langDropdown.value) {
      return data;
    }
  });
  // console.log(filteredData);
  renderTable(filteredData);
});

departmentDropdown.addEventListener("change", () => {
  let filteredData = arr.filter((data) => {
    if (data.department == department.value) {
      return data;
    }
  });
  // console.log(filteredData);
  renderTable(filteredData);
});

dateDropdown.addEventListener("change", () => {
  let filteredData = arr.filter((data) => {
    if (data.year == dateDropdown.value) {
      return data;
    }
  });
  // console.log(filteredData);
  renderTable(filteredData);
});
