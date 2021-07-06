require('dotenv').config()
const { Client } = require('pg')

const config = {
    host: process.env.DB_HOST || 'my.database-server.com',
    user: process.env.DB_USER || 'database-user',
    password: process.env.DB_PASS || 'secretpassword!!',
    database: process.env.DB_NAME || 'database-name',
    port: 5432,
}

const db = new Client(config)

db.connect()
    .then(() => console.log(`DB Connected ${JSON.stringify(config)}`))
    .catch((err) => console.log(`DB connection error ${err}`))

const commonQueryGetAll = (tableName) => {
    return `
        SELECT * FROM ${tableName}
    `
}

const commonQueryGetOne = (tableName, payload) => {
    const query = `SELECT * FROM ${tableName} WHERE `

    let where = ``
    let x = 0

    Object.keys(payload).map(key => {
        x += 1
        if(x > 1) where += `AND `
        where += `${key} = ${ typeof payload[key] === 'number'? payload[key] : `'${payload[key]}'` } `
    })

    return query + where
}

const commonQueryInsert = (tableName, payload) => {
    const query = `
        INSERT INTO ${tableName} 
    `
    let column = '( '
    let values = '('
    let x = 0
    let y = 0

    if(payload.length > 0){                                                                             // JIKA TIPE LIST, add multiple
        Object.keys(payload[0]).map(key => {
            x += 1
            if(x > 1){
                column += `, ${key}`
            }else{
                column += key
            }            
        })
        column += ') VALUES '

        let i = 0
        payload.forEach(data => {
            i += 1
            if(i > 1){
                values += ', ('
            }
            Object.values(data).map(value => {
                y += 1
                if(y > 1){
                    values += (typeof value === 'number')? `, ${value}` : `, '${value}'`
                }else{
                    values += (typeof value === 'number')? value : `'${value}'`
                }
            })

            values += ')'
            y = 0
        });
    }else{
        Object.keys(payload).map(key => {
            x += 1
            if(x > 1){
                column += `, ${key}`
            }else{
                column += key
            }
        })
        column += ') VALUES '
    
        Object.values(payload).map(value => {
            y += 1
            if(y > 1){
                values += (typeof value === 'number')? `, ${value}` : `, '${value}'`
            }else{
                values += (typeof value === 'number')? value : `'${value}'`
            }
        })
        values += ')'
    }
    
    return query + column + values
}

const commonQueryUpdate = (tableName, identity, payload) => {
    const query = `
        UPDATE ${tableName}
    `
    let set = ` SET `
    let where = ` WHERE `
    let x = 0
    let y = 0

    Object.keys(payload).map(key => {
        x += 1
        if(x > 1){
            set += (typeof payload[key] === 'number')? `, ${key} = ${payload[key]}` : `, ${key} = '${payload[key]}'`
        }else{
            set += (typeof payload[key] === 'number')? `${key} = ${payload[key]}` : `${key} = '${payload[key]}'`
        }
    })

    Object.keys(identity).map(key => {
        y += 1
        if(y > 1){
            where += (typeof identity[key] === 'number')? `, ${key} = ${identity[key]}` : `, ${key} = '${identity[key]}'`
        }else{
            where += (typeof identity[key] === 'number')? `${key} = ${identity[key]}` : `${key} = '${identity[key]}'`
        }
    })

    return query + set + where
}

const commonQueryDelete = (tableName, identity) => {
    const query = `
        DELETE FROM ${tableName}
    `
    let where = ` WHERE `
    let x = 0

    Object.keys(identity).map(key => {
        x += 1
        if(x > 1){
            where += (typeof identity[key] === 'number')? `, ${key} = ${identity[key]}` : `, ${key} = '${identity[key]}'`
        }else{
            where += (typeof identity[key] === 'number')? `${key} = ${identity[key]}` : `${key} = '${identity[key]}'`
        }
    })

    return query + where
}


module.exports = {
    db,
    commonQueryGetAll,
    commonQueryGetOne,
    commonQueryInsert,
    commonQueryUpdate,
    commonQueryDelete
}