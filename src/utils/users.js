const users=[]

const addUser=({id,name,room})=>{
    let namee=name.trim().toLowerCase()
    let roomm=room.trim().toLowerCase()
    if(!name || !room){
        return {
            error:"Username & Room Req"
        }
    }
    const existingUser= users.find((user)=>{
        return user.room=== roomm && user.name === namee
    })
    if(existingUser){
        return {
            error:"Username Already taken in this Room"
        }
    }
    const user={id,name:namee,room:roomm}
    users.push(user)
    return user
}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>{
        return user.id === id
    })
    if(index!= -1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
   return users.find((user)=>user.id === id)
}

const getUsersInRoom =(roomname)=>{
    const room=roomname.trim().toLowerCase()
    const userlist= users.filter((user)=>user.room === room)
    return {
        "room":room,
        "users": userlist
    }
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}