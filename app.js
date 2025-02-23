import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
import {processQuery} from './index.js'
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());


app.use(cors({
    origin : '*'
}))



app.post('/process', async (req, resp)=>{

    try {
        
        const {query} = req.body;

        if(!query){
            return  resp.status(200).json({
                status : true,
                message : "Plz provide a query..Inorder to perform an operation.."
            })
        }

        if(query){
        const result = await processQuery(query);

        resp.status(200).json({
            status : true,
            message : result
        })
    }


    } catch (error) {
        console.log(`Error occured, due to : `, error);
        resp.status(500).json({
            status : false,
            message : "INTERNAL SERVER ERROR"
        })
    }


})


app.listen(PORT, ()=>{
    console.log(`Server is listening at PORT : ${PORT}`);
})