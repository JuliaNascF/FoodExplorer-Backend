const express = require("express");
const cors = require("cors");
const path = require("path");
require("express-async-errors");
const dotenv = require("dotenv");
const AppError= require("../utils/AppError");
const routes = require("../routes/index");

function connectServer(){
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
  );
  
  app.use(routes);
  
  app.use((error, request, response, next) => {
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
    
    
    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
   
  };

  module.exports = connectServer;