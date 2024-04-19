import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    
    constructor(
        
    ){}

    public async registerUser( registerUserDto: RegisterUserDto ){
        const existEmail = await UserModel.findOne({ email: registerUserDto.email });
        if( existEmail ) throw CustomError.badRequest(`Email already registered`);
        
        try{
            const user = new UserModel( registerUserDto );
            user.password = bcryptAdapter.hash( registerUserDto.password );
            await user.save();
            const { password, ...userEntity} = UserEntity.fromObject(user);
            return {
                user: { 
                    ...userEntity
                }, 
                token: 'TODO_TOKEN'
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
        const token = await JwtAdapter.generateToken( {id: user.id, email: user.email} );
        if(!token) throw CustomError.internalServerError('Error generating token');
        return{
            user: {
                ...userEntity
            },
            token
        }
    }

}