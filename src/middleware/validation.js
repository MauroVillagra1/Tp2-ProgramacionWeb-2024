const validateStudentBody = (req, res, next) => {
    const { firstname, lastname, dni, email } = req.body;

    if (!firstname || !lastname || !dni || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    next();
};

const validateById = (req, res, next) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).json({ message: 'Invalid ID format.' });
    }
    req.params.id = Number(req.params.id);
    next();
};

module.exports = {
    validateStudentBody,
    validateById
};
