import axios from 'axios';
import parse from 'stack-trace';
import fs from 'fs/promises';

class NodeGuardian {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async log(data) {
    await axios({
      method: 'post',
      url: 'https://nodeguardianapp.com/api/v1/logs',
      data: {
        level: info,
        data,
      },
    });
  }

  handleError() {
    return async function (err, req, res, next) {
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

      await axios({
        method: 'post',
        url: 'https://nodeguardianapp.com/api/v1/logs',
        data: {
          level: 'error',
          err,
          req,
          code: errorCode.join('\n'),
        },
      });

      next();
    };
  }
}

module.exports = NodeGuardian;
