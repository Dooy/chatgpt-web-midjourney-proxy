import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from './utils/is';
import FormData  from 'form-data'


//req, res, next

export const viggleProxyFileDo= async( req:Request, res:Response, next?:NextFunction)=>{
    // if ( process.env.VIGGLE_KEY ) proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.VIGGLE_KEY;
    // else   proxyReqOpts.headers['Authorization'] ='Bearer '+process.env.OPENAI_API_KEY;  
    console.log('req.originalUrl', req.originalUrl );
    let  API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'
    API_BASE_URL= process.env.VIGGLE_SERVER??  API_BASE_URL
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('file',  fileBuffer,  { filename:  req.file.originalname }  );
     // formData.append('model',  req.body.model );
     try{
       let url = `${API_BASE_URL}${req.originalUrl}` ;
      let responseBody = await axios.post( url , formData, {
              headers: {
              Authorization: 'Bearer '+ (process.env.VIGGLE_KEY??process.env.OPENAI_API_KEY) ,
              'Content-Type': 'multipart/form-data',
              //'Mj-Version': pkg.version
            }
        })   ; 
       res.json(responseBody.data );
      }catch(e){ 
        res.status( 400 ).json( {error: e } );
      }

    }else{
      res.status(400).json({'error':'uploader fail'});
    }
    
}