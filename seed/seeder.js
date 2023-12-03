import categories from "./categories.js"
import prices from "./prices.js"
import users from "./users.js"
import db from "../config/db.js"
import { Category, Price, User } from "../models/index.js"

const importData = async () => {
    try {
        await db.authenticate()
        await db.sync()

        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])

        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

const deleteData = async () => {
    try {
        // await Promise.all([
        //     Category.destroy({where: {}, truncate: {cascade: true}}),
        //     Price.destroy({where: {}, truncate: {cascade: true}}),
        //     User.destroy({where: {}, truncate: {cascade: true}})
        // ])
        await db.sync({force: true})
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if(process.argv[2] === "-i") {
    importData();
}

if(process.argv[2] === "-d") {
    deleteData();
}