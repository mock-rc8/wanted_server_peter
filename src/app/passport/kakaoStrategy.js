const passport = require('passport');
const {pool} = require("../../../config/database");
const KakaoStrategy = require('passport-kakao').Strategy;

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: '../../../config/secret/KAKAO_ID',
        callbackURL: '../../../config/secret/KAKAO_URL',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            // const exUser = await User.findOne({
            //     where: { snsId: profile.id, provider: 'kakao' },
            // }
            const connection = await pool.getConnection(async (conn) => conn);
            const selectUserAccountQuery = `
            SELECT *
            FROM User 
            WHERE snsId = profile.id AND provider = 'kakao';`;

            let selectUserAccountRow = await connection.query(
                selectUserAccountQuery
            );
            exUser = selectUserAccountRow[0];

            if (exUser) {
                done(null, exUser);
            } else { // 카카오를 통해 회원가입한 사용자가 없을 경우
                /*const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });*/
                const insertUserInfoQuery = `
                INSERT INTO User(name,
                                 phone,
                                 email,
                                 password)
                VALUES (?, ?, ?, ?);
                `;
                const insertUserInfoParams = [profile.displayName, '010-0000-0000', 'test@email.com', '000000'];
                const newUser = await connection.query(
                    insertUserInfoQuery,
                    insertUserInfoParams
                );
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};