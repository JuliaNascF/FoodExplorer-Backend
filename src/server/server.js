const express = require("express");
const cors = require("cors");
require("express-async-errors")

const AppError= require("../utils/AppError");
const routes = require("../routes/index")

function connectServer(){
  const app = express()
  app.use(cors())
  app.use(express.json())
  
  
  app.use(routes);
  
  app.use((error, request, response, next) => {
      // se a instancia dele saiu de AppError é um erro gerado pelo cliente 
   if (error instanceof AppError){
      return response.status(error.statusCode).json({
          status:"error",
          message: error.message
   });
  }
  
  console.error(error);
  
  return response.status(500).json({
      status: "error",
      message: "Internal server error "
  });
  });
    
    
    const PORT = 4000
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
   
  };

  module.exports = connectServer;