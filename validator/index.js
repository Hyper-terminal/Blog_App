exports.createPostValidator = (req, res, next) => {
    // ************************ Validation *************************

    // title validation
    req.check('title', 'Write a title').notEmpty()
    req.check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });


    // body validation
    req.check('body', 'Write a body').notEmpty()
    req.check('body', 'Body must be between 4 to2000 characters').isLength({
        min: 4,
        max: 150
    });

    // ************************ Error handling *************************

    // check for all errors
    const errors = req.validationErrors();

    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }

    // proceed to next middleware
    next();
}


exports.userSinupValidator = (req, res, next) => {

    // ************************ Validation *************************

    // name not null
    req.check("name", "Name is required").notEmpty();

    // email not null , valid and normalised
    req.check("email", "Email must be between 4 to 32 characters")
        .matches(/.+\@.+\../)
        .withMessage("Email not valid")
        .isLength({
            min: 4,
            max: 2000
        })

    // check for password
    req.check("password", "Password is required").notEmpty();
    req.check('password').isLength({
        min: 6
    })
        .withMessage("Password must contain 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");



    // ************************ Error handling *************************

    // check for all errors
    const errors = req.validationErrors();

    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        })
    }

    // proceed to next middleware
    next();

}