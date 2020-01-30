const socket= io()
const $chatForm = document.querySelector('#chatForm')
const $sendMessage = $chatForm.querySelector('#sendMessage')
const $textMsg = $chatForm.querySelector('input')
const $msgBox = document.querySelector('#msgBox')
const $location = document.querySelector('#location')

//Templates
const messagetemplate= document.querySelector('#message-template').innerHTML
const locationtemplate = document.querySelector('#location-template').innerHTML
const activeusertemp= document.querySelector('#activeUser-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('activeUser',({room,users})=>{
    console.log(users)
    const html= Mustache.render(activeusertemp,{
        room,
        users
    })
    document.querySelector('#activeSidebar').innerHTML =html
})
socket.on('message',(message)=>{
    const html= Mustache.render(messagetemplate,{
        "uname":message.name,
        "message": message.text,
        "Attime": moment(message.createdAt).format('h:mm a')
    })
    $msgBox.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(mapMsg)=>{
    const html= Mustache.render(locationtemplate,{
        "uname":mapMsg.name,
        "link":mapMsg.url,
        "Attime":moment(mapMsg.createdAt).format('h:mm a')
    })
    $msgBox.insertAdjacentHTML('beforeend',html)
})


$sendMessage.addEventListener('click',(e)=>{
   e.preventDefault()
    $chatForm.setAttribute('disabled','disabled')
    const message= $textMsg.value
    socket.emit('message',message,()=>{
        $chatForm.removeAttribute('disabled')
        $textMsg.value= ''
        $textMsg.focus()
        console.log('Sent')
    })
})

$location.addEventListener('click',()=>{
$location.setAttribute('disabled','disabled')
if(!navigator.geolocation){
    console.log('not supported')
}
navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position)
    socket.emit('locationMessage',{
        lat:position.coords.latitude,
        lang:position.coords.longitude
    },(msg)=>{
        console.log(msg)
        $location.removeAttribute('disabled')
    })
})
console.log(position)
})

socket.emit('join',{username,room})