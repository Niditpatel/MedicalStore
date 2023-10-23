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
        const storeName = res[companyIndex[0]]
        const isExists = companies.find(x=>x.storeName === storeName)
        if (companyIndex[2] === undefined && !isExists ) {
            companies.push({
                storeName: storeName,
            })
        }
    })
}
console.log(companies)
fs.writeFileSync('companiesName', JSON.stringify(companies))
