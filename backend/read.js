// Requiring the module 
const express =require("express");
const router = express.Router();
const Store = require("./models/MedicalSchema");
const reader = require('xlsx'); 
const { Mongoose, default: mongoose } = require("mongoose");
const fs = require('fs')

// Reading our test file 
const file = reader.readFile('./products.xlsx') 

// let data = [] 

// const createCompany =async(name)=>{
//     const store = await Store.find({storeName:name})
//     if(!store){
//         await Store.create({
//             storeName:name,
//             isDeleted:false
//         });  
//         return true
//     }
//     else{
//         return false
//     }
// }

const sheets = file.SheetNames 

const companies =[]

for(let i = 0; i < sheets.length; i++) 
{ 
const temp = reader.utils.sheet_to_json( 
		file.Sheets[file.SheetNames[i]]) 
temp.forEach(async(res) => { 
       const companyIndex = Object.keys(res)
        const name = res[companyIndex[0]]
        const packing = res[companyIndex[1]]
        companies.push({storeName:name,packing:packing?packing:''})
}) 
} 
console.log(companies)
fs.writeFileSync('companies',JSON.stringify(companies))
// let uniqueCompanies = [...new Set(companies)]
// let finalcompanies =[]
// uniqueCompanies.map(item=>{
//     finalcompanies.push({storeName:item,isDeleted:false})
// })


// async function insertStores() {
//     finalcompanies.forEach(async item=>{
//         const company = new Store(item)
//         await company.save()
//     })
// }
// Store.insertMany(finalcompanies)

// insertStores();
// console.log(finalcompanies)

// Printing data 
// console.log(data)
