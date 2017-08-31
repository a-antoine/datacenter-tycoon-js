import { Router, Request, Response } from 'express';
import * as validator from 'validator';

const jwt = require('jsonwebtoken');
const authenticationMiddleware = require('../authentication/middleware');

const playerDao = require('../models').Player;

const router = Router();

router.get('/login', async function (req: Request, res: Response) {
	try {
		const player = await playerDao.findOne({where: {username: req.body.username}});
		if (!player) {
			res.status(404).send({success: false, message: 'Authentication failed. User not found.'});
		} else {
			if (!player.validPassword(req.body.password)) {
				res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});
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
		res.status(500).send({success: false, message: 'Error: ' + error.message});
	}
});

router.post('/signup', async function (req: Request, res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const companyName = req.body.companyName;

	if (username && password && email && companyName) {

		// 1: Check the email format
		if (!validator.isEmail(email)) {
			res.status(400).send({success: false, message: 'Email "' + email + '" is invalid.'});
			return;
		}

		// 2: Check if username isn't already taken.
		const potentiallyExistingUsername = await playerDao.findOne({where: {username}});
		if (potentiallyExistingUsername) {
			res.status(409).send({success: false, message: 'Username "' + username + '" is already used.'});
			return;
		}

		// 3: Check if email isn't already taken.
		const potentiallyExistingEmail = await playerDao.findOne({where: {email}});
		if (potentiallyExistingEmail) {
			res.status(409).send({success: false, message: 'Email "' + email + '" is already used.'});
			return;
		}

		// 4: Check if company name isn't already taken
		const potentiallyExistingCompanyName = await playerDao.findOne({where: {companyName}});
		if (potentiallyExistingCompanyName) {
			res.status(409).send({success: false, message: 'Company name "' + companyName + '" is already used.'});
			return;
		}

		try {
			const newPlayer = await playerDao.create({
				role: 'PLAYER',
				username,
				password: '',
				email,
				companyName,
				balance: 1000
			});
			newPlayer.update({
				password: newPlayer.generateHash(password)
			});

			res.send({success: true, message: 'Player created successfully'});
		}
		catch (error) {
			console.error(error.message);
			res.status(500).send({success: false, message: 'Error: ' + error.message});
		}
	} else {
		res.status(400).send({success: false, message: 'Missing parameters'});
	}
});


router.get('/', authenticationMiddleware('ADMIN'), async function (req: Request, res: Response) {
	const allPlayers = await playerDao.findAll();
	res.send(allPlayers);
});

router.get('/:id(\\d+)/', authenticationMiddleware('ADMIN'), async function (req: Request, res: Response) {
	const player = await playerDao.findOne({where: {id: req.params.id}});
	res.send(player);
});

router.get('/me', authenticationMiddleware('PLAYER'), async function (req: any, res: Response) {
	const player = await playerDao.findOne({where: {id: req.tokenData.id}});
	res.send(player);
});


export = router;