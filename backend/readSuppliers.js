// Requiring the module 
const express = require("express");
const reader = require('xlsx');
const { Mongoose, default: mongoose } = require("mongoose");
const fs = require('fs')

const file = reader.readFile('./mainFile.xlsx')

const sheets = file.SheetNames

const companies = []

for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
        temp.forEach(async (res) => {
                const companyIndex = Object.keys(res)

               
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

const isExists1 = companies.find(x=>x.supplierName === supplier1)
if(supplier1 && !isExists1){
        companies.push({supplierName:(supplier1)})
}
const isExists2 = companies.find(x=>x.supplierName === supplier2)

if(supplier2 && !isExists2){
        companies.push({supplierName:(supplier2)})
}

const isExists3 = companies.find(x=>x.supplierName === supplier3)

if(supplier3 && !isExists3){
        companies.push({supplierName:(supplier3)})
}
const isExists4 = companies.find(x=>x.supplierName === supplier4)

if(supplier4 && !isExists4){
        companies.push({supplierName:(supplier4)})
}
const isExists5 = companies.find(x=>x.supplierName === supplier5)

if(supplier5 && !isExists5){
        companies.push({supplierName:(supplier5)})
}
const isExists6 = companies.find(x=>x.supplierName === supplier6)

if(supplier6 && !isExists6){
        companies.push({supplierName:(supplier6)})
}
const isExists7 = companies.find(x=>x.supplierName === supplier7)

if(supplier7 && !isExists7){
        companies.push({supplierName:(supplier7)})
}

const isExists8 = companies.find(x=>x.supplierName === supplier8)

if(supplier8 && !isExists8){
        companies.push({supplierName:(supplier8)})
}
const isExists9 = companies.find(x=>x.supplierName === supplier9)

if(supplier9 && !isExists9){
        companies.push({supplierName:(supplier9)})
}
const isExists10 = companies.find(x=>x.supplierName === supplier10)

if(supplier10 && !isExists10){
        companies.push({supplierName:(supplier10)})
}
const isExists11 = companies.find(x=>x.supplierName === supplier11)

if(supplier11 && !isExists11){
        companies.push({supplierName:(supplier11)})
}
const isExists12 = companies.find(x=>x.supplierName === supplier12)

if(supplier12 && !isExists12 ){
        companies.push({supplierName:(supplier12)})
}
const isExists13 = companies.find(x=>x.supplierName === supplier13)

if(supplier13 && !isExists13){
        companies.push({supplierName:(supplier13)})
}
const isExists14 = companies.find(x=>x.supplierName === supplier14)

if(supplier14 && !isExists14){
        companies.push({supplierName:(supplier14)})
}
const isExists15 = companies.find(x=>x.supplierName === supplier15)

if(supplier15 && !isExists15){
        companies.push({supplierName:(supplier15)})
}
const isExists16 = companies.find(x=>x.supplierName === supplier16)

if(supplier16 && !isExists16){
        companies.push({supplierName:(supplier16)})
}
const isExists17 = companies.find(x=>x.supplierName === supplier17)

if(supplier17 && !isExists17 ){
        companies.push({supplierName:(supplier17)})
}

                // const suppliers = res[companyIndex[2]]
                        
        })
}
console.log(companies)
fs.writeFileSync('suppliersName', JSON.stringify(companies))
