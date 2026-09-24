document.querySelectorAll(".output").forEach(el => {
    el.style.display = "none"
})
document.querySelectorAll(".buttonRUN").forEach(button => {
    button.addEventListener('click',function(){

        var group = button.closest(".panels_button")
        var editorID = group.querySelector(".textEditor")
        var editor = window.getEditor(editorID)
        if (!editor) {
            console.error(`Editor "${editorID}" não encontrado`)
            return
        }

        var code = editor.state.doc.toString()

        var outputID = group.querySelector(".output")

        //Using localhost instead of 127.0.0.1 is causing a bug which comes from Docker Desktop (especially on Linux, where it runs inside a VM) with port mapping sometimes working correctly only for IPv4, not IPv6. Probably gets fixed when the backend gets a new ip
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
            outputID.style.display = "block" 
            return response.json();
        })
        .then(response => 
            outputID.textContent = response
        )
    })
})