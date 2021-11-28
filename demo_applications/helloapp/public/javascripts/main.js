var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20);

document.getElementById('meeting_id').value = id;

function loggedInApp(name, id) {

  if(id.length > 0) {
    window.location.href = "/meeting?name="+ name +"&id=" + id;
  } else {
    console.log("Please enter valid ID")
  }
}