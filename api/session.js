module.exports = (req, res) => {
  console.log('session.js', req.body);
  try {
    let data = req.body.data; 
    let obj ={
        "status": "Success",
        "message": "",
        "data": {
            "isHideServer": false,
            "isUpload": false,
            "auth":   process.env.AUTH_SECRET_KEY?true:false ,
            "model": "ChatGPTAPI",
            "amodel": process.env.OPENAI_API_MODEL?? "gpt-3.5-turbo"
            ,isApiGallery:    process.env.MJ_API_GALLERY ? true : false 
        }
    }
    res.writeHead(200).end(
        JSON.stringify( obj )
    );
  } catch (e) {
    console.error('session.js', e, req.body);
  }
}