import { EmailService } from './email.service';
import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    
    constructor(
        private readonly emailService: EmailService,
    ){}

    public async registerUser( registerUserDto: RegisterUserDto ){
        const existEmail = await UserModel.findOne({ email: registerUserDto.email });
        if( existEmail ) throw CustomError.badRequest(`Email already registered`);
        
        try{
            const user = new UserModel( registerUserDto );
            user.password = bcryptAdapter.hash( registerUserDto.password );

            await user.save();

            await this.sendEmailValidationLinck( user.email );

            const token = await JwtAdapter.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServerError('Error generating token');

            const { password, ...userEntity} = UserEntity.fromObject(user);
            return {
                user: { 
                    ...userEntity
                }, 
                token
            };
        }
        catch(error){
            throw CustomError.internalServerError(`${error}`)
        }
    }

    public async loginUser( loginUserDto: LoginUserDto ){
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if( !user ) throw CustomError.badRequest(`User with email ${ loginUserDto.email } dont exist`);

        const validPassword = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!validPassword) throw CustomError.badRequest('Incorrect password');

        const { password, ...userEntity } = UserEntity.fromObject( user );
        const token = await JwtAdapter.generateToken( { id: user.id } );
        if(!token) throw CustomError.internalServerError('Error generating token');
        return{
            user: {
                ...userEntity
            },
            token
        }
    }

    private sendEmailValidationLinck = async (email: string) => {
        const token = JwtAdapter.generateToken({email});
        if (!token) throw CustomError.internalServerError('Error generating validation token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email<p>
            <a href="${link}">Validate ${email}</a>
        `;
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }
        const isSent = await this.emailService.sendEmail( options );
        if( !isSent ) throw CustomError.internalServerError('Error sending email');

        return true;
    }

}