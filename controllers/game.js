const Game = require("../models/game");
const  Auth  = require('../models/auth')

module.exports = {
    inputNilai: async (req, res, next) => {
        try{
            const user = req.user;

            const { nama_game, nilai } = req.body;

            const exist = await Auth.findOne({ id: user.id});
            if (!exist) return res.status(400).json({ status: false, message: 'user not found!'})

            const existgame = await Game.findOne(
                {
                    $and: [
                        {
                            user_id: exist.id
                        },
                        {
                            nama_game: nama_game
                        }
                    ]

                }
                );

                if (existgame) return res.status(400).json({ status: false, message: `game dengan nama ${nama_game} sudah ada`})

            const data = await Game.create({
                user_id: exist.id,
                nickname: exist.username,
                nama_game,
                nilai
            })

            return res.status(200).json({ 
                status: false, 
                message: 'input nilai berhasil',
                data: data
            });
        }catch (err){
        next(err)
        }
    },
    myGame: async (req, res, next) => {
        try{
            const user = req.user;

            const exist = await Auth.findOne({ id: user.id});
            if (!exist) return res.status(400).json({ status: false, message: 'user not found!'})

            const mygame = await Game.find({ user_id: exist.id })

            return res.status(200).json({ 
                status: false, 
                message: 'input nilai berhasil',
                data: mygame
            });
        }catch (err){
            next(err)
        }
    },
    hapusGame: async (req, res, next) => {
        try{
            const user = req.user;
            const { id } = req.params;

            const us = await Auth.findOne({ id: user.id});
            if (!us) return res.status(400).json({ status: false, message: 'user tidak ditemukan!'})

            const exist = await Game.findOne(
                { 
                $and: [
                    {
                        id: id
                    },
                    {
                        user_id: us.id
                    }
                ]  
                });
            if (!exist) return res.status(400).json({ status: false, message: `game dengan id ${id} tidak ditemukan!`})

            const hapus = await Game.deleteOne({ id: id });

            return res.status(200).json({ 
                status: false, 
                message: `game dengan ${id} berhasil di hapus!`,
                data: hapus
            });
        }catch (err){
            next(err)
        }
    },
    editGame: async (req, res, next) => {
        try{
            const user = req.user;
            const { id } = req.params;
            const { nama_game, nilai } = req.body;

            const us = await Auth.findOne({ id: user.id});
            if (!us) return res.status(400).json({ status: false, message: 'user tidak ditemukan!'})

            const exist = await Game.findOne(
                { 
                $and: [
                    {
                        id: id
                    },
                    {
                        user_id: us.id
                    }
                ]  
                });
            if (!exist) return res.status(400).json({ status: false, message: `game dengan id ${id} tidak ditemukan!`})

            const existgame = await Game.findOne(
                {
                    $and: [
                        {
                            user_id: us.id
                        },
                        {
                            nama_game: nama_game
                        }
                    ]

                }
                );

                if (existgame) return res.status(400).json({ status: false, message: `game dengan nama ${nama_game} sudah ada`})

            const edit = await Game.updateOne(
                { 
                    id: id 
                },
                {
                    nama_game,
                    nilai
                }
                );

            return res.status(200).json({ 
                status: false, 
                message: `game dengan ${id} berhasil di ubah!`,
                data: edit
            });
        }catch (err){
            next(err)
        }
    }
}