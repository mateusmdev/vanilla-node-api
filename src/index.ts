import * as http from 'node:http'
import ServerApi from './server'

let server = http.createServer(ServerApi.runApi.bind(ServerApi))

const PORT = 3000
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))