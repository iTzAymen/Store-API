const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const {numericFilters} = req.query
    const queryObject = {

    }
    if(numericFilters){
        const operatorsMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }

        const regEx = /\b(<|<=|=|>=|>)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorsMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });
    }
    
    const products = await Product.find(queryObject)
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {name, featured, company, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }

    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }

    if(company){
        queryObject.company = company
    }
    if(numericFilters){
        const operatorsMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }

        const regEx = /\b(<|<=|=|>=|>)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorsMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });
    }

    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    if(limit){
        if(page){
            result = result.skip(skip)
        }
        result = result.limit(limit)
    }
    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}