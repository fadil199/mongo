const multer = require('multer');
const path  = require('path');

const simpan = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'https://ik.imagekit.io/5kja0otrte');
    },

    filename: (req, file, callback) => {
        const fileNama = Date.now() + '_' + file.originalname;
        callback(null, fileNama);
    }
})

module.exports = {
    image: multer({
        limits: {
            fileSize: 1024 * 1024 * 1
        },

        fileFilter: (req, file, callback) => {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                callback(null, true)
            
            } else {
                const err = new Error('only files of type png, jpg, and jpeg are allowed!');
                callback(err, false);
            }

        },

        onError: (err, next) => {
            next(err);
        }
    }),

    video: multer({
        storage: simpan,
        limits: {
            fileSize: 10240 * 1024 * 1
        },

        fileFilter: (req, file, callback) => {
            if (file.mimetype == 'video/mp4' || file.mimetype == 'video/3gp' || file.mimetype == 'video/avi') {
                callback(null, true)
            } else {
                const err = new Error('only videos of type mp4, 3gp, and avi are allowed!');
                callback(err, false);
            }
        },

        onError: (err, next) => {
            next(err);
        }
    })
}