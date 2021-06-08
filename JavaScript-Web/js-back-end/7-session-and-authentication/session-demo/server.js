const express = require('express');

const app = express();

const sessions = {};

function mySessionStorage(req, res, next) {
    let session = {};

    if (req.headers.cookie) {
        const id = req.headers.cookie.split('=')[1];
        if (sessions[id] == undefined) {
            console.log('Invalid cookie, generating new..');
            createSession();
        }
        session = sessions[id];
        console.log('>> Existing session', session);
    } else {
        createSession();
    }

    req.session = session;
    next();

    createSession () {
        const id = ('00000000', + (Math.random() * 99999999 | 0).toString(16)).slice(-8);
        sessions[id] = session;
        res.setHeader('Set-Cookie', `sessionId=${id}`);
        console.log('New user, generated session with ID', id);

        session.visited = 0;
    }
}

app.use(mySessionStorage); 

app.get('/', (req, res) => {
    req.session.visited++;
    res.send(`<h1>Hello</h1> Your session data: ${JSON.stringify(req.session)}`);    
});

app.listen(3000);