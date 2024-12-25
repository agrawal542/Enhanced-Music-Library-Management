class AppError extends Error {
    constructor(messege, statusCode) {
        super(messege)
        this.statusCode = statusCode;
        this.explanation = messege;
    }
}

module.exports = AppError;