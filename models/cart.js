const fs = require('fs');
const path =require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)
module.exports = class Cart {

static addProduct(id, productPrice){

    //Fetch the previous cart
    fs.readFile(p,(err,fileContent)=>{
        let cart = {products:[], totalPrice: 0};
        if(!err){
            try {
                cart = JSON.parse(fileContent);
              } catch (error) {
                console.log(`Error parsing cart file: ${error}`);
              }
        }
        
        //Analyse the cart => Find existing products
        const existingProductIndex = cart.products.findIndex(prod => prod.id===id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;

        //Add new Product / increase quantity
        if(existingProduct){
            updatedProduct = {...existingProduct};
            updatedProduct.qty= updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct ;
        }else{
            updatedProduct = {id:id,qty:1}; 
            cart.products = [...cart.products,updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p,JSON.stringify(cart),err=>{
            console.log(`Error writing a cart to a file: ${err}`)
        });

    })
}

static deleteProduct(id,productPrice){
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            return;
        }
        const updatedCart = {...JSON.parse(fileContent)};
        const product = updatedCart.products.find(prod=> prod.id===id);
        if (!product) {
            console.log(`Product with ID ${id} not found in the cart.`);
            return;
        }
        const productQty = product.qty;
        updatedCart.products = updatedCart.products.filter(prod=>prod.id!==id); 
        updatedCart.totalPrice -= (productPrice*productQty);

        fs.writeFile(p,JSON.stringify(updatedCart),err=>{
            console.log(`Error deleting a product from cart: ${err}`)
        });
    })
}
}