const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken")

const JWTSecret = "SenhaSiteSegura2023" // senha privada 

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

  function auth(req, res, next){ // passa a requisição do middleware para a rota acessada 

    const authToken = req.headers['authorization']

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];

        jwt.verify(token,JWTSecret,(err, data) => {

           if (err) {
                res.status(401);
                res.json({ err: "n/a token" });
            } else {

                req.token = token;
                req.loggedUSer = {id: data.id,email: data.email};
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err: "Token invalido"})
    }

}

var DB = {
    games:[

    
        {
            id: 15,
            title:"Rainbow Six",
            year: 2015,
            price: 90

        },
        {
            id: 28,
            title:"Valorant",
            year: 2021,
            price: "Free"

        },        {
            id: 71,
            title:"Tales of Berseria",
            year: 2017,
            price: 60

        },        {
            id: 85,
            title:"God of war",
            year: 2019,
            price: 100

        },        {
            id: 99,
            title:"Minecraft",
            year: 2012,
            price: 60

        }

    ],
    users: [
        {
            id:21,
            name: "Yan",
            email: "yanmlimalima2727@gmail.com",
            password: "@yansenhaboa20"
             
        },
        {
            id:24,
            name: "Alison",
            email: "camargo61camaro@gmail.com",
            password: "Sabadoeugosto"


        }
    ]
}


app.get("/games",auth,(req, res) => {
    res.json(DB.games);
    res.statusCode = 200;
});

app.get("/game/:id",auth,(req, res) => {
    
    if(isNaN(req.params.id)){    // verifica se é um numero ou nao 
        res.sendStatus(400);
    }else{
        
        let id = parseInt(req.params.id)

        var game = DB.games.find(g => g.id == id)

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
            }

    }

});


app.post("/game",(req, res) => {

    var {title, price, year} = req.body;

    DB.games.push({ // adiciona dados dentro do array
        
        id: 20,
        title,
        price,
        year
    });                   

    res.sendStatus(200);
})

app.delete("/game/:id",(req, res) => {

    if(isNaN(req.params.id)){    // verifica se é um numero ou nao 
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id)
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404)
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200)
        }

    }

});

app.put("/game/:id", (req,res) => {

    if(isNaN(req.params.id)){    // verifica se é um numero ou nao 
        res.sendStatus(400);
    }else{
        
        let id = parseInt(req.params.id)

        var game = DB.games.find(g => g.id == id)

        if(game != undefined){

            var {title, price, year} = req.body;

            if(title != undefined){
                game.title = title;
            }
            if(price != undefined){
                game.price = price;
            }
            if(year != undefined){
                game.year = year;
            }

            res.sendStatus(200)


        }else{
            res.sendStatus(404);
        }

    }


})

app.post("/auth",(req, res) => { 

    var {email, password} = req.body;

    if(email != undefined){

        var user = DB.users.find(u => u.email == email)
        if(user != undefined){
            if(user.password == password){

                jwt.sign({id: user.id, email: user.email},JWTSecret,{expiresIn:'10h'},(err, token) => {
                    if(err){
                        res.status(400);
                        res.json({err:"Falha interna"});
                    }else{
                        res.status(200); 
                        res.json({token: token});
                    }
                }) 
            }else{
                res.status(401);
                res.json({err: "Senha invalida para a conta"})
            }

        }else{
            res.status(404);
            res.json({err: "O email enviado não existe no nosso sistema, tente outro!"})
        }

    }else{
        res.status(400)
        res.json({err: "E-mail ou senha invalidas"})
    }

})


app.listen(8181,() => {
    console.log("O API está rodando")
})