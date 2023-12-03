import bcrypt from "bcrypt"

const users = [
    {
        name: "Dennys Rivera",
        email: "dennysr7@outlook.es",
        confirmed: 1,
        password: bcrypt.hashSync("Hajahaja123", 10)
    }
]

export default users