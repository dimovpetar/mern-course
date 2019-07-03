# Online Exchange app

Exchange app is an application where users can search and publish advertisements for sales.

## Installation

### development

Use the package manager [npm](https://www.npmjs.com/)


```bash
cd server
npm i
npm run dev

cd client
npm i
npm start
```
The app is opened in the default browser on `localhost:3000`


### production

```bash
cd client
npm i
npm run build

cd server
npm i
npm start
```

The app can be found on `localhost:9000`

## Used technologies and libraries
* Node.js with Express
* MongoDB with Mongoose
* React with the help of [create-react-app](https://github.com/facebook/create-react-app)
* [SocketIO](https://socket.io/)
* [Multer](https://github.com/expressjs/multer) for parsing `form-data` and saving files
* [Moment.js](https://momentjs.com/) for time formatting
* [Axios](https://www.npmjs.com/package/axios) for requests