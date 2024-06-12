import axios from 'axios';
import { parse } from 'stack-trace';
import fs from 'fs/promises';
import { stringify } from 'flatted';

class NodeGuardian {
  constructor(option = {}) {
    this.accessToken = option.accessToken || null;
  }

  async log(data) {
    const accessToken = this.accessToken;
    const flattenData = stringify(data);
    await axios({
      method: 'post',
      url: 'https://nodeguardianapp.com/api/v1/logs/newLogs',
      data: {
        accessToken: this.accessToken,
        level: info,
        flattenData,
      },
    });
  }

  handleError() {
    const accessToken = this.accessToken;
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

        const flattenedErr = stringify(err);
        const flattenedReq = stringify(req);

        await axios({
          method: 'post',
          url: 'https://nodeguardianapp.com/api/v1/logs/newLogs',
          data: {
            accessToken,
            level: 'error',
            flattenedErr,
            flattenedReq,
            code: errorCode.join('\n'),
          },
        });

        next();
      } catch (err) {
        console.log(err);
        next();
      }
    };
  }
}

export default NodeGuardian;
