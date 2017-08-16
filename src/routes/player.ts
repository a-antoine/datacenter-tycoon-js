import { Router, Request, Response } from 'express';

let jwt = require('jsonwebtoken');
let authenticationMiddleware = require('../authentication/middleware');

let playerDao = require('../models').Player;

let router = Router();

router.post('/login', async function (req: Request, res: Response) {
	try {
		let player = await playerDao.findOne({where: {username: req.body.username}});
		if (!player) {
			res.send({success: false, msg: 'Authentication failed. User not found.'});
		} else {
			if (!player.validPassword(req.body.password)) {
				res.send({success: false, msg: 'Authentication failed. Wrong password.'});
			} else {
				res.json({
					username: player.username,
					role: player.role,
					token: jwt.sign({id: player.id, role: player.role}, process.env.JWT_SECRET)
				});
			}
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Error: ' + error.message);
	}
});

router.get('/', authenticationMiddleware('ADMIN'), async function (req: Request, res: Response) {
	let allPlayers = await playerDao.findAll();
	res.send(allPlayers);
});

router.get('/:id', authenticationMiddleware('ADMIN'), async function (req: Request, res: Response) {
	let player = await playerDao.findOne({where: {id: req.params.id}});
	res.send(player);
});

router.get('/me', authenticationMiddleware('PLAYER'), async function (req: any, res: Response) {
	let player = await playerDao.findOne({where: {id: req.tokenData.id}});
	res.send(player);
});

router.post('/', async function (req: Request, res: Response) {

});

router.put('/:id', async function (req: Request, res: Response) {

});

export = router;