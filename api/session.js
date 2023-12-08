module.exports = (req, res) => {
  console.log('session.js', req.body);
  try {
    let data = req.body.data;
    data.env = _LibsCommon.parseEnv(data.env);
    new _LibsFlowCommon.core().main(data, (tmpInputReport, tmpInputHistory) => {
      res.writeHead(200).end(
        JSON.stringify({"a":"b"})
      );
    });
  } catch (e) {
    console.error('session.js', e, req.body);
  }
}