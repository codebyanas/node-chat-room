const socket = io();

socket.on("message", (message) => {
    console.log(message);
});

// Elements
const me = me()
const $messages = document.querySelector('#messages')
const $messageForm = document.querySelector("#message-form");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messageFormInput = $messageForm.querySelector("#message-input");

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render($locationMessageTemplate, {
        url: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // disable
    $messageFormButton.setAttribute("disabled", "disabled");

    const message = document.querySelector("#message-input").value;

    socket.emit("sendMessage", message, (error) => {
        // enabled
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            console.log(error);
        }

        console.log("Message is delivered!");
    });
});

$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    // disable
    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            "sendLocation",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                $sendLocationButton.removeAttribute("disabled");
                console.log("Location shared!");
            }
        );
    });
});
=======
const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#message-input')
const $messageFormButton = $messageForm.querySelector('button')

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = document.querySelector('#message-input').value

    socket.emit('sendMessage', message, (error) => {
        // enabled
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            console.log(error)
        }

        console.log('Message is delivered!')
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})
>>>>>>> 102172254cb87439c7ebd88227eb4db3706f027b
