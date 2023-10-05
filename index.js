const http = require('http');
const server = http.createServer((req, res) => {});
server.listen(PORT, () => {
    const address = server.address().address;
    const port = server.address().port;
    console.log(`Server is running at http://${address}:${port}`);
});


const io=require("socket.io")(process.env.PORT,
    {
        cors:{origin:"https://buyandsell-e7tw.onrender.com"},
        methods: ["GET", "POST"]
    })
    let users=[]
    let targetUser=[]
    const addUser=((userId,socketId)=>
    {
        userId!==null && users.push({userId,socketId})
        !users.some((user)=>
            {
                return (user.userId===userId)
            })
    })
    const removeUser=(socketId=>
        {
            users=users.filter(user=>
                {
                    return user.socketId!==socketId
                })
        })
        const getUser=(userId)=>
        {
            users.forEach(user=>
                {
                    if(user.userId===userId)
                    targetUser=user
                })
        }
    io.on("connection",(socket)=>
    {
        console.log("A user connected")
        socket.on("addUser",userId=>
        {
            addUser(userId,socket.id)
            io.emit("getUsers",users)
        })
        socket.on("sendMessage",({senderId,receiverId,text,conversationId})=>
        {
            getUser(senderId)
            io.to(targetUser.socketId).emit("getMessage",{senderId,text,receiverId,conversationId})
        })
        socket.on("disconnect",()=>
        {
            console.log("a user disconnected")
            removeUser(socket.id)
            io.emit("getUsers",users)
        })
    })
console.log(process.env.PORT)
