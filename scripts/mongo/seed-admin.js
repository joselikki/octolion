const bcrypt = require('bcrypt')
const chalk = require('chalk')
const MongoLib = require('../../lib/mongo')
const { config } = require('../../config')


const buildAdminUser = password =>{
    return{
        password,
        username: config.authAdminUserName,
        email: config.authAdminEmail
    }
}

 const  hasAdminUser = async (mongoDB) =>{
    const adminUser = await mongoDB.getAll("users",{
        username: config.authAdminUserName
    })
    return adminUser && adminUser.length
}

const createAdminUser = async (mongoDB) =>{
    const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10)
    const userID = await mongoDB.create("users", buildAdminUser(hashedPassword))
    return userID
}

const seedAdmin = async ()=>{
    try{
        const mongoDB = new MongoLib()

        if(await hasAdminUser(mongoDB)){
            console.log(chalk.yellow("admin user already exist"))
            return process.exit(1)
        }

        const adminUserId = await createAdminUser(mongoDB)
        console.log(chalk.green("admin user created with ID:", adminUserId))
        return process.exit(0)
    } catch (error){
        console.log(chalk.red(error))
        process.exit(1)
    }
}


seedAdmin()
