// Requiring the module 
const express = require("express");
const reader = require('xlsx');
const { Mongoose, default: mongoose } = require("mongoose");
const fs = require('fs')

const file = reader.readFile('./products.xlsx')

const sheets = file.SheetNames

const companies = []

for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
        temp.forEach(async (res) => {
                const companyIndex = Object.keys(res)

                const supplier = [];
                const supplier1 = res[companyIndex[3]]
                const supplier2 = res[companyIndex[4]]
                const supplier3 = res[companyIndex[5]]
                const supplier4 = res[companyIndex[6]]
                const supplier5 = res[companyIndex[7]]
                const supplier6 = res[companyIndex[8]]
                const supplier7 = res[companyIndex[9]]
                const supplier8 = res[companyIndex[10]]
                const supplier9 = res[companyIndex[11]]
                const supplier10 = res[companyIndex[12]]
                const supplier11 = res[companyIndex[13]]
                const supplier12 = res[companyIndex[14]]
                const supplier13 = res[companyIndex[15]]
                const supplier14 = res[companyIndex[16]]
                const supplier15 = res[companyIndex[17]]
                const supplier16 = res[companyIndex[18]]
                const supplier17 = res[companyIndex[19]]

if(supplier1){
        supplier.push(supplier1)
}
if(supplier2){
        supplier.push(supplier2)
}
if(supplier3){
        supplier.push(supplier3)
}
if(supplier4){
        supplier.push(supplier4)
}
if(supplier5){
        supplier.push(supplier5)
}
if(supplier6){
        supplier.push(supplier6)
}
if(supplier7){
        supplier.push(supplier7)
}
if(supplier8){
        supplier.push(supplier8)
}
if(supplier9){
        supplier.push(supplier9)
}
if(supplier10){
        supplier.push(supplier10)
}
if(supplier11){
        supplier.push(supplier11)
}
if(supplier12){
        supplier.push(supplier12)
}
if(supplier13){
        supplier.push(supplier13)
}
if(supplier14){
        supplier.push(supplier14)
}
if(supplier15){
        supplier.push(supplier15)
}
if(supplier16){
        supplier.push(supplier16)
}
if(supplier17){
        supplier.push(supplier17)
}

                const storeName = res[companyIndex[0]]
                const name = res[companyIndex[1]]
                const packing = res[companyIndex[2]]
                // const suppliers = res[companyIndex[2]]
                companies.push({
                        productName: name, packing: packing ? packing : '',
                        store: storeName,
                        supplier: supplier, 
                })
        })
}
fs.writeFileSync('companies', JSON.stringify(companies))
