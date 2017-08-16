import { Request, Response, NextFunction } from 'express';

let jwt = require('jsonwebtoken');

export = function (role: string) {
	return function (req: any, res: Response, next: NextFunction) {

		let token = req.headers['x-access-token'];

		if (token) {

			try {
				let tokenData = jwt.verify(token, process.env.JWT_SECRET);
				if ((role === 'PLAYER' && (tokenData.role === 'PLAYER' || tokenData.role === 'ADMIN')) ||
					(role === 'ADMIN' && tokenData.role === 'ADMIN')) {

					req.tokenData = tokenData;
					next();

				} else {

					return res.status(403).send({success: false, message: 'Insufficient authorization level'});
				}

			} catch (error) {

				return res.status(403).send({success: false, message: 'Failed to authenticate token.'});
			}

		} else {

			return res.status(403).send({success: false, message: 'No token provided.'});
		}
	}
}