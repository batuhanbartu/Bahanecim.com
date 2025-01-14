const Bahane = require('../models/Bahane');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

class BahaneController {
    /**
     * Rastgele bahane getir
     */
    getRandom = catchAsync(async (req, res) => {
        const kategori = req.query.kategori;
        let query = { isActive: true };
        
        if (kategori) {
            query.category = kategori;
        }

        const bahaneler = await Bahane.aggregate([
            { $match: query },
            { $sample: { size: 1 } }
        ]);

        if (!bahaneler || bahaneler.length === 0) {
            // Kategori belirtilmişse
            if (kategori) {
                // Önce diğer kategorilerde dene
                const herhangiKategori = await Bahane.aggregate([
                    { $match: { isActive: true } },
                    { $sample: { size: 1 } }
                ]);

                if (herhangiKategori && herhangiKategori.length > 0) {
                    return res.json({
                        status: 'success',
                        data: herhangiKategori[0],
                        message: 'Seçilen kategoride bahane bulunamadı, başka bir bahane gösteriliyor.'
                    });
                }
            }
            
            throw new ApiError('Hiç bahane bulunamadı. Lütfen daha sonra tekrar deneyin.', 404);
        }

        res.json({
            status: 'success',
            data: bahaneler[0]
        });
    });

    /**
     * Popüler bahaneleri getir
     */
    getPopular = catchAsync(async (req, res) => {
        const bahaneler = await Bahane.find({ isActive: true })
            .sort({ votes: -1 })
            .limit(10)
            .populate('author', 'username');

        res.json({
            status: 'success',
            results: bahaneler.length,
            data: bahaneler
        });
    });

    /**
     * Yeni bahane ekle
     */
    addBahane = catchAsync(async (req, res) => {
        const bahane = await Bahane.create({
            content: req.body.content,
            category: req.body.category,
            author: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: bahane
        });
    });

    /**
     * Bahaneye oy ver
     */
    voteBahane = catchAsync(async (req, res) => {
        try {
            const bahane = await Bahane.findById(req.params.id);
            
            if (!bahane || !bahane.isActive) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Bahane bulunamadı'
                });
            }

            // Kullanıcı kendi bahanesine oy veremez
            if (bahane.author.toString() === req.user._id.toString()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Kendi bahanenize oy veremezsiniz'
                });
            }

            // Kullanıcı daha önce oy vermiş mi kontrol et
            if (bahane.voters.includes(req.user._id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Bu bahaneye zaten oy vermişsiniz'
                });
            }

            // Oy sayısını artır ve kullanıcıyı voters listesine ekle
            bahane.votes += 1;
            bahane.voters.push(req.user._id);
            await bahane.save();

            res.json({
                status: 'success',
                message: 'Oy başarıyla verildi',
                data: {
                    votes: bahane.votes
                }
            });
        } catch (err) {
            console.error('Oy verme hatası:', err);
            res.status(500).json({
                status: 'error',
                message: 'Oy verme işlemi sırasında bir hata oluştu'
            });
        }
    });

    /**
     * Bahaneyi sil
     */
    deleteBahane = catchAsync(async (req, res) => {
        try {
            await Bahane.findByIdAndDelete(req.params.id);
            
            res.status(200).json({
                status: 'success',
                message: 'Bahane başarıyla silindi'
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Bahane silinirken bir hata oluştu'
            });
        }
    });

    /**
     * Admin için tüm bahaneleri getir
     */
    getAllBahaneler = async (req, res) => {
        try {
            const bahaneler = await Bahane.find()
                .populate('author', 'username')
                .sort({ dateAdded: -1 });

            res.status(200).json({
                status: 'success',
                results: bahaneler.length,
                data: bahaneler
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Bahaneler getirilirken bir hata oluştu'
            });
        }
    };
}

module.exports = new BahaneController(); 