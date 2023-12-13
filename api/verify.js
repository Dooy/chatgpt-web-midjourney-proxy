module.exports = (req, res) => {
    let obj= {"status":"Fail","message":"密钥无效 | Secret key is invalid","data":null};
    if( req.body &&  req.body.token && process.env.AUTH_SECRET_KEY == req.body.token)  obj= { status: 'Success', message: 'Verify successfully', data: null }
    res.setHeader('Content-type', 'application/json' ); 
    res.writeHead(200).end(
        JSON.stringify( obj )
    );
}
