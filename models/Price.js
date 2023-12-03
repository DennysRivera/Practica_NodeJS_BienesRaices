import { DataTypes} from "sequelize";
import db from "../config/db.js";

const Price = db.define("prices", {
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

export default Price;