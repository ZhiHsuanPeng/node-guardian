import axios from 'axios';
import { parse } from 'stack-trace';
import fs from 'fs/promises';
import { stringify } from 'flatted';
import https from 'https';

class NodeGuardian {
  constructor(option = {}) {
    this.accessToken = option.accessToken || null;
    this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  }

  async log(data) {
    const flattenData = stringify(data);
    const processArgs = process.argv;
    await axios({
      method: 'post',
      url: 'https://nodeguardianapp.com/api/v1/logs/newLogs',
      httpsAgent: this.httpsAgent,
      data: {
        accessToken: this.accessToken,
        level: info,
        flattenData,
        timestamp: Date.now(),
        processArgs,
      },
    });
  }

  handleError() {
    const accessToken = this.accessToken;
    const httpsAgent = this.httpsAgent;
    return async function (err, req, res, next) {
      try {
        const trace = parse(err);
        const regex = /^file:\/\/\/([A-Za-z]:\/.*)$/;
        const errorLine = trace[0].getLineNumber();
        const errorFilePath = trace[0].getFileName().match(regex)[1];

        const data = await fs.readFile(errorFilePath, 'utf8');

        const errorCode = [];
        const lines = data.split('\n');

        for (let i = errorLine - 2 || 0; i < errorLine + 2 && i < lines.length; i++) {
          errorCode.push(lines[i]);
        }

        const filteredReqObj = {
          headers: req.rawHeaders,
          method: req.method,
          protocol: req.protocol,
          requestIp: req.socket.remoteAddress,
          requestProxyIp: req.headers['x-forwarded-for'],
          host: req.hostname,
          originalUrl: req.originalUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        };

        const processArgs = process.argv;

        await axios({
          method: 'post',
          url: 'https://nodeguardianapp.com/api/v1/logs/newLogs',
          httpsAgent,
          data: {
            accessToken,
            level: 'error',
            err: err.stack,
            filteredReqObj,
            code: errorCode.join('\n'),
            timestamp: Date.now(),
            processArgs,
          },
        });

        next(req, err);
      } catch (err) {
        console.log(err);
        next(req, err);
      }
    };
  }
}

export default NodeGuardian;
