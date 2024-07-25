<p align="center">
  <img src="https://github.com/user-attachments/assets/693228d6-3842-4de4-bffd-74f058d504f4" alt="Logo">
</p>

<h1 align="center">NodeGuardian.js</h1>

<p align="center">
  <strong>Monitor, manage and resolve errors with <a href="https://nodeguardianapp.com/home">NodeGuardian’s</a> error monitoring platform. <a href="https://nodeguardianapp.com/signup">Start tracking errors today</a>!</strong>
</p>

## Key benefits of using NodeGuardian.js are:

- **Automatic error grouping:** NodeGuardian aggregates Occurrences caused by the same error into Items that represent application issues.
- **Alarm system**: NodeGuardian is capable of sending emails upon detecting anomaly.
- **Customizable notifications:** NodeGuardian supports different notifications rules, letting users modify their notification settings based on their need.

## Setup Instructions

1. [Sign up for a NodeGuardian account.](https://nodeguardianapp.com/signup) (or you can use guest info to sign in)
2. Create a project, which should give you an access token, copy this token as you will need it to authenticate your project.
3. Follow instructions below to import and initialize the package.

```
// install package node-guardian
$ npm install node-guardian

// inside express framework, ESM only
import node-guardian from 'node-guardian';
const guard = new NodeGuardian({ accessToken: "< your project access token >" });

// calling next on error
try {
} catch (err) {
    next(err);
}


// use it as an error handling middleware
app.use(guard.handleError());

// your own error handler
app.use(globalErrorHandler);
```

## Contributing

1. Fork it on GitHub.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Added some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.

## FAQ

#### Is this package ESM only?

Yes, this package right now can only be initialized using ESM.

#### Can I use this package outside Express framework?

No, this package now can only be used in Express's error handling middleware. Future update will release more feature and functionality.
