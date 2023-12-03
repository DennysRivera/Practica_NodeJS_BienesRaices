import { unlink } from "node:fs/promises"
import { Property, Category, Price, Message, User } from "../models/index.js"
import { validationResult } from "express-validator"
import { isSeller, formatDate } from "../helpers/index.js"

const showOwnedProperties = async (req, res) => {

    const { page: currentPage } = req.query
    const regex = /^[0-9]$/

    if(!regex.text(currentPage)){
        return res.redirect("/my-properties?page=1")
    }

    try{
        const { id } = req.user
        
        const limit = 10;
        const offset = (currentPage * limit) - limit

        const [properties, total] = await Promise.all([
                Property.findAll({
                limit,
                offset,
                where: {
                    userId: id
                },
                include: [
                    { model: Category, as: "category" },
                    { model: Price, as: "price" },
                    { model: Message, as: "messages" }
                ]
            }),
            Property.count({
                where: {
                    userId: id
                }
            })
        ])

        res.render("properties/ownedProperties", {
            page: "Mis propiedades",
            csrfToken: req.csrfToken(),
            properties,
            pages: Math.ceil(total / limit),
            currentPage: Number(currentPage),
            total,
            offset,
            limit
        })
    } catch(error){
        console.log(error)
    }
}

const createProperty = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render("properties/createProperty", {
        page: "Publica propiedad",
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}

const saveProperty = async (req, res) => {
    let result = validationResult(req)

    if(!result.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render("properties/createProperty", {
            page: "Publica propiedad",
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { title, description, category, price, bedrooms, parking, bathrooms, street, lat, lng } = req.body
    const { id } = req.user

    try {
        const propertySaved = await Property.create({
            title,
            description,
            bedrooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            priceId: price,
            categoryId: category,
            userId: id,
            image: ""
        })

        const { id } = propertySaved
        res.redirect(`/properties/add-image/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const addImage = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.published){
        return res.redirect("/my-properties")
    }

    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }

    res.render("properties/add-image", {
        page: "Agregar imagen de la propiedad",
        csrfToken: req.csrfToken(),
        property
    })
}

const storeImage = async (req, res, next) => {
    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.published){
        return res.redirect("/my-properties")
    }

    if(req.user.id.toString() !== property.userId.toString()){
        return res.redirect("/my-properties")
    }

    try {
        property.image = req.file.filename
        property.published = 1

        await property.save()
        next()
    } catch (error) {
        console.log(error)
    }
}

const editProperty = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render("properties/editProperty", {
        page: `Editar propiedad: ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    })
}

const saveEdit = async (req, res) => {
    let result = validationResult(req)

    if(!result.isEmpty()){
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])

        return res.render("properties/editProperty", {
            page: "Editar propiedad",
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    try {
        const { title, description, category, price, bedrooms, parking, bathrooms, street, lat, lng } = req.body

        property.set({
            title,
            description,
            bedrooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            priceId: price,
            categoryId: category
        })

        await property.save()

        res.redirect("/my-properties")
    } catch (error) {
        console.log(error)
    }
}
const removeProperty = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    await unlink(`public/uploads/${property.image}`)

    await property.destroy()
    res.redirect("/my-properties")
}

const changeState = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id)

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    property.published = !property.published

    await property.save()

    res.json({
        result: "OK"
    })
}

const showProperty = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id, {
        include: [
            { model: Price, as: "price" },
            { model: Category, as: "category"}
        ]
    })

    if(!property || !property.published){
        return res.redirect("/404")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    res.render("properties/showProperty", {
        property,
        page: property.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req,user?.id, property.userId)
    })
}

const sendMessage = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id, {
        include: [
            { model: Price, as: "price" },
            { model: Category, as: "category"}
        ]
    })

    if(!property){
        return res.redirect("/404")
    }

    let result = validationResult(req)

    if(!result.isEmpty()){
        res.render("properties/showProperty", {
            property,
            page: property.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req,user?.id, property.userId),
            errors: result.array()
        })
    }

    const { message } = req.body
    const { id: propertyId } = req.params
    const { id: userId } = req.user

    await Message.create({
        message,
        propertyId,
        userId
    })

    res.redirect("/")
}

const readMessages = async (req, res) => {
    const { id } = req.params

    const property = await Property.findByPk(id, {
        include: [
            { model: Message, as: "messages",
                include: [
                    { model: User.scope("removePassword"), as: "user" }
                ]
            }
        ]
    })

    if(!property){
        return res.redirect("/my-properties")
    }

    if(property.userId.toString() !== req.user.id.toString()){
        return res.redirect("/my-properties")
    }

    res.render("properties/messages", {
        page: "Mensajes",
        messages: property.messages,
        formatDate
    })
}

export {
    showOwnedProperties,
    createProperty,
    saveProperty,
    addImage,
    storeImage,
    editProperty,
    saveEdit,
    removeProperty,
    changeState,
    showProperty,
    sendMessage,
    readMessages
}