import Property from "./Property.js"
import Category from "./Category.js"
import Price from "./Price.js"
import User from "./User.js"
import Message from "./Message.js"

Price.hasOne(Property)
Category.hasOne(Property)
User.hasOne(Property)
Property.hasMany(Message)
Message.belongsTo(Property)
Message.belongsTo(User)

//Property.belongsTo(User)

export {
    Property,
    Category,
    Price,
    User,
    Message
}