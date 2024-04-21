import { envs } from "../../config"
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";


(async () => {
    await MongoDatabase.connect(({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    }))
    await main();

    MongoDatabase.disconnect()
})()

const randomBetween0andX= (x: number) => {
    return Math.floor(Math.random() * x);
}

async function main(){
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    const users = await UserModel.insertMany( seedData.users );

    const categories = await CategoryModel.insertMany(
            seedData.categories.map( category => {
                return {
                    ...category,
                    user: users[randomBetween0andX(seedData.users.length - 1)]._id,
                }
            })
    )

    const products = await ProductModel.insertMany(
        seedData.products.map(product => {
            return {
                ...product,
                user: users[ randomBetween0andX( seedData.users.length -1 )]._id,
                category: categories[ randomBetween0andX( seedData.categories.length -1 )]._id
            }
        })
    )

    console.log('SEED EXECUTED');
}