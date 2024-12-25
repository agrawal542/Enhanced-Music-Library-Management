const express = require('express')
const apiRoutes = require('./routes/index.js');
const { ServerConfig, Logger } = require('./config/index.js');
const { ErrorMiddleware } = require('./middlewares/index.js');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api", apiRoutes)

// http://localhost:3008/api/v1/test
// app.get('/api/v1/blogs',(req,res)=>{
//     res.send({
//         data :"working"
//     })
// })


app.use(ErrorMiddleware.errorHandler)
app.use(ErrorMiddleware.notFound)

app.listen(ServerConfig.PORT, () => {
    console.log(`Server is running on PORT : ${ServerConfig.PORT}`)
    Logger.info("Succesfully started the server")

})

