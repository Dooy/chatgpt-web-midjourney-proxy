module.exports = (req, res) => {
    let obj= {"status":"Fail","message":"密钥无效 | Secret key is invalid","data":null}
    res.writeHead(200).end(
        JSON.stringify( obj )
    );
}
