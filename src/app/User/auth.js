const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const {pool} = require("../../../config/database");

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, password } = req.body;
    try {
        //const exUser = await User.findOne({ where: { email } }); //쿼리문으로 조회해와야할 듯
        const connection = await pool.getConnection(async (conn) => conn);
        const selectUserAccountQuery = `
        SELECT email
        FROM User 
        WHERE email = ?;`;
        const selectUserAccountRow = await connection.query(
            selectUserAccountQuery,
            email
        );
        const exUser = selectUserAccountRow[0];

        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await crypto.hash(password, 12);
        /*await User.create({
            email,
            nick,
            password: hash,
        });*/
        const insertUserQuery = `
        INSERT INTO User(name, phone, email, password)
        VALUES('홍길동', '010-0000-0000', email, hash);
        `;
        await connection.query(insertUserQuery);

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;
