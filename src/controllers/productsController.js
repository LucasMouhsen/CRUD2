const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const categories = ['in-sale','visited']
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		res.render('detail',{
			product : products.find(product => product.id == req.params.id),
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const { name, price, discount, category, description } = req.body;
		const id = products.length + 1;
		products.push({
			id,
			name,
			price: +price,
			discount: +discount,
			category,
			description,
			image: 'default-image.png'
		});
		fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const { id } = req.params;
		const product = products.find(product => product.id == id);
		res.render('product-edit-form',{
			product,
			categories
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const { id } = req.params;
		const { name, price, discount, category, description } = req.body;
		const index = products.findIndex(product => product.id == id);
		products[index] = {
			id: index+1,
			name,
			price : +price,
			discount: +discount,
			category,
			description,
			image: products[index].image
		}
		fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
		res.redirect('/products');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const { id } = req.params;
		const index = products.findIndex(product => product.id == id);
		products.splice(index, 1);
		fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
		res.redirect('/products');
	}
};

module.exports = controller;