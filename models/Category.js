import { DataTypes} from "sequelize";
import db from "../config/db.js";

const Category = db.define("categories", {
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

export default Category;