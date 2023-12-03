import { Sequelize } from "sequelize"
import { Property, Category, Price } from "../models/index.js"

const landing = async (req, res) => {
    const [categories, prices, houses, apartments] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1
            },
            include: [
                {
                    model: Price,
                    as: "price"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2
            },
            include: [
                {
                    model: Price,
                    as: "price"
                }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        })
    ])

    res.render("landing", {
        page: "Inicio",
        categories,
        prices,
        houses,
        apartments,
        csrfToken: req.csrfToken()
    })
}

const category = async (req, res) => {
    const { id } = req.params

    const category = await Category.findByPk(id)
    if(!category){
        return res.redirect("/404")
    }

    const properties = await Property.findAll({
        where: {
            categoryId: id
        },
        include: [
            {model: Price, as: "price"}
        ]
    })

    res.render("category", {
        page: `${category.name}s en venta`,
        properties,
        csrfToken: req.csrfToken()
    })
}

const notFound = (req, res) => {
    res.render("404", {
        page: "No encontrada",
        csrfToken: req.csrfToken()
    })
}

const search = async (req, res) => {
    const { term } = req.body

    if(!term.trim()){
        return res.redirect("back")
    }

    const properties = await Property.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : "%" + term + "%"
            }
        },
        include: [
            {model: Price, as: "price"}
        ]
    })

    res.render("search", {
        page: "Resultados de la búsqueda",
        properties,
        csrfToken: req.csrfToken()
    })
}

export {
    landing,
    category,
    notFound,
    search
}