const { parseError } = require('../util/errorParser');
const { isUser } = require('../middlewares/guards');

const router = require('express').Router();

router.get('/create', isUser(), (req, res) => {
    res.render('play/create');
});

router.post('/create', isUser(), async (req, res) => {
    const playData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        public: Boolean(req.body.public),
        author: req.user._id
    };

    try {
        await req.storage.createPlay(playData);

        res.redirect('/');
    } catch (err) {       
        const ctx = {
            errors: parseError(err),
            playData
        };
        res.render('play/create', ctx);
    }
});

router.get('/details/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);
        play.hasUser = Boolean(req.user);
        play.isAuthor = req.user && req.user._id == play.author;
        play.liked = req.user && play.usersLiked.includes(req.user._id);

        res.render('play/details', { play });
    } catch (err) {
        console.error(err.message);
        res.redirect('/404');
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author != req.user._id) {
            throw new Error('You can not delete a play you have Not created!');
        }

        await req.storage.deletePlay(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect('/play/details/' + req.params.id);
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author != req.user._id) {
            throw new Error('You can not edit a play you have Not created!');
        }

        res.render('play/edit', { play });
    } catch (err) {
        console.error(err.message);
        res.redirect('/404');
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const play = await req.storage.getPlayById(req.params.id);

        if (play.author != req.user._id) {
            throw new Error('You can not edit a play you have Not created!');
        }

        await req.storage.editPlay(req.params._id, req.body);
        
        res.redirect('/');
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            play: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                public: Boolean(req.body.public)
            }
        };
        res.redirect('/play/edit/' + req.params._id, ctx);
    }
});

module.exports = router;