import { ProductModel } from '../../data';
import { CustomError, PaginationDto } from '../../domain';
import { CreateProductDto } from './../../domain/dtos/product/create-product.dto';

export class ProductService {

    constructor() { }

    async createProduct(createProductDto: CreateProductDto) {
        const productExist = await ProductModel.findOne({ name: CreateProductDto.name });
        if (productExist) throw CustomError.badRequest('Product already exist');

        try {
            const product = new ProductModel( createProductDto );
            await product.save();

            return product
        }
        catch (error) {
            throw CustomError.internalServerError(`${error}`)
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ])

            return {
                page,
                limit,
                total,
                next: `api/products?page=${page + 1}&limit=${limit}`,
                previus: (page - 1 > 0)
                    ? `api/products?page=${page - 1}&limit=${limit}`
                    : null,
                products: products,
            }
        }
        catch (error) {
            return CustomError.internalServerError('Internal server error')
        }
    }
}