const express=require("express");
const app=express();
const http=require("http");
const server=http.createServer(app);
const io = require("socket.io")(server);

const players=[];

io.on("connection", socket=>{
	players.push({
		id: socket.id,
		x: 100,
		y: 100
	})

	io.emit("new-user", players);

	socket.on("player-move",key=>{
		movePlayer(key,socket.id);
	})

	socket.on("disconnect",()=>{
		players.forEach((player,i)=>{
			if(player.id==socket.id){
				players.splice(i,1)
			}
		})
	})

	const movePlayer=(key,id)=>{
		let index;
		players.forEach((player,i)=>{
			if(player.id==id){
			 index=i;
			}
		})
		if(key==37){
			players[index].x-=3;
			io.emit("redraw-player",players);
		}
		else if(key==38){
			players[index].y-=3;
			io.emit("redraw-player",players);
		}
		else if(key==39){
			players[index].x+=3;
			io.emit("redraw-player",players);
		}
		else if(key==40){
			players[index].y+=3;
			io.emit("redraw-player",players);
		}
	}
})

app.get('/', (req, res) => {
	res.sendFile(__dirname+'/index.html');
});

server.listen(3000,()=>{
	console.log("listening on server 3000...");
})