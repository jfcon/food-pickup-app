"use strict";

const express = require("express");
const customerRoutes = express.Router();
const bodyParser = require("body-parser");
const twilio = require("../public/scripts/twilio.js");

//--------Functions--------------------->

function itemRowCost (itemRow) {
    //calculates cost of each item in cart for order review page
    let itemCost = itemRow.Qty * itemRow.price;
    return itemCost;
};

function calculateCart(cartData){
  //calculates total cost of cart for order review page
  let subtotal = 0;
  for (let i = 0; i < cartData.length; i++) {
        subtotal += itemRowCost(cartData[i])
    }
    return subtotal;
};

function displayDollars(number){
    var dollars = number; 
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
};

//-------customer routes---------------->

module.exports = function(knex) {
  // Home page
  customerRoutes.get("/", (req, res) => {
    res.render("index");
  });

  customerRoutes.post("/revieworder", (req, res) => {
    let menuItems;
    knex
      .select("*")
      .from("menu_items")
      .then(results => {
        menuItems = results;
        let orderForm = [];
        let tempForm = Object.entries(req.body);
        tempForm.forEach(function(element) {
          if (element[1] > 0) {
            menuItems.forEach(function(item) {
              if (item.id === Number(element[0])) {
                orderForm.push({ itemID: element[0], Qty: element[1], itemName: item.name, price: item.price });
              }
            });
          }
        });

        let subtotal = calculateCart(orderForm);
        let templateVars = {orders: orderForm, subtotal: subtotal, displayDollars: displayDollars};
        res.render("order_review", templateVars);
      });
  });

  customerRoutes.get("/revieworder", (req, res) => {
    res.redirect("/");
  });
  customerRoutes.get("/confirmorder", (req, res) => {
    res.redirect("/");
  });

  customerRoutes.post("/confirmorder", (req, res) => {
    let templateVars = { phone: req.body.phoneNumber, name: req.body.firstName };

    //Admin Phone #
    // let phoneNumber = "+17789274265";
    // let stringMessage = "Naan Stop - you have a new order to verify";

    // twilio.twilioTextMessage(stringMessage, phoneNumber);
    res.render("order_confirmation", templateVars);
  });

  // Order Complete - Thank You
    customerRoutes.get("/order/complete", (req, res) => {
    res.render("order_confirmation");
  });
  return customerRoutes;
};

