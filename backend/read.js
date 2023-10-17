// Requiring the module 
const express =require("express");
const router = express.Router();
const Store = require("./models/MedicalSchema");
const reader = require('xlsx'); 
const { Mongoose, default: mongoose } = require("mongoose");

// Reading our test file 
const file = reader.readFile('./products.xlsx') 

// let data = [] 

const createCompany =async(name)=>{
    const store = await Store.find({storeName:name})
    if(!store){
        await Store.create({
            storeName:name,
            isDeleted:false
        });  
        return true
    }
    else{
        return false
    }
}

const sheets = file.SheetNames 

for(let i = 0; i < sheets.length; i++) 
{ 
const temp = reader.utils.sheet_to_json( 
		file.Sheets[file.SheetNames[i]]) 
temp.forEach(async(res) => { 
	// data.push(res) 
       const companyIndex = Object.keys(res)
    //    console.log(companyIndex[2])
       if(companyIndex[2]===undefined){
        // console.log(res[companyIndex[0]])
        const store = await Store.find({storeName:res[companyIndex[0]]})
        
    //    await createCompany(res[companyIndex[0]])
       }
    //    if(companyIndex[2] === undefined){
    //     console.log(res)
    //    }
}) 
} 



// Printing data 
// console.log(data)
