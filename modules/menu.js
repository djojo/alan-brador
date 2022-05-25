const mongoose = require("mongoose");
const Section = require("../models/section");
const General = require("../models/general");
const Element = require("../models/element");

module.exports = {
    getMenu: getMenu,
    getGeneral: getGeneral,
    getShowcaseElements: getShowcaseElements,
    getApp: getApp
};

function getMenu() {
    return new Promise(resolve => {
        Section.find({}, function(err, sections){
            sections = sections.filter(e=>e.visible != false);
            sections = sections.filter(e=>e.type != "landing");
            resolve(sections);
        }).sort({ order: 'asc'});   
  });
}

function getGeneral() {
    return new Promise(resolve => {
        General.findOne({config : "app"}, function(err, general){
            resolve(general);
        });   
  });
}

async function getShowcaseElements(dataGeneral) {
    return new Promise(resolve => {
        var showcaseHomeElements = [];
        dataGeneral.showcaseElements.forEach(async function(elementId){
            // console.log(elementId);
            await Element.findOne({_id: elementId}, function(err, element){
                
                showcaseHomeElements.push(element);
                // console.log(showcaseHomeElements);
                
            });
        });
        resolve(showcaseHomeElements);  
        // resolve(showcaseHomeElements);  
  });
}

function getApp() {
    return new Promise(resolve => {
        Section.find({}, function(err, sections){
            sections = sections.filter(e=>e.visible != false);
            sections = sections.filter(e=>e.type != "landing");
            resolve(sections);
        }).sort({ order: 'asc'}).populate({
            path: 'elements',
            model: 'Element', options: { sort : { order: 'desc'} }
        });   
  });
}