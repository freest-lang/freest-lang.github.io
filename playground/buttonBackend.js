document.getElementById("buttonRUN").addEventListener('click',function(){
    var editor = getEditor("textEditor");
    var code = editor.state.doc.toString();
    //Using localhost instead of 127.0.0.1 is causing a bug which comes from Docker Desktop (especially on Linux, where it runs inside a VM) has an issue: with port mapping sometimes working correctly only for IPv4, not IPv6. Probably is fix when the backend gets a new ip
    fetch('http://127.0.0.1:8080/runFreeST', { 
        method: 'POST',
        body: JSON.stringify (code),
        headers: {
            'content-type': 'application/json'
           }
    })
    .then(response => {
        if (!response.ok) {
            console.log('Error')
            return;
        }
        return response.json();
    })
    .then(response => 
            document.getElementById("output").textContent = response
    )
});