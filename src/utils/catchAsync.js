/**
 * Async fonksiyonları try-catch bloğuna alan yardımcı fonksiyon
 * @param {Function} fn - Async fonksiyon
 * @returns {Function} Express middleware fonksiyonu
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync; 