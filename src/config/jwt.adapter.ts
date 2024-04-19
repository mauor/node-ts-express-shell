import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED= envs.JWT_SEED; 

export class JwtAdapter {

    static async generateToken(payload: any, duration: string = '2h'){
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, {expiresIn: duration}, (err, res) => {
                if (err)return resolve(null);
                return resolve(res);
            });

        })
    }

    static validateToken(token: string){

    }

}