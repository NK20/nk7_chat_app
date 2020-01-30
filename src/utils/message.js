const getMessage=(text,name)=>{

    return {
    name,
    text,
    "createdAt":new Date().getTime()
    }
}

const getLocation=(position,name)=>{
    return {
    name,
    "url":'https://maps.google.com/?q='+position.lat+','+position.lang,
    "createdAt":new Date().getTime()
    }
}

module.exports={
    getMessage,
    getLocation
}