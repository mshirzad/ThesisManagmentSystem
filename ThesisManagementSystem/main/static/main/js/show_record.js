// function getCookie(name) {
//   let cookieValue = null;
//   //   console.log(document.cookie);
//   if (document.cookie && document.cookie !== "") {
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i].trim();
//       // Does this cookie string begin with the name we want?
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

// var monograph_id = "";

// function linkShowRecord(mID) {
//   console.log(mID);
//   monograph_id = mID;
// }

// function showSpecRecord(mID) {
//   console.log("inside show record js");
//   const m_url = "http://127.0.0.1:8000/api/main/records/" + mID;
//   // const temp_url = "http://127.0.0.1:8000/showRecord/";
//   // const s_url = "http://127.0.0.1:8000/api/main/students/" + sID;

//   fetch(m_url, {
//     headers: {
//       "X-CSRFToken": getCookie("csrftoken"),
//       Accept: "application/json",
//     },
//     method: "GET",
//   })
//     .then((response) =>
//       response.json().then((data) => {
//         // console.log(response.status);
//         if (response.ok) {
//           console.log(data);
//         } else {
//           // console.log(data);
//           showDBError(data);
//         }
//       })
//     )
//     .catch((error) => showDBError(error));
// }

// console.log(monograph_id);
// // showSpecRecord(monograph_id);
